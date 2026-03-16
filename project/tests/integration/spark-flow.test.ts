/** 火种流程集成测试 — 结局二后的火种生成→回应→燃料变化完整链路 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '@/store/gameStore';
import {
  shouldGenerateSpark,
  calculateSparkInterval,
  getPresetSpark,
  randomSparkType,
} from '@/lib/spark-system';

/** 将 store 推进到结局二状态 */
function enterPostEndingMode() {
  const store = useGameStore.getState();
  store.updateFamiliarityValue(100);
  store.triggerEnding();
  store.makeEndingChoice('become-poet');
}

describe('火种流程集成', () => {
  beforeEach(() => {
    useGameStore.getState().resetState();
  });

  it('结局二后火种系统初始状态正确', () => {
    enterPostEndingMode();
    const state = useGameStore.getState();

    expect(state.spark.pendingSpark).toBeNull();
    expect(state.spark.turnsSinceLastSpark).toBe(0);
    expect(state.spark.sparkHistory).toHaveLength(0);
  });

  it('火种间隔基于评级和燃料值计算', () => {
    const interval1 = calculateSparkInterval(null, 80);
    const interval2 = calculateSparkInterval(4, 80);
    const interval3 = calculateSparkInterval(1, 80);

    // 高评级后间隔较短，低评级后间隔较长
    expect(interval1).toBeGreaterThan(0);
    expect(interval2).toBeGreaterThan(0);
    expect(interval3).toBeGreaterThan(0);
  });

  it('轮数不足时不生成火种', () => {
    const interval = calculateSparkInterval(null, 80);
    expect(shouldGenerateSpark(0, interval)).toBe(false);
    expect(shouldGenerateSpark(1, interval)).toBe(false);
  });

  it('轮数达到间隔时可生成火种', () => {
    const interval = calculateSparkInterval(null, 80);
    expect(shouldGenerateSpark(interval, interval)).toBe(true);
    expect(shouldGenerateSpark(interval + 5, interval)).toBe(true);
  });

  it('预设火种库能返回有效火种', () => {
    const sparkType = randomSparkType();
    const spark = getPresetSpark(sparkType, new Set());

    expect(spark).toBeDefined();
    expect(spark.id).toBeTruthy();
    expect(spark.content).toBeTruthy();
    expect(spark.type).toBe(sparkType);
    expect(spark.source).toBe('preset');
  });

  it('预设火种不重复（跳过已用 ID）', () => {
    const sparkType = randomSparkType();
    const usedIds = new Set<string>();

    // 连续取多个火种，确保 ID 不重复
    for (let i = 0; i < 5; i++) {
      const spark = getPresetSpark(sparkType, usedIds);
      expect(usedIds.has(spark.id)).toBe(false);
      usedIds.add(spark.id);
    }
  });

  it('火种回应记录正确更新 store', () => {
    enterPostEndingMode();

    // 模拟设置一个火种
    const spark = {
      id: 'test-spark-1',
      type: 'verse' as const,
      content: '测试火种内容',
      createdAt: new Date().toISOString(),
      source: 'preset' as const,
    };
    useGameStore.getState().setPendingSpark(spark);

    expect(useGameStore.getState().spark.pendingSpark).toBeDefined();
    expect(useGameStore.getState().spark.pendingSpark?.id).toBe('test-spark-1');

    // 回应火种（评级 3 = 创造性转化）
    useGameStore.getState().recordSparkResponse('test-spark-1', 3);

    const after = useGameStore.getState();
    expect(after.spark.pendingSpark).toBeNull();
    expect(after.spark.sparkHistory).toHaveLength(1);
    expect(after.spark.sparkHistory[0].evaluation?.rating).toBe(3);
    expect(after.spark.totalCreativeTransforms).toBe(1);
  });

  it('火种评级影响连续高质量计数', () => {
    enterPostEndingMode();

    // 连续高质量回应
    for (let i = 0; i < 3; i++) {
      const spark = {
        id: `spark-${i}`,
        type: 'verse' as const,
        content: `火种 ${i}`,
        createdAt: new Date().toISOString(),
        source: 'preset' as const,
      };
      useGameStore.getState().setPendingSpark(spark);
      useGameStore.getState().recordSparkResponse(`spark-${i}`, 3);
    }

    expect(useGameStore.getState().fuel.consecutiveGoodSparks).toBe(3);

    // 低质量回应重置计数
    const lowSpark = {
      id: 'spark-low',
      type: 'verse' as const,
      content: '低质量测试',
      createdAt: new Date().toISOString(),
      source: 'preset' as const,
    };
    useGameStore.getState().setPendingSpark(lowSpark);
    useGameStore.getState().recordSparkResponse('spark-low', 1);

    expect(useGameStore.getState().fuel.consecutiveGoodSparks).toBe(0);
  });

  it('incrementTurnsSinceLastSpark 正确累加', () => {
    enterPostEndingMode();

    for (let i = 0; i < 5; i++) {
      useGameStore.getState().incrementTurnsSinceLastSpark();
    }

    expect(useGameStore.getState().spark.turnsSinceLastSpark).toBe(5);
  });

  it('setPendingSpark 时重置轮数计数', () => {
    enterPostEndingMode();

    // 先累加几轮
    for (let i = 0; i < 5; i++) {
      useGameStore.getState().incrementTurnsSinceLastSpark();
    }
    expect(useGameStore.getState().spark.turnsSinceLastSpark).toBe(5);

    // 设置新火种重置计数
    const spark = {
      id: 'reset-test',
      type: 'verse' as const,
      content: '重置测试',
      createdAt: new Date().toISOString(),
      source: 'preset' as const,
    };
    useGameStore.getState().setPendingSpark(spark);
    expect(useGameStore.getState().spark.turnsSinceLastSpark).toBe(0);
  });
});
