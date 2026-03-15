/** 金币 Hook — 封装充值和送礼操作 */

'use client';

import { useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';

interface UseGoldReturn {
  balance: number;
  totalEarned: number;
  totalSpent: number;
  recharge: (amount: number) => void;
  gift: (amount: number) => { success: boolean; error?: string };
}

/** 金币系统 Hook */
export function useGold(): UseGoldReturn {
  const balance = useGameStore((s) => s.economy.goldBalance);
  const totalEarned = useGameStore((s) => s.economy.totalGoldEarned);
  const totalSpent = useGameStore((s) => s.economy.totalGoldSpent);
  const addGold = useGameStore((s) => s.addGold);
  const sendGift = useGameStore((s) => s.sendGift);

  const recharge = useCallback((amount: number) => {
    addGold(amount);
  }, [addGold]);

  const gift = useCallback((amount: number) => {
    return sendGift(amount);
  }, [sendGift]);

  return {
    balance,
    totalEarned,
    totalSpent,
    recharge,
    gift,
  };
}
