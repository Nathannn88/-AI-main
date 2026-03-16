/** 金币 Hook — 封装充值操作和企鹅变形送礼 */

'use client';

import { useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import type { PenguinForm } from '@/types/penguin';

interface UseGoldReturn {
  /** 当前金币余额 */
  balance: number;
  /** 累计获得金币 */
  totalEarned: number;
  /** 累计消费金币 */
  totalSpent: number;
  /** 充值金币 */
  recharge: (amount: number) => void;
  /** 送礼 — 执行企鹅变形（消耗金币解锁形态） */
  giftTransform: (form: PenguinForm) => { success: boolean; goldCost: number; error?: string };
  /** 直接扣金币送礼（不变形，兼容旧逻辑） */
  gift: (amount: number) => { success: boolean; error?: string };
}

/** 金币系统 Hook */
export function useGold(): UseGoldReturn {
  const balance = useGameStore((s) => s.economy.goldBalance);
  const totalEarned = useGameStore((s) => s.economy.totalGoldEarned);
  const totalSpent = useGameStore((s) => s.economy.totalGoldSpent);
  const addGold = useGameStore((s) => s.addGold);
  const sendGift = useGameStore((s) => s.sendGift);
  const transformPenguinForm = useGameStore((s) => s.transformPenguinForm);

  /** 充值金币 */
  const recharge = useCallback((amount: number) => {
    addGold(amount);
  }, [addGold]);

  /** 送礼变形 — 消耗金币解锁企鹅新形态 */
  const giftTransform = useCallback((form: PenguinForm) => {
    return transformPenguinForm(form);
  }, [transformPenguinForm]);

  /** 直接送礼扣金币（兼容旧逻辑） */
  const gift = useCallback((amount: number) => {
    return sendGift(amount);
  }, [sendGift]);

  return {
    balance,
    totalEarned,
    totalSpent,
    recharge,
    giftTransform,
    gift,
  };
}
