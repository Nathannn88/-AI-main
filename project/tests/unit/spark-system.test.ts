/** 火种系统单元测试 */

import { describe, it, expect } from 'vitest';
import {
  calculateSparkInterval,
  shouldGenerateSpark,
  getPresetSpark,
  decideSparkSource,
  isSparkResponse,
  isSparkIgnored,
  SPARK_BASE_INTERVAL,
  SPARK_RESPONSE_WINDOW,
} from '@/lib/spark-system';

// ============================================================
// calculateSparkInterval
// ============================================================

describe('calculateSparkInterval - 火种出现间隔计算', () => {
  it('基础间隔为5', () => {
    /* 评级2不调节，燃料50在30-90之间也不调节 */
    expect(calculateSparkInterval(2, 50)).toBe(SPARK_BASE_INTERVAL);
  });

  it('上次评级4减少间隔到3', () => {
    /* 基础5 - 2 = 3 */
    expect(calculateSparkInterval(4, 50)).toBe(3);
  });

  it('上次被忽略（null）增加间隔到8', () => {
    /* 基础5 + 3 = 8 */
    expect(calculateSparkInterval(null, 50)).toBe(8);
  });

  it('低燃料额外减1', () => {
    /* 评级2不调节，基础5 - 1(低燃料) = 4 */
    expect(calculateSparkInterval(2, 20)).toBe(4);
  });

  it('高燃料额外加2', () => {
    /* 评级2不调节，基础5 + 2(高燃料) = 7 */
    expect(calculateSparkInterval(2, 95)).toBe(7);
  });

  it('最小不低于2', () => {
    /* 评级4: 5-2=3, 低燃料: 3-1=2, 已到最小 */
    expect(calculateSparkInterval(4, 20)).toBe(2);
  });

  it('最大不超过10', () => {
    /* 被忽略: 5+3=8, 高燃料: 8+2=10, 已到最大 */
    expect(calculateSparkInterval(null, 95)).toBe(10);
  });

  it('评级1增加间隔', () => {
    /* 基础5 + 2(评级1) = 7 */
    expect(calculateSparkInterval(1, 50)).toBe(7);
  });

  it('评级3减少间隔', () => {
    /* 基础5 - 1(评级3) = 4 */
    expect(calculateSparkInterval(3, 50)).toBe(4);
  });
});

// ============================================================
// shouldGenerateSpark
// ============================================================

describe('shouldGenerateSpark - 是否生成火种判定', () => {
  it('达到间隔时返回 true', () => {
    expect(shouldGenerateSpark(5, 5)).toBe(true);
  });

  it('超过间隔时也返回 true', () => {
    expect(shouldGenerateSpark(7, 5)).toBe(true);
  });

  it('未达到间隔时返回 false', () => {
    expect(shouldGenerateSpark(3, 5)).toBe(false);
  });

  it('超过硬性上限（10轮）强制触发', () => {
    expect(shouldGenerateSpark(10, 15)).toBe(true);
  });
});

// ============================================================
// getPresetSpark
// ============================================================

describe('getPresetSpark - 预设火种获取', () => {
  it('返回指定类型的火种', () => {
    const spark = getPresetSpark('poem', new Set());
    expect(spark.type).toBe('poem');
    expect(spark.source).toBe('preset');
    expect(spark.content).toBeTruthy();
  });

  it('不返回已使用的火种', () => {
    /* 把 poem-01 标记为已使用 */
    const usedIds = new Set(['poem-01']);
    /* 多次获取，检查不会返回 poem-01 */
    for (let i = 0; i < 50; i++) {
      const spark = getPresetSpark('poem', usedIds);
      expect(spark.id).not.toBe('poem-01');
    }
  });

  it('所有类型都能获取预设火种', () => {
    const types = ['poem', 'visual', 'emotion', 'metaphor'] as const;
    for (const type of types) {
      const spark = getPresetSpark(type, new Set());
      expect(spark.type).toBe(type);
      expect(spark.id).toBeTruthy();
    }
  });

  it('全部用尽时仍可获取（允许重复）', () => {
    /* 把所有 poem ID 标记为已使用 */
    const allIds = new Set<string>();
    for (let i = 1; i <= 30; i++) {
      allIds.add(`poem-${String(i).padStart(2, '0')}`);
    }
    const spark = getPresetSpark('poem', allIds);
    expect(spark.type).toBe('poem');
    expect(spark.content).toBeTruthy();
  });
});

// ============================================================
// decideSparkSource
// ============================================================

describe('decideSparkSource - 火种来源决定', () => {
  it('第4个火种（索引3）强制使用 preset', () => {
    expect(decideSparkSource(3)).toBe('preset');
  });

  it('第8个火种（索引7）强制使用 preset', () => {
    expect(decideSparkSource(7)).toBe('preset');
  });

  it('第1个火种（索引0）不强制 preset', () => {
    /* 非强制周期，结果是随机的但不是永远 preset */
    const results = new Set<string>();
    for (let i = 0; i < 100; i++) {
      results.add(decideSparkSource(0));
    }
    /* 期望至少偶尔有 generated（概率70%，100次几乎必定出现） */
    expect(results.has('generated')).toBe(true);
  });
});

// ============================================================
// isSparkResponse / isSparkIgnored
// ============================================================

describe('isSparkResponse - 火种回应判定', () => {
  it('火种出现后1轮内是回应', () => {
    expect(isSparkResponse(5, 6)).toBe(true);
  });

  it('火种出现后2轮内是回应', () => {
    expect(isSparkResponse(5, 7)).toBe(true);
  });

  it('同一轮不算回应', () => {
    expect(isSparkResponse(5, 5)).toBe(false);
  });

  it('超过窗口期不算回应', () => {
    expect(isSparkResponse(5, 8)).toBe(false);
  });
});

describe('isSparkIgnored - 火种忽略判定', () => {
  it('超过窗口期（默认2轮）视为忽略', () => {
    expect(isSparkIgnored(5, 8)).toBe(true);
  });

  it('窗口期内不算忽略', () => {
    expect(isSparkIgnored(5, 7)).toBe(false);
  });

  it('刚好在窗口边界不算忽略', () => {
    /* gap = 7 - 5 = 2, 等于 window，不大于 window */
    expect(isSparkIgnored(5, 7, SPARK_RESPONSE_WINDOW)).toBe(false);
  });

  it('超出窗口边界一轮算忽略', () => {
    /* gap = 8 - 5 = 3, 大于 window(2) */
    expect(isSparkIgnored(5, 8, SPARK_RESPONSE_WINDOW)).toBe(true);
  });
});
