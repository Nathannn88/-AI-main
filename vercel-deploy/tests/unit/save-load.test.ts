/** 存档系统单元测试 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  exportGameState,
  importGameState,
  validateGameState,
  generateSaveFileName,
} from '@/lib/save-system';
import type { GameState } from '@/types/game-state';
import { createDefaultGameState, GAME_STATE_VERSION } from '@/types/game-state';

describe('exportGameState - 导出游戏状态', () => {
  let state: GameState;

  beforeEach(() => {
    state = createDefaultGameState();
    state.user.name = '测试用户';
    state.character.familiarity = 25;
  });

  it('导出为有效的 JSON 字符串', () => {
    const json = exportGameState(state);
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it('导出的数据包含所有字段', () => {
    const json = exportGameState(state);
    const parsed = JSON.parse(json);
    expect(parsed.user).toBeDefined();
    expect(parsed.character).toBeDefined();
    expect(parsed.economy).toBeDefined();
    expect(parsed.chatHistory).toBeDefined();
    expect(parsed.meta).toBeDefined();
  });

  it('导出会更新 lastSavedAt', async () => {
    // 等待一小段时间确保时间戳不同
    await new Promise((resolve) => setTimeout(resolve, 10));
    const json = exportGameState(state);
    const parsed = JSON.parse(json);
    // lastSavedAt 应该是一个有效的 ISO 日期字符串
    expect(parsed.meta.lastSavedAt).toBeTruthy();
    expect(new Date(parsed.meta.lastSavedAt).getTime()).toBeGreaterThanOrEqual(
      new Date(state.meta.createdAt).getTime()
    );
  });

  it('保留用户数据', () => {
    const json = exportGameState(state);
    const parsed = JSON.parse(json);
    expect(parsed.user.name).toBe('测试用户');
    expect(parsed.character.familiarity).toBe(25);
  });
});

describe('validateGameState - 数据校验', () => {
  it('有效的 GameState 通过校验', () => {
    const state = createDefaultGameState();
    expect(validateGameState(state)).toBe(true);
  });

  it('null 不通过', () => {
    expect(validateGameState(null)).toBe(false);
  });

  it('undefined 不通过', () => {
    expect(validateGameState(undefined)).toBe(false);
  });

  it('空对象不通过', () => {
    expect(validateGameState({})).toBe(false);
  });

  it('缺少 user 不通过', () => {
    const state = createDefaultGameState();
    const broken = { ...state } as Record<string, unknown>;
    delete broken.user;
    expect(validateGameState(broken)).toBe(false);
  });

  it('缺少 character 不通过', () => {
    const state = createDefaultGameState();
    const broken = { ...state } as Record<string, unknown>;
    delete broken.character;
    expect(validateGameState(broken)).toBe(false);
  });

  it('缺少 economy 不通过', () => {
    const state = createDefaultGameState();
    const broken = { ...state } as Record<string, unknown>;
    delete broken.economy;
    expect(validateGameState(broken)).toBe(false);
  });

  it('chatHistory 不是数组不通过', () => {
    const state = createDefaultGameState();
    const broken = { ...state, chatHistory: 'not-array' };
    expect(validateGameState(broken)).toBe(false);
  });

  it('无效的 currentPhase 不通过', () => {
    const state = createDefaultGameState();
    const broken = {
      ...state,
      character: { ...state.character, currentPhase: 'invalid' },
    };
    expect(validateGameState(broken)).toBe(false);
  });

  it('familiarity 不是数字不通过', () => {
    const state = createDefaultGameState();
    const broken = {
      ...state,
      character: { ...state.character, familiarity: '25' },
    };
    expect(validateGameState(broken)).toBe(false);
  });
});

describe('importGameState - 导入游戏状态', () => {
  it('有效 JSON 导入成功', () => {
    const state = createDefaultGameState();
    state.user.name = '导入测试';
    const json = exportGameState(state);
    const result = importGameState(json);

    expect(result.success).toBe(true);
    expect(result.state).toBeDefined();
    expect(result.state?.user.name).toBe('导入测试');
  });

  it('无效 JSON 导入失败', () => {
    const result = importGameState('not valid json');
    expect(result.success).toBe(false);
    expect(result.error).toContain('无法解析');
  });

  it('空字符串导入失败', () => {
    const result = importGameState('');
    expect(result.success).toBe(false);
  });

  it('数据不完整导入失败', () => {
    const result = importGameState('{"user": {}}');
    expect(result.success).toBe(false);
    expect(result.error).toContain('不完整');
  });

  it('版本不匹配导入失败', () => {
    const state = createDefaultGameState();
    state.meta.version = '99.0.0';
    const json = JSON.stringify(state);
    const result = importGameState(json);

    expect(result.success).toBe(false);
    expect(result.error).toContain('版本不匹配');
  });

  it('导出后再导入，数据一致', () => {
    const original = createDefaultGameState();
    original.user.name = '完整流程测试';
    original.character.familiarity = 42.5;
    original.economy.goldBalance = 100;
    original.chatHistory = [
      {
        id: 'msg-1',
        role: 'user',
        content: '你好',
        timestamp: new Date().toISOString(),
      },
    ];

    const json = exportGameState(original);
    const result = importGameState(json);

    expect(result.success).toBe(true);
    expect(result.state?.user.name).toBe('完整流程测试');
    expect(result.state?.character.familiarity).toBe(42.5);
    expect(result.state?.economy.goldBalance).toBe(100);
    expect(result.state?.chatHistory).toHaveLength(1);
  });
});

describe('generateSaveFileName - 生成存档文件名', () => {
  it('文件名包含 flawed-ai-save 前缀', () => {
    const name = generateSaveFileName();
    expect(name).toMatch(/^flawed-ai-save-/);
  });

  it('文件名以 .json 结尾', () => {
    const name = generateSaveFileName();
    expect(name).toMatch(/\.json$/);
  });

  it('文件名包含时间戳', () => {
    const name = generateSaveFileName();
    // 时间戳格式：YYYY-MM-DDTHH-MM-SS
    expect(name).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}/);
  });
});
