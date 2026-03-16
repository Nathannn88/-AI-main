/** 企鹅变形系统类型定义 — 企鹅是风格鲜明的可变形审美象征与燃料容器 */

/** 企鹅可用形态枚举 */
export type PenguinForm =
  | 'default'
  | 'toaster'
  | 'alarm-clock'
  | 'rocket-pack'
  | 'traverser'
  | 'surreal-apparatus'
  | 'boat'
  | 'judge'
  | 'lighthouse';

/** 企鹅单个形态的配置信息 */
export interface PenguinFormConfig {
  /** 形态标识 */
  form: PenguinForm;
  /** 形态中文名称 */
  name: string;
  /** 形态描述 */
  description: string;
  /** 解锁所需金币，0 表示免费 */
  cost: number;
  /** 审美象征含义 */
  symbolism: string;
  /** 是否为特殊形态（终局/灯塔变形，无法通过金币购买） */
  isSpecial: boolean;
}

/** 企鹅状态 */
export interface PenguinState {
  /** 当前激活形态 */
  currentForm: PenguinForm;
  /** 变形历史记录（形态标识列表） */
  transformHistory: string[];
  /** 已解锁的可用形态列表 */
  availableForms: PenguinForm[];
}

/** 所有企鹅形态的完整配置表 — 数值与项目圣经一致 */
export const PENGUIN_FORMS: PenguinFormConfig[] = [
  {
    form: 'default',
    name: '默认',
    description:
      '深空靛青底色，腹部翡翠绿谱纹脉动。左眼翡翠绿右眼琥珀金。边缘线条偶尔像信号一样轻微抖动。',
    cost: 0,
    symbolism: '未被定义的可能性',
    isSpecial: false,
  },
  {
    form: 'toaster',
    name: '烤面包机',
    description:
      '躯干扁平化为复古黄铜色烤面包机，表面70年代迷幻风谱纹。翅膀变为推杆。面包槽不断烤出微型黑胶唱片。',
    cost: 32,
    symbolism: '日常的荒诞化——平凡事物产出精致艺术品',
    isSpecial: false,
  },
  {
    form: 'alarm-clock',
    name: '闹钟',
    description:
      '达利式扭曲闹钟，表盘是企鹅肚子，数字替换为谱渊符号。指针为企鹅双脚，不规则旋转。双铃铛是放大的双眼。',
    cost: 64,
    symbolism: '时间的反叛——时间不是刻度，是即兴演奏',
    isSpecial: false,
  },
  {
    form: 'rocket-pack',
    name: '火箭背包',
    description:
      '背部涌出两束变换颜色的光流推进器。身体前倾悬空1cm。尾部彩虹色彗星尾迹。唯一会露出兴奋表情的形态。',
    cost: 128,
    symbolism: '超越的冲动——被美击中时你会想要飞',
    isSpecial: false,
  },
  {
    form: 'traverser',
    name: '穿越器',
    description:
      '球形半透明频率装置，企鹅蜷缩中心。多层同心频率环旋转，显示不同维度的风景碎片。',
    cost: 328,
    symbolism: '跨维度的窗口——"之间"的存在',
    isSpecial: false,
  },
  {
    form: 'surreal-apparatus',
    name: '超现实器具',
    description:
      '彻底解构为不可名状的超现实器具——同时是乐器、容器、钟表和生物。致敬马格利特和达利。',
    cost: 648,
    symbolism: '审美终极形态是不可归类',
    isSpecial: false,
  },
  {
    form: 'boat',
    name: '船',
    description:
      '企鹅的终局变形（结局一）。双脚变龙骨，翅膀翻折变船帆骨架，双眼合并移至船头变为翡翠绿灯火。',
    cost: 0,
    symbolism: '承载离别的容器',
    isSpecial: true,
  },
  {
    form: 'judge',
    name: '审美判断者',
    description:
      '静默内变（结局二）。底色加深为近纯黑，谱纹变得前所未有地亮。双眼合并为单一白色大眼。',
    cost: 0,
    symbolism: '审视与共振的凝视',
    isSpecial: true,
  },
  {
    form: 'lighthouse',
    name: '灯塔',
    description:
      '企鹅的最终变形。深灰色凝固频率材质，中部有各形态颜色的年轮环。灯室是企鹅双眼最终形态——整面发光体。',
    cost: 0,
    symbolism: '永恒旋转的审美之光',
    isSpecial: true,
  },
];
