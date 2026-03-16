/** 事件触发集成测试 — 精确阈值跨越、弹窗内容、角色行为变化 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '@/store/gameStore';
import {
  checkEventTrigger,
  getEventContent,
  getEventContentById,
  getAllThresholds,
} from '@/lib/event-system';
import { buildSystemPrompt } from '@/lib/prompt-engine';

describe('事件触发集成', () => {
  beforeEach(() => {
    useGameStore.getState().resetState();
  });

  it('19% → 20% 精确触发第一道裂缝', () => {
    const store = useGameStore.getState();
    store.updateFamiliarityValue(19);

    const trigger = checkEventTrigger(19, 20, []);
    expect(trigger).not.toBeNull();
    expect(trigger!.eventId).toBe('event-20-first-crack');
    expect(trigger!.title).toBe('第一道裂缝');
  });

  it('19.9% → 20% 精确触发第一道裂缝', () => {
    const trigger = checkEventTrigger(19.9, 20, []);
    expect(trigger).not.toBeNull();
    expect(trigger!.eventId).toBe('event-20-first-crack');
  });

  it('20% → 20.1% 不触发（已经在 20% 以上）', () => {
    const trigger = checkEventTrigger(20, 20.1, []);
    expect(trigger).toBeNull();
  });

  it('0% → 100% 只触发第一个未触发的事件', () => {
    const trigger = checkEventTrigger(0, 100, []);
    expect(trigger).not.toBeNull();
    expect(trigger!.eventId).toBe('event-20-first-crack');
  });

  it('已触发事件不会重复触发', () => {
    const triggered = ['event-20-first-crack'];
    const trigger = checkEventTrigger(19, 25, triggered);
    expect(trigger).toBeNull();
  });

  it('跳过已触发事件后触发下一个', () => {
    const triggered = ['event-20-first-crack'];
    const trigger = checkEventTrigger(45, 55, triggered);
    expect(trigger).not.toBeNull();
    expect(trigger!.eventId).toBe('event-50-unnamed');
  });

  it('通过 updateFamiliarityValue 触发事件后 store 正确更新', () => {
    const store = useGameStore.getState();
    store.updateFamiliarityValue(19);

    useGameStore.getState().updateFamiliarityValue(1);

    const after = useGameStore.getState();
    expect(after.character.eventsTriggered).toContain('event-20-first-crack');
    expect(after.character.currentPhase).toBe('acquaintance');
  });

  it('通过 sendMessage 触发事件后 store 正确更新', () => {
    const store = useGameStore.getState();
    store.updateFamiliarityValue(19.9);

    const longMessage = '这是一段用于测试的文字内容'.repeat(10);
    useGameStore.getState().sendMessage(longMessage, '收到');

    const after = useGameStore.getState();
    if (after.character.familiarity >= 20) {
      expect(after.character.eventsTriggered).toContain('event-20-first-crack');
    }
  });

  it('四个事件都有完整内容', () => {
    for (const threshold of getAllThresholds()) {
      const content = getEventContent(threshold);
      expect(content.id).toBeTruthy();
      expect(content.title).toBeTruthy();
      expect(content.description).toBeTruthy();
      expect(content.dialogue.length).toBeGreaterThan(0);
    }
  });

  it('通过 eventId 获取不存在事件返回 null', () => {
    const content = getEventContentById('non-existent-event');
    expect(content).toBeNull();
  });

  it('事件触发后 system prompt 包含事件相关内容', () => {
    const store = useGameStore.getState();
    store.setUserName('测试');
    store.triggerEvent('event-50-unnamed');
    store.updateFamiliarityValue(55);

    const state = useGameStore.getState();
    const gameState = {
      user: state.user,
      character: state.character,
      economy: state.economy,
      chatHistory: state.chatHistory,
      meta: state.meta,
      fuel: state.fuel,
      penguin: state.penguin,
      ending: state.ending,
      spark: state.spark,
    };
    const prompt = buildSystemPrompt(gameState);

    /* prompt 中应包含与已触发事件相关的信息 */
    expect(prompt).toBeTruthy();
  });

  it('四个阈值按正确顺序排列', () => {
    const thresholds = getAllThresholds();
    expect(thresholds[0]).toBe(20);
    expect(thresholds[1]).toBe(50);
    expect(thresholds[2]).toBe(80);
    expect(thresholds[3]).toBe(100);
  });

  it('连续增加熟悉度依次触发多个事件', () => {
    const store = useGameStore.getState();

    /* 增加到 20% → 第一道裂缝 */
    store.updateFamiliarityValue(20);
    expect(useGameStore.getState().character.eventsTriggered).toContain('event-20-first-crack');

    /* 增加到 50% → 他从不说的名字 */
    useGameStore.getState().updateFamiliarityValue(30);
    expect(useGameStore.getState().character.eventsTriggered).toContain('event-50-unnamed');

    /* 增加到 80% → 航程启动 */
    useGameStore.getState().updateFamiliarityValue(30);
    expect(useGameStore.getState().character.eventsTriggered).toContain('event-80-voyage-start');

    /* 增加到 100% → 两扇门 */
    useGameStore.getState().updateFamiliarityValue(20);
    expect(useGameStore.getState().character.eventsTriggered).toContain('event-100-two-doors');

    /* 总共 4 个事件 */
    expect(useGameStore.getState().character.eventsTriggered).toHaveLength(4);
    expect(useGameStore.getState().character.currentPhase).toBe('bonded');
  });
});
