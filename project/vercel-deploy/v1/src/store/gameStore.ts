/** Zustand 全局状态管理 — 包含 GameState 所有字段及操作 */

import { create } from 'zustand';
import type { GameState } from '@/types/game-state';
import { createDefaultGameState, GAME_STATE_VERSION } from '@/types/game-state';
import type { ChatMessage } from '@/types/chat';
import type { FamiliarityPhase } from '@/types/character';
import type { StallLevel } from '@/types/fuel';
import type { PenguinForm } from '@/types/penguin';
import type { EndingChoice } from '@/types/ending';
import type { Spark, SparkEvaluation } from '@/types/spark';
import { countChineseWords, calculateFamiliarityFromWords, updateFamiliarity, getFamiliarityPhase } from '@/lib/familiarity';
import { recharge as goldRecharge, sendGift as goldSendGift } from '@/lib/gold-system';
import { exportGameState, importGameState } from '@/lib/save-system';
import { checkEventTrigger } from '@/lib/event-system';
import { updateFuel } from '@/lib/fuel-system';
import { transformPenguin, getPostEndingPenguinState } from '@/lib/penguin-system';
import { processEndingChoice, checkEndingTrigger } from '@/lib/ending-system';

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

  // === 燃料相关 ===
  /** 更新燃料值 */
  updateFuelValue: (delta: number) => void;
  /** 设置失速等级 */
  setStallLevel: (level: StallLevel) => void;
  /** 进入灯塔模式 */
  enterLighthouseMode: () => void;

  // === 企鹅相关 ===
  /** 企鹅变形（消耗金币解锁或切换已有形态） */
  transformPenguinForm: (form: PenguinForm) => { success: boolean; goldCost: number; error?: string };
  /** 终局后设置企鹅状态 */
  setPostEndingPenguin: (choice: EndingChoice) => void;

  // === 火种相关 ===
  /** 设置当前待回应的火种 */
  setPendingSpark: (spark: Spark | null) => void;
  /** 记录火种回应及评级 */
  recordSparkResponse: (sparkId: string, rating: number) => void;
  /** 每轮对话增加火种计数器 */
  incrementTurnsSinceLastSpark: () => void;
  /** 每次火种后增加回声计数 */
  incrementSparksSinceLastEcho: () => void;
  /** 回声出现后重置计数 */
  resetSparksSinceLastEcho: () => void;

  // === 终局相关 ===
  /** 标记到达终局 */
  triggerEnding: () => void;
  /** 执行终局选择 */
  makeEndingChoice: (choice: 'send-away' | 'become-poet') => void;
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

  // === 燃料相关 actions ===

  updateFuelValue: (delta: number) => {
    const state = get();
    const newFuel = updateFuel(state.fuel.currentFuel, delta);
    const now = new Date().toISOString();

    set({
      fuel: {
        ...state.fuel,
        currentFuel: newFuel,
        lastUpdateTime: now,
      },
      meta: {
        ...state.meta,
        lastSavedAt: now,
      },
    });
  },

  setStallLevel: (level: StallLevel) => {
    const state = get();

    set({
      fuel: {
        ...state.fuel,
        stallLevel: level,
        // 进入失速时重置连续高质量计数
        consecutiveGoodSparks: level === 'none' ? state.fuel.consecutiveGoodSparks : 0,
        // 跟踪失速持续轮数
        turnsInStall: level === 'none' ? 0 : state.fuel.turnsInStall,
      },
    });
  },

  enterLighthouseMode: () => {
    const state = get();
    const now = new Date().toISOString();

    set({
      fuel: {
        ...state.fuel,
        fuelPhase: 'lighthouse',
        lastUpdateTime: now,
      },
      // 灯塔模式下企鹅变为灯塔形态
      penguin: {
        ...state.penguin,
        currentForm: 'lighthouse',
        transformHistory: [
          ...state.penguin.transformHistory,
          `lighthouse:${now}`,
        ],
        availableForms: state.penguin.availableForms.includes('lighthouse')
          ? state.penguin.availableForms
          : [...state.penguin.availableForms, 'lighthouse'],
      },
      meta: {
        ...state.meta,
        lastSavedAt: now,
      },
    });
  },

  // === 企鹅相关 actions ===

  transformPenguinForm: (form: PenguinForm) => {
    const state = get();
    const result = transformPenguin(state.penguin, form, state.economy.goldBalance);

    // 如果没有金币消耗且形态未改变，说明变形失败
    if (result.goldCost === 0 && result.newState.currentForm === state.penguin.currentForm) {
      return { success: false, goldCost: 0, error: '无法变形为该形态' };
    }

    const now = new Date().toISOString();

    set({
      penguin: result.newState,
      economy: {
        ...state.economy,
        goldBalance: state.economy.goldBalance - result.goldCost,
        totalGoldSpent: state.economy.totalGoldSpent + result.goldCost,
      },
      meta: {
        ...state.meta,
        lastSavedAt: now,
      },
    });

    return { success: true, goldCost: result.goldCost };
  },

  setPostEndingPenguin: (choice: EndingChoice) => {
    const state = get();
    const newPenguinState = getPostEndingPenguinState(state.penguin, choice);
    const now = new Date().toISOString();

    set({
      penguin: newPenguinState,
      meta: {
        ...state.meta,
        lastSavedAt: now,
      },
    });
  },

  // === 火种相关 actions ===

  setPendingSpark: (spark: Spark | null) => {
    const state = get();
    const now = new Date().toISOString();

    set({
      spark: {
        ...state.spark,
        pendingSpark: spark,
        // 设置新火种时重置轮数计数
        turnsSinceLastSpark: spark ? 0 : state.spark.turnsSinceLastSpark,
        lastSparkTime: spark ? now : state.spark.lastSparkTime,
      },
    });
  },

  recordSparkResponse: (sparkId: string, rating: number) => {
    const state = get();
    const pendingSpark = state.spark.pendingSpark;
    const now = new Date().toISOString();

    // 确保评级在有效范围 1-4
    const clampedRating = Math.max(1, Math.min(4, Math.round(rating))) as 1 | 2 | 3 | 4;

    // 构建火种评估记录
    const evaluation: SparkEvaluation = {
      sparkId,
      rating: clampedRating,
      userResponse: '',
      evaluatedAt: now,
    };

    // 更新历史记录：如果 pendingSpark 匹配则创建完整记录
    const newRecord = pendingSpark && pendingSpark.id === sparkId
      ? { spark: pendingSpark, evaluation, ignored: false }
      : null;

    // 计算创造性转化次数增量
    const creativeIncrement = clampedRating >= 3 ? 1 : 0;

    // 更新连续高质量计数
    const isGoodResponse = clampedRating >= 2;
    const newConsecutiveGood = isGoodResponse
      ? state.fuel.consecutiveGoodSparks + 1
      : 0;

    set({
      spark: {
        ...state.spark,
        pendingSpark: null,
        sparkHistory: newRecord
          ? [...state.spark.sparkHistory, newRecord]
          : state.spark.sparkHistory,
        totalCreativeTransforms: state.spark.totalCreativeTransforms + creativeIncrement,
      },
      fuel: {
        ...state.fuel,
        consecutiveGoodSparks: newConsecutiveGood,
        lastUpdateTime: now,
      },
      meta: {
        ...state.meta,
        lastSavedAt: now,
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

  incrementSparksSinceLastEcho: () => {
    set((state) => ({
      spark: {
        ...state.spark,
        sparksSinceLastEcho: state.spark.sparksSinceLastEcho + 1,
      },
    }));
  },

  resetSparksSinceLastEcho: () => {
    set((state) => ({
      spark: {
        ...state.spark,
        sparksSinceLastEcho: 0,
      },
    }));
  },

  // === 终局相关 actions ===

  triggerEnding: () => {
    const state = get();

    // 仅在熟悉度到达 100% 且尚未触发时执行
    if (!checkEndingTrigger(state.character.familiarity)) return;
    if (state.ending.endingReached) return;

    const now = new Date().toISOString();

    set({
      ending: {
        ...state.ending,
        endingReached: true,
      },
      meta: {
        ...state.meta,
        lastSavedAt: now,
      },
    });
  },

  makeEndingChoice: (choice: 'send-away' | 'become-poet') => {
    const state = get();

    // 防止重复选择
    if (state.ending.choiceMade !== 'none') return;

    const currentGameState: GameState = {
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

    // 调用 ending-system 获取需要更新的 state 部分
    const stateUpdates = processEndingChoice(choice, currentGameState);

    const now = new Date().toISOString();

    // 构建终局状态
    const newEnding = {
      endingReached: true,
      choiceMade: choice,
      postEndingActive: choice === 'become-poet',
    };

    // 结局二特殊处理：初始化燃料系统和火种系统
    const fuelUpdate = choice === 'become-poet'
      ? {
          currentFuel: 80,
          fuelPhase: 'voyage' as const,
          lastUpdateTime: now,
          stallLevel: 'none' as const,
          turnsInStall: 0,
          consecutiveGoodSparks: 0,
        }
      : state.fuel;

    // 结局二：设置企鹅为审美判断者；结局一：设置企鹅为船
    const penguinUpdate = getPostEndingPenguinState(state.penguin, choice);

    set({
      ...stateUpdates,
      ending: newEnding,
      fuel: fuelUpdate,
      penguin: penguinUpdate,
      meta: {
        ...state.meta,
        lastSavedAt: now,
      },
    });
  },
}));
