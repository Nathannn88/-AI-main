/** 终局系统单元测试 */

import { describe, it, expect } from 'vitest';
import {
  checkEndingTrigger,
  processEndingChoice,
  getPostEndingSystemState,
  getEndingFromSave,
  ENDING_TRIGGER_FAMILIARITY,
} from '@/lib/ending-system';
import { FUEL_CONSTANTS } from '@/types/fuel';
import { createDefaultGameState } from '@/types/game-state';
import type { GameState } from '@/types/game-state';

/** 创建一个熟悉度满值的游戏状态 */
function makeFullFamiliarityState(): GameState {
  const state = createDefaultGameState();
  state.character.familiarity = 100;
  state.economy.goldBalance = 500;
  return state;
}

// ============================================================
// checkEndingTrigger
// ============================================================

describe('checkEndingTrigger - 终局触发条件检查', () => {
  it('熟悉度100%触发', () => {
    expect(checkEndingTrigger(100)).toBe(true);
  });

  it('熟悉度99%不触发', () => {
    expect(checkEndingTrigger(99)).toBe(false);
  });

  it('熟悉度101%也触发（边界保护）', () => {
    expect(checkEndingTrigger(101)).toBe(true);
  });

  it('熟悉度0%不触发', () => {
    expect(checkEndingTrigger(0)).toBe(false);
  });

  it('触发阈值为100', () => {
    expect(ENDING_TRIGGER_FAMILIARITY).toBe(100);
  });
});

// ============================================================
// processEndingChoice - send-away
// ============================================================

describe('processEndingChoice - 结局一（送走诗人）', () => {
  it('标记结局事件为 ending-send-away', () => {
    const state = makeFullFamiliarityState();
    const result = processEndingChoice('send-away', state);
    expect(result.character?.eventsTriggered).toContain('ending-send-away');
  });

  it('保留聊天记录（不清空 chatHistory）', () => {
    const state = makeFullFamiliarityState();
    state.chatHistory = [
      { id: '1', role: 'user', content: '你好', timestamp: new Date().toISOString() },
    ];
    const result = processEndingChoice('send-away', state);
    /* 结局一不返回 chatHistory 字段，意味着不修改它 */
    expect(result.chatHistory).toBeUndefined();
  });

  it('不清除金币余额', () => {
    const state = makeFullFamiliarityState();
    const result = processEndingChoice('send-away', state);
    /* 结局一不返回 economy 字段 */
    expect(result.economy).toBeUndefined();
  });
});

// ============================================================
// processEndingChoice - become-poet
// ============================================================

describe('processEndingChoice - 结局二（成为诗人）', () => {
  it('标记结局事件为 ending-become-poet', () => {
    const state = makeFullFamiliarityState();
    const result = processEndingChoice('become-poet', state);
    expect(result.character?.eventsTriggered).toContain('ending-become-poet');
  });

  it('清除金币余额', () => {
    const state = makeFullFamiliarityState();
    state.economy.goldBalance = 999;
    const result = processEndingChoice('become-poet', state);
    expect(result.economy?.goldBalance).toBe(0);
  });

  it('阶段设置为 bonded', () => {
    const state = makeFullFamiliarityState();
    const result = processEndingChoice('become-poet', state);
    expect(result.character?.currentPhase).toBe('bonded');
  });
});

// ============================================================
// getPostEndingSystemState
// ============================================================

describe('getPostEndingSystemState - 终局后系统状态快照', () => {
  it('结局一移除对话、熟悉度、金币、送礼、火种系统', () => {
    const snapshot = getPostEndingSystemState('send-away');
    expect(snapshot.systemsRemoved).toContain('对话系统');
    expect(snapshot.systemsRemoved).toContain('熟悉度系统');
    expect(snapshot.systemsRemoved).toContain('金币系统');
  });

  it('结局一激活永久结局屏和回声消息系统', () => {
    const snapshot = getPostEndingSystemState('send-away');
    expect(snapshot.systemsActivated).toContain('永久结局屏');
    expect(snapshot.systemsActivated).toContain('回声消息系统');
  });

  it('结局二初始化燃料为80', () => {
    const snapshot = getPostEndingSystemState('become-poet');
    expect(snapshot.fuelInitial).toBe(FUEL_CONSTANTS.INITIAL);
    expect(snapshot.fuelInitial).toBe(80);
  });

  it('结局二激活航程燃料、火种、失速、灯塔模式', () => {
    const snapshot = getPostEndingSystemState('become-poet');
    expect(snapshot.systemsActivated).toContain('航程燃料系统');
    expect(snapshot.systemsActivated).toContain('火种系统');
    expect(snapshot.systemsActivated).toContain('失速系统');
    expect(snapshot.systemsActivated).toContain('灯塔模式');
  });

  it('未选择时返回空快照', () => {
    const snapshot = getPostEndingSystemState('none');
    expect(snapshot.systemsRemoved).toEqual([]);
    expect(snapshot.systemsActivated).toEqual([]);
    expect(snapshot.fuelInitial).toBe(0);
  });
});

// ============================================================
// getEndingFromSave
// ============================================================

describe('getEndingFromSave - 从存档读取结局状态', () => {
  it('正确读取 send-away 结局', () => {
    const state = createDefaultGameState();
    state.character.eventsTriggered = ['ending-send-away'];
    expect(getEndingFromSave(state)).toBe('send-away');
  });

  it('正确读取 become-poet 结局', () => {
    const state = createDefaultGameState();
    state.character.eventsTriggered = ['ending-become-poet'];
    expect(getEndingFromSave(state)).toBe('become-poet');
  });

  it('无结局返回 none', () => {
    const state = createDefaultGameState();
    expect(getEndingFromSave(state)).toBe('none');
  });

  it('包含其他事件但无结局事件返回 none', () => {
    const state = createDefaultGameState();
    state.character.eventsTriggered = ['event-20', 'event-50'];
    expect(getEndingFromSave(state)).toBe('none');
  });
});
