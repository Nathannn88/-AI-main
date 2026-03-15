/** 充值流程集成测试 — 选择金额→到账→余额更新→充值历史 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '@/store/gameStore';
import { RECHARGE_OPTIONS, RECHARGE_PRICES } from '@/lib/gold-system';

describe('充值流程集成', () => {
  beforeEach(() => {
    useGameStore.getState().resetState();
  });

  it('所有充值选项都有对应价格', () => {
    for (const option of RECHARGE_OPTIONS) {
      expect(RECHARGE_PRICES[option]).toBeDefined();
      expect(RECHARGE_PRICES[option]).toBeGreaterThan(0);
    }
  });

  it('六个充值选项值正确', () => {
    expect(RECHARGE_OPTIONS).toEqual([6, 32, 64, 128, 328, 648]);
  });

  it('充值后余额正确增加', () => {
    const store = useGameStore.getState();
    store.addGold(64);

    const after = useGameStore.getState();
    expect(after.economy.goldBalance).toBe(64);
    expect(after.economy.totalGoldEarned).toBe(64);
  });

  it('连续充值余额累加', () => {
    const store = useGameStore.getState();
    store.addGold(6);
    store.addGold(32);

    const after = useGameStore.getState();
    expect(after.economy.goldBalance).toBe(38);
    expect(after.economy.totalGoldEarned).toBe(38);
  });

  it('充值记录历史正确', () => {
    const store = useGameStore.getState();
    store.addGold(128);
    store.addGold(648);

    const after = useGameStore.getState();
    expect(after.economy.rechargeHistory).toHaveLength(2);
    expect(after.economy.rechargeHistory[0].amount).toBe(128);
    expect(after.economy.rechargeHistory[1].amount).toBe(648);
    // 时间戳应是 ISO 格式
    expect(after.economy.rechargeHistory[0].timestamp).toMatch(/^\d{4}-\d{2}-\d{2}/);
  });

  it('充值后可以送礼', () => {
    const store = useGameStore.getState();
    store.addGold(328);

    const result = store.sendGift(200);
    expect(result.success).toBe(true);

    const after = useGameStore.getState();
    expect(after.economy.goldBalance).toBe(128);
    expect(after.character.familiarity).toBe(20);
  });

  it('充值→送礼→再充值→再送礼 完整链路', () => {
    const store = useGameStore.getState();

    // 第一轮
    store.addGold(100);
    store.sendGift(100);
    expect(useGameStore.getState().economy.goldBalance).toBe(0);
    expect(useGameStore.getState().character.familiarity).toBe(10);

    // 第二轮
    useGameStore.getState().addGold(200);
    useGameStore.getState().sendGift(100);
    expect(useGameStore.getState().economy.goldBalance).toBe(100);
    expect(useGameStore.getState().character.familiarity).toBe(20);

    // 统计
    expect(useGameStore.getState().economy.totalGoldEarned).toBe(300);
    expect(useGameStore.getState().economy.totalGoldSpent).toBe(200);
    expect(useGameStore.getState().economy.rechargeHistory).toHaveLength(2);
  });

  it('充值数据在导出/导入后保留', () => {
    const store = useGameStore.getState();
    store.addGold(648);
    store.addGold(128);

    const json = store.exportState();
    useGameStore.getState().resetState();
    useGameStore.getState().importState(json);

    const restored = useGameStore.getState();
    expect(restored.economy.goldBalance).toBe(776);
    expect(restored.economy.totalGoldEarned).toBe(776);
    expect(restored.economy.rechargeHistory).toHaveLength(2);
  });
});
