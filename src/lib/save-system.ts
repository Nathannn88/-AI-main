/** 存档系统 — 导出/导入/校验 GameState */

import type { GameState } from '@/types/game-state';
import { GAME_STATE_VERSION } from '@/types/game-state';

/**
 * 导出游戏状态为 JSON 字符串
 */
export function exportGameState(state: GameState): string {
  const exportState: GameState = {
    ...state,
    meta: {
      ...state.meta,
      lastSavedAt: new Date().toISOString(),
    },
  };
  return JSON.stringify(exportState, null, 2);
}

/**
 * 生成存档文件名
 */
export function generateSaveFileName(): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `flawed-ai-save-${timestamp}.json`;
}

/**
 * 校验数据是否是有效的 GameState
 */
export function validateGameState(data: unknown): data is GameState {
  if (!data || typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  // 校验顶层结构
  if (!obj.user || typeof obj.user !== 'object') return false;
  if (!obj.character || typeof obj.character !== 'object') return false;
  if (!obj.economy || typeof obj.economy !== 'object') return false;
  if (!Array.isArray(obj.chatHistory)) return false;
  if (!obj.meta || typeof obj.meta !== 'object') return false;

  // 校验 user
  const user = obj.user as Record<string, unknown>;
  if (typeof user.name !== 'string') return false;
  if (typeof user.introCompleted !== 'boolean') return false;
  if (!user.introAnswers || typeof user.introAnswers !== 'object') return false;

  // 校验 character
  const character = obj.character as Record<string, unknown>;
  if (typeof character.familiarity !== 'number') return false;
  if (typeof character.totalWordsFromUser !== 'number') return false;
  if (!Array.isArray(character.eventsTriggered)) return false;
  const validPhases = ['intro', 'acquaintance', 'familiar', 'close', 'bonded'];
  if (!validPhases.includes(character.currentPhase as string)) return false;

  // 校验 economy
  const economy = obj.economy as Record<string, unknown>;
  if (typeof economy.goldBalance !== 'number') return false;
  if (typeof economy.totalGoldEarned !== 'number') return false;
  if (typeof economy.totalGoldSpent !== 'number') return false;
  if (!Array.isArray(economy.rechargeHistory)) return false;

  // 校验 meta
  const meta = obj.meta as Record<string, unknown>;
  if (typeof meta.version !== 'string') return false;
  if (typeof meta.createdAt !== 'string') return false;
  if (typeof meta.lastSavedAt !== 'string') return false;

  return true;
}

/** 导入结果 */
export interface ImportResult {
  success: boolean;
  state?: GameState;
  error?: string;
}

/**
 * 从 JSON 字符串导入游戏状态
 */
export function importGameState(json: string): ImportResult {
  // 尝试解析 JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { success: false, error: '文件格式错误，无法解析 JSON' };
  }

  // 校验数据完整性
  if (!validateGameState(parsed)) {
    return { success: false, error: '存档数据不完整或格式不正确' };
  }

  // 检查版本兼容性
  if (parsed.meta.version !== GAME_STATE_VERSION) {
    return {
      success: false,
      error: `存档版本不匹配：期望 ${GAME_STATE_VERSION}，实际 ${parsed.meta.version}`,
    };
  }

  return { success: true, state: parsed };
}
