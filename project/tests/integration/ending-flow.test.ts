/** 终局流程集成测试 — 熟悉度100% → 终局触发 → 选择 → 系统状态切换 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '@/store/gameStore';
import { checkEndingTrigger } from '@/lib/ending-system';

describe('终局流程集成', () => {
  beforeEach(() => {
    useGameStore.getState().resetState();
  });

  it('熟悉度到达100%时 checkEndingTrigger 返回 true', () => {
    expect(checkEndingTrigger(99)).toBe(false);
    expect(checkEndingTrigger(100)).toBe(true);
    expect(checkEndingTrigger(100.5)).toBe(true);
  });

  it('triggerEnding 标记终局状态', () => {
    const store = useGameStore.getState();
    store.updateFamiliarityValue(100);
    store.triggerEnding();

    const state = useGameStore.getState();
    expect(state.ending.endingReached).toBe(true);
    expect(state.ending.choiceMade).toBe('none');
  });

  it('未到100%时 triggerEnding 无效', () => {
    const store = useGameStore.getState();
    store.updateFamiliarityValue(99);
    store.triggerEnding();

    const state = useGameStore.getState();
    expect(state.ending.endingReached).toBe(false);
  });

  it('结局一：送他离开 → 系统终止', () => {
    const store = useGameStore.getState();
    store.updateFamiliarityValue(100);
    store.triggerEnding();
    store.makeEndingChoice('send-away');

    const state = useGameStore.getState();
    expect(state.ending.choiceMade).toBe('send-away');
    expect(state.ending.postEndingActive).toBe(false);
    expect(state.penguin.currentForm).toBe('boat');
    expect(state.character.eventsTriggered).toContain('ending-send-away');
  });

  it('结局二：成为他 → 燃料系统激活', () => {
    const store = useGameStore.getState();
    store.updateFamiliarityValue(100);
    store.triggerEnding();
    store.makeEndingChoice('become-poet');

    const state = useGameStore.getState();
    expect(state.ending.choiceMade).toBe('become-poet');
    expect(state.ending.postEndingActive).toBe(true);
    expect(state.fuel.currentFuel).toBe(80);
    expect(state.fuel.fuelPhase).toBe('voyage');
    expect(state.penguin.currentForm).toBe('judge');
    expect(state.economy.goldBalance).toBe(0);
    expect(state.character.eventsTriggered).toContain('ending-become-poet');
  });

  it('终局选择不可逆——重复选择无效', () => {
    const store = useGameStore.getState();
    store.updateFamiliarityValue(100);
    store.triggerEnding();
    store.makeEndingChoice('send-away');

    // 尝试再次选择
    useGameStore.getState().makeEndingChoice('become-poet');
    const state = useGameStore.getState();
    expect(state.ending.choiceMade).toBe('send-away');
    expect(state.ending.postEndingActive).toBe(false);
  });

  it('结局二后对话继续推进火种轮数', () => {
    const store = useGameStore.getState();
    store.updateFamiliarityValue(100);
    store.triggerEnding();
    store.makeEndingChoice('become-poet');

    const before = useGameStore.getState().spark.turnsSinceLastSpark;
    useGameStore.getState().incrementTurnsSinceLastSpark();
    const after = useGameStore.getState().spark.turnsSinceLastSpark;
    expect(after).toBe(before + 1);
  });

  it('结局二后燃料值可变', () => {
    const store = useGameStore.getState();
    store.updateFamiliarityValue(100);
    store.triggerEnding();
    store.makeEndingChoice('become-poet');

    const before = useGameStore.getState().fuel.currentFuel;
    useGameStore.getState().updateFuelValue(10);
    const after = useGameStore.getState().fuel.currentFuel;
    expect(after).toBe(before + 10);
  });
});
