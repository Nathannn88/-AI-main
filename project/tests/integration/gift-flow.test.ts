/** 送礼流程集成测试 — 送礼→扣金币（金币不影响熟悉度） */

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '@/store/gameStore';

describe('送礼流程集成', () => {
  beforeEach(() => {
    useGameStore.getState().resetState();
  });

  it('送礼完整链路：充值→送礼→扣金币（熟悉度不变）', () => {
    const store = useGameStore.getState();

    // 先充值 200 金币
    store.addGold(200);
    expect(useGameStore.getState().economy.goldBalance).toBe(200);

    // 送礼 100 金币
    const result = store.sendGift(100);
    expect(result.success).toBe(true);

    const after = useGameStore.getState();
    // 余额 = 200 - 100 = 100
    expect(after.economy.goldBalance).toBe(100);
    expect(after.economy.totalGoldSpent).toBe(100);
    // 金币不影响熟悉度
    expect(after.character.familiarity).toBe(0);
  });

  it('送礼不触发阶段变更（金币不影响熟悉度）', () => {
    const store = useGameStore.getState();
    store.addGold(500);

    // 送 200 金币 → 熟悉度不变
    store.sendGift(200);
    const after = useGameStore.getState();
    expect(after.character.familiarity).toBe(0);
    expect(after.character.currentPhase).toBe('intro');
  });

  it('送礼不触发事件（金币不影响熟悉度）', () => {
    const store = useGameStore.getState();
    store.addGold(500);

    // 先达到 19%
    store.updateFamiliarityValue(19);
    expect(useGameStore.getState().character.eventsTriggered).toHaveLength(0);

    // 送 100 金币 → 熟悉度不变，不会跨过 20% 阈值
    const freshStore = useGameStore.getState();
    freshStore.sendGift(100);

    const after = useGameStore.getState();
    expect(after.character.familiarity).toBe(19);
    expect(after.character.eventsTriggered).toHaveLength(0);
  });

  it('大额送礼只扣金币不影响熟悉度', () => {
    const store = useGameStore.getState();
    store.addGold(10000);

    // 送 5000 金币 → 金币扣除但熟悉度不变
    store.sendGift(5000);

    const after = useGameStore.getState();
    expect(after.character.familiarity).toBe(0);
    expect(after.economy.goldBalance).toBe(5000);
    expect(after.economy.totalGoldSpent).toBe(5000);
  });

  it('余额不足时送礼失败', () => {
    const store = useGameStore.getState();
    store.addGold(50);

    const result = store.sendGift(100);
    expect(result.success).toBe(false);
    expect(result.error).toContain('不足');

    const after = useGameStore.getState();
    // 余额不变
    expect(after.economy.goldBalance).toBe(50);
    // 熟悉度不变
    expect(after.character.familiarity).toBe(0);
  });

  it('送礼 0 金币失败', () => {
    const store = useGameStore.getState();
    store.addGold(100);

    const result = store.sendGift(0);
    expect(result.success).toBe(false);
  });

  it('不重复触发已经触发过的事件', () => {
    const store = useGameStore.getState();

    // 通过对话推到 20% 触发事件
    store.updateFamiliarityValue(20);
    const events1 = useGameStore.getState().character.eventsTriggered;
    expect(events1).toContain('event-20-first-crack');

    // 再次 triggerEvent 不会重复添加
    const freshStore = useGameStore.getState();
    freshStore.triggerEvent('event-20-first-crack');
    const events2 = useGameStore.getState().character.eventsTriggered;
    const count = events2.filter((e: string) => e === 'event-20-first-crack').length;
    expect(count).toBe(1);
  });

  it('送礼后充值→再送礼，金币状态连续正确', () => {
    const store = useGameStore.getState();

    // 充值 100
    store.addGold(100);
    expect(useGameStore.getState().economy.goldBalance).toBe(100);

    // 送礼 100
    store.sendGift(100);
    expect(useGameStore.getState().economy.goldBalance).toBe(0);
    // 金币不影响熟悉度
    expect(useGameStore.getState().character.familiarity).toBe(0);

    // 再充值 200
    useGameStore.getState().addGold(200);
    expect(useGameStore.getState().economy.goldBalance).toBe(200);

    // 再送 100
    useGameStore.getState().sendGift(100);
    expect(useGameStore.getState().economy.goldBalance).toBe(100);
    // 熟悉度仍然为 0（金币不影响熟悉度）
    expect(useGameStore.getState().character.familiarity).toBe(0);
    expect(useGameStore.getState().economy.totalGoldSpent).toBe(200);
    expect(useGameStore.getState().economy.totalGoldEarned).toBe(300);
  });
});
