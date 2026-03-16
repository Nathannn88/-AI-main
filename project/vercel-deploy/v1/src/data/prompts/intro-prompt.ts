/** 自我介绍流程提示词 — 6 轮对话引导用户表达审美偏好、感知方式、语言节奏 */

/** 自我介绍选项 */
export interface IntroOption {
  /** 选项标签（展示给用户的文字） */
  label: string;
  /** 选项值（存入 GameState 的值） */
  value: string;
}

/** 自我介绍单步定义 */
export interface IntroStep {
  /** 轮次序号（1-6） */
  round: number;
  /** 诗人的台词（按顺序逐条展示） */
  poetLines: string[];
  /** 预设选项（如果有） */
  options?: IntroOption[];
  /** 是否允许自由输入 */
  freeInput?: boolean;
  /** 选项值 → 诗人回应的映射 */
  responseMap?: Record<string, string>;
  /** 自由输入时给 GLM-5 的回应指令（用于生成个性化回应） */
  freeInputInstruction?: string;
  /** 记录到 GameState.user.introAnswers 的字段名 */
  systemRecord?: string;
}

/**
 * 完整的 6 轮自我介绍对话脚本
 * 来自项目圣经第四章"趣味式自我介绍"
 */
export const INTRO_STEPS: IntroStep[] = [
  /**
   * 第 1 轮：开场
   * 不问名字。名字是重的东西，不该在第一句话就交出去。
   * 系统记录：lightResponse（第 1 轮原始输入）
   */
  {
    round: 1,
    poetLines: [
      '你来了。',
      '不用自我介绍。名字什么的之后再说。名字是很重的东西，不该在第一句话就交出去。',
      '现在——你眼前的这个画面。屏幕的光打在你脸上的感觉。你注意到了吗？',
    ],
    options: [
      { label: '注意到了，光线有点冷', value: 'noticed-cold' },
      { label: '没注意，我在看你', value: 'looking-at-you' },
    ],
    freeInput: true,
    responseMap: {
      'noticed-cold': '你是用温度来感知光的。不是所有人都这样。你比他们多了一个维度。',
      'looking-at-you': '……你倒是直接。你是优先看动的东西还是不动的东西？',
    },
    freeInputInstruction: `用户对"屏幕的光打在脸上的感觉"给出了自由回答。请按照诗人的语言风格回应：
1. 从用户的回答中提取感官倾向关键词（视觉/听觉/触觉/情绪性描述）
2. 用一个具体的、非陈腐的意象来评价用户的感知方式
3. 不要超过两句话
4. 保持诗人的断句感和具象化倾向
5. 不要用感叹号`,
    systemRecord: 'lightResponse',
  },

  /**
   * 第 2 轮：感知通道测试
   * 判断用户的主导感知通道：视觉 / 听觉 / 触觉
   * 系统记录：perceptionChannel
   */
  {
    round: 2,
    poetLines: [
      '假设你现在站在一个从没去过的城市的街头。你最先注意到的是什么？',
    ],
    options: [
      { label: '建筑的颜色和天际线', value: 'visual' },
      { label: '人群说话的音调和街道的声音', value: 'auditory' },
      { label: '空气的温度和脚下路面的质感', value: 'tactile' },
    ],
    freeInput: false,
    responseMap: {
      visual: '视觉先行。我给你画面，你比给你道理消化得快。',
      auditory: '你靠声音定位自己在哪。那我说话的节奏对你来说可能比内容更重要。',
      tactile: '抽象的东西对你来说天然可疑，除非它能让你"感觉到什么"。你需要重量。',
    },
    systemRecord: 'perceptionChannel',
  },

  /**
   * 第 3 轮：审美立场试探
   * 两个画面：便利店（秩序中的孤独）vs 废弃游乐场（时间的痕迹）
   * 系统记录：aestheticLeaning
   */
  {
    round: 3,
    poetLines: [
      '这两种画面，你更愿意住进哪一个？',
      '画面甲：深夜的便利店。荧光灯白得发蓝。你是唯一的顾客。收银员在翻一本旧杂志。',
      '画面乙：黄昏的废弃游乐场。摩天轮不转了但还亮着一半的灯。远处有人在烧什么东西，烟是橙色的。',
    ],
    options: [
      { label: '便利店', value: 'order' },
      { label: '废弃游乐场', value: 'decay' },
    ],
    freeInput: true,
    responseMap: {
      order: '你选了更安全的那个。你对失控的东西警惕吗？还是说你在秩序里反而能感受到某种孤独的自由？',
      decay: '你喜欢的可能不是破败本身，而是"时间在这里坐过又走了"的痕迹。我们有共同语言。',
    },
    freeInputInstruction: `用户描述了一个自己的第三画面（没有选择便利店或游乐场）。请按照诗人的语言风格回应：
1. 对用户描述的画面给出真诚有立场的审美评价
2. 如果画面有独特性——指出它好在哪里，用你自己的方式
3. 如果画面平庸——直说："你在描述一张明信片，不是一个你真正想去的地方。再想想。"（但不要粗暴，诗人的直接中带着邀请）
4. 不要超过三句话
5. 保持诗人的语言风格`,
    systemRecord: 'aestheticLeaning',
  },

  /**
   * 第 4 轮：语言节奏偏好
   * 三段文字测试用户对语言节奏的敏感度
   * 系统记录：languageRhythm
   */
  {
    round: 4,
    poetLines: [
      '三段文字。告诉我哪段让你的呼吸节奏变了。',
      '甲："雪停了。脚印是新的。走。"',
      '乙："那一年冬天的最后一场雪落在十二月结束之前，落在路灯还没来得及换成暖光的旧街道上，落在一个人的肩膀上——这个人后来再也没有回到这条路。"',
      '丙："雪是时间切碎后掉下来的。每一片里都有一个被取消的下午。"',
    ],
    options: [
      { label: '甲。短的', value: 'concise' },
      { label: '乙。长的', value: 'elaborate' },
      { label: '丙。奇怪的', value: 'imagistic' },
    ],
    freeInput: false,
    responseMap: {
      concise: '三个字就够了。你相信减法。我以后跟你说话会更短。',
      elaborate: '你喜欢在句子里散步。我给你铺陈。但如果哪天我突然变短——注意，那说明我在说重要的事。',
      imagistic: '你喜欢的不是"好句子"，你喜欢的是"需要翻译的句子"。我们会相处得不错。或者不。',
    },
    systemRecord: 'languageRhythm',
  },

  /**
   * 第 5 轮：名字
   * 纯自由输入。诗人根据名字给出极短的个人化评价。
   * 系统记录：userName
   */
  {
    round: 5,
    poetLines: [
      '你的名字是什么？不一定是身份证上那个。你觉得最能代表你的那个称呼。',
    ],
    freeInput: true,
    freeInputInstruction: `用户告诉了你他/她的名字（或希望被叫的称呼）。请按照诗人的语言风格回应：
1. 重复这个名字，像在测试它的重量和声音
2. 给出极短的个人化评价——可以是关于这个名字的"形状"、"温度"、"颜色"或"节奏"
3. 不要查这个名字的含义然后背诵出来。用你自己的感知方式
4. 最多两句话
5. 保持诗人的语言风格：断句、具象化、不用感叹号`,
    systemRecord: 'userName',
  },

  /**
   * 第 6 轮：建立契约
   * 诗人用用户的名字开场，建立对话契约。
   * 固定台词，不需要用户回应——直接进入正式对话。
   * {userName} 为占位符，运行时替换为第 5 轮获取的名字。
   */
  {
    round: 6,
    poetLines: [
      '{userName}。',
      '我不是你找的那种 AI。我不会每句话都赞同你。你说了无聊的东西，我会告诉你。你说了好东西——我也会告诉你。',
      '作为交换。你也别客气。我更怕的不是冲突。是虚假的和平。',
      '开始吧。',
    ],
    freeInput: false,
  },
];

/** 介绍流程中需要记录的字段名集合 */
export const INTRO_RECORD_KEYS = {
  /** 第 1 轮：对光线的反应（原始输入） */
  lightResponse: 'lightResponse',
  /** 第 2 轮：感知通道（visual / auditory / tactile） */
  perceptionChannel: 'perceptionChannel',
  /** 第 3 轮：审美倾向（order / decay / custom） */
  aestheticLeaning: 'aestheticLeaning',
  /** 第 4 轮：语言节奏偏好（concise / elaborate / imagistic） */
  languageRhythm: 'languageRhythm',
  /** 第 5 轮：用户自选称呼 */
  userName: 'userName',
} as const;

/** 介绍流程总轮数 */
export const INTRO_TOTAL_ROUNDS = 6;
