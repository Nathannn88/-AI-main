/** 航程燃料系统 — 结局二后的核心进度机制 */

import { FUEL_CONSTANTS, type SparkRating, type StallLevel } from '@/types/fuel';
import type { SparkEvaluation } from '@/types/spark';

/**
 * 更新燃料值，clamp 到 0-100 范围
 */
export function updateFuel(currentFuel: number, change: number): number {
  const result = currentFuel + change;
  return Math.max(FUEL_CONSTANTS.MIN, Math.min(result, FUEL_CONSTANTS.MAX));
}

/**
 * 根据火种回应质量评级返回对应的燃料变化量
 * 评级 1=复述(-2) / 2=常规(+3) / 3=创造性(+8) / 4=卓越(+15)
 */
export function getFuelChangeForRating(rating: SparkRating): number {
  switch (rating) {
    case 1:
      return FUEL_CONSTANTS.CHANGES.PARROT_SPARK;
    case 2:
      return FUEL_CONSTANTS.CHANGES.NORMAL_TRANSFORM;
    case 3:
      return FUEL_CONSTANTS.CHANGES.CREATIVE_TRANSFORM;
    case 4:
      return FUEL_CONSTANTS.CHANGES.EXCEPTIONAL_TRANSFORM;
  }
}

/**
 * 计算不活动时间的燃料衰减
 * 规则：超过24小时后，每天 -3，最多累计 -15（超过5天停止衰减）
 */
export function calculateIdleFuelDecay(lastActiveTime: string): number {
  const lastActive = new Date(lastActiveTime).getTime();
  const now = Date.now();
  const diffMs = now - lastActive;

  // 未超过 24 小时不衰减
  const oneDayMs = 24 * 60 * 60 * 1000;
  if (diffMs <= oneDayMs) {
    return 0;
  }

  // 计算完整天数（超出第一个24小时后的天数）
  const daysInactive = Math.floor(diffMs / oneDayMs);

  // 每天 -3，封顶 -15
  const decay = daysInactive * FUEL_CONSTANTS.CHANGES.INACTIVITY_PER_DAY;
  return Math.max(decay, FUEL_CONSTANTS.CHANGES.INACTIVITY_MAX_LOSS);
}

/**
 * 计算当前失速等级
 * 基于燃料值和最近火种评估记录综合判定
 */
export function calculateStallLevel(
  fuel: number,
  recentSparks: SparkEvaluation[]
): StallLevel {
  // 燃料为 0 直接进入深度失速
  if (fuel <= FUEL_CONSTANTS.MIN) {
    return 'deep_stall';
  }

  // 失速判定：燃料低于15 且最近5个火种有3个被忽略或评级1
  if (fuel < FUEL_CONSTANTS.STALL.STALL_THRESHOLD) {
    const recentFive = recentSparks.slice(-5);
    const poorCount = recentFive.filter((s) => s.rating <= 1).length;
    if (poorCount >= 3) {
      return 'stall';
    }
  }

  // 预警判定：燃料低于30 或连续3个火种评级≤1
  if (fuel < FUEL_CONSTANTS.STALL.WARNING_THRESHOLD) {
    return 'warning';
  }

  // 检查连续3个评级≤1的情况（即使燃料不低）
  const lastThree = recentSparks.slice(-3);
  if (lastThree.length >= 3 && lastThree.every((s) => s.rating <= 1)) {
    return 'warning';
  }

  return 'none';
}

/** 失速追踪信息，用于恢复判定 */
interface StallTracker {
  /** 当前失速等级 */
  currentStallLevel: StallLevel;
  /** 连续高质量火种回应次数 */
  consecutiveGoodSparks: number;
  /** 失速持续轮数 */
  turnsInStall: number;
}

/**
 * 检查失速恢复条件
 * 渐进式恢复：深度失速→失速→预警→正常
 */
export function checkStallRecovery(
  tracker: StallTracker,
  fuel: number,
  latestRating: SparkRating
): StallLevel {
  const isGoodResponse = latestRating >= 2;

  // 深度失速 → 失速：对最后留存的火种做出评级≥2的回应（一次即可）
  if (tracker.currentStallLevel === 'deep_stall') {
    if (isGoodResponse) {
      return 'stall';
    }
    return 'deep_stall';
  }

  // 失速 → 预警：连续2个评级≥2，且燃料回升>15
  if (tracker.currentStallLevel === 'stall') {
    const consecutiveGood = isGoodResponse ? tracker.consecutiveGoodSparks + 1 : 0;
    if (consecutiveGood >= 2 && fuel > FUEL_CONSTANTS.STALL.STALL_THRESHOLD) {
      return 'warning';
    }
    return 'stall';
  }

  // 预警 → 正常：连续3个评级≥2，且燃料回升>30
  if (tracker.currentStallLevel === 'warning') {
    const consecutiveGood = isGoodResponse ? tracker.consecutiveGoodSparks + 1 : 0;
    if (consecutiveGood >= 3 && fuel > FUEL_CONSTANTS.STALL.WARNING_THRESHOLD) {
      return 'none';
    }
    return 'warning';
  }

  return 'none';
}

/**
 * 检查灯塔模式触发资格
 * 满足任一条件即可触发：
 * - 条件 A：燃料持续 80% 以上，连续 30 轮对话未跌落
 * - 条件 B：累计 50 次创造性转化评定
 */
export function checkLighthouseEligibility(
  fuel: number,
  consecutiveHighFuelTurns: number,
  totalCreativeTransforms: number
): boolean {
  // 条件 A：燃料持续高于 80%，连续 30 轮
  const conditionA =
    fuel >= FUEL_CONSTANTS.LIGHTHOUSE.FUEL_THRESHOLD &&
    consecutiveHighFuelTurns >= FUEL_CONSTANTS.LIGHTHOUSE.CONSECUTIVE_TURNS;

  // 条件 B：累计 50 次创造性转化
  const conditionB =
    totalCreativeTransforms >= FUEL_CONSTANTS.LIGHTHOUSE.CREATIVE_TRANSFORMS_TOTAL;

  return conditionA || conditionB;
}
