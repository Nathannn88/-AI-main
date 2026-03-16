/** 火种系统类型定义 — 结局二后企鹅吐出的审美碎片 */

import type { SparkRating } from './fuel';

/** 火种类型：诗句 / 画面描述 / 抽象情绪 / 不完整隐喻 */
export type SparkType = 'verse' | 'scene' | 'emotion' | 'incomplete-metaphor';

/** 火种来源：GLM-5 生成 / 预设库抽取 */
export type SparkSource = 'generated' | 'preset';

/** 单个火种 */
export interface Spark {
  /** 火种唯一标识 */
  id: string;
  /** 火种类型 */
  type: SparkType;
  /** 火种内容文本 */
  content: string;
  /** 生成时间（ISO 字符串） */
  createdAt: string;
  /** 来源 */
  source: SparkSource;
}

/** 火种回应评估结果 */
export interface SparkEvaluation {
  /** 对应的火种 ID */
  sparkId: string;
  /** 质量评级 1-4 */
  rating: SparkRating;
  /** 用户回应的原文 */
  userResponse: string;
  /** 评估时间（ISO 字符串） */
  evaluatedAt: string;
}

/** 火种记录（含火种本体和回应结果） */
export interface SparkRecord {
  /** 火种本体 */
  spark: Spark;
  /** 回应评估，null 表示被忽略 */
  evaluation: SparkEvaluation | null;
  /** 是否被忽略 */
  ignored: boolean;
}

/** 火种状态 */
export interface SparkState {
  /** 当前待回应的火种 */
  pendingSpark: Spark | null;
  /** 历史火种记录 */
  sparkHistory: SparkRecord[];
  /** 上次火种出现时间（ISO 字符串） */
  lastSparkTime: string;
  /** 累计创造性转化次数（评级 3 及以上） */
  totalCreativeTransforms: number;
  /** 自上次回声以来的火种数量（灯塔模式用） */
  sparksSinceLastEcho: number;
  /** 自上次火种以来的对话轮数 */
  turnsSinceLastSpark: number;
}

/** 火种系统常量 — 所有数值与项目圣经保持一致 */
export const SPARK_CONSTANTS = {
  /** 基础间隔轮数 */
  BASE_INTERVAL: 5,
  /** 火种出现后的回应窗口（消息条数） */
  RESPONSE_WINDOW: 2,
  /** 回应超时时间（毫秒）：10 分钟 */
  RESPONSE_TIMEOUT_MS: 10 * 60 * 1000,
  /** 最小间隔轮数 */
  MIN_INTERVAL: 2,
  /** 最大间隔轮数 */
  MAX_INTERVAL: 10,
  /** 超过此轮数强制生成火种 */
  FORCE_GENERATE_INTERVAL: 10,
  /** 间隔调节规则 */
  INTERVAL_ADJUSTMENTS: {
    /** 上次评级 4（卓越）：间隔 -2 */
    EXCEPTIONAL_RATING: -2,
    /** 上次评级 3（创造性）：间隔 -1 */
    CREATIVE_RATING: -1,
    /** 上次评级 1（复述）：间隔 +2 */
    PARROT_RATING: 2,
    /** 上次被忽略：间隔 +3 */
    IGNORED: 3,
    /** 燃料低于 30：额外 -1（救命绳） */
    LOW_FUEL_BONUS: -1,
    /** 燃料高于 90：额外 +2（信任用户） */
    HIGH_FUEL_PENALTY: 2,
  },
  /** 生成比例：GLM-5 生成 vs 预设库抽取 */
  GENERATION: {
    /** GLM-5 上下文生成占比 */
    GLM_RATIO: 0.7,
    /** 预设库抽取占比 */
    PRESET_RATIO: 0.3,
    /** 每生成几个 GLM 火种后从预设库抽取 */
    PRESET_CYCLE: 4,
    /** 每类预设数量 */
    PRESETS_PER_TYPE: 30,
  },
} as const;
