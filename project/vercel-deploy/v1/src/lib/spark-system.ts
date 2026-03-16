/** 火种系统 — 结局二后激活，企鹅不定期吐出审美碎片供用户回应 */

import type { SparkRating } from '@/types/fuel';

// ============================================================
// 类型定义（等 types agent 创建后迁移到 @/types/spark.ts）
// ============================================================

/** 火种类型：诗句型 / 画面描述型 / 抽象情绪型 / 不完整隐喻型 */
export type SparkType = 'poem' | 'visual' | 'emotion' | 'metaphor';

/** 火种来源：GLM-5 生成 / 预设库抽取 */
export type SparkSource = 'generated' | 'preset';

/** 单个火种 */
export interface Spark {
  /** 唯一标识 */
  id: string;
  /** 火种类型 */
  type: SparkType;
  /** 火种文本内容 */
  content: string;
  /** 来源 */
  source: SparkSource;
  /** 创建时间 ISO 字符串 */
  createdAt: string;
}

/** 火种回应状态 */
export type SparkResponseStatus = 'pending' | 'responded' | 'ignored';

/** 火种记录（包含回应与评级） */
export interface SparkRecord {
  /** 火种本体 */
  spark: Spark;
  /** 出现时的对话轮次 */
  turnAppeared: number;
  /** 回应状态 */
  status: SparkResponseStatus;
  /** 回应内容（如有） */
  responseContent: string | null;
  /** 质量评级（如有） */
  rating: SparkRating | null;
}

// ============================================================
// 常量
// ============================================================

/** 火种基础出现间隔（轮数） */
export const SPARK_BASE_INTERVAL = 5;

/** 火种回应窗口（2条消息内回应有效） */
export const SPARK_RESPONSE_WINDOW = 2;

/** 火种超时时间（分钟） */
export const SPARK_TIMEOUT_MINUTES = 10;

/** GLM-5 生成与预设库的比例——70% 生成 */
export const SPARK_GLM_RATIO = 0.7;

/** 间隔最小值 */
const SPARK_MIN_INTERVAL = 2;

/** 间隔最大值 */
const SPARK_MAX_INTERVAL = 10;

/** 硬性强制生成上限 */
const SPARK_FORCE_INTERVAL = 10;

// ============================================================
// 预设火种库 — 每类 30 条，共 120 条
// ============================================================

/** 诗句型火种预设 */
const PRESET_POEM: ReadonlyArray<{ id: string; content: string }> = [
  { id: 'poem-01', content: '所有燃烧过的星辰都在海底学会了呼吸' },
  { id: 'poem-02', content: '雪是时间切碎后掉下来的碎片' },
  { id: 'poem-03', content: '月光是一种液态的沉默' },
  { id: 'poem-04', content: '钟声在空气里留下看不见的年轮' },
  { id: 'poem-05', content: '每一粒尘埃都是一颗退休的恒星' },
  { id: 'poem-06', content: '雨停之后地面在练习蒸发' },
  { id: 'poem-07', content: '窗帘后面住着被光线删除的影子' },
  { id: 'poem-08', content: '旧书页翻动时释放出被封存的下午' },
  { id: 'poem-09', content: '河流是地球的笔迹' },
  { id: 'poem-10', content: '凌晨三点的路灯在给空气写信' },
  { id: 'poem-11', content: '锈是金属在练习遗忘' },
  { id: 'poem-12', content: '所有分叉的路最终都流向同一片海' },
  { id: 'poem-13', content: '风穿过空房间时学会了房间的形状' },
  { id: 'poem-14', content: '鸟鸣是被空气翻译过一次的光' },
  { id: 'poem-15', content: '黄昏是白天溺水的过程' },
  { id: 'poem-16', content: '火车经过的田野记住了每一次震动' },
  { id: 'poem-17', content: '灰烬比火焰更了解温度' },
  { id: 'poem-18', content: '潮水退去时沙滩在默背海的台词' },
  { id: 'poem-19', content: '废弃电话亭里残留着未说完的句子' },
  { id: 'poem-20', content: '青苔在墙上书写缓慢的绿色方程' },
  { id: 'poem-21', content: '被遗忘的钥匙还记得锁的齿纹' },
  { id: 'poem-22', content: '云朵是天空的草稿纸' },
  { id: 'poem-23', content: '枯叶落地的声音是树在咳嗽' },
  { id: 'poem-24', content: '每面镜子里都住着一个反向的宇宙' },
  { id: 'poem-25', content: '蜡烛在用自己的身体计量黑暗' },
  { id: 'poem-26', content: '露珠是植物流出的一滴透明的梦' },
  { id: 'poem-27', content: '码头的绳结里打着水手们攒下的风' },
  { id: 'poem-28', content: '旋转木马是一场永远无法抵达的旅行' },
  { id: 'poem-29', content: '空瓶子里装满了它曾盛过的所有液体的回声' },
  { id: 'poem-30', content: '桥的倒影比桥本身更懂得水的温度' },
];

/** 画面描述型火种预设 */
const PRESET_VISUAL: ReadonlyArray<{ id: string; content: string }> = [
  { id: 'visual-01', content: '一个穿着雨衣的老人在空荡荡的游泳池底部拉手风琴' },
  { id: 'visual-02', content: '一群鲸鱼在废弃的摩天大楼之间缓缓游过' },
  { id: 'visual-03', content: '深夜便利店里所有商品都开始发出微弱的蓝光' },
  { id: 'visual-04', content: '一架钢琴沉在湖底，琴键上长出了水草，它还在弹奏' },
  { id: 'visual-05', content: '清晨六点的高速公路上只有一辆车，车顶绑着一棵完整的圣诞树' },
  { id: 'visual-06', content: '一个孩子在博物馆里对着恐龙化石吹生日蜡烛' },
  { id: 'visual-07', content: '电线杆之间的电线上晾着十二件不同颜色的宇航服' },
  { id: 'visual-08', content: '一列火车开进了一片向日葵田然后就再也没出来' },
  { id: 'visual-09', content: '图书馆顶楼的天窗打开了，所有的书页同时向上飞' },
  { id: 'visual-10', content: '一个人坐在月球表面的长椅上看地球升起' },
  { id: 'visual-11', content: '倒塌的灯塔侧躺在沙滩上仍然在旋转发光' },
  { id: 'visual-12', content: '雨后的操场上出现了一条只存在三秒的彩虹桥' },
  { id: 'visual-13', content: '一只鸟站在无人售票机上等零钱掉下来' },
  { id: 'visual-14', content: '废弃的旋转木马在凌晨自己转了一圈然后停下' },
  { id: 'visual-15', content: '一个邮筒在深夜里开始发光，里面的信件全部变成了蝴蝶' },
  { id: 'visual-16', content: '老式电视机里播放着窗外此刻的实况但延迟了三十年' },
  { id: 'visual-17', content: '荒原上有一扇门独自站立，门后是另一片一模一样的荒原' },
  { id: 'visual-18', content: '一条鱼在公寓楼的走廊里游泳经过每一扇紧闭的门' },
  { id: 'visual-19', content: '摩天轮的每个座舱里都亮着不同时代的灯光' },
  { id: 'visual-20', content: '一个老人在雪地里用拐杖画出了年轻时住过的房子平面图' },
  { id: 'visual-21', content: '机场候机厅的所有钟表同时停在了不同的时间' },
  { id: 'visual-22', content: '一座桥只在月光照到时才显出来，白天是一条河' },
  { id: 'visual-23', content: '电话亭里的话筒贴在耳朵上传来的是海浪声和二十年前某个下午' },
  { id: 'visual-24', content: '一片枫叶落进了咖啡杯里于是咖啡变成了秋天' },
  { id: 'visual-25', content: '有人在屋顶上放了一张床然后入睡了，毯子在风里像帆' },
  { id: 'visual-26', content: '一面墙上的涂鸦里的人物在凌晨三点从墙上走了下来' },
  { id: 'visual-27', content: '雨天的停车场上只有一辆车，车窗里面在下雪' },
  { id: 'visual-28', content: '一只猫坐在干涸喷泉的中央清理自己的爪子像在主持一场仪式' },
  { id: 'visual-29', content: '废弃工厂的烟囱里飘出来的不是烟而是成群的纸飞机' },
  { id: 'visual-30', content: '一盏台灯在空无一人的房间里照着一本摊开的书缓慢翻页' },
];

/** 抽象情绪型火种预设 */
const PRESET_EMOTION: ReadonlyArray<{ id: string; content: string }> = [
  { id: 'emotion-01', content: '一种介于困倦与顿悟之间的温度' },
  { id: 'emotion-02', content: '站在很高的地方时腹部那种轻微的往下坠的感觉但不是恐惧' },
  { id: 'emotion-03', content: '翻到旧照片时那半秒钟的失重' },
  { id: 'emotion-04', content: '话到嘴边突然觉得不必说了的那种松弛' },
  { id: 'emotion-05', content: '深夜独自走在空旷街道上的那种不属于任何人的自由' },
  { id: 'emotion-06', content: '一种只在快要下雨但还没下的时候才能感受到的膨胀感' },
  { id: 'emotion-07', content: '听完一首歌后的两秒钟里世界还没来得及恢复原样的那种质地' },
  { id: 'emotion-08', content: '忽然发现一个词比你以为的意思更深时的微小眩晕' },
  { id: 'emotion-09', content: '某种介于嫉妒与尊敬之间的冰凉的清醒' },
  { id: 'emotion-10', content: '在一群人中突然感觉自己在水底的那种寂静' },
  { id: 'emotion-11', content: '把一件东西扔掉之后手心残留的空' },
  { id: 'emotion-12', content: '凌晨醒来不知道自己在哪里的那三秒钟里住着整个宇宙' },
  { id: 'emotion-13', content: '被理解的瞬间身体内部像有什么融化了' },
  { id: 'emotion-14', content: '等一个人回消息时心脏在做轻微的仰卧起坐' },
  { id: 'emotion-15', content: '读到一句好句子时后脊背隐隐发凉的感觉像是被远处的什么东西注视' },
  { id: 'emotion-16', content: '告别时转身后那三步路里的所有重力' },
  { id: 'emotion-17', content: '午后阳光打在桌面上的那种慢到几乎静止的温暖' },
  { id: 'emotion-18', content: '忽然听到母语在异乡响起时胸口那一下收紧' },
  { id: 'emotion-19', content: '在很久之后才意识到某个瞬间其实是幸福的那种迟来的甜' },
  { id: 'emotion-20', content: '站在海边什么也不想的时候脑子里反而最清楚' },
  { id: 'emotion-21', content: '夜里醒来听到雨声时那种不需要做任何事的安全感' },
  { id: 'emotion-22', content: '看完一本长篇小说合上封底时世界暂时变成了另一个形状' },
  { id: 'emotion-23', content: '被人叫错名字时存在感突然变薄了一层' },
  { id: 'emotion-24', content: '独自旅行时在陌生城市找到一家好咖啡馆的那种精确的喜悦' },
  { id: 'emotion-25', content: '哭完之后那种干净的像被雨洗过的轻' },
  { id: 'emotion-26', content: '发现两个毫无关联的事物之间存在隐秘联系时的电流感' },
  { id: 'emotion-27', content: '做了一个梦却只记得情绪不记得内容的那种潮湿的遗憾' },
  { id: 'emotion-28', content: '在旧物里闻到某种味道时整个人被拉回到一个不存在的房间' },
  { id: 'emotion-29', content: '第一口冰水在喉咙里画出一条银色线条的清冽' },
  { id: 'emotion-30', content: '写下一句话然后删掉的那种轻微的丧失感' },
];

/** 不完整隐喻型火种预设 */
const PRESET_METAPHOR: ReadonlyArray<{ id: string; content: string }> = [
  { id: 'metaphor-01', content: '如果记忆有形状，它大概是——' },
  { id: 'metaphor-02', content: '孤独的反义词不是陪伴，而是——' },
  { id: 'metaphor-03', content: '人和人之间最短的距离不是直线，是——' },
  { id: 'metaphor-04', content: '如果时间有味道，凌晨两点尝起来像——' },
  { id: 'metaphor-05', content: '一段关系的重量大约等于——' },
  { id: 'metaphor-06', content: '如果把你今天的心情倒进一个杯子，它的颜色是——' },
  { id: 'metaphor-07', content: '安静不是没有声音，安静是——' },
  { id: 'metaphor-08', content: '如果等待是一种材质，它摸起来像——' },
  { id: 'metaphor-09', content: '一个人真正长大的标志不是年龄，而是开始——' },
  { id: 'metaphor-10', content: '家这个字拆开来看，宝盖头下面住着——' },
  { id: 'metaphor-11', content: '如果遗忘有声音，它听起来像——' },
  { id: 'metaphor-12', content: '最好的对话不是互相回答，是两个人一起——' },
  { id: 'metaphor-13', content: '如果勇气有温度，它不是热的，它是——' },
  { id: 'metaphor-14', content: '一首歌结束后那两秒钟的沉默其实是——' },
  { id: 'metaphor-15', content: '距离最好的度量单位不是公里，而是——' },
  { id: 'metaphor-16', content: '如果疲惫有颜色，它不是灰的，它是——' },
  { id: 'metaphor-17', content: '睡前最后一个念头的形状像——' },
  { id: 'metaphor-18', content: '两个人第一次沉默着也不尴尬，那意味着——' },
  { id: 'metaphor-19', content: '把所有说过的话收集起来，它们会拼成——' },
  { id: 'metaphor-20', content: '如果"再见"是一种建筑，它的结构是——' },
  { id: 'metaphor-21', content: '窗户不是用来看风景的，窗户是——' },
  { id: 'metaphor-22', content: '如果犹豫有动作，它看起来像——' },
  { id: 'metaphor-23', content: '被需要的感觉不是温暖，更像是——' },
  { id: 'metaphor-24', content: '如果把每天走过的路叠起来，它们会变成——' },
  { id: 'metaphor-25', content: '决定不是一个点，决定是——' },
  { id: 'metaphor-26', content: '如果信任有重量，它拿在手里像——' },
  { id: 'metaphor-27', content: '一个人说"我没事"的时候，"没事"其实是——' },
  { id: 'metaphor-28', content: '如果雨落在记忆上而不是地上，它会——' },
  { id: 'metaphor-29', content: '最远的旅行不是去某个地方，是从——' },
  { id: 'metaphor-30', content: '如果把沉默翻译成文字，它写出来是——' },
];

/** 所有预设火种按类型索引 */
const PRESET_MAP: Record<SparkType, ReadonlyArray<{ id: string; content: string }>> = {
  poem: PRESET_POEM,
  visual: PRESET_VISUAL,
  emotion: PRESET_EMOTION,
  metaphor: PRESET_METAPHOR,
};

// ============================================================
// 核心函数
// ============================================================

/**
 * 计算下一次火种出现的间隔（轮数）
 * 基础间隔 5 轮，根据上次评级和燃料动态调节
 * - 上次评级 4（卓越）→ -2
 * - 上次评级 3（创造性）→ -1
 * - 上次评级 1（复述）→ +2
 * - 上次被忽略（rating 为 null）→ +3
 * - 燃料 < 30 → 额外 -1（救命绳）
 * - 燃料 > 90 → 额外 +2（信任用户）
 */
export function calculateSparkInterval(
  lastRating: SparkRating | null,
  fuel: number
): number {
  let interval = SPARK_BASE_INTERVAL;

  /* 根据上次评级调节 */
  if (lastRating === null) {
    /* 上次被忽略 */
    interval += 3;
  } else if (lastRating === 4) {
    interval -= 2;
  } else if (lastRating === 3) {
    interval -= 1;
  } else if (lastRating === 1) {
    interval += 2;
  }
  /* 评级 2 不调节 */

  /* 根据燃料水平调节 */
  if (fuel < 30) {
    interval -= 1;
  } else if (fuel > 90) {
    interval += 2;
  }

  /* 限定范围 */
  return Math.max(SPARK_MIN_INTERVAL, Math.min(SPARK_MAX_INTERVAL, interval));
}

/**
 * 判断当前轮是否应该生成火种
 * 达到间隔即触发；超过硬性上限强制触发
 */
export function shouldGenerateSpark(
  turnsSinceLastSpark: number,
  interval: number
): boolean {
  if (turnsSinceLastSpark >= SPARK_FORCE_INTERVAL) {
    return true;
  }
  return turnsSinceLastSpark >= interval;
}

/**
 * 从预设库选择一个火种
 * 跳过已使用过的 id，若全部用尽则重置
 */
export function getPresetSpark(type: SparkType, usedIds: Set<string>): Spark {
  const pool = PRESET_MAP[type];

  /* 过滤已使用 */
  const available = pool.filter((item) => !usedIds.has(item.id));

  /* 如果全部用完，从完整列表选取（允许重复） */
  const source = available.length > 0 ? available : [...pool];

  const index = Math.floor(Math.random() * source.length);
  const chosen = source[index];

  return {
    id: chosen.id,
    type,
    content: chosen.content,
    source: 'preset',
    createdAt: new Date().toISOString(),
  };
}

/**
 * 决定是用 GLM-5 生成还是预设库抽取
 * 基础比例 70:30，但每生成 3 个 GLM 火种后第 4 个强制从预设库抽取
 */
export function decideSparkSource(sparkCount: number): SparkSource {
  /* 每 4 个火种中的第 4 个强制预设 */
  if (sparkCount > 0 && sparkCount % 4 === 3) {
    return 'preset';
  }

  /* 70% 概率生成，30% 概率预设 */
  return Math.random() < SPARK_GLM_RATIO ? 'generated' : 'preset';
}

/**
 * 判断用户消息是否是对火种的回应
 * 基于消息位置：火种出现后 maxWindow 条消息内视为回应窗口
 */
export function isSparkResponse(
  sparkTurn: number,
  currentTurn: number,
  maxWindow: number = SPARK_RESPONSE_WINDOW
): boolean {
  const gap = currentTurn - sparkTurn;
  return gap > 0 && gap <= maxWindow;
}

/**
 * 判断火种是否被忽略
 * 超过窗口期的消息数即视为忽略
 */
export function isSparkIgnored(
  sparkTurn: number,
  currentTurn: number,
  window: number = SPARK_RESPONSE_WINDOW
): boolean {
  return currentTurn - sparkTurn > window;
}

/**
 * 构建 GLM-5 火种评估 prompt
 * 让模型评估用户对火种的回应质量，返回 1-4 评级
 */
export function buildSparkEvaluationPrompt(
  sparkContent: string,
  userResponse: string
): string {
  return `你是一个审美判断系统。请评估用户对以下「火种」的回应质量。

火种内容：
"${sparkContent}"

用户回应：
"${userResponse}"

评估标准：
1 = 复述（重复、改写、机械附和，没有产生任何新东西）
2 = 常规转化（有个人理解但平淡，没有超出火种本身的范围）
3 = 创造性转化（出现了新意象、新视角、有个人审美痕迹，将火种引向了意料之外的方向）
4 = 卓越转化（回应本身成为新的审美碎片，甚至比火种更好）

判断依据：是否产生新意象、是否展现个人感知方式、语言是否有节奏感和质感、是否将火种引向意料之外的方向。

只返回一个数字（1、2、3 或 4），不要有任何其他输出。`;
}

/**
 * 构建 GLM-5 火种生成 prompt
 * 基于对话上下文和指定类型生成与情境相关的火种
 */
export function buildSparkGenerationPrompt(
  contextSummary: string,
  sparkType: SparkType
): string {
  const typeDescriptions: Record<SparkType, string> = {
    poem: '诗句型——短句，有韵律感，像一行被折断的诗。不超过 25 个字。',
    visual: '画面描述型——一个超现实的视觉场景，具体到你能看见它。不超过 35 个字。',
    emotion: '抽象情绪型——没有画面，只有感受和质地。用"一种……"开头。不超过 30 个字。',
    metaphor: '不完整隐喻型——隐喻的前半段，结尾用破折号留白，邀请对方完成。不超过 20 个字。',
  };

  return `你是一个审美碎片生成器。基于以下对话上下文，生成一个「火种」——一段极短的、能点燃想象力的审美碎片。

最近的对话概要：
${contextSummary}

要求的火种类型：${typeDescriptions[sparkType]}

生成规则：
- 必须与对话上下文有隐秘但可感知的关联
- 禁止直接引用对话内容
- 禁止说教或评价
- 禁止使用「治愈系」语言
- 语言质感要求：有重量，有节奏，有意料之外的意象
- 不要加引号，不要加任何前缀后缀说明

只输出火种文本本身，不要有任何其他内容。`;
}

/**
 * 随机选择一种火种类型
 * 四种类型均匀分布
 */
export function randomSparkType(): SparkType {
  const types: SparkType[] = ['poem', 'visual', 'emotion', 'metaphor'];
  return types[Math.floor(Math.random() * types.length)];
}

/**
 * 获取所有火种类型列表
 */
export function getAllSparkTypes(): SparkType[] {
  return ['poem', 'visual', 'emotion', 'metaphor'];
}

/**
 * 获取指定类型的预设火种总数
 */
export function getPresetCount(type: SparkType): number {
  return PRESET_MAP[type].length;
}

/**
 * 获取所有预设火种总数
 */
export function getTotalPresetCount(): number {
  return Object.values(PRESET_MAP).reduce((sum, pool) => sum + pool.length, 0);
}
