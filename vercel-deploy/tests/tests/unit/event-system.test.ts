/** 事件系统单元测试 */

import { describe, it, expect } from 'vitest';
import {
  EVENTS,
  checkEventTrigger,
  getEventContent,
} from '@/lib/event-system';

describe('EVENTS - 事件定义', () => {
  it('定义了 4 个事件', () => {
    expect(EVENTS).toHaveLength(4);
  });

  it('阈值分别为 20/50/80/100', () => {
    const thresholds = EVENTS.map((e) => e.threshold);
    expect(thresholds).toEqual([20, 50, 80, 100]);
  });

  it('每个事件都有 id、title、description', () => {
    for (const event of EVENTS) {
      expect(event.id).toBeTruthy();
      expect(event.title).toBeTruthy();
      expect(event.description).toBeTruthy();
    }
  });

  it('事件 id 唯一', () => {
    const ids = EVENTS.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('checkEventTrigger - 事件触发检测', () => {
  it('跨越 20% 触发事件 A', () => {
    const result = checkEventTrigger(19, 21, []);
    expect(result).not.toBeNull();
    expect(result?.threshold).toBe(20);
    expect(result?.eventId).toBe('event-a-first-resonance');
  });

  it('跨越 50% 触发事件 B', () => {
    const result = checkEventTrigger(45, 55, ['event-a-first-resonance']);
    expect(result).not.toBeNull();
    expect(result?.threshold).toBe(50);
    expect(result?.eventId).toBe('event-b-rift');
  });

  it('跨越 80% 触发事件 C', () => {
    const result = checkEventTrigger(75, 85, [
      'event-a-first-resonance',
      'event-b-rift',
    ]);
    expect(result).not.toBeNull();
    expect(result?.threshold).toBe(80);
  });

  it('跨越 100% 触发事件 D', () => {
    const result = checkEventTrigger(95, 100, [
      'event-a-first-resonance',
      'event-b-rift',
      'event-c-irreversible',
    ]);
    expect(result).not.toBeNull();
    expect(result?.threshold).toBe(100);
  });

  it('已触发的事件不会重复触发', () => {
    const result = checkEventTrigger(19, 21, ['event-a-first-resonance']);
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
    // 从 0 到 55，跨越了 20 和 50，返回第一个（20）
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
  it('获取事件 A 的内容', () => {
    const content = getEventContent('event-a-first-resonance');
    expect(content.title).toBe('第一次共振');
    expect(content.dialogue).toBeInstanceOf(Array);
    expect(content.dialogue.length).toBeGreaterThan(0);
  });

  it('获取事件 B 的内容', () => {
    const content = getEventContent('event-b-rift');
    expect(content.title).toBe('裂痕');
    expect(content.dialogue.length).toBeGreaterThan(0);
  });

  it('获取事件 C 的内容', () => {
    const content = getEventContent('event-c-irreversible');
    expect(content.title).toBe('不可撤回');
    expect(content.dialogue.length).toBeGreaterThan(0);
  });

  it('获取事件 D 的内容', () => {
    const content = getEventContent('event-d-interval');
    expect(content.title).toBe('间隙');
    expect(content.dialogue.length).toBeGreaterThan(0);
  });

  it('未知事件 id 返回默认内容', () => {
    const content = getEventContent('nonexistent');
    expect(content.title).toBe('未知事件');
    expect(content.dialogue).toEqual([]);
  });

  it('事件对话内容不为空', () => {
    for (const event of EVENTS) {
      const content = getEventContent(event.id);
      expect(content.dialogue.length).toBeGreaterThan(0);
      for (const line of content.dialogue) {
        expect(line.length).toBeGreaterThan(0);
      }
    }
  });
});
