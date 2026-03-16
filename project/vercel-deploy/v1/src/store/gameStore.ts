/** Zustand 全局状态管理 — 包含 GameState 所有字段及操作 */

import { create } from 'zustand';
import type { GameState } from '@/types/game-state';
import { createDefaultGameState, GAME_STATE_VERSION } from '@/types/game-state';
import type { ChatMessage } from '@/types/chat';
import type { FamiliarityPhase } from '@/types/character';
import { countChineseWords, calculateFamiliarityFromWords, updateFamiliarity, getFamiliarityPhase } from '@/lib/familiarity';
import { recharge as goldRecharge, sendGift as goldSendGift } from '@/lib/gold-system';
import { exportGameState, importGameState } from '@/lib/save-system';
import { checkEventTrigger } from '@/lib/event-system';

/** Store 中的操作方法 */
interface GameActions {
  /** 发送消息并更新字数/熟悉度 */
  sendMessage: (userMessage: string, assistantMessage: string) => void;
  /** 添加单条消息 */
  addMessage: (message: ChatMessage) => void;
  /** 充值金币 */
  addGold: (amount: number) => void;
  /** 送礼 */
  sendGift: (amount: number) => { success: boolean; error?: string };
  /** 更新熟悉度 */
  updateFamiliarityValue: (delta: number) => void;
  /** 记录事件已触发 */
  triggerEvent: (eventId: string) => void;
  /** 导出状态为 JSON */
  exportState: () => string;
  /** 从 JSON 导入状态 */
  importState: (json: string) => { success: boolean; error?: string };
  /** 重置状态 */
  resetState: () => void;
  /** 设置用户名 */
  setUserName: (name: string) => void;
  /** 完成自我介绍 */
  completeIntro: () => void;
  /** 保存介绍回答 */
  saveIntroAnswer: (question: string, answer: string) => void;
}

/** 完整的 Store 类型 */
type GameStore = GameState & GameActions;

/** 生成唯一消息 ID */
function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // 初始状态
  ...createDefaultGameState(),

  sendMessage: (userMessage: string, assistantMessage: string) => {
    const state = get();
    const now = new Date().toISOString();

    // 统计用户消息字数
    const wordCount = countChineseWords(userMessage);
    const familiarityDelta = calculateFamiliarityFromWords(wordCount);
    const newTotalWords = state.character.totalWordsFromUser + wordCount;
    const newFamiliarity = updateFamiliarity(state.character.familiarity, familiarityDelta);
    const newPhase = getFamiliarityPhase(newFamiliarity);

    // 创建消息
    const userMsg: ChatMessage = {
      id: generateMessageId(),
      role: 'user',
      content: userMessage,
      timestamp: now,
    };

    const assistantMsg: ChatMessage = {
      id: generateMessageId(),
      role: 'assistant',
      content: assistantMessage,
      timestamp: now,
    };

    // 检测事件触发
    const eventTrigger = checkEventTrigger(
      state.character.familiarity,
      newFamiliarity,
      state.character.eventsTriggered
    );

    const newEventsTriggered = eventTrigger
      ? [...state.character.eventsTriggered, eventTrigger.eventId]
      : state.character.eventsTriggered;

    set({
      chatHistory: [...state.chatHistory, userMsg, assistantMsg],
      character: {
        ...state.character,
        familiarity: newFamiliarity,
        totalWordsFromUser: newTotalWords,
        currentPhase: newPhase,
        eventsTriggered: newEventsTriggered,
      },
      meta: {
        ...state.meta,
        lastSavedAt: now,
      },
    });
  },

  addMessage: (message: ChatMessage) => {
    set((state) => ({
      chatHistory: [...state.chatHistory, message],
    }));
  },

  addGold: (amount: number) => {
    const state = get();
    const result = goldRecharge(state.economy.goldBalance, amount);
    const now = new Date().toISOString();

    set({
      economy: {
        ...state.economy,
        goldBalance: result.newBalance,
        totalGoldEarned: state.economy.totalGoldEarned + amount,
        rechargeHistory: [
          ...state.economy.rechargeHistory,
          { amount, timestamp: now },
        ],
      },
      meta: {
        ...state.meta,
        lastSavedAt: now,
      },
    });
  },

  sendGift: (amount: number) => {
    const state = get();
    const result = goldSendGift(state.economy.goldBalance, amount);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    // 送礼成功，仅扣除金币（金币不影响熟悉度，熟悉度完全基于对话）
    const now = new Date().toISOString();

    set({
      economy: {
        ...state.economy,
        goldBalance: result.newBalance,
        totalGoldSpent: state.economy.totalGoldSpent + amount,
      },
      meta: {
        ...state.meta,
        lastSavedAt: now,
      },
    });

    return { success: true };
  },

  updateFamiliarityValue: (delta: number) => {
    const state = get();
    const newFamiliarity = updateFamiliarity(state.character.familiarity, delta);
    const newPhase = getFamiliarityPhase(newFamiliarity);

    // 检测事件触发
    const eventTrigger = checkEventTrigger(
      state.character.familiarity,
      newFamiliarity,
      state.character.eventsTriggered
    );

    const newEventsTriggered = eventTrigger
      ? [...state.character.eventsTriggered, eventTrigger.eventId]
      : state.character.eventsTriggered;

    set({
      character: {
        ...state.character,
        familiarity: newFamiliarity,
        currentPhase: newPhase,
        eventsTriggered: newEventsTriggered,
      },
    });
  },

  triggerEvent: (eventId: string) => {
    const state = get();
    if (state.character.eventsTriggered.includes(eventId)) return;

    set({
      character: {
        ...state.character,
        eventsTriggered: [...state.character.eventsTriggered, eventId],
      },
    });
  },

  exportState: () => {
    const state = get();
    const gameState: GameState = {
      user: state.user,
      character: state.character,
      economy: state.economy,
      chatHistory: state.chatHistory,
      meta: state.meta,
      fuel: state.fuel,
      penguin: state.penguin,
      ending: state.ending,
      spark: state.spark,
    };
    return exportGameState(gameState);
  },

  importState: (json: string) => {
    const result = importGameState(json);
    if (!result.success || !result.state) {
      return { success: false, error: result.error };
    }

    set({
      user: result.state.user,
      character: result.state.character,
      economy: result.state.economy,
      chatHistory: result.state.chatHistory,
      meta: result.state.meta,
      fuel: result.state.fuel,
      penguin: result.state.penguin,
      ending: result.state.ending,
      spark: result.state.spark,
    });

    return { success: true };
  },

  resetState: () => {
    set(createDefaultGameState());
  },

  setUserName: (name: string) => {
    set((state) => ({
      user: {
        ...state.user,
        name,
      },
    }));
  },

  completeIntro: () => {
    set((state) => ({
      user: {
        ...state.user,
        introCompleted: true,
      },
    }));
  },

  saveIntroAnswer: (question: string, answer: string) => {
    set((state) => ({
      user: {
        ...state.user,
        introAnswers: {
          ...state.user.introAnswers,
          [question]: answer,
        },
      },
    }));
  },
}));
