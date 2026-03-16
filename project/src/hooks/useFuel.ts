/** 燃料 Hook — 封装航程燃料系统的状态订阅与操作方法 */

'use client';

import { useCallback, useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import type { StallLevel, SparkRating } from '@/types/fuel';
import { FUEL_CONSTANTS } from '@/types/fuel';
import {
  getFuelChangeForRating,
  calculateIdleFuelDecay,
  calculateStallLevel,
  checkStallRecovery,
  checkLighthouseEligibility,
} from '@/lib/fuel-system';

/** 失速视觉配置，用于驱动 UI 样式变化 */
interface StallVisualConfig {
  /** 背景色调 CSS 变量值 */
  bgTint: string;
  /** 文字透明度 */
  textOpacity: number;
  /** 企鹅动画速度倍率 */
  penguinAnimSpeed: number;
  /** 是否显示失速警告 */
  showWarning: boolean;
  /** 屏幕灰度滤镜百分比 */
  grayscale: number;
}

interface UseFuelReturn {
  /** 当前燃料值（0-100） */
  fuelPercentage: number;
  /** 当前失速等级 */
  stallLevel: StallLevel;
  /** 是否处于失速状态（warning 及以上） */
  isInStall: boolean;
  /** 是否满足灯塔模式触发条件 */
  isLighthouseEligible: boolean;
  /** 失速视觉配置 */
  visualConfig: StallVisualConfig;
  /** 根据火种评级更新燃料 */
  applySparkRating: (rating: SparkRating) => void;
  /** 应用不活动衰减 */
  applyIdleDecay: () => void;
  /** 检查并更新失速状态 */
  checkAndUpdateStall: () => void;
  /** 检查灯塔触发条件 */
  checkLighthouse: () => void;
}

/** 根据失速等级生成视觉配置 */
function getStallVisualConfig(stallLevel: StallLevel): StallVisualConfig {
  switch (stallLevel) {
    case 'none':
      return {
        bgTint: 'rgba(0, 0, 0, 0)',
        textOpacity: 1,
        penguinAnimSpeed: 1,
        showWarning: false,
        grayscale: 0,
      };
    case 'warning':
      return {
        bgTint: 'rgba(180, 140, 0, 0.06)',
        textOpacity: 0.9,
        penguinAnimSpeed: 0.7,
        showWarning: true,
        grayscale: 10,
      };
    case 'stall':
      return {
        bgTint: 'rgba(120, 60, 0, 0.12)',
        textOpacity: 0.75,
        penguinAnimSpeed: 0.4,
        showWarning: true,
        grayscale: 30,
      };
    case 'deep_stall':
      return {
        bgTint: 'rgba(60, 20, 0, 0.20)',
        textOpacity: 0.5,
        penguinAnimSpeed: 0.1,
        showWarning: true,
        grayscale: 60,
      };
  }
}

/** 燃料系统 Hook */
export function useFuel(): UseFuelReturn {
  const fuel = useGameStore((s) => s.fuel);
  const sparkHistory = useGameStore((s) => s.spark.sparkHistory);
  const totalCreativeTransforms = useGameStore((s) => s.spark.totalCreativeTransforms);
  const updateFuelValue = useGameStore((s) => s.updateFuelValue);
  const setStallLevel = useGameStore((s) => s.setStallLevel);
  const enterLighthouseMode = useGameStore((s) => s.enterLighthouseMode);

  const fuelPercentage = fuel.currentFuel;
  const stallLevel = fuel.stallLevel;
  const isInStall = stallLevel !== 'none';

  /** 是否满足灯塔触发条件 */
  const isLighthouseEligible = useMemo(() => {
    // 灯塔模式仅在航程阶段检查
    if (fuel.fuelPhase === 'lighthouse') return false;
    return checkLighthouseEligibility(
      fuel.currentFuel,
      fuel.consecutiveGoodSparks,
      totalCreativeTransforms
    );
  }, [fuel.currentFuel, fuel.consecutiveGoodSparks, fuel.fuelPhase, totalCreativeTransforms]);

  /** 视觉配置 */
  const visualConfig = useMemo(() => getStallVisualConfig(stallLevel), [stallLevel]);

  /** 根据火种评级更新燃料 */
  const applySparkRating = useCallback((rating: SparkRating) => {
    const change = getFuelChangeForRating(rating);
    updateFuelValue(change);
  }, [updateFuelValue]);

  /** 应用不活动衰减 */
  const applyIdleDecay = useCallback(() => {
    const decay = calculateIdleFuelDecay(fuel.lastUpdateTime);
    if (decay < 0) {
      updateFuelValue(decay);
    }
  }, [fuel.lastUpdateTime, updateFuelValue]);

  /** 检查并更新失速状态 */
  const checkAndUpdateStall = useCallback(() => {
    // 从火种历史中提取评估记录
    const evaluations = sparkHistory
      .filter((r) => r.evaluation !== null)
      .map((r) => r.evaluation!);

    // 先检查是否需要恢复
    if (isInStall && evaluations.length > 0) {
      const latestEval = evaluations[evaluations.length - 1];
      const recovered = checkStallRecovery(
        {
          currentStallLevel: stallLevel,
          consecutiveGoodSparks: fuel.consecutiveGoodSparks,
          turnsInStall: fuel.turnsInStall,
        },
        fuel.currentFuel,
        latestEval.rating
      );
      if (recovered !== stallLevel) {
        setStallLevel(recovered);
        return;
      }
    }

    // 计算当前失速等级
    const newLevel = calculateStallLevel(fuel.currentFuel, evaluations);
    if (newLevel !== stallLevel) {
      setStallLevel(newLevel);
    }
  }, [sparkHistory, isInStall, stallLevel, fuel, setStallLevel]);

  /** 检查灯塔触发条件并进入灯塔模式 */
  const checkLighthouse = useCallback(() => {
    if (fuel.fuelPhase === 'lighthouse') return;

    const eligible = checkLighthouseEligibility(
      fuel.currentFuel,
      fuel.consecutiveGoodSparks,
      totalCreativeTransforms
    );

    if (eligible) {
      enterLighthouseMode();
    }
  }, [fuel.currentFuel, fuel.consecutiveGoodSparks, fuel.fuelPhase, totalCreativeTransforms, enterLighthouseMode]);

  return {
    fuelPercentage,
    stallLevel,
    isInStall,
    isLighthouseEligible,
    visualConfig,
    applySparkRating,
    applyIdleDecay,
    checkAndUpdateStall,
    checkLighthouse,
  };
}
