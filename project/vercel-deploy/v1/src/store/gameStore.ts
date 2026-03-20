/** Zustand 全局状态管理 — 包含 GameState 所有字段及操作 */

import { create } from 'zustand';
import type { GameState } from '@/types/game-state';
import { createDefaultGameState, GAME_STATE_VERSION } from '@/types/game-state';
import type { ChatMessage } from '@/types/chat';
import type { FamiliarityPhase } from '@/types/character';
import { countChineseWords, calculateFamiliarityFromWords, calculateFamiliarityFromGold, updateFamiliarity, getFamiliarityPhase } from '@/lib/familiarity';
import { recharge as goldRecharge, sendGift as goldSendGift } from '@/lib/gold-system';
import { exportGameState, importGameState } from '@/lib/save-system';
import { checkEventTrigger } from '@/lib/event-system';
import { processEndingChoice } from '@/lib/ending-system';
import { transformPenguin, getPostEndingPenguinState } from '@/lib/penguin-system';
import type { PenguinForm } from '@/types/penguin';
import { FUEL_CONSTANTS } from '@/types/fuel';
import type { Spark } from '@/types/spark';
import type { SparkRating } from '@/types/fuel';
import { getFuelChangeForRating, updateFuel } from '@/lib/fuel-system';

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
  /** 触发终局（熟悉度达 100%） */
  triggerEnding: () => void;
  /** 做出终极选择 */
  makeEndingChoice: (choice: 'send-away' | 'become-poet') => void;
  /** 企鹅变形 */
  transformPenguinForm: (form: PenguinForm) => { success: boolean; goldCost: number };
  /** 进入灯塔模式 */
  enterLighthouseMode: () => void;
  /** 设置待回应火种 */
  setPendingSpark: (spark: Spark) => void;
  /** 记录火种回应 */
  recordSparkResponse: (sparkId: string, rating: SparkRating) => void;
  /** 累加自上次火种以来的轮数 */
  incrementTurnsSinceLastSpark: () => void;
  /** 更新燃料值 */
  updateFuelValue: (delta: number) => void;
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

    // 送礼成功，增加熟悉度
    const familiarityDelta = calculateFamiliarityFromGold(amount);
    const newFamiliarity = updateFamiliarity(state.character.familiarity, familiarityDelta);
    const newPhase = getFamiliarityPhase(newFamiliarity);
    const now = new Date().toISOString();

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
      economy: {
        ...state.economy,
        goldBalance: result.newBalance,
        totalGoldSpent: state.economy.totalGoldSpent + amount,
      },
      character: {
        ...state.character,
        familiarity: newFamiliarity,
        currentPhase: newPhase,
        eventsTriggered: newEventsTriggered,
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
      ending: state.ending,
      penguin: state.penguin,
      fuel: state.fuel,
      spark: state.spark,
      chatHistory: state.chatHistory,
      meta: state.meta,
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
      ending: result.state.ending,
      penguin: result.state.penguin,
      fuel: result.state.fuel,
      spark: result.state.spark,
      chatHistory: result.state.chatHistory,
      meta: result.state.meta,
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

  triggerEnding: () => {
    const state = get();
    if (state.character.familiarity < 100) return;
    if (state.ending.endingReached) return;

    set({
      ending: {
        ...state.ending,
        endingReached: true,
      },
    });
  },

  makeEndingChoice: (choice: 'send-away' | 'become-poet') => {
    const state = get();
    if (!state.ending.endingReached) return;
    if (state.ending.choiceMade !== 'none') return;

    const stateUpdates = processEndingChoice(choice, state);
    const penguinState = getPostEndingPenguinState(state.penguin, choice);

    const fuelUpdate = choice === 'become-poet'
      ? {
          currentFuel: FUEL_CONSTANTS.INITIAL,
          fuelPhase: 'voyage' as const,
          lastUpdateTime: new Date().toISOString(),
          stallLevel: 'none' as const,
          turnsInStall: 0,
          consecutiveGoodSparks: 0,
        }
      : state.fuel;

    set({
      ...stateUpdates,
      ending: {
        endingReached: true,
        choiceMade: choice,
        postEndingActive: choice === 'become-poet',
      },
      penguin: penguinState,
      fuel: fuelUpdate,
    });
  },

  transformPenguinForm: (form: PenguinForm) => {
    const state = get();
    const result = transformPenguin(state.penguin, form, state.economy.goldBalance);

    if (result.goldCost === 0 && result.newState.currentForm === state.penguin.currentForm) {
      return { success: false, goldCost: 0 };
    }

    set({
      penguin: result.newState,
      economy: {
        ...state.economy,
        goldBalance: state.economy.goldBalance - result.goldCost,
        totalGoldSpent: state.economy.totalGoldSpent + result.goldCost,
      },
    });

    return { success: true, goldCost: result.goldCost };
  },

  setPendingSpark: (spark: Spark) => {
    set((state) => ({
      spark: {
        ...state.spark,
        pendingSpark: spark,
        turnsSinceLastSpark: 0,
        lastSparkTime: new Date().toISOString(),
      },
    }));
  },

  recordSparkResponse: (sparkId: string, rating: SparkRating) => {
    const state = get();
    const pending = state.spark.pendingSpark;
    if (!pending || pending.id !== sparkId) return;

    const fuelChange = getFuelChangeForRating(rating);
    const newFuel = updateFuel(state.fuel.currentFuel, fuelChange);
    const isGood = rating >= 2;
    const isCreative = rating >= 3;

    set({
      spark: {
        ...state.spark,
        pendingSpark: null,
        sparkHistory: [
          ...state.spark.sparkHistory,
          {
            spark: pending,
            evaluation: {
              sparkId,
              rating,
              userResponse: '',
              evaluatedAt: new Date().toISOString(),
            },
            ignored: false,
          },
        ],
        totalCreativeTransforms: state.spark.totalCreativeTransforms + (isCreative ? 1 : 0),
      },
      fuel: {
        ...state.fuel,
        currentFuel: newFuel,
        consecutiveGoodSparks: isGood ? state.fuel.consecutiveGoodSparks + 1 : 0,
      },
    });
  },

  incrementTurnsSinceLastSpark: () => {
    set((state) => ({
      spark: {
        ...state.spark,
        turnsSinceLastSpark: state.spark.turnsSinceLastSpark + 1,
      },
    }));
  },

  updateFuelValue: (delta: number) => {
    const state = get();
    const newFuel = updateFuel(state.fuel.currentFuel, delta);
    set({
      fuel: {
        ...state.fuel,
        currentFuel: newFuel,
      },
    });
  },

  enterLighthouseMode: () => {
    const state = get();
    if (state.ending.choiceMade !== 'become-poet') return;

    set({
      penguin: {
        ...state.penguin,
        currentForm: 'lighthouse',
        availableForms: [...state.penguin.availableForms, 'lighthouse'],
        transformHistory: [
          ...state.penguin.transformHistory,
          `lighthouse:${new Date().toISOString()}`,
        ],
      },
      fuel: {
        ...state.fuel,
        fuelPhase: 'lighthouse',
      },
    });
  },
}));
