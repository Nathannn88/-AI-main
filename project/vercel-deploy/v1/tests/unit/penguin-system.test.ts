/** 企鹅变形系统单元测试 */

import { describe, it, expect } from 'vitest';
import {
  getPenguinForms,
  canTransform,
  transformPenguin,
  getPostEndingPenguinState,
} from '@/lib/penguin-system';
import { PENGUIN_FORMS, type PenguinState } from '@/types/penguin';

/** 创建默认企鹅状态的工厂函数 */
function makeDefaultPenguinState(): PenguinState {
  return {
    currentForm: 'default',
    transformHistory: [],
    availableForms: ['default'],
  };
}

// ============================================================
// getPenguinForms
// ============================================================

describe('getPenguinForms - 获取所有形态配置', () => {
  it('返回所有形态配置', () => {
    const forms = getPenguinForms();
    expect(forms).toEqual(PENGUIN_FORMS);
    expect(forms.length).toBeGreaterThan(0);
  });

  it('默认形态 cost 为 0', () => {
    const forms = getPenguinForms();
    const defaultForm = forms.find((f) => f.form === 'default');
    expect(defaultForm).toBeDefined();
    expect(defaultForm!.cost).toBe(0);
  });
});

// ============================================================
// canTransform
// ============================================================

describe('canTransform - 变形条件判定', () => {
  it('金币足够且未解锁时可以变形', () => {
    expect(canTransform('toaster', 100, ['default'])).toBe(true);
  });

  it('金币不足时不能变形', () => {
    expect(canTransform('toaster', 10, ['default'])).toBe(false);
  });

  it('已解锁形态可以免费切换', () => {
    expect(canTransform('toaster', 0, ['default', 'toaster'])).toBe(true);
  });

  it('默认形态始终可切换', () => {
    expect(canTransform('default', 0, ['default'])).toBe(true);
  });

  it('特殊形态不可通过金币购买', () => {
    expect(canTransform('boat', 9999, ['default'])).toBe(false);
    expect(canTransform('judge', 9999, ['default'])).toBe(false);
    expect(canTransform('lighthouse', 9999, ['default'])).toBe(false);
  });
});

// ============================================================
// transformPenguin
// ============================================================

describe('transformPenguin - 执行企鹅变形', () => {
  it('成功变形更新状态', () => {
    const state = makeDefaultPenguinState();
    const result = transformPenguin(state, 'toaster', 100);
    expect(result.newState.currentForm).toBe('toaster');
  });

  it('扣除正确金币数', () => {
    const state = makeDefaultPenguinState();
    const toasterCost = PENGUIN_FORMS.find((f) => f.form === 'toaster')!.cost;
    const result = transformPenguin(state, 'toaster', 100);
    expect(result.goldCost).toBe(toasterCost);
  });

  it('已解锁形态不重复扣费', () => {
    const state: PenguinState = {
      currentForm: 'default',
      transformHistory: [],
      availableForms: ['default', 'toaster'],
    };
    const result = transformPenguin(state, 'toaster', 0);
    expect(result.goldCost).toBe(0);
    expect(result.newState.currentForm).toBe('toaster');
  });

  it('记录变形历史', () => {
    const state = makeDefaultPenguinState();
    const result = transformPenguin(state, 'toaster', 100);
    expect(result.newState.transformHistory.length).toBe(1);
    expect(result.newState.transformHistory[0]).toContain('toaster');
  });

  it('金币不足变形失败返回原状态', () => {
    const state = makeDefaultPenguinState();
    const result = transformPenguin(state, 'toaster', 1);
    expect(result.newState.currentForm).toBe('default');
    expect(result.goldCost).toBe(0);
  });

  it('特殊形态不允许手动切换', () => {
    const state = makeDefaultPenguinState();
    const result = transformPenguin(state, 'boat', 9999);
    expect(result.newState.currentForm).toBe('default');
    expect(result.goldCost).toBe(0);
  });
});

// ============================================================
// getPostEndingPenguinState
// ============================================================

describe('getPostEndingPenguinState - 终局后企鹅状态', () => {
  it('结局一返回 boat 形态', () => {
    const state = makeDefaultPenguinState();
    const result = getPostEndingPenguinState(state, 'send-away');
    expect(result.currentForm).toBe('boat');
    expect(result.availableForms).toContain('boat');
  });

  it('结局二返回 judge 形态', () => {
    const state = makeDefaultPenguinState();
    const result = getPostEndingPenguinState(state, 'become-poet');
    expect(result.currentForm).toBe('judge');
    expect(result.availableForms).toContain('judge');
  });

  it('结局变形会记录到变形历史', () => {
    const state = makeDefaultPenguinState();
    const result = getPostEndingPenguinState(state, 'send-away');
    expect(result.transformHistory.length).toBe(1);
    expect(result.transformHistory[0]).toContain('boat');
  });

  it('未做选择返回原状态', () => {
    const state = makeDefaultPenguinState();
    const result = getPostEndingPenguinState(state, 'none');
    expect(result).toEqual(state);
  });
});
