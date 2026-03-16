/** 企鹅变形 Hook — 封装企鹅形态切换与可用形态查询 */

'use client';

import { useCallback, useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import type { PenguinForm, PenguinFormConfig } from '@/types/penguin';
import { getPenguinForms, canTransform } from '@/lib/penguin-system';

/** 带解锁状态的形态信息 */
interface FormWithStatus extends PenguinFormConfig {
  /** 是否已解锁 */
  unlocked: boolean;
  /** 当前金币是否足够购买（已解锁时为 true） */
  affordable: boolean;
}

interface UsePenguinReturn {
  /** 当前企鹅形态 */
  currentForm: PenguinForm;
  /** 执行变形（含金币检查和扣除） */
  transform: (form: PenguinForm) => { success: boolean; goldCost: number; error?: string };
  /** 获取所有形态及其解锁状态 */
  getAvailableForms: () => FormWithStatus[];
  /** 检查是否能负担指定形态的变形费用 */
  canAffordTransform: (form: PenguinForm) => boolean;
}

/** 企鹅变形 Hook */
export function usePenguin(): UsePenguinReturn {
  const currentForm = useGameStore((s) => s.penguin.currentForm);
  const availableForms = useGameStore((s) => s.penguin.availableForms);
  const goldBalance = useGameStore((s) => s.economy.goldBalance);
  const transformPenguinForm = useGameStore((s) => s.transformPenguinForm);

  /** 执行变形操作 */
  const transform = useCallback((form: PenguinForm) => {
    return transformPenguinForm(form);
  }, [transformPenguinForm]);

  /** 获取所有形态列表（含解锁/价格状态） */
  const getAvailableForms = useCallback((): FormWithStatus[] => {
    const allForms = getPenguinForms();

    return allForms.map((config) => {
      const unlocked = availableForms.includes(config.form);
      const affordable = unlocked || (!config.isSpecial && goldBalance >= config.cost);

      return {
        ...config,
        unlocked,
        affordable,
      };
    });
  }, [availableForms, goldBalance]);

  /** 检查是否能负担指定形态的变形 */
  const canAffordTransform = useCallback((form: PenguinForm): boolean => {
    return canTransform(form, goldBalance, availableForms);
  }, [goldBalance, availableForms]);

  return {
    currentForm,
    transform,
    getAvailableForms,
    canAffordTransform,
  };
}
