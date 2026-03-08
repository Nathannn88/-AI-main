/** 自我介绍→GameState→正式聊天 集成测试 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '@/store/gameStore';
import { buildSystemPrompt } from '@/lib/prompt-engine';

describe('自我介绍流程集成', () => {
  beforeEach(() => {
    useGameStore.getState().resetState();
  });

  it('初始状态未完成介绍', () => {
    const state = useGameStore.getState();
    expect(state.user.introCompleted).toBe(false);
    expect(state.user.name).toBe('');
    expect(Object.keys(state.user.introAnswers)).toHaveLength(0);
  });

  it('设置用户名后正确保存', () => {
    const store = useGameStore.getState();
    store.setUserName('栖迟测试者');

    const after = useGameStore.getState();
    expect(after.user.name).toBe('栖迟测试者');
  });

  it('保存介绍回答后正确存储', () => {
    const store = useGameStore.getState();

    store.saveIntroAnswer('color', '翡翠绿');
    store.saveIntroAnswer('song', '夜曲');
    store.saveIntroAnswer('time', '看夕阳的时候');

    const after = useGameStore.getState();
    expect(after.user.introAnswers.color).toBe('翡翠绿');
    expect(after.user.introAnswers.song).toBe('夜曲');
    expect(after.user.introAnswers.time).toBe('看夕阳的时候');
    expect(Object.keys(after.user.introAnswers)).toHaveLength(3);
  });

  it('完成介绍后标记为完成', () => {
    const store = useGameStore.getState();
    store.setUserName('测试用户');
    store.saveIntroAnswer('color', '红');
    store.completeIntro();

    const after = useGameStore.getState();
    expect(after.user.introCompleted).toBe(true);
  });

  it('完整介绍流程→prompt 包含用户信息', () => {
    const store = useGameStore.getState();

    // 模拟完整介绍流程
    store.setUserName('李明');
    store.saveIntroAnswer('color', '深海蓝');
    store.saveIntroAnswer('song', '月光奏鸣曲');
    store.saveIntroAnswer('time', '下大雪的深夜');
    store.completeIntro();

    // 验证 prompt 包含用户信息
    const state = useGameStore.getState();
    const gameState = {
      user: state.user,
      character: state.character,
      economy: state.economy,
      chatHistory: state.chatHistory,
      meta: state.meta,
    };
    const prompt = buildSystemPrompt(gameState);

    expect(prompt).toContain('李明');
    expect(prompt).toContain('深海蓝');
    expect(prompt).toContain('月光奏鸣曲');
    expect(prompt).toContain('下大雪的深夜');
  });

  it('介绍完成后可以正常发送聊天消息', () => {
    const store = useGameStore.getState();
    store.setUserName('聊天测试');
    store.completeIntro();

    store.sendMessage('第一条正式消息', '欢迎，聊天测试');

    const after = useGameStore.getState();
    expect(after.chatHistory).toHaveLength(2);
    expect(after.character.totalWordsFromUser).toBeGreaterThan(0);
  });

  it('多次保存同一问题的回答会覆盖', () => {
    const store = useGameStore.getState();
    store.saveIntroAnswer('color', '红色');
    store.saveIntroAnswer('color', '蓝色');

    const after = useGameStore.getState();
    expect(after.user.introAnswers.color).toBe('蓝色');
  });

  it('介绍信息在存档/读档后保持一致', () => {
    const store = useGameStore.getState();
    store.setUserName('存档名');
    store.saveIntroAnswer('color', '金色');
    store.saveIntroAnswer('song', '一首歌');
    store.completeIntro();

    const json = store.exportState();
    useGameStore.getState().resetState();
    useGameStore.getState().importState(json);

    const restored = useGameStore.getState();
    expect(restored.user.name).toBe('存档名');
    expect(restored.user.introCompleted).toBe(true);
    expect(restored.user.introAnswers.color).toBe('金色');
    expect(restored.user.introAnswers.song).toBe('一首歌');
  });
});
