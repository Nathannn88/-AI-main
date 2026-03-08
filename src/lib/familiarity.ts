/** 熟悉度计算模块 — 处理对话字数、金币兑换、阈值检测 */

import type { FamiliarityPhase } from '@/types/character';

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
 * 根据金币数量计算熟悉度增量
 * 规则：每 100 金币 → +10%
 */
export function calculateFamiliarityFromGold(goldAmount: number): number {
  if (goldAmount <= 0) return 0;
  return (goldAmount / 100) * 10;
}

/**
 * 更新熟悉度值，确保不超过上限 100
 */
export function updateFamiliarity(current: number, delta: number): number {
  if (delta < 0) return current;
  const result = current + delta;
  return Math.min(result, 100);
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
