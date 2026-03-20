/** 存档/读档集成测试 — 对话→保存→清除→上传恢复→状态一致 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '@/store/gameStore';

describe('存档/读档集成', () => {
  beforeEach(() => {
    useGameStore.getState().resetState();
  });

  it('完整流程：设置状态→导出→重置→导入→状态一致', () => {
    const store = useGameStore.getState();

    // 设置初始状态
    store.setUserName('存档测试');
    store.saveIntroAnswer('color', '蓝色');
    store.completeIntro();
    store.addGold(128);
    store.sendMessage('你好', '你好，欢迎来到谱渊的边界');
    store.sendGift(50);

    // 记录导出前状态
    const beforeExport = useGameStore.getState();
    const exportedName = beforeExport.user.name;
    const exportedFamiliarity = beforeExport.character.familiarity;
    const exportedGold = beforeExport.economy.goldBalance;
    const exportedHistory = beforeExport.chatHistory.length;
    const exportedIntroCompleted = beforeExport.user.introCompleted;

    // 导出
    const json = store.exportState();
    expect(json).toBeTruthy();
    expect(typeof json).toBe('string');

    // 验证 JSON 格式
    const parsed = JSON.parse(json);
    expect(parsed.user.name).toBe(exportedName);
    expect(parsed.character.familiarity).toBeCloseTo(exportedFamiliarity, 5);

    // 重置状态
    useGameStore.getState().resetState();
    const reset = useGameStore.getState();
    expect(reset.user.name).toBe('');
    expect(reset.character.familiarity).toBe(0);
    expect(reset.chatHistory).toHaveLength(0);

    // 导入恢复
    const result = useGameStore.getState().importState(json);
    expect(result.success).toBe(true);

    // 验证恢复后状态一致
    const restored = useGameStore.getState();
    expect(restored.user.name).toBe(exportedName);
    expect(restored.user.introCompleted).toBe(exportedIntroCompleted);
    expect(restored.user.introAnswers.color).toBe('蓝色');
    expect(restored.character.familiarity).toBeCloseTo(exportedFamiliarity, 5);
    expect(restored.economy.goldBalance).toBe(exportedGold);
    expect(restored.chatHistory).toHaveLength(exportedHistory);
  });

  it('导入损坏的 JSON 数据失败', () => {
    const result = useGameStore.getState().importState('{ invalid json }');
    expect(result.success).toBe(false);
    expect(result.error).toContain('JSON');
  });

  it('导入不完整的数据失败', () => {
    const result = useGameStore.getState().importState('{"user": {}}');
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('导入失败后状态不被修改', () => {
    const store = useGameStore.getState();
    store.setUserName('保持不变');
    store.addGold(100);

    // 尝试导入损坏数据
    store.importState('not json');

    const after = useGameStore.getState();
    expect(after.user.name).toBe('保持不变');
    expect(after.economy.goldBalance).toBe(100);
  });

  it('导出的 JSON 包含所有必要字段', () => {
    const store = useGameStore.getState();
    store.setUserName('字段测试');
    store.sendMessage('测试', '回复');

    const json = store.exportState();
    const data = JSON.parse(json);

    // 顶层字段
    expect(data).toHaveProperty('user');
    expect(data).toHaveProperty('character');
    expect(data).toHaveProperty('economy');
    expect(data).toHaveProperty('chatHistory');
    expect(data).toHaveProperty('meta');

    // user 字段
    expect(data.user).toHaveProperty('name');
    expect(data.user).toHaveProperty('introCompleted');
    expect(data.user).toHaveProperty('introAnswers');

    // character 字段
    expect(data.character).toHaveProperty('familiarity');
    expect(data.character).toHaveProperty('totalWordsFromUser');
    expect(data.character).toHaveProperty('eventsTriggered');
    expect(data.character).toHaveProperty('currentPhase');

    // economy 字段
    expect(data.economy).toHaveProperty('goldBalance');
    expect(data.economy).toHaveProperty('totalGoldEarned');
    expect(data.economy).toHaveProperty('totalGoldSpent');
    expect(data.economy).toHaveProperty('rechargeHistory');

    // meta 字段
    expect(data.meta).toHaveProperty('version');
    expect(data.meta).toHaveProperty('createdAt');
    expect(data.meta).toHaveProperty('lastSavedAt');
  });

  it('多次导出/导入循环状态保持一致', () => {
    const store = useGameStore.getState();
    store.setUserName('循环测试');
    store.addGold(500);
    store.sendGift(200);
    store.sendMessage('第一轮', '回复一');

    // 第一次导出→导入
    const json1 = useGameStore.getState().exportState();
    useGameStore.getState().resetState();
    useGameStore.getState().importState(json1);

    // 在导入的状态上继续操作
    useGameStore.getState().sendMessage('第二轮', '回复二');
    useGameStore.getState().addGold(100);

    // 第二次导出→导入
    const json2 = useGameStore.getState().exportState();
    const state2 = useGameStore.getState();
    useGameStore.getState().resetState();
    useGameStore.getState().importState(json2);

    const restored = useGameStore.getState();
    expect(restored.user.name).toBe('循环测试');
    expect(restored.chatHistory).toHaveLength(state2.chatHistory.length);
    expect(restored.economy.goldBalance).toBe(state2.economy.goldBalance);
    expect(restored.character.familiarity).toBeCloseTo(state2.character.familiarity, 5);
  });
});
