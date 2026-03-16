/** 航程燃料系统类型定义 — 结局二后的核心进度机制 */

/** 失速等级 */
export type StallLevel = 'none' | 'warning' | 'stall' | 'deep_stall';

/** 燃料阶段：成长期 / 航程期 / 失速期 / 灯塔模式 */
export type FuelPhase = 'growing' | 'voyage' | 'stall' | 'lighthouse';

/** 燃料状态 */
export interface FuelState {
  /** 当前燃料值，范围 0-100 */
  currentFuel: number;
  /** 当前燃料阶段 */
  fuelPhase: FuelPhase;
  /** 上次更新时间（ISO 字符串） */
  lastUpdateTime: string;
  /** 失速等级 */
  stallLevel: StallLevel;
  /** 失速持续轮数 */
  turnsInStall: number;
  /** 连续高质量火种回应次数（用于恢复判定） */
  consecutiveGoodSparks: number;
}

/** 火种回应质量评级：1=复述 2=常规转化 3=创造性转化 4=卓越转化 */
export type SparkRating = 1 | 2 | 3 | 4;

/** 燃料系统常量 — 所有数值与项目圣经保持一致 */
export const FUEL_CONSTANTS = {
  /** 初始燃料值（结局二触发瞬间） */
  INITIAL: 80,
  /** 燃料最小值 */
  MIN: 0,
  /** 燃料最大值 */
  MAX: 100,
  /** 各行为对应的燃料变化量 */
  CHANGES: {
    /** 忽略火种（2条非回应消息后）：-8 */
    IGNORE_SPARK: -8,
    /** 复述火种（质量评级 1）：-2 */
    PARROT_SPARK: -2,
    /** 常规转化（质量评级 2）：+3 */
    NORMAL_TRANSFORM: 3,
    /** 创造性转化（质量评级 3）：+8 */
    CREATIVE_TRANSFORM: 8,
    /** 卓越转化（质量评级 4）：+15 */
    EXCEPTIONAL_TRANSFORM: 15,
    /** 普通对话（非火种相关）每轮：-0.5 */
    IDLE_CHAT_PER_TURN: -0.5,
    /** 长时间无活动每天衰减：-3 */
    INACTIVITY_PER_DAY: -3,
    /** 不活动衰减上限：-15（超过5天停止衰减） */
    INACTIVITY_MAX_LOSS: -15,
  },
  /** 失速阈值 */
  STALL: {
    /** 预警阈值：燃料低于30 */
    WARNING_THRESHOLD: 30,
    /** 失速阈值：燃料低于15 */
    STALL_THRESHOLD: 15,
    /** 深度失速：失速持续20轮未恢复 */
    DEEP_STALL_TURNS: 20,
  },
  /** 灯塔模式触发条件 */
  LIGHTHOUSE: {
    /** 燃料持续高于80% */
    FUEL_THRESHOLD: 80,
    /** 连续30轮对话未跌落 */
    CONSECUTIVE_TURNS: 30,
    /** 累计50次创造性转化 */
    CREATIVE_TRANSFORMS_TOTAL: 50,
  },
  /** 80%-100% 过渡期特殊规则 */
  PREVIEW: {
    /** 预览火种出现间隔：每15轮1次 */
    SPARK_INTERVAL: 15,
    /** 回应火种额外加成：+2% 熟悉度 */
    SPARK_FAMILIARITY_BONUS: 2,
    /** 预览期不惩罚忽略 */
    PUNISH_IGNORE: false,
  },
} as const;
