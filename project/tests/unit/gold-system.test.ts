/** 金币系统单元测试 */

import { describe, it, expect } from 'vitest';
import {
  recharge,
  sendGift,
  RECHARGE_OPTIONS,
  RECHARGE_PRICES,
} from '@/lib/gold-system';

describe('RECHARGE_OPTIONS - 充值选项', () => {
  it('包含 6 个选项', () => {
    expect(RECHARGE_OPTIONS).toHaveLength(6);
  });

  it('选项值正确', () => {
    expect([...RECHARGE_OPTIONS]).toEqual([6, 32, 64, 128, 328, 648]);
  });

  it('每个选项都有对应价格', () => {
    for (const option of RECHARGE_OPTIONS) {
      expect(RECHARGE_PRICES[option]).toBeDefined();
      expect(RECHARGE_PRICES[option]).toBeGreaterThan(0);
    }
  });
});

describe('recharge - 充值', () => {
  it('正常充值增加余额', () => {
    const result = recharge(100, 50);
    expect(result.newBalance).toBe(150);
  });

  it('从 0 开始充值', () => {
    const result = recharge(0, 648);
    expect(result.newBalance).toBe(648);
  });

  it('充值 0 金币余额不变', () => {
    const result = recharge(100, 0);
    expect(result.newBalance).toBe(100);
  });

  it('负数充值不改变余额', () => {
    const result = recharge(100, -50);
    expect(result.newBalance).toBe(100);
  });

  it('连续充值累计正确', () => {
    let balance = 0;
    balance = recharge(balance, 32).newBalance;
    balance = recharge(balance, 64).newBalance;
    balance = recharge(balance, 128).newBalance;
    expect(balance).toBe(224);
  });
});

describe('sendGift - 送礼', () => {
  it('余额充足时送礼成功', () => {
    const result = sendGift(100, 50);
    expect(result.success).toBe(true);
    expect(result.newBalance).toBe(50);
    expect(result.error).toBeUndefined();
  });

  it('余额恰好等于送礼金额', () => {
    const result = sendGift(100, 100);
    expect(result.success).toBe(true);
    expect(result.newBalance).toBe(0);
  });

  it('余额不足时送礼失败', () => {
    const result = sendGift(50, 100);
    expect(result.success).toBe(false);
    expect(result.newBalance).toBe(50); // 余额不变
    expect(result.error).toBe('金币数量不足，请充值');
  });

  it('送 0 金币失败', () => {
    const result = sendGift(100, 0);
    expect(result.success).toBe(false);
    expect(result.error).toBe('送礼金额必须大于 0');
  });

  it('送负数金币失败', () => {
    const result = sendGift(100, -10);
    expect(result.success).toBe(false);
    expect(result.error).toBe('送礼金额必须大于 0');
  });

  it('余额为 0 时送礼失败', () => {
    const result = sendGift(0, 10);
    expect(result.success).toBe(false);
    expect(result.error).toBe('金币数量不足，请充值');
  });
});
