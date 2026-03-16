/** 熟悉度计算模块 — 处理对话字数、阈值检测、燃料过渡判定 */

import type { FamiliarityPhase } from '@/types/character';
import { FUEL_CONSTANTS } from '@/types/fuel';

/** 熟悉度阈值列表 */
const THRESHOLDS = [20, 50, 80, 100] as const;

/** 阈值名称映射 */
const THRESHOLD_NAMES: Record<number, string> = {
  20: 'acquaintance',
  50: 'familiar',
  80: 'close',
  100: 'bonded',
};

/**
 * 统计中文字数
 * 中文字符、标点均计入，英文单词按空格分割计数
 */
export function countChineseWords(text: string): number {
  if (!text || typeof text !== 'string') return 0;

  let count = 0;

  // 匹配中文字符（包含中文标点）
  const chineseChars = text.match(/[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/g);
  if (chineseChars) {
    count += chineseChars.length;
  }

  // 匹配英文单词
  const englishWords = text.match(/[a-zA-Z]+/g);
  if (englishWords) {
    count += englishWords.length;
  }

  // 匹配数字串
  const numbers = text.match(/\d+/g);
  if (numbers) {
    count += numbers.length;
  }

  return count;
}

/**
 * 根据字数计算熟悉度增量
 * 规则：每 100 字 → +0.1%
 */
export function calculateFamiliarityFromWords(wordCount: number): number {
  if (wordCount <= 0) return 0;
  return (wordCount / 100) * 0.1;
}

/**
 * 更新熟悉度值，确保不超过上限 100
 * 如果处于预览期（80%-100%）且回应了火种，额外加成 +2%
 */
export function updateFamiliarity(
  current: number,
  delta: number,
  respondedToSpark?: boolean
): number {
  if (delta < 0) return current;
  let result = current + delta;

  // 预览期火种回应加成
  if (respondedToSpark && isInPreviewSparkPhase(current)) {
    result += FUEL_CONSTANTS.PREVIEW.SPARK_FAMILIARITY_BONUS;
  }

  return Math.min(result, 100);
}

/**
 * 检查是否到达 80% 阈值，需要将熟悉度条转换为航程燃料条
 * 80% 是整个体验的转折核心
 */
export function checkFuelTransition(familiarity: number): boolean {
  return familiarity >= 80;
}

/**
 * 检查是否处于 80%-100% 的火种预览期
 * 在此期间，每15轮出现1次预览火种，忽略不惩罚，回应额外+2%熟悉度
 */
export function isInPreviewSparkPhase(familiarity: number): boolean {
  return familiarity >= 80 && familiarity < 100;
}

/**
 * 根据熟悉度值返回当前阶段
 */
export function getFamiliarityPhase(familiarity: number): FamiliarityPhase {
  if (familiarity >= 100) return 'bonded';
  if (familiarity >= 80) return 'close';
  if (familiarity >= 50) return 'familiar';
  if (familiarity >= 20) return 'acquaintance';
  return 'intro';
}

/**
 * 检测熟悉度变化是否跨越了阈值
 * 返回跨越的阈值名称列表
 */
export function checkThresholdCrossing(oldValue: number, newValue: number): string[] {
  if (newValue <= oldValue) return [];

  const crossed: string[] = [];
  for (const threshold of THRESHOLDS) {
    if (oldValue < threshold && newValue >= threshold) {
      crossed.push(THRESHOLD_NAMES[threshold]);
    }
  }
  return crossed;
}
