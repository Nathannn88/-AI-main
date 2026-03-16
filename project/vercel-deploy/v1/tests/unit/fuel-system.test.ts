/** 航程燃料系统单元测试 */

import { describe, it, expect } from 'vitest';
import {
  updateFuel,
  getFuelChangeForRating,
  calculateStallLevel,
  checkStallRecovery,
  checkLighthouseEligibility,
} from '@/lib/fuel-system';
import { FUEL_CONSTANTS } from '@/types/fuel';
import type { SparkEvaluation } from '@/types/spark';

/** 创建火种评估记录的工厂函数 */
function makeSpark(rating: 1 | 2 | 3 | 4): SparkEvaluation {
  return {
    sparkId: `spark-${Math.random().toString(36).slice(2)}`,
    rating,
    userResponse: '测试回应',
    evaluatedAt: new Date().toISOString(),
  };
}

// ============================================================
// updateFuel
// ============================================================

describe('updateFuel - 燃料值更新', () => {
  it('正常增加燃料', () => {
    expect(updateFuel(50, 10)).toBe(60);
  });

  it('正常减少燃料', () => {
    expect(updateFuel(50, -10)).toBe(40);
  });

  it('燃料不能超过100', () => {
    expect(updateFuel(95, 20)).toBe(FUEL_CONSTANTS.MAX);
  });

  it('燃料不能低于0', () => {
    expect(updateFuel(5, -20)).toBe(FUEL_CONSTANTS.MIN);
  });
});

// ============================================================
// getFuelChangeForRating
// ============================================================

describe('getFuelChangeForRating - 评级对应的燃料变化量', () => {
  it('评级1（复述）返回-2', () => {
    expect(getFuelChangeForRating(1)).toBe(FUEL_CONSTANTS.CHANGES.PARROT_SPARK);
    expect(getFuelChangeForRating(1)).toBe(-2);
  });

  it('评级2（常规转化）返回+3', () => {
    expect(getFuelChangeForRating(2)).toBe(FUEL_CONSTANTS.CHANGES.NORMAL_TRANSFORM);
    expect(getFuelChangeForRating(2)).toBe(3);
  });

  it('评级3（创造性转化）返回+8', () => {
    expect(getFuelChangeForRating(3)).toBe(FUEL_CONSTANTS.CHANGES.CREATIVE_TRANSFORM);
    expect(getFuelChangeForRating(3)).toBe(8);
  });

  it('评级4（卓越转化）返回+15', () => {
    expect(getFuelChangeForRating(4)).toBe(FUEL_CONSTANTS.CHANGES.EXCEPTIONAL_TRANSFORM);
    expect(getFuelChangeForRating(4)).toBe(15);
  });
});

// ============================================================
// calculateStallLevel
// ============================================================

describe('calculateStallLevel - 失速等级计算', () => {
  it('燃料>30 且无坏评级返回 none', () => {
    const sparks = [makeSpark(2), makeSpark(3), makeSpark(2)];
    expect(calculateStallLevel(50, sparks)).toBe('none');
  });

  it('燃料<30 返回 warning', () => {
    const sparks = [makeSpark(2), makeSpark(3)];
    expect(calculateStallLevel(25, sparks)).toBe('warning');
  });

  it('燃料<15 且最近5个火种有3个评级≤1 返回 stall', () => {
    const sparks = [
      makeSpark(1),
      makeSpark(1),
      makeSpark(1),
      makeSpark(2),
      makeSpark(3),
    ];
    expect(calculateStallLevel(10, sparks)).toBe('stall');
  });

  it('燃料=0 返回 deep_stall', () => {
    expect(calculateStallLevel(0, [])).toBe('deep_stall');
  });

  it('连续3个评级≤1 即使燃料不低也返回 warning', () => {
    const sparks = [makeSpark(1), makeSpark(1), makeSpark(1)];
    expect(calculateStallLevel(80, sparks)).toBe('warning');
  });
});

// ============================================================
// checkStallRecovery
// ============================================================

describe('checkStallRecovery - 失速恢复判定', () => {
  it('深度失速中一次好回应（评级≥2）恢复到失速', () => {
    const result = checkStallRecovery(
      { currentStallLevel: 'deep_stall', consecutiveGoodSparks: 0, turnsInStall: 10 },
      5,
      2,
    );
    expect(result).toBe('stall');
  });

  it('深度失速中差回应（评级1）保持深度失速', () => {
    const result = checkStallRecovery(
      { currentStallLevel: 'deep_stall', consecutiveGoodSparks: 0, turnsInStall: 10 },
      5,
      1,
    );
    expect(result).toBe('deep_stall');
  });

  it('失速中连续2次好回应且燃料>15 恢复到预警', () => {
    const result = checkStallRecovery(
      { currentStallLevel: 'stall', consecutiveGoodSparks: 1, turnsInStall: 5 },
      20,
      3,
    );
    expect(result).toBe('warning');
  });

  it('失速中只有1次好回应不恢复', () => {
    const result = checkStallRecovery(
      { currentStallLevel: 'stall', consecutiveGoodSparks: 0, turnsInStall: 5 },
      20,
      3,
    );
    expect(result).toBe('stall');
  });

  it('预警中连续3次好回应且燃料>30 恢复到正常', () => {
    const result = checkStallRecovery(
      { currentStallLevel: 'warning', consecutiveGoodSparks: 2, turnsInStall: 3 },
      35,
      2,
    );
    expect(result).toBe('none');
  });

  it('预警中只有2次好回应不恢复', () => {
    const result = checkStallRecovery(
      { currentStallLevel: 'warning', consecutiveGoodSparks: 1, turnsInStall: 3 },
      35,
      2,
    );
    expect(result).toBe('warning');
  });
});

// ============================================================
// checkLighthouseEligibility
// ============================================================

describe('checkLighthouseEligibility - 灯塔模式触发资格', () => {
  it('连续30轮高燃料触发', () => {
    expect(checkLighthouseEligibility(85, 30, 10)).toBe(true);
  });

  it('累计50次创造性转化触发', () => {
    expect(checkLighthouseEligibility(50, 5, 50)).toBe(true);
  });

  it('不满足条件不触发', () => {
    expect(checkLighthouseEligibility(50, 10, 20)).toBe(false);
  });

  it('燃料高但轮数不够不触发', () => {
    expect(checkLighthouseEligibility(85, 29, 0)).toBe(false);
  });

  it('燃料不够高即使轮数够也不触发', () => {
    expect(checkLighthouseEligibility(79, 30, 0)).toBe(false);
  });
});
