/** 企鹅变形系统 — 形态管理、变形判定、终局变形 */

import {
  PENGUIN_FORMS,
  type PenguinForm,
  type PenguinFormConfig,
  type PenguinState,
} from '@/types/penguin';
import type { EndingChoice } from '@/types/ending';

/**
 * 获取所有企鹅形态的完整配置列表
 */
export function getPenguinForms(): PenguinFormConfig[] {
  return PENGUIN_FORMS;
}

/**
 * 检查是否可以变形为指定形态
 * 条件：金币余额足够 且 该形态已解锁或正在购买解锁
 * 特殊形态（船/审美判断者/灯塔）不可通过此途径变形
 */
export function canTransform(
  form: PenguinForm,
  goldBalance: number,
  availableForms: PenguinForm[]
): boolean {
  const config = PENGUIN_FORMS.find((f) => f.form === form);
  if (!config) return false;

  // 特殊形态不可通过金币购买
  if (config.isSpecial) return false;

  // 已解锁的形态可以免费切换
  if (availableForms.includes(form)) return true;

  // 未解锁的形态需要金币购买
  return goldBalance >= config.cost;
}

/** 变形结果 */
interface TransformResult {
  /** 变形后的企鹅状态 */
  newState: PenguinState;
  /** 消耗的金币数量（已解锁形态切换为 0） */
  goldCost: number;
}

/**
 * 执行企鹅变形
 * 如果形态已解锁则免费切换，否则消耗金币解锁并切换
 * 返回新状态和金币消耗
 */
export function transformPenguin(
  currentState: PenguinState,
  form: PenguinForm,
  goldBalance: number
): TransformResult {
  const config = PENGUIN_FORMS.find((f) => f.form === form);
  if (!config) {
    return { newState: currentState, goldCost: 0 };
  }

  // 特殊形态不允许手动切换
  if (config.isSpecial) {
    return { newState: currentState, goldCost: 0 };
  }

  const alreadyUnlocked = currentState.availableForms.includes(form);

  // 未解锁且金币不足
  if (!alreadyUnlocked && goldBalance < config.cost) {
    return { newState: currentState, goldCost: 0 };
  }

  const goldCost = alreadyUnlocked ? 0 : config.cost;
  const newAvailableForms = alreadyUnlocked
    ? currentState.availableForms
    : [...currentState.availableForms, form];

  const newState: PenguinState = {
    currentForm: form,
    transformHistory: [
      ...currentState.transformHistory,
      `${form}:${new Date().toISOString()}`,
    ],
    availableForms: newAvailableForms,
  };

  return { newState, goldCost };
}

/**
 * 根据终局选择获取企鹅的终局后状态
 * 结局一（送他离开）：企鹅变为船
 * 结局二（成为诗人）：企鹅变为审美判断者
 */
export function getPostEndingPenguinState(
  currentState: PenguinState,
  ending: EndingChoice
): PenguinState {
  if (ending === 'send-away') {
    // 结局一：企鹅 → 船
    return {
      currentForm: 'boat',
      transformHistory: [
        ...currentState.transformHistory,
        `boat:${new Date().toISOString()}`,
      ],
      availableForms: [...currentState.availableForms, 'boat'],
    };
  }

  if (ending === 'become-poet') {
    // 结局二：企鹅 → 审美判断者（静默内变，不再有形态切换）
    return {
      currentForm: 'judge',
      transformHistory: [
        ...currentState.transformHistory,
        `judge:${new Date().toISOString()}`,
      ],
      availableForms: [...currentState.availableForms, 'judge'],
    };
  }

  // 未做选择，返回原状态
  return currentState;
}
