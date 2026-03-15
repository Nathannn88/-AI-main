/** 金币系统 — 充值和送礼逻辑 */

/** 充值选项（金币数量） */
export const RECHARGE_OPTIONS = [6, 32, 64, 128, 328, 648] as const;

/** 充值选项对应的价格（元） */
export const RECHARGE_PRICES: Record<number, number> = {
  6: 60,
  32: 320,
  64: 640,
  128: 1280,
  328: 3280,
  648: 6480,
};

/** 充值结果 */
export interface RechargeResult {
  newBalance: number;
}

/** 送礼结果 */
export interface GiftResult {
  success: boolean;
  newBalance: number;
  error?: string;
}

/**
 * 充值 — 先行版直接到账
 */
export function recharge(balance: number, amount: number): RechargeResult {
  if (amount <= 0) {
    return { newBalance: balance };
  }
  return { newBalance: balance + amount };
}

/**
 * 送礼 — 检查余额后扣除
 */
export function sendGift(balance: number, amount: number): GiftResult {
  if (amount <= 0) {
    return { success: false, newBalance: balance, error: '送礼金额必须大于 0' };
  }

  if (balance < amount) {
    return { success: false, newBalance: balance, error: '金币数量不足，请充值' };
  }

  return { success: true, newBalance: balance - amount };
}
