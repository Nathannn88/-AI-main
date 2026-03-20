/** 聊天流程集成测试 — 发消息→回复→字数统计→熟悉度更新 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '@/store/gameStore';
import { countChineseWords, calculateFamiliarityFromWords } from '@/lib/familiarity';
import { buildSystemPrompt, buildMessages } from '@/lib/prompt-engine';

describe('聊天流程集成', () => {
  beforeEach(() => {
    useGameStore.getState().resetState();
  });

  it('发送消息后字数累加并增长熟悉度', () => {
    const store = useGameStore.getState();
    const userMessage = '你好，我想了解一下谱渊的世界';
    const assistantMessage = '谱渊是一个由纯粹频率构成的维度。';

    const wordCount = countChineseWords(userMessage);
    expect(wordCount).toBeGreaterThan(0);

    store.sendMessage(userMessage, assistantMessage);

    const afterState = useGameStore.getState();
    expect(afterState.chatHistory).toHaveLength(2);
    expect(afterState.chatHistory[0].role).toBe('user');
    expect(afterState.chatHistory[0].content).toBe(userMessage);
    expect(afterState.chatHistory[1].role).toBe('assistant');
    expect(afterState.chatHistory[1].content).toBe(assistantMessage);
    expect(afterState.character.totalWordsFromUser).toBe(wordCount);
    expect(afterState.character.familiarity).toBeGreaterThan(0);
  });

  it('多轮对话字数持续累加', () => {
    const store = useGameStore.getState();

    const msg1 = '这是第一条消息测试用的文字';
    const msg2 = '这是第二条消息同样是用来测试的文字';

    store.sendMessage(msg1, '回复一');
    const after1 = useGameStore.getState();
    const words1 = after1.character.totalWordsFromUser;

    after1.sendMessage(msg2, '回复二');
    const after2 = useGameStore.getState();
    const words2 = after2.character.totalWordsFromUser;

    expect(words2).toBeGreaterThan(words1);
    expect(after2.chatHistory).toHaveLength(4);
  });

  it('消息字数正确转换为熟悉度增量', () => {
    const userMessage = '这是一段很长的消息'.repeat(10); // 约90个中文字
    const wordCount = countChineseWords(userMessage);
    const expectedDelta = calculateFamiliarityFromWords(wordCount);

    const store = useGameStore.getState();
    store.sendMessage(userMessage, '回复');

    const afterState = useGameStore.getState();
    // 熟悉度应接近 expectedDelta（浮点容差）
    expect(afterState.character.familiarity).toBeCloseTo(expectedDelta, 5);
  });

  it('空消息不影响状态', () => {
    const store = useGameStore.getState();
    const before = { ...store.character };

    store.sendMessage('', '');
    const after = useGameStore.getState();

    // 即使发了空消息，sendMessage 会添加到历史，但字数增量为 0
    expect(after.character.familiarity).toBe(before.familiarity);
    expect(after.character.totalWordsFromUser).toBe(before.totalWordsFromUser);
  });

  it('熟悉度阶段随增长正确切换', () => {
    const store = useGameStore.getState();
    expect(store.character.currentPhase).toBe('intro');

    // 用大量文字推动到 acquaintance（20%）
    // 每 100 字 +0.1%，需要 20000 字到 20%
    // 改用 updateFamiliarityValue 快速模拟
    store.updateFamiliarityValue(20);
    const phase1 = useGameStore.getState().character.currentPhase;
    expect(phase1).toBe('acquaintance');

    store.updateFamiliarityValue(30);
    const phase2 = useGameStore.getState().character.currentPhase;
    expect(phase2).toBe('familiar');

    store.updateFamiliarityValue(30);
    const phase3 = useGameStore.getState().character.currentPhase;
    expect(phase3).toBe('close');

    store.updateFamiliarityValue(20);
    const phase4 = useGameStore.getState().character.currentPhase;
    expect(phase4).toBe('bonded');
  });

  it('Prompt 引擎根据状态正确拼装 system prompt', () => {
    const store = useGameStore.getState();
    store.setUserName('测试用户');
    store.saveIntroAnswer('color', '翡翠绿');
    store.completeIntro();

    const state = useGameStore.getState();
    const gameState = {
      user: state.user,
      character: state.character,
      economy: state.economy,
      chatHistory: state.chatHistory,
      meta: state.meta,
    };
    const prompt = buildSystemPrompt(gameState);

    // system prompt 包含角色基础设定
    expect(prompt).toContain('栖迟');
    expect(prompt).toContain('谱渊');
    // 包含用户信息
    expect(prompt).toContain('测试用户');
    expect(prompt).toContain('翡翠绿');
    // 包含当前阶段指令
    expect(prompt).toContain('初遇');
  });

  it('Prompt 引擎随阶段变化更新指令', () => {
    const store = useGameStore.getState();
    store.setUserName('用户');
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

    expect(prompt).toContain('熟悉');
    expect(prompt).toContain('55.0%');
  });

  it('buildMessages 正确拼装消息列表并限制 20 轮', () => {
    const store = useGameStore.getState();

    // 添加 25 轮对话（50 条消息）
    for (let i = 0; i < 25; i++) {
      store.sendMessage(`用户消息${i}`, `助手回复${i}`);
    }

    const state = useGameStore.getState();
    const gameState = {
      user: state.user,
      character: state.character,
      economy: state.economy,
      chatHistory: state.chatHistory,
      meta: state.meta,
    };
    const systemPrompt = buildSystemPrompt(gameState);
    const messages = buildMessages(state.chatHistory, systemPrompt);

    // system prompt + 最近 20 轮（40 条）
    expect(messages[0].role).toBe('system');
    expect(messages.length).toBe(41); // 1 system + 40 messages
  });

  it('事件触发后 prompt 包含事件指令', () => {
    const store = useGameStore.getState();
    store.setUserName('用户');
    store.triggerEvent('event-a-first-resonance');
    store.updateFamiliarityValue(25);

    const state = useGameStore.getState();
    const gameState = {
      user: state.user,
      character: state.character,
      economy: state.economy,
      chatHistory: state.chatHistory,
      meta: state.meta,
    };
    const prompt = buildSystemPrompt(gameState);

    expect(prompt).toContain('第一次共振');
  });
});
