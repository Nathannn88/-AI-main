/** 火种 Hook — 封装火种生成判定、回应处理与 prompt 构建 */

'use client';

import { useCallback, useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import type { Spark } from '@/types/spark';
import type { SparkRating } from '@/types/fuel';
import {
  calculateSparkInterval,
  shouldGenerateSpark,
  randomSparkType,
  getPresetSpark,
  decideSparkSource,
  buildSparkEvaluationPrompt,
  buildSparkGenerationPrompt,
  type Spark as LibSpark,
} from '@/lib/spark-system';

/**
 * 将 lib/spark-system 的 Spark 类型适配为 types/spark 的 Spark 类型
 * 两者的 SparkType 枚举值不同（lib 用 poem/visual，types 用 verse/scene）
 */
function adaptLibSpark(libSpark: LibSpark): Spark {
  const typeMap: Record<string, Spark['type']> = {
    poem: 'verse',
    visual: 'scene',
    emotion: 'emotion',
    metaphor: 'incomplete-metaphor',
  };

  return {
    id: libSpark.id,
    type: typeMap[libSpark.type] ?? 'verse',
    content: libSpark.content,
    createdAt: libSpark.createdAt,
    source: libSpark.source,
  };
}

interface UseSparkReturn {
  /** 是否有待回应的火种 */
  hasPendingSpark: boolean;
  /** 当前待回应的火种 */
  pendingSpark: Spark | null;
  /** 当前计算的火种出现间隔（轮数） */
  sparkInterval: number;
  /** 检查是否应生成火种，如果是则设置 pendingSpark（预设库源） */
  checkAndGenerate: () => Spark | null;
  /** 标记用户回应了火种，记录评级 */
  respondToSpark: (sparkId: string, rating: SparkRating) => void;
  /** 标记火种被忽略 */
  markSparkIgnored: () => void;
  /** 获取评估 prompt（供 API 调用使用） */
  getEvaluationPrompt: (sparkContent: string, userResponse: string) => string;
  /** 获取生成 prompt（供 API 调用使用） */
  getGenerationPrompt: (contextSummary: string) => { prompt: string; sparkType: string };
}

/** 火种系统 Hook */
export function useSpark(): UseSparkReturn {
  const sparkState = useGameStore((s) => s.spark);
  const fuel = useGameStore((s) => s.fuel);
  const setPendingSpark = useGameStore((s) => s.setPendingSpark);
  const recordSparkResponse = useGameStore((s) => s.recordSparkResponse);
  const incrementTurnsSinceLastSpark = useGameStore((s) => s.incrementTurnsSinceLastSpark);
  const incrementSparksSinceLastEcho = useGameStore((s) => s.incrementSparksSinceLastEcho);

  const hasPendingSpark = sparkState.pendingSpark !== null;
  const pendingSpark = sparkState.pendingSpark;

  /** 计算当前火种间隔 */
  const sparkInterval = useMemo(() => {
    // 从历史记录中获取最近一次评级
    const history = sparkState.sparkHistory;
    const lastRecord = history.length > 0 ? history[history.length - 1] : null;
    const lastRating: SparkRating | null = lastRecord?.evaluation?.rating ?? null;

    return calculateSparkInterval(lastRating, fuel.currentFuel);
  }, [sparkState.sparkHistory, fuel.currentFuel]);

  /** 检查是否应生成火种，并从预设库生成（GLM 生成需在组件层调用 API） */
  const checkAndGenerate = useCallback((): Spark | null => {
    // 已有待回应火种时不生成新的
    if (sparkState.pendingSpark) return null;

    const shouldGenerate = shouldGenerateSpark(
      sparkState.turnsSinceLastSpark,
      sparkInterval
    );

    if (!shouldGenerate) return null;

    // 判断来源
    const source = decideSparkSource(sparkState.sparkHistory.length);

    if (source === 'preset') {
      // 预设库生成可直接完成，需将 lib 类型适配为 types 类型
      const sparkType = randomSparkType();
      const usedIds = new Set(sparkState.sparkHistory.map((r) => r.spark.id));
      const libSpark = getPresetSpark(sparkType, usedIds);
      const spark = adaptLibSpark(libSpark);
      setPendingSpark(spark);
      incrementSparksSinceLastEcho();
      return spark;
    }

    // GLM 生成需要外部调用 API，返回 null 表示需要组件层处理
    // 组件层应调用 getGenerationPrompt 获取 prompt，调用 API 后手动 setPendingSpark
    return null;
  }, [sparkState, sparkInterval, setPendingSpark, incrementSparksSinceLastEcho]);

  /** 标记用户回应了火种 */
  const respondToSpark = useCallback((sparkId: string, rating: SparkRating) => {
    recordSparkResponse(sparkId, rating);
    incrementSparksSinceLastEcho();
  }, [recordSparkResponse, incrementSparksSinceLastEcho]);

  /** 标记火种被忽略 */
  const markSparkIgnored = useCallback(() => {
    const pending = sparkState.pendingSpark;
    if (!pending) return;

    // 记录为被忽略的火种
    const store = useGameStore.getState();
    const now = new Date().toISOString();

    // 将被忽略的火种加入历史
    useGameStore.setState({
      spark: {
        ...store.spark,
        pendingSpark: null,
        sparkHistory: [
          ...store.spark.sparkHistory,
          {
            spark: pending,
            evaluation: null,
            ignored: true,
          },
        ],
        lastSparkTime: now,
      },
    });

    incrementSparksSinceLastEcho();
  }, [sparkState.pendingSpark, incrementSparksSinceLastEcho]);

  /** 获取评估 prompt */
  const getEvaluationPrompt = useCallback((sparkContent: string, userResponse: string): string => {
    return buildSparkEvaluationPrompt(sparkContent, userResponse);
  }, []);

  /** 获取生成 prompt，返回 prompt 文本和火种类型 */
  const getGenerationPrompt = useCallback((contextSummary: string): { prompt: string; sparkType: string } => {
    const sparkType = randomSparkType();
    const prompt = buildSparkGenerationPrompt(contextSummary, sparkType);
    return { prompt, sparkType };
  }, []);

  return {
    hasPendingSpark,
    pendingSpark,
    sparkInterval,
    checkAndGenerate,
    respondToSpark,
    markSparkIgnored,
    getEvaluationPrompt,
    getGenerationPrompt,
  };
}
