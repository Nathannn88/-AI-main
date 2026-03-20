/** 熟悉度系统单元测试 */

import { describe, it, expect } from 'vitest';
import {
  countChineseWords,
  calculateFamiliarityFromWords,
  calculateFamiliarityFromGold,
  updateFamiliarity,
  getFamiliarityPhase,
  checkThresholdCrossing,
} from '@/lib/familiarity';

describe('countChineseWords - 中文字数统计', () => {
  it('统计纯中文字符', () => {
    expect(countChineseWords('你好世界')).toBe(4);
  });

  it('统计中英混合文本', () => {
    const text = '你好hello世界world';
    // 2中文 + 2英文单词 = 4（中文字符不包含英文和数字）
    // 实际：你(中文) 好(中文) hello(英文) 世(中文) 界(中文) world(英文) = 6
    expect(countChineseWords(text)).toBe(6);
  });

  it('统计包含数字的文本', () => {
    expect(countChineseWords('今天是2024年')).toBe(5); // 4中文 + 1数字
  });

  it('空字符串返回 0', () => {
    expect(countChineseWords('')).toBe(0);
  });

  it('null/undefined 防御', () => {
    expect(countChineseWords(null as unknown as string)).toBe(0);
    expect(countChineseWords(undefined as unknown as string)).toBe(0);
  });

  it('纯英文按单词计算', () => {
    expect(countChineseWords('hello world foo')).toBe(3);
  });

  it('包含中文标点', () => {
    // 你(中文) 好(中文) ，(全角标点) 世(中文) 界(中文) ！(全角标点) = 6
    expect(countChineseWords('你好，世界！')).toBe(6);
  });
});

describe('calculateFamiliarityFromWords - 字数→熟悉度增量', () => {
  it('100 字增加 0.1%', () => {
    expect(calculateFamiliarityFromWords(100)).toBeCloseTo(0.1);
  });

  it('1000 字增加 1%', () => {
    expect(calculateFamiliarityFromWords(1000)).toBeCloseTo(1);
  });

  it('50 字增加 0.05%', () => {
    expect(calculateFamiliarityFromWords(50)).toBeCloseTo(0.05);
  });

  it('0 字返回 0', () => {
    expect(calculateFamiliarityFromWords(0)).toBe(0);
  });

  it('负数返回 0', () => {
    expect(calculateFamiliarityFromWords(-100)).toBe(0);
  });
});

describe('calculateFamiliarityFromGold - 金币→熟悉度增量', () => {
  it('100 金币增加 10%', () => {
    expect(calculateFamiliarityFromGold(100)).toBeCloseTo(10);
  });

  it('648 金币增加 64.8%', () => {
    expect(calculateFamiliarityFromGold(648)).toBeCloseTo(64.8);
  });

  it('50 金币增加 5%', () => {
    expect(calculateFamiliarityFromGold(50)).toBeCloseTo(5);
  });

  it('0 金币返回 0', () => {
    expect(calculateFamiliarityFromGold(0)).toBe(0);
  });

  it('负数返回 0', () => {
    expect(calculateFamiliarityFromGold(-50)).toBe(0);
  });
});

describe('updateFamiliarity - 更新熟悉度（上限 100）', () => {
  it('正常增加', () => {
    expect(updateFamiliarity(10, 5)).toBe(15);
  });

  it('不超过 100', () => {
    expect(updateFamiliarity(95, 10)).toBe(100);
  });

  it('已达 100 不再增加', () => {
    expect(updateFamiliarity(100, 5)).toBe(100);
  });

  it('负 delta 不减少', () => {
    expect(updateFamiliarity(50, -10)).toBe(50);
  });

  it('delta 为 0 不变', () => {
    expect(updateFamiliarity(30, 0)).toBe(30);
  });
});

describe('getFamiliarityPhase - 阶段判定', () => {
  it('0% 是 intro', () => {
    expect(getFamiliarityPhase(0)).toBe('intro');
  });

  it('19% 是 intro', () => {
    expect(getFamiliarityPhase(19)).toBe('intro');
  });

  it('20% 是 acquaintance', () => {
    expect(getFamiliarityPhase(20)).toBe('acquaintance');
  });

  it('49% 是 acquaintance', () => {
    expect(getFamiliarityPhase(49)).toBe('acquaintance');
  });

  it('50% 是 familiar', () => {
    expect(getFamiliarityPhase(50)).toBe('familiar');
  });

  it('79% 是 familiar', () => {
    expect(getFamiliarityPhase(79)).toBe('familiar');
  });

  it('80% 是 close', () => {
    expect(getFamiliarityPhase(80)).toBe('close');
  });

  it('99% 是 close', () => {
    expect(getFamiliarityPhase(99)).toBe('close');
  });

  it('100% 是 bonded', () => {
    expect(getFamiliarityPhase(100)).toBe('bonded');
  });
});

describe('checkThresholdCrossing - 阈值跨越检测', () => {
  it('跨越 20% 阈值', () => {
    expect(checkThresholdCrossing(19, 21)).toEqual(['acquaintance']);
  });

  it('跨越 50% 阈值', () => {
    expect(checkThresholdCrossing(45, 55)).toEqual(['familiar']);
  });

  it('跨越 80% 阈值', () => {
    expect(checkThresholdCrossing(75, 85)).toEqual(['close']);
  });

  it('跨越 100% 阈值', () => {
    expect(checkThresholdCrossing(95, 100)).toEqual(['bonded']);
  });

  it('一次跨越多个阈值', () => {
    expect(checkThresholdCrossing(15, 55)).toEqual(['acquaintance', 'familiar']);
  });

  it('一次跨越所有阈值', () => {
    expect(checkThresholdCrossing(0, 100)).toEqual([
      'acquaintance',
      'familiar',
      'close',
      'bonded',
    ]);
  });

  it('未跨越任何阈值', () => {
    expect(checkThresholdCrossing(25, 30)).toEqual([]);
  });

  it('值不变不触发', () => {
    expect(checkThresholdCrossing(20, 20)).toEqual([]);
  });

  it('值下降不触发', () => {
    expect(checkThresholdCrossing(50, 30)).toEqual([]);
  });

  it('精确到达阈值触发', () => {
    expect(checkThresholdCrossing(19.9, 20)).toEqual(['acquaintance']);
  });
});
