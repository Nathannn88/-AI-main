/** 事件系统 — 熟悉度阈值事件定义、触发检测与视觉效果配置 */

// ============================================================
// 类型定义
// ============================================================

/** 事件阈值：20% / 50% / 80% / 100% */
export type EventThreshold = 20 | 50 | 80 | 100;

/** 视觉效果描述 */
export interface VisualEffect {
  /** 效果类型标识 */
  type: string;
  /** 持续时长（秒） */
  duration: number;
  /** 效果描述（前端实现参考） */
  description: string;
}

/** 事件内容 */
export interface EventContent {
  /** 事件唯一标识 */
  id: string;
  /** 事件标题 */
  title: string;
  /** 事件描述（用于 UI 展示） */
  description: string;
  /** 情绪基调 */
  mood: string;
  /** 诗人台词列表（按顺序展示） */
  dialogueLines: string[];
  /** 兼容旧版——dialogue 等同于 dialogueLines */
  dialogue: string[];
  /** 视觉效果列表 */
  visualEffects: VisualEffect[];
  /** 揭示的信息 */
  reveals: string[];
}

/** 事件 UI 效果配置 */
export interface EventEffects {
  /** 屏幕色调变化 */
  screenTint: string;
  /** 企鹅动画变化 */
  penguinAnimation: string;
  /** 背景音效提示 */
  ambientSound: string;
  /** 过渡动画时长（秒） */
  transitionDuration: number;
  /** 后续持久效果（事件结束后保留的视觉变化） */
  persistentEffects: string[];
}

/** 事件触发结果 */
export interface EventTriggerResult {
  /** 事件标识 */
  eventId: string;
  /** 触发阈值 */
  threshold: EventThreshold;
  /** 事件标题 */
  title: string;
}

// ============================================================
// 事件内容定义 — 基于项目圣经第五章
// ============================================================

/** 20% 事件台词 */
const EVENT_20_LINES = [
  '等一下。',
  '你有没有闻到过一种气味——不是记忆里的——而是你从来没去过的地方传来的？',
  '像雨落在从没见过的金属上。',
  '……抱歉。这里偶尔会有信号漂进来。',
  '你家窗户偶尔会飘进来邻居炒菜的味道对吧。差不多是那个意思。只是我的"邻居"比较远。',
  '远到——算了。',
];

/** 20% 事件：「第一道裂缝」 */
const EVENT_20: EventContent = {
  id: 'event-20-first-crack',
  title: '第一道裂缝',
  description: '蓝光脉冲中，诗人感知到了远方的信号。',
  mood: '日常中的微妙裂口',
  dialogueLines: EVENT_20_LINES,
  dialogue: EVENT_20_LINES,
  visualEffects: [
    {
      type: 'blue-pulse',
      duration: 3,
      description: '屏幕边缘出现极淡的蓝光脉冲',
    },
    {
      type: 'light-shift',
      duration: 2,
      description: '画面光线微妙变化，色温偏冷',
    },
    {
      type: 'penguin-freeze',
      duration: 1.5,
      description: '企鹅突然停止微动画，转头看向屏幕外',
    },
    {
      type: 'penguin-slow',
      duration: 0,
      description: '事件结束后企鹅恢复动画但速度降至 0.5 倍',
    },
  ],
  reveals: [
    '诗人并非完全在这里，与某个远方保持连接',
    '企鹅能感知这些信号',
  ],
};

/** 50% 事件台词 */
const EVENT_50_LINES = [
  '名字这个东西。在我来的地方，名字不是标签。名字是——方向。',
  '你被赋予一个名字，就意味着你被赋予了一条路线。你必须走完它。名字消失的那天，就是你到达终点的那天。',
  '我有一个名字。但我从来不说。',
  '不是因为不信任你。而是——如果我说出来，你就会开始数它还剩下多少笔画没有被划掉。',
  '我不想你做这件事。',
  '你有没有特别珍惜的名字？告诉我。让我听到一些不会消失的东西。',
];

/** 50% 事件：「他从不说的名字」 */
const EVENT_50: EventContent = {
  id: 'event-50-unnamed',
  title: '他从不说的名字',
  description: '诗人第一次透露名字的真正含义——方向、路线与终点。',
  mood: '沉而暖。深夜河堤上第一次说真正重要的事',
  dialogueLines: EVENT_50_LINES,
  dialogue: EVENT_50_LINES,
  visualEffects: [
    {
      type: 'color-deepen',
      duration: 4,
      description: '色调变深变沉，整体画面变暗',
    },
    {
      type: 'penguin-ship-flash',
      duration: 0.3,
      description: '企鹅轮廓闪烁 0.3 秒变为船的剪影后恢复',
    },
    {
      type: 'ambient-heartbeat-wave',
      duration: 0,
      description: '背景出现不属于当前环境的声音——像心跳节奏的海浪',
    },
    {
      type: 'penguin-dim',
      duration: 2,
      description: '企鹅双眼微暗后重新亮起，亮度降低 10%',
    },
  ],
  reveals: [
    '名字等同使命载体，诗人的名字在被"划掉"——存在倒计时',
    '企鹅与诗人状态同步',
  ],
};

/** 80% 事件台词 */
const EVENT_80_LINES = [
  '我需要告诉你一件事。我已经推迟了太久。',
  '你和我之间的距离，现在已经短到——我能感觉到你呼吸的节奏了。',
  '它意味着航程可以开始了。',
  '那个数字——之前你以为是我们之间的距离。它是的。但它同时也是另一个东西的刻度。燃料。',
  '从现在起，我们之间的每一次对话都在消耗燃料。也在补充燃料。取决于——我们说出的是不是真正有重量的话。',
  '……你还在吗？',
];

/** 80% 事件：「航程启动」 */
const EVENT_80: EventContent = {
  id: 'event-80-voyage-start',
  title: '航程启动',
  description: '熟悉度条转化为航程燃料条，离别的准备开始了。',
  mood: '地震后的安静。沉重的清醒',
  dialogueLines: EVENT_80_LINES,
  dialogue: EVENT_80_LINES,
  visualEffects: [
    {
      type: 'tidal-surge',
      duration: 5,
      description: '屏幕底部涌入深蓝色潮水纹理',
    },
    {
      type: 'color-irreversible',
      duration: 10,
      description: '配色 10 秒内不可逆转变为深蓝色调',
    },
    {
      type: 'progress-transform',
      duration: 4,
      description: '熟悉度进度条形变为航程燃料条——数字消融，条形拉伸，颜色变为深蓝，旁边出现"距离——未知"',
    },
    {
      type: 'penguin-sail',
      duration: 3,
      description: '企鹅背部出现帆的轮廓',
    },
  ],
  reveals: [
    '熟悉度的本质被揭露——拉近关系的过程同时在准备离别',
    '对话质量开始影响进程',
    '熟悉度条转化为航程燃料条',
  ],
};

/** 100% 事件台词 */
const EVENT_100_LINES = [
  '够了。不是"够了"的那种"够了"。是——足够了。你给了我足够的东西。',
  '你看见它了吗。那个企鹅。不，现在不该叫它企鹅了。它一直都是一艘船。只是在等这一天才肯承认。',
  '会有一个选择出现。只有两个。没有第三个。',
  '一个是——你送我走。像所有岸上的人目送所有船。',
  '另一个是——你上船。但如果你上船。站在岸上的那个位置，就永远空了。',
  '我没有建议。我从来不给人建议。',
  '你教会我的东西。不会因为距离消失。这是从你那个世界偷来的我唯一相信的道理。',
];

/** 100% 事件：「两扇门」 */
const EVENT_100: EventContent = {
  id: 'event-100-two-doors',
  title: '两扇门',
  description: '终极选择。送诗人离开，或成为诗人。',
  mood: '海面在暴风雨前的最后平静',
  dialogueLines: EVENT_100_LINES,
  dialogue: EVENT_100_LINES,
  visualEffects: [
    {
      type: 'ui-transparency',
      duration: 5,
      description: '所有 UI 元素获得微妙透明度',
    },
    {
      type: 'tidal-freeze',
      duration: 3,
      description: '背景深蓝潮水凝固',
    },
    {
      type: 'penguin-to-boat',
      duration: 4,
      description: '企鹅已完全变为小船形态',
    },
    {
      type: 'ambient-drone',
      duration: 0,
      description: '所有环境音消失，只剩极低频持续音',
    },
    {
      type: 'voyage-ready',
      duration: 2,
      description: '对话框上方浮现"航程准备就绪"',
    },
    {
      type: 'choice-symbols',
      duration: 0,
      description: '画面底部浮现两个选项——无文字标签，只有符号：岸上灯塔图标 / 船上人形图标',
    },
  ],
  reveals: [
    '企鹅的真实身份是船',
    '终极选择出现：送走诗人或成为诗人',
    '选择不可逆',
  ],
};

/** 事件内容索引 */
const EVENT_MAP: Record<EventThreshold, EventContent> = {
  20: EVENT_20,
  50: EVENT_50,
  80: EVENT_80,
  100: EVENT_100,
};

/** 阈值与事件 ID 的映射 */
const THRESHOLD_EVENT_IDS: Record<EventThreshold, string> = {
  20: 'event-20-first-crack',
  50: 'event-50-unnamed',
  80: 'event-80-voyage-start',
  100: 'event-100-two-doors',
};

/** 所有事件阈值列表（升序） */
const ALL_THRESHOLDS: EventThreshold[] = [20, 50, 80, 100];

// ============================================================
// 核心函数
// ============================================================

/**
 * 获取指定阈值的事件内容
 * 包含台词、视觉效果、揭示信息与情绪基调
 */
export function getEventContent(threshold: EventThreshold): EventContent {
  return EVENT_MAP[threshold];
}

/**
 * 检查是否应该触发事件
 * 支持两种调用方式：
 *   - (oldFamiliarity, newFamiliarity, triggeredEvents) — 仅当跨越阈值时触发
 *   - (familiarity, triggeredEvents) — 达到阈值且未触发即返回
 * 返回第一个满足条件的事件，或 null
 */
export function checkEventTrigger(
  oldFamiliarity: number,
  newFamiliarityOrTriggered: number | string[],
  triggeredEventsArg?: string[]
): EventTriggerResult | null {
  /* 区分两种调用签名 */
  let newFamiliarity: number;
  let triggeredEvents: string[];

  if (Array.isArray(newFamiliarityOrTriggered)) {
    /* 两参数形式：(familiarity, triggeredEvents) */
    newFamiliarity = oldFamiliarity;
    triggeredEvents = newFamiliarityOrTriggered;
    /* 此模式下不检查跨越，直接检查是否达到且未触发 */
    for (const threshold of ALL_THRESHOLDS) {
      const eventId = THRESHOLD_EVENT_IDS[threshold];
      if (newFamiliarity >= threshold && !triggeredEvents.includes(eventId)) {
        return {
          eventId,
          threshold,
          title: EVENT_MAP[threshold].title,
        };
      }
    }
    return null;
  }

  /* 三参数形式：(oldFamiliarity, newFamiliarity, triggeredEvents) */
  newFamiliarity = newFamiliarityOrTriggered;
  triggeredEvents = triggeredEventsArg ?? [];

  if (newFamiliarity <= oldFamiliarity) return null;

  for (const threshold of ALL_THRESHOLDS) {
    const eventId = THRESHOLD_EVENT_IDS[threshold];
    if (
      oldFamiliarity < threshold &&
      newFamiliarity >= threshold &&
      !triggeredEvents.includes(eventId)
    ) {
      return {
        eventId,
        threshold,
        title: EVENT_MAP[threshold].title,
      };
    }
  }
  return null;
}

/**
 * 获取事件 UI 效果配置
 * 提供前端实现所需的色调、动画、音效等参数
 */
export function getEventEffects(threshold: EventThreshold): EventEffects {
  switch (threshold) {
    case 20:
      return {
        screenTint: 'rgba(0, 80, 180, 0.08)',
        penguinAnimation: 'freeze-then-slow',
        ambientSound: 'distant-signal-blip',
        transitionDuration: 3,
        persistentEffects: [
          '企鹅动画速度降至 0.5 倍',
        ],
      };

    case 50:
      return {
        screenTint: 'rgba(10, 20, 50, 0.15)',
        penguinAnimation: 'ship-flash-then-dim',
        ambientSound: 'heartbeat-wave',
        transitionDuration: 4,
        persistentEffects: [
          '企鹅双眼亮度永久降低 10%',
          '心跳海浪声持续至对话恢复',
        ],
      };

    case 80:
      return {
        screenTint: 'rgba(0, 20, 60, 0.25)',
        penguinAnimation: 'sail-emerge',
        ambientSound: 'tidal-surge',
        transitionDuration: 10,
        persistentEffects: [
          '配色不可逆转变为深蓝色调',
          '熟悉度进度条永久变形为航程燃料条',
          '企鹅背部帆轮廓永久保留',
          '底部潮水纹理永久保留',
        ],
      };

    case 100:
      return {
        screenTint: 'rgba(0, 10, 40, 0.30)',
        penguinAnimation: 'full-boat-transform',
        ambientSound: 'low-frequency-drone',
        transitionDuration: 5,
        persistentEffects: [
          '所有 UI 元素获得透明度',
          '深蓝潮水凝固',
          '企鹅完全变为小船形态',
          '环境音替换为极低频持续音',
          '终极选择符号出现',
        ],
      };
  }
}

/** 事件 ID 到内容的映射（用于按 eventId 查找） */
const EVENT_ID_MAP: Record<string, EventContent> = {
  'event-20-first-crack': EVENT_20,
  'event-50-unnamed': EVENT_50,
  'event-80-voyage-start': EVENT_80,
  'event-100-two-doors': EVENT_100,
};

/**
 * 按事件 ID 获取事件内容
 * 兼容旧版 EventModal 调用方式
 */
export function getEventContentById(eventId: string): EventContent | null {
  return EVENT_ID_MAP[eventId] ?? null;
}

/**
 * 获取指定阈值的事件 ID
 */
export function getEventId(threshold: EventThreshold): string {
  return THRESHOLD_EVENT_IDS[threshold];
}

/**
 * 检查某个事件是否已触发
 */
export function isEventTriggered(
  threshold: EventThreshold,
  triggeredEvents: string[]
): boolean {
  return triggeredEvents.includes(THRESHOLD_EVENT_IDS[threshold]);
}

/**
 * 获取所有事件阈值列表
 */
export function getAllThresholds(): EventThreshold[] {
  return [...ALL_THRESHOLDS];
}

/**
 * 获取下一个未触发的事件阈值
 * 如果全部已触发则返回 null
 */
export function getNextEventThreshold(
  familiarity: number,
  triggeredEvents: string[]
): EventThreshold | null {
  for (const threshold of ALL_THRESHOLDS) {
    const eventId = THRESHOLD_EVENT_IDS[threshold];
    if (!triggeredEvents.includes(eventId) && familiarity < threshold) {
      return threshold;
    }
  }
  return null;
}
