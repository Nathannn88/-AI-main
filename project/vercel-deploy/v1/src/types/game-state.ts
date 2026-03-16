/** 游戏状态完整类型定义 */

import type { ChatMessage } from './chat';
import type { FamiliarityPhase } from './character';
import type { FuelState } from './fuel';
import type { PenguinState } from './penguin';
import type { EndingState } from './ending';
import type { SparkState } from './spark';

/** 用户信息 */
export interface UserState {
  name: string;
  introCompleted: boolean;
  introAnswers: Record<string, string>;
}

/** 角色状态 */
export interface CharacterGameState {
  familiarity: number;
  totalWordsFromUser: number;
  eventsTriggered: string[];
  currentPhase: FamiliarityPhase;
}

/** 经济系统状态 */
export interface EconomyState {
  goldBalance: number;
  totalGoldEarned: number;
  totalGoldSpent: number;
  rechargeHistory: Array<{ amount: number; timestamp: string }>;
}

/** 元信息 */
export interface MetaState {
  version: string;
  createdAt: string;
  lastSavedAt: string;
}

/** 完整游戏状态 */
export interface GameState {
  user: UserState;
  character: CharacterGameState;
  economy: EconomyState;
  chatHistory: ChatMessage[];
  meta: MetaState;
  /** 航程燃料状态（结局二后激活） */
  fuel: FuelState;
  /** 企鹅变形状态 */
  penguin: PenguinState;
  /** 终局状态 */
  ending: EndingState;
  /** 火种状态（结局二后激活） */
  spark: SparkState;
}

/** 当前版本号 */
export const GAME_STATE_VERSION = '1.0.0';

/** 创建默认游戏状态 */
export function createDefaultGameState(): GameState {
  const now = new Date().toISOString();
  return {
    user: {
      name: '',
      introCompleted: false,
      introAnswers: {},
    },
    character: {
      familiarity: 0,
      totalWordsFromUser: 0,
      eventsTriggered: [],
      currentPhase: 'intro',
    },
    economy: {
      goldBalance: 0,
      totalGoldEarned: 0,
      totalGoldSpent: 0,
      rechargeHistory: [],
    },
    chatHistory: [],
    meta: {
      version: GAME_STATE_VERSION,
      createdAt: now,
      lastSavedAt: now,
    },
    fuel: {
      currentFuel: 0,
      fuelPhase: 'growing',
      lastUpdateTime: now,
      stallLevel: 'none',
      turnsInStall: 0,
      consecutiveGoodSparks: 0,
    },
    penguin: {
      currentForm: 'default',
      transformHistory: [],
      availableForms: ['default'],
    },
    ending: {
      endingReached: false,
      choiceMade: 'none',
      postEndingActive: false,
    },
    spark: {
      pendingSpark: null,
      sparkHistory: [],
      lastSparkTime: now,
      totalCreativeTransforms: 0,
      sparksSinceLastEcho: 0,
      turnsSinceLastSpark: 0,
    },
  };
}
