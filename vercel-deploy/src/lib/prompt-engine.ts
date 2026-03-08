/** Prompt 引擎 — 动态拼装 system prompt 和消息列表 */

import type { GameState } from '@/types/game-state';
import type { ChatMessage, GLMMessage } from '@/types/chat';
import { getSystemPromptWithUserInfo } from '@/data/prompts/system-prompt';
import { getEventPrompt } from '@/data/prompts/event-prompts';

/** 发送给 GLM 的最大对话轮数 */
const MAX_HISTORY_ROUNDS = 20;

/**
 * 根据游戏状态动态构建 system prompt
 */
export function buildSystemPrompt(state: GameState): string {
  let prompt = getSystemPromptWithUserInfo(
    state.character.currentPhase,
    state.user.name,
    state.character.familiarity,
    state.user.introAnswers
  );

  // 注入最近触发的事件提示词
  const triggeredEvents = state.character.eventsTriggered;
  if (triggeredEvents.length > 0) {
    const lastEvent = triggeredEvents[triggeredEvents.length - 1];
    const eventPrompt = getEventPrompt(lastEvent);
    if (eventPrompt) {
      prompt += `\n\n${eventPrompt}`;
    }
  }

  return prompt;
}

/**
 * 拼装发送给 GLM 的消息列表
 * 包含 system prompt + 最近 20 轮对话历史
 */
export function buildMessages(chatHistory: ChatMessage[], systemPrompt: string): GLMMessage[] {
  const messages: GLMMessage[] = [
    { role: 'system', content: systemPrompt },
  ];

  // 只取最近 MAX_HISTORY_ROUNDS 轮对话（一轮 = 一条用户消息 + 一条助手消息）
  const recentMessages = chatHistory
    .filter((msg) => msg.role === 'user' || msg.role === 'assistant')
    .slice(-(MAX_HISTORY_ROUNDS * 2));

  for (const msg of recentMessages) {
    messages.push({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    });
  }

  return messages;
}
