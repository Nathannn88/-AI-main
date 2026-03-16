/** 聊天容器 — TopBar + 消息区域 + FamiliarityBar + InputBar，驱动 CSS 变量切换 */

'use client';

import { useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import MessageBubble from './MessageBubble';
import type { Spark } from '@/types/spark';

interface ChatContainerProps {
  isTyping: boolean;
  /** 当前待展示的火种（如果有），由父组件注入 */
  pendingSpark?: Spark | null;
}

/** 聊天消息列表容器 */
export default function ChatContainer({ isTyping, pendingSpark }: ChatContainerProps) {
  const chatHistory = useGameStore((s) => s.chatHistory);
  const character = useGameStore((s) => s.character);
  const ending = useGameStore((s) => s.ending);
  const fuel = useGameStore((s) => s.fuel);

  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* 自动滚动到底部 */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory.length, isTyping]);

  /* 计算 data-phase 属性 */
  const dataPhase = character.currentPhase;

  /* 计算 data-stall 属性 */
  const dataStall = useMemo(() => {
    if (!ending.postEndingActive) return undefined;
    switch (fuel.stallLevel) {
      case 'warning':
        return 'warning';
      case 'stall':
        return 'stalled';
      case 'deep_stall':
        return 'deep';
      default:
        return undefined;
    }
  }, [ending.postEndingActive, fuel.stallLevel]);

  /* 是否处于远方模式（结局二） */
  const isAstralMode = ending.postEndingActive;

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-4 relative z-content stall-filter"
      data-phase={dataPhase}
      data-stall={dataStall}
    >
      {/* 失速灰化叠加层 */}
      {dataStall && (
        <div
          className="absolute inset-0 pointer-events-none z-10 transition-all duration-[3000ms]"
          style={{ backgroundColor: 'var(--stall-overlay)' }}
        />
      )}

      <div className="max-w-3xl mx-auto space-y-4">
        {/* 空状态提示 */}
        {chatHistory.length === 0 && !isTyping && (
          <div className="flex items-center justify-center h-full min-h-[200px]">
            <motion.p
              className="text-caption text-txt-muted text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {isAstralMode ? '航程已开始。写点什么吧。' : '开始你们的对话吧'}
            </motion.p>
          </div>
        )}

        {/* 消息列表 */}
        {chatHistory.map((msg, i) => {
          const prevMsg = i > 0 ? chatHistory[i - 1] : null;
          const isSameSide = prevMsg !== null && prevMsg.role === msg.role;

          return (
            <div
              key={msg.id}
              className={`${isSameSide ? 'mt-2' : 'mt-5'} max-w-[85%] sm:max-w-[75%] ${
                msg.role === 'user' ? 'ml-auto' : 'mr-auto'
              }`}
              style={{ maxWidth: msg.role === 'system' ? '100%' : undefined }}
            >
              <MessageBubble
                message={msg}
                isAstralMode={isAstralMode}
              />
            </div>
          );
        })}

        {/* 火种卡片（如果有待展示的火种） */}
        {pendingSpark && (
          <div className="mt-5 mr-auto max-w-[85%] sm:max-w-[75%]">
            <MessageBubble
              message={{
                id: `spark-${pendingSpark.id}`,
                role: 'assistant',
                content: pendingSpark.content,
                timestamp: pendingSpark.createdAt,
              }}
              isAstralMode={isAstralMode}
              spark={pendingSpark}
            />
          </div>
        )}

        {/* 打字指示器 */}
        {isTyping && (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-3">
              {/* 诗人侧翡翠竖线 */}
              <div
                className="w-[2px] h-6 rounded-full animate-pulse-glow"
                style={{
                  background: isAstralMode
                    ? 'linear-gradient(to bottom, #6C5CE7, #A39AF5)'
                    : 'linear-gradient(to bottom, var(--chord-color-1), var(--chord-color-2))',
                }}
              />
              <div className={isAstralMode ? 'bubble-astral flex items-center gap-1.5 py-3 px-5' : 'bubble-poet flex items-center gap-1.5 py-3 px-5'}>
                {[0, 1, 2].map((dotIndex) => (
                  <div
                    key={dotIndex}
                    className={`w-2 h-2 rounded-full animate-typing-dot ${
                      isAstralMode ? 'bg-astral-400' : 'bg-jade-500'
                    }`}
                    style={{ animationDelay: `${dotIndex * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
