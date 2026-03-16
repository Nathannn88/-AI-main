/** 事件系统单元测试 — 适配新版事件内容与接口 */

import { describe, it, expect } from 'vitest';
import {
  checkEventTrigger,
  getEventContent,
  getEventContentById,
  getAllThresholds,
  getEventId,
} from '@/lib/event-system';
import type { EventThreshold } from '@/lib/event-system';

/** 所有阈值列表 */
const THRESHOLDS: EventThreshold[] = [20, 50, 80, 100];

describe('事件定义', () => {
  it('定义了 4 个阈值事件', () => {
    expect(getAllThresholds()).toHaveLength(4);
  });

  it('阈值分别为 20/50/80/100', () => {
    expect(getAllThresholds()).toEqual([20, 50, 80, 100]);
  });

  it('每个事件都有 id、title、description、dialogue', () => {
    for (const threshold of THRESHOLDS) {
      const content = getEventContent(threshold);
      expect(content.id).toBeTruthy();
      expect(content.title).toBeTruthy();
      expect(content.description).toBeTruthy();
      expect(content.dialogue.length).toBeGreaterThan(0);
    }
  });

  it('事件 id 唯一', () => {
    const ids = THRESHOLDS.map((t) => getEventId(t));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('checkEventTrigger - 事件触发检测', () => {
  it('跨越 20% 触发第一道裂缝', () => {
    const result = checkEventTrigger(19, 21, []);
    expect(result).not.toBeNull();
    expect(result?.threshold).toBe(20);
    expect(result?.eventId).toBe('event-20-first-crack');
  });

  it('跨越 50% 触发他从不说的名字', () => {
    const result = checkEventTrigger(45, 55, ['event-20-first-crack']);
    expect(result).not.toBeNull();
    expect(result?.threshold).toBe(50);
    expect(result?.eventId).toBe('event-50-unnamed');
  });

  it('跨越 80% 触发航程启动', () => {
    const result = checkEventTrigger(75, 85, [
      'event-20-first-crack',
      'event-50-unnamed',
    ]);
    expect(result).not.toBeNull();
    expect(result?.threshold).toBe(80);
  });

  it('跨越 100% 触发两扇门', () => {
    const result = checkEventTrigger(95, 100, [
      'event-20-first-crack',
      'event-50-unnamed',
      'event-80-voyage-start',
    ]);
    expect(result).not.toBeNull();
    expect(result?.threshold).toBe(100);
  });

  it('已触发的事件不会重复触发', () => {
    const result = checkEventTrigger(19, 21, ['event-20-first-crack']);
    expect(result).toBeNull();
  });

  it('未跨越阈值不触发', () => {
    const result = checkEventTrigger(25, 30, []);
    expect(result).toBeNull();
  });

  it('值不变不触发', () => {
    const result = checkEventTrigger(20, 20, []);
    expect(result).toBeNull();
  });

  it('值下降不触发', () => {
    const result = checkEventTrigger(50, 30, []);
    expect(result).toBeNull();
  });

  it('一次跨越多个阈值，触发最近的一个', () => {
    const result = checkEventTrigger(0, 55, []);
    expect(result).not.toBeNull();
    expect(result?.threshold).toBe(20);
  });

  it('精确到达阈值触发', () => {
    const result = checkEventTrigger(19.9, 20, []);
    expect(result).not.toBeNull();
    expect(result?.threshold).toBe(20);
  });

  it('从正好在阈值不再触发', () => {
    const result = checkEventTrigger(20, 25, []);
    expect(result).toBeNull();
  });
});

describe('getEventContent - 获取事件内容', () => {
  it('获取 20% 事件内容', () => {
    const content = getEventContent(20);
    expect(content.title).toBe('第一道裂缝');
    expect(content.dialogue).toBeInstanceOf(Array);
    expect(content.dialogue.length).toBeGreaterThan(0);
  });

  it('获取 50% 事件内容', () => {
    const content = getEventContent(50);
    expect(content.title).toBe('他从不说的名字');
    expect(content.dialogue.length).toBeGreaterThan(0);
  });

  it('获取 80% 事件内容', () => {
    const content = getEventContent(80);
    expect(content.title).toBe('航程启动');
    expect(content.dialogue.length).toBeGreaterThan(0);
  });

  it('获取 100% 事件内容', () => {
    const content = getEventContent(100);
    expect(content.title).toBe('两扇门');
    expect(content.dialogue.length).toBeGreaterThan(0);
  });

  it('通过 eventId 获取事件内容', () => {
    const content = getEventContentById('event-20-first-crack');
    expect(content).not.toBeNull();
    expect(content?.title).toBe('第一道裂缝');
  });

  it('未知 eventId 返回 null', () => {
    const content = getEventContentById('nonexistent');
    expect(content).toBeNull();
  });

  it('事件对话内容不为空', () => {
    for (const threshold of THRESHOLDS) {
      const content = getEventContent(threshold);
      expect(content.dialogue.length).toBeGreaterThan(0);
      for (const line of content.dialogue) {
        expect(line.length).toBeGreaterThan(0);
      }
    }
  });

  it('每个事件都有 mood 情绪基调', () => {
    for (const threshold of THRESHOLDS) {
      const content = getEventContent(threshold);
      expect(content.mood).toBeTruthy();
    }
  });

  it('每个事件都有视觉效果定义', () => {
    for (const threshold of THRESHOLDS) {
      const content = getEventContent(threshold);
      expect(content.visualEffects.length).toBeGreaterThan(0);
    }
  });

  it('每个事件都有揭示信息', () => {
    for (const threshold of THRESHOLDS) {
      const content = getEventContent(threshold);
      expect(content.reveals.length).toBeGreaterThan(0);
    }
  });
});
