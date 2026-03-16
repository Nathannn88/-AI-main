/** 企鹅变形完整流程集成测试 — 金币→变形→终局后形态锁定 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '@/store/gameStore';

describe('企鹅变形流程集成', () => {
  beforeEach(() => {
    useGameStore.getState().resetState();
  });

  it('初始形态为 default', () => {
    const state = useGameStore.getState();
    expect(state.penguin.currentForm).toBe('default');
    expect(state.penguin.availableForms).toContain('default');
  });

  it('充值金币后可变形', () => {
    const store = useGameStore.getState();
    store.addGold(128);

    const result = useGameStore.getState().transformPenguinForm('toaster');
    expect(result.success).toBe(true);
    expect(result.goldCost).toBeGreaterThan(0);

    const state = useGameStore.getState();
    expect(state.penguin.currentForm).toBe('toaster');
    expect(state.penguin.availableForms).toContain('toaster');
  });

  it('金币不足时变形失败', () => {
    const store = useGameStore.getState();
    store.addGold(1);

    const result = useGameStore.getState().transformPenguinForm('surreal-apparatus');
    expect(result.success).toBe(false);
  });

  it('已解锁形态可免费切换', () => {
    const store = useGameStore.getState();
    store.addGold(200);

    // 先解锁 toaster
    useGameStore.getState().transformPenguinForm('toaster');
    // 切回 default
    useGameStore.getState().transformPenguinForm('default');
    expect(useGameStore.getState().penguin.currentForm).toBe('default');

    // 再切回 toaster（已解锁，应免费）
    const result = useGameStore.getState().transformPenguinForm('toaster');
    expect(result.success).toBe(true);
    expect(result.goldCost).toBe(0);
    expect(useGameStore.getState().penguin.currentForm).toBe('toaster');
  });

  it('结局一后企鹅变为船形态', () => {
    const store = useGameStore.getState();
    store.updateFamiliarityValue(100);
    store.triggerEnding();
    store.makeEndingChoice('send-away');

    expect(useGameStore.getState().penguin.currentForm).toBe('boat');
  });

  it('结局二后企鹅变为审判者形态', () => {
    const store = useGameStore.getState();
    store.updateFamiliarityValue(100);
    store.triggerEnding();
    store.makeEndingChoice('become-poet');

    expect(useGameStore.getState().penguin.currentForm).toBe('judge');
  });

  it('变形历史正确记录', () => {
    const store = useGameStore.getState();
    store.addGold(500);

    useGameStore.getState().transformPenguinForm('toaster');
    useGameStore.getState().transformPenguinForm('alarm-clock');

    const state = useGameStore.getState();
    expect(state.penguin.transformHistory.length).toBeGreaterThanOrEqual(2);
  });

  it('灯塔模式设置企鹅为灯塔形态', () => {
    const store = useGameStore.getState();
    store.updateFamiliarityValue(100);
    store.triggerEnding();
    store.makeEndingChoice('become-poet');

    useGameStore.getState().enterLighthouseMode();

    const state = useGameStore.getState();
    expect(state.penguin.currentForm).toBe('lighthouse');
    expect(state.fuel.fuelPhase).toBe('lighthouse');
    expect(state.penguin.availableForms).toContain('lighthouse');
  });
});
