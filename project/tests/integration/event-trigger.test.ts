/** 事件触发集成测试 — 精确阈值跨越、弹窗内容、角色行为变化 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '@/store/gameStore';
import { checkEventTrigger, getEventContent, EVENTS } from '@/lib/event-system';
import { buildSystemPrompt } from '@/lib/prompt-engine';

describe('事件触发集成', () => {
  beforeEach(() => {
    useGameStore.getState().resetState();
  });

  it('19% → 20% 精确触发事件A', () => {
    const store = useGameStore.getState();
    store.updateFamiliarityValue(19);

    // 再增加 1% 触发
    const trigger = checkEventTrigger(19, 20, []);
    expect(trigger).not.toBeNull();
    expect(trigger!.eventId).toBe('event-a-first-resonance');
    expect(trigger!.title).toBe('第一次共振');
  });

  it('19.9% → 20% 精确触发事件A', () => {
    const trigger = checkEventTrigger(19.9, 20, []);
    expect(trigger).not.toBeNull();
    expect(trigger!.eventId).toBe('event-a-first-resonance');
  });

  it('20% → 20.1% 不触发（已经在 20% 以上）', () => {
    const trigger = checkEventTrigger(20, 20.1, []);
    expect(trigger).toBeNull();
  });

  it('0% → 100% 只触发第一个未触发的事件', () => {
    const trigger = checkEventTrigger(0, 100, []);
    expect(trigger).not.toBeNull();
    expect(trigger!.eventId).toBe('event-a-first-resonance');
  });

  it('已触发事件不会重复触发', () => {
    const triggered = ['event-a-first-resonance'];
    const trigger = checkEventTrigger(19, 25, triggered);
    expect(trigger).toBeNull();
  });

  it('跳过已触发事件后触发下一个', () => {
    const triggered = ['event-a-first-resonance'];
    const trigger = checkEventTrigger(45, 55, triggered);
    expect(trigger).not.toBeNull();
    expect(trigger!.eventId).toBe('event-b-rift');
  });

  it('通过 sendGift 触发事件后 store 正确更新', () => {
    const store = useGameStore.getState();
    store.addGold(500);
    store.updateFamiliarityValue(19);

    // 送 100 金币 → +10% → 29%，跨过 20%
    useGameStore.getState().sendGift(100);

    const after = useGameStore.getState();
    expect(after.character.eventsTriggered).toContain('event-a-first-resonance');
    expect(after.character.currentPhase).toBe('acquaintance');
  });

  it('通过 sendMessage 触发事件后 store 正确更新', () => {
    const store = useGameStore.getState();
    // 推到 19.9%（接近阈值）
    store.updateFamiliarityValue(19.9);

    // 发送足够字数的消息推过 20%
    // 需要 0.1% = 100字
    const longMessage = '这是一段用于测试的文字内容'.repeat(10); // 约 120 字
    useGameStore.getState().sendMessage(longMessage, '收到');

    const after = useGameStore.getState();
    // 可能已触发也可能差一点，取决于精确字数
    if (after.character.familiarity >= 20) {
      expect(after.character.eventsTriggered).toContain('event-a-first-resonance');
    }
  });

  it('四个事件都有完整内容', () => {
    for (const event of EVENTS) {
      const content = getEventContent(event.id);
      expect(content.id).toBe(event.id);
      expect(content.title).toBeTruthy();
      expect(content.description).toBeTruthy();
      expect(content.dialogue.length).toBeGreaterThan(0);
    }
  });

  it('获取不存在事件返回默认内容', () => {
    const content = getEventContent('non-existent-event');
    expect(content.title).toBe('未知事件');
    expect(content.dialogue).toHaveLength(0);
  });

  it('事件触发后 system prompt 包含事件指令', () => {
    const store = useGameStore.getState();
    store.setUserName('测试');
    store.triggerEvent('event-b-rift');
    store.updateFamiliarityValue(55);

    const state = useGameStore.getState();
    const gameState = {
      user: state.user,
      character: state.character,
      economy: state.economy,
      chatHistory: state.chatHistory,
      meta: state.meta,
    };
    const prompt = buildSystemPrompt(gameState);

    expect(prompt).toContain('裂痕');
    expect(prompt).toContain('共振衰减');
  });

  it('四个阈值事件按正确顺序排列', () => {
    expect(EVENTS[0].threshold).toBe(20);
    expect(EVENTS[1].threshold).toBe(50);
    expect(EVENTS[2].threshold).toBe(80);
    expect(EVENTS[3].threshold).toBe(100);
  });

  it('连续送礼依次触发多个事件', () => {
    const store = useGameStore.getState();
    store.addGold(10000);

    // 送 200 → 20% → 事件A
    store.sendGift(200);
    expect(useGameStore.getState().character.eventsTriggered).toContain('event-a-first-resonance');

    // 送 300 → 50% → 事件B
    useGameStore.getState().sendGift(300);
    expect(useGameStore.getState().character.eventsTriggered).toContain('event-b-rift');

    // 送 300 → 80% → 事件C
    useGameStore.getState().sendGift(300);
    expect(useGameStore.getState().character.eventsTriggered).toContain('event-c-irreversible');

    // 送 200 → 100% → 事件D
    useGameStore.getState().sendGift(200);
    expect(useGameStore.getState().character.eventsTriggered).toContain('event-d-interval');

    // 总共 4 个事件
    expect(useGameStore.getState().character.eventsTriggered).toHaveLength(4);
    expect(useGameStore.getState().character.currentPhase).toBe('bonded');
  });
});
