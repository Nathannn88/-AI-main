/** 完整生命周期集成测试 — 从初见到终局的全链路 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '@/store/gameStore';
import { buildSystemPrompt, buildMessages } from '@/lib/prompt-engine';
import { checkEndingTrigger } from '@/lib/ending-system';
import { checkEventTrigger } from '@/lib/event-system';

describe('完整生命周期', () => {
  beforeEach(() => {
    useGameStore.getState().resetState();
  });

  it('从初见到终局的完整流程', () => {
    const store = useGameStore.getState();

    // === 阶段 0：用户设置 ===
    store.setUserName('旅人');
    store.saveIntroAnswer('color', '深海蓝');
    store.saveIntroAnswer('sound', '雨声');
    store.completeIntro();

    let state = useGameStore.getState();
    expect(state.user.name).toBe('旅人');
    expect(state.user.introCompleted).toBe(true);
    expect(state.character.currentPhase).toBe('intro');

    // === 阶段 1：对话与熟悉度增长 ===
    // 模拟对话推进到 20%（事件 A 触发点）
    state.updateFamiliarityValue(20);
    state = useGameStore.getState();
    expect(state.character.currentPhase).toBe('acquaintance');
    expect(state.character.eventsTriggered).toContain('event-20-first-crack');

    // === 阶段 2：推进到 50%（事件 B）===
    state.updateFamiliarityValue(30);
    state = useGameStore.getState();
    expect(state.character.currentPhase).toBe('familiar');
    expect(state.character.eventsTriggered).toContain('event-50-unnamed');

    // === 阶段 3：推进到 80%（事件 C）===
    state.updateFamiliarityValue(30);
    state = useGameStore.getState();
    expect(state.character.currentPhase).toBe('close');
    expect(state.character.eventsTriggered).toContain('event-80-voyage-start');

    // === 阶段 4：推进到 100%（终局）===
    state.updateFamiliarityValue(20);
    state = useGameStore.getState();
    expect(state.character.currentPhase).toBe('bonded');
    expect(state.character.familiarity).toBe(100);
    expect(checkEndingTrigger(state.character.familiarity)).toBe(true);

    // === 阶段 5：触发终局 ===
    state.triggerEnding();
    state = useGameStore.getState();
    expect(state.ending.endingReached).toBe(true);
    expect(state.ending.choiceMade).toBe('none');

    // === 阶段 6：选择结局二 ===
    state.makeEndingChoice('become-poet');
    state = useGameStore.getState();
    expect(state.ending.postEndingActive).toBe(true);
    expect(state.fuel.currentFuel).toBe(80);
    expect(state.penguin.currentForm).toBe('judge');
    expect(state.economy.goldBalance).toBe(0);
  });

  it('Prompt 引擎在各阶段产生正确 prompt', () => {
    const store = useGameStore.getState();
    store.setUserName('诗人候选');

    // 初始阶段
    let state = useGameStore.getState();
    let gameState = { ...state };
    let prompt = buildSystemPrompt(gameState);
    expect(prompt).toContain('诗人');
    expect(prompt).toContain('0.0%');

    // 推进到 50%
    state.updateFamiliarityValue(50);
    state = useGameStore.getState();
    gameState = { ...state };
    prompt = buildSystemPrompt(gameState);
    expect(prompt).toContain('50.0%');
  });

  it('存档→导入完整保留状态', () => {
    const store = useGameStore.getState();
    store.setUserName('存档测试');
    store.saveIntroAnswer('color', '红');
    store.completeIntro();
    store.sendMessage('测试消息', '测试回复');
    store.addGold(64);
    store.updateFamiliarityValue(30);

    // 导出
    const json = useGameStore.getState().exportState();

    // 重置
    useGameStore.getState().resetState();
    expect(useGameStore.getState().user.name).toBe('');

    // 导入
    const result = useGameStore.getState().importState(json);
    expect(result.success).toBe(true);

    const restored = useGameStore.getState();
    expect(restored.user.name).toBe('存档测试');
    expect(restored.user.introCompleted).toBe(true);
    expect(restored.chatHistory.length).toBe(2);
    expect(restored.economy.goldBalance).toBe(64);
    expect(restored.character.familiarity).toBeGreaterThan(30);
  });

  it('结局二后存档→导入保留燃料/火种状态', () => {
    const store = useGameStore.getState();
    store.setUserName('结局存档');
    store.completeIntro();
    store.updateFamiliarityValue(100);
    store.triggerEnding();
    store.makeEndingChoice('become-poet');

    // 模拟火种交互
    useGameStore.getState().incrementTurnsSinceLastSpark();
    useGameStore.getState().incrementTurnsSinceLastSpark();
    useGameStore.getState().updateFuelValue(-5);

    // 导出
    const json = useGameStore.getState().exportState();

    // 重置并导入
    useGameStore.getState().resetState();
    const result = useGameStore.getState().importState(json);
    expect(result.success).toBe(true);

    const restored = useGameStore.getState();
    expect(restored.ending.postEndingActive).toBe(true);
    expect(restored.ending.choiceMade).toBe('become-poet');
    expect(restored.fuel.currentFuel).toBe(75);
    expect(restored.penguin.currentForm).toBe('judge');
    expect(restored.spark.turnsSinceLastSpark).toBe(2);
  });

  it('事件触发与终局触发不冲突', () => {
    const store = useGameStore.getState();

    // 逐阶段推进，每个阈值只触发一个事件
    store.updateFamiliarityValue(20);
    let state = useGameStore.getState();
    expect(state.character.eventsTriggered).toContain('event-20-first-crack');

    state.updateFamiliarityValue(30);
    state = useGameStore.getState();
    expect(state.character.eventsTriggered).toContain('event-50-unnamed');

    state.updateFamiliarityValue(30);
    state = useGameStore.getState();
    expect(state.character.eventsTriggered).toContain('event-80-voyage-start');

    state.updateFamiliarityValue(20);
    state = useGameStore.getState();
    expect(state.character.eventsTriggered).toContain('event-100-two-doors');

    // 终局可触发且不与事件冲突
    expect(checkEndingTrigger(state.character.familiarity)).toBe(true);
    expect(state.character.eventsTriggered).toHaveLength(4);
  });
});
