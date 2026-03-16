/** 终局系统 — 处理熟悉度 100% 后的终极选择与状态转换 */

import type { GameState } from '@/types/game-state';
import { FUEL_CONSTANTS } from '@/types/fuel';

// ============================================================
// 类型定义（等 types agent 创建后迁移到 @/types/ending.ts）
// ============================================================

/** 终局选择：送走诗人 / 成为诗人 */
export type EndingChoice = 'send-away' | 'become-poet' | 'none';

/** 终局后系统状态快照 */
export interface PostEndingSnapshot {
  /** 被移除的系统名称列表 */
  systemsRemoved: string[];
  /** 被激活的系统名称列表 */
  systemsActivated: string[];
  /** 燃料初始值（仅结局二） */
  fuelInitial: number;
}

/** 终局触发条件 */
export const ENDING_TRIGGER_FAMILIARITY = 100;

// ============================================================
// 核心函数
// ============================================================

/**
 * 检查是否达到终局条件
 * 熟悉度达到 100% 即触发
 */
export function checkEndingTrigger(familiarity: number): boolean {
  return familiarity >= ENDING_TRIGGER_FAMILIARITY;
}

/**
 * 处理终局选择，返回需要更新的 state 字段
 *
 * send-away（结局一）：
 *   - 标记结局为 'send-away'
 *   - 设置阶段为 'ended'
 *   - 保留聊天记录
 *
 * become-poet（结局二）：
 *   - 初始化燃料系统（80）
 *   - 清除金币、送礼、熟悉度系统
 *   - 激活火种系统标记
 *   - 身份切换标记
 */
export function processEndingChoice(
  choice: 'send-away' | 'become-poet',
  currentState: GameState
): Partial<GameState> {
  const now = new Date().toISOString();

  if (choice === 'send-away') {
    return {
      character: {
        ...currentState.character,
        currentPhase: 'bonded',
        eventsTriggered: [
          ...currentState.character.eventsTriggered,
          'ending-send-away',
        ],
      },
      meta: {
        ...currentState.meta,
        lastSavedAt: now,
      },
    };
  }

  /* 结局二：成为诗人 */
  return {
    character: {
      ...currentState.character,
      /* 保留 familiarity 为 100 但系统不再使用它 */
      currentPhase: 'bonded',
      eventsTriggered: [
        ...currentState.character.eventsTriggered,
        'ending-become-poet',
      ],
    },
    economy: {
      /* 金币系统清零——不可逆 */
      goldBalance: 0,
      totalGoldEarned: currentState.economy.totalGoldEarned,
      totalGoldSpent: currentState.economy.totalGoldSpent,
      rechargeHistory: currentState.economy.rechargeHistory,
    },
    meta: {
      ...currentState.meta,
      lastSavedAt: now,
    },
  };
}

/**
 * 获取结局后的系统状态快照
 * 描述哪些系统被移除、哪些被激活
 */
export function getPostEndingSystemState(choice: EndingChoice): PostEndingSnapshot {
  if (choice === 'send-away') {
    return {
      systemsRemoved: [
        '对话系统',
        '熟悉度系统',
        '金币系统',
        '送礼系统',
        '火种系统',
      ],
      systemsActivated: [
        '永久结局屏',
        '回声消息系统',
      ],
      fuelInitial: 0,
    };
  }

  if (choice === 'become-poet') {
    return {
      systemsRemoved: [
        '熟悉度系统',
        '金币系统',
        '送礼系统',
      ],
      systemsActivated: [
        '航程燃料系统',
        '火种系统',
        '失速系统',
        '灯塔模式',
        '远方通信',
      ],
      fuelInitial: FUEL_CONSTANTS.INITIAL,
    };
  }

  /* choice === 'none' */
  return {
    systemsRemoved: [],
    systemsActivated: [],
    fuelInitial: 0,
  };
}

/**
 * 从 JSON 存档中检测结局状态
 * 通过检查 eventsTriggered 判断用户选择了哪个结局
 */
export function getEndingFromSave(gameState: GameState): EndingChoice {
  const triggered = gameState.character.eventsTriggered;

  if (triggered.includes('ending-send-away')) {
    return 'send-away';
  }

  if (triggered.includes('ending-become-poet')) {
    return 'become-poet';
  }

  return 'none';
}

/**
 * 判断存档是否处于结局一的永久屏状态
 */
export function isSendAwayEnding(gameState: GameState): boolean {
  return getEndingFromSave(gameState) === 'send-away';
}

/**
 * 判断存档是否处于结局二的诗人模式
 */
export function isBecomePoetEnding(gameState: GameState): boolean {
  return getEndingFromSave(gameState) === 'become-poet';
}

/**
 * 检查是否已做出终局选择
 */
export function hasEndingChoice(gameState: GameState): boolean {
  return getEndingFromSave(gameState) !== 'none';
}
