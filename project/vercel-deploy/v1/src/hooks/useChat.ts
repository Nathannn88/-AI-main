/** 聊天 Hook — 管理消息发送、API 流式调用、熟悉度/事件检测 */

'use client';

import { useState, useCallback, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { buildSystemPrompt, buildMessages } from '@/lib/prompt-engine';
import { checkEventTrigger } from '@/lib/event-system';
import type { ChatMessage } from '@/types/chat';

/** 生成唯一消息 ID */
function genId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

interface UseChatReturn {
  isTyping: boolean;
  error: string | null;
  pendingEvent: string | null;
  clearEvent: () => void;
  sendMessage: (content: string) => Promise<void>;
}

/** 聊天逻辑 Hook */
export function useChat(): UseChatReturn {
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingEvent, setPendingEvent] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const store = useGameStore;

  const clearEvent = useCallback(() => {
    setPendingEvent(null);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    setError(null);
    setIsTyping(true);

    const state = store.getState();
    const now = new Date().toISOString();

    // 添加用户消息
    const userMsg: ChatMessage = {
      id: genId(),
      role: 'user',
      content: content.trim(),
      timestamp: now,
    };
    state.addMessage(userMsg);

    // 构建 API 请求
    const gameState = {
      user: state.user,
      character: state.character,
      economy: state.economy,
      chatHistory: [...state.chatHistory, userMsg],
      meta: state.meta,
    };
    const systemPrompt = buildSystemPrompt(gameState);
    const messages = buildMessages([...state.chatHistory, userMsg], systemPrompt);

    try {
      abortRef.current = new AbortController();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: '请求失败' }));
        throw new Error(errData.error || `请求失败 (${response.status})`);
      }

      // 流式读取响应
      const reader = response.body?.getReader();
      if (!reader) throw new Error('无法读取响应流');

      const decoder = new TextDecoder();
      let fullContent = '';

      // 添加一个占位的助手消息
      const assistantMsg: ChatMessage = {
        id: genId(),
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
      };
      state.addMessage(assistantMsg);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullContent += chunk;

        // 更新助手消息内容（通过替换最后一条消息）
        const currentState = store.getState();
        const updatedHistory = [...currentState.chatHistory];
        const lastIndex = updatedHistory.length - 1;
        if (lastIndex >= 0 && updatedHistory[lastIndex].role === 'assistant') {
          updatedHistory[lastIndex] = {
            ...updatedHistory[lastIndex],
            content: fullContent,
          };
          store.setState({ chatHistory: updatedHistory });
        }
      }

      // 完成后用 sendMessage 更新字数/熟悉度
      // 先移除之前手动添加的两条消息
      const finalState = store.getState();
      const historyWithout = finalState.chatHistory.slice(0, -2);
      store.setState({ chatHistory: historyWithout });

      // 使用 store 的 sendMessage 统一处理
      const oldFamiliarity = finalState.character.familiarity;
      finalState.sendMessage(content.trim(), fullContent);

      // 检测事件触发
      const afterState = store.getState();
      const eventTrigger = checkEventTrigger(
        oldFamiliarity,
        afterState.character.familiarity,
        // 用旧的 eventsTriggered 检查，因为 sendMessage 已经更新了
        finalState.character.eventsTriggered
      );
      if (eventTrigger) {
        setPendingEvent(eventTrigger.eventId);
      }

    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      const message = err instanceof Error ? err.message : '发送失败，请稍后重试';
      setError(message);

      // 5 秒后自动清除错误
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => setError(null), 5000);
    } finally {
      setIsTyping(false);
      abortRef.current = null;
    }
  }, [store]);

  return {
    isTyping,
    error,
    pendingEvent,
    clearEvent,
    sendMessage,
  };
}
