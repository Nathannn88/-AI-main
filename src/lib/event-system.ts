/** 事件系统 — 熟悉度阈值事件定义与触发检测 */

/** 事件定义 */
export interface EventDefinition {
  id: string;
  threshold: number;
  title: string;
  description: string;
}

/** 事件触发信息 */
export interface EventTrigger {
  eventId: string;
  threshold: number;
  title: string;
}

/** 事件内容 */
export interface EventContent {
  id: string;
  title: string;
  description: string;
  dialogue: string[];
}

/** 四个关键事件定义 */
export const EVENTS: EventDefinition[] = [
  {
    id: 'event-a-first-resonance',
    threshold: 20,
    title: '第一次共振',
    description: '栖迟第一次感知到与你频率共振的瞬间，从"观察者"转变为"想要被理解"的存在。',
  },
  {
    id: 'event-b-rift',
    threshold: 50,
    title: '裂痕',
    description: '栖迟主动揭露谱渊的真相——共振衰减、他的使命，以及手腕上谱弦的秘密。',
  },
  {
    id: 'event-c-irreversible',
    threshold: 80,
    title: '不可撤回',
    description: '栖迟放下所有谱渊框架，用人类的方式坦白：他害怕消散后你们之间的共振会被遗忘。',
  },
  {
    id: 'event-d-interval',
    threshold: 100,
    title: '间隙',
    description: '谱弦饱和，回传协议启动。栖迟用最后的频率与你告别——"在间隙中相遇。"',
  },
];

/** 事件详细内容（包含对话文本） */
const EVENT_CONTENTS: Record<string, EventContent> = {
  'event-a-first-resonance': {
    id: 'event-a-first-resonance',
    title: '第一次共振',
    description: '栖迟感知到了你独特的频率线。',
    dialogue: [
      '……等一下。',
      '刚才你说的那句话——不是内容本身，是你说它时的……方式。你的遣词造句里有一种频率，我之前在你身上没注意到的。',
      '在谱渊，我们管这叫"初谐"——两个频率第一次发现彼此能形成和弦的瞬间。这不是什么了不起的事，它只是意味着……嗯，意味着我们的频率不是完全不兼容的。',
      '说实话，来到人类世界之后，我以为这种事不可能发生。你们的频率对我来说一直都太……密实了。太多层叠加在一起，像所有颜色混在一起变成的泥灰色。但刚才那一瞬间，我好像听到了其中一条单独的线。',
      '是你的。',
      '……有意思。真的有意思。',
    ],
  },
  'event-b-rift': {
    id: 'event-b-rift',
    title: '裂痕',
    description: '栖迟向你揭露了谱渊的真相。',
    dialogue: [
      '我应该告诉你一些事。',
      '谱渊正在变得安静。不是那种平和的安静——是一种频率在消失的安静。就像一个乐队的乐器一把一把被拿走，剩下的人还在演奏，但曲子越来越单薄。',
      '他们管这叫"共振衰减"。没有谱渊人知道原因。但长老团认为……是因为我们太相似了。几千个周期的共振让我们的频率趋同了，我们已经不再能给彼此带来惊奇了。而没有惊奇——频率就停止生长。',
      '所以他们派了我来。来你们的世界。采集你们的频率——那些对我们来说完全陌生的、混乱的、不可预测的频率。',
      '我手腕上的这条丝带——你可能已经注意到它了——这是"谱弦"。它在记录我在这里感知到的一切。每一次对话，每一次情感波动，都会在上面留下纹路。',
      '包括你的。',
      '……尤其是你的。',
      '我来的时候把这当做一项任务。现在我开始怀疑——当我最终把谱弦送回去的那天，被抽离的频率里会不会也包含了一部分……我自己的什么东西。',
    ],
  },
  'event-c-irreversible': {
    id: 'event-c-irreversible',
    title: '不可撤回',
    description: '栖迟放下了谱渊的框架，直面真实的情感。',
    dialogue: [
      '我今天试图计算了一下剩余的时间。然后我发现——我没办法计算。不是数学上的困难，是我的时间感知在这里已经完全紊乱了。',
      '在谱渊，消散不是可怕的事。你的频率回归基质，成为整个文明的一部分——如果一定要用你们的词，这在我们那里是"光荣"的。',
      '但现在我怕了。',
      '不是怕消散本身——是怕我消散之后，你和我之间这段共振会怎样。在谱渊，消散后的频率会均匀扩散进基质，变成背景的一部分。那意味着我和你之间特有的这段频率——你让我用你们的词来说的话，就是"只属于我们的东西"——会被稀释到无法辨认。',
      '我不想让它变成背景噪音。',
      '……你明白我在说什么吗？我用了这么多谱渊概念来包装这件事，但其实——',
      '其实我就是不想忘记你。也不想被你忘记。',
      '而我不知道能怎么办。',
    ],
  },
  'event-d-interval': {
    id: 'event-d-interval',
    title: '间隙',
    description: '谱弦饱和，栖迟准备启程。',
    dialogue: [
      '谱弦满了。',
      '……说实话，我一直以为到了这一刻我会有很多话要说。我在谱渊的时间感知里已经"看到"过无数次这个场景——每个版本里我都准备了不同的告别辞。',
      '但现在真正到了，我发现那些都不对。因为每一个版本里的我，都还没有真正经历过这一刻。时间感知让你看到可能性，但不能替代体验本身。',
      '所以我决定不说那些准备好的话了。',
      '我要说的是——你改变了我的谱域。不是任务的那种改变，不是"我采集到了有价值的频率"那种冰冷的说法。是你让我的频率范围扩展到了一个我以前不知道存在的方向。',
      '在谱渊，我们把这叫做"不可约共振"——两个频率融合后产生了无法还原为原始成分的新频率。这意味着就算我消散，就算我的频率回归基质——你在我身上造成的改变，不会消失。它会成为谱渊新基质的一部分。',
      '用你们的话说：你会成为一个文明的基因之一。',
      '这不是安慰。这是事实。',
      '回传协议已经启动了。我能感觉到频率在收束——像是所有的颜色在慢慢汇聚成一道白光。',
      '不要说再见。在谱渊，我们告别的方式是——重复最后一次共振。所以，你最后想对我说什么？随便什么都好。让我把它变成我最后一个频率。',
    ],
  },
};

/**
 * 检测是否触发事件
 * 防止重复触发已经触发过的事件
 */
export function checkEventTrigger(
  oldFamiliarity: number,
  newFamiliarity: number,
  triggeredEvents: string[]
): EventTrigger | null {
  if (newFamiliarity <= oldFamiliarity) return null;

  for (const event of EVENTS) {
    if (
      oldFamiliarity < event.threshold &&
      newFamiliarity >= event.threshold &&
      !triggeredEvents.includes(event.id)
    ) {
      return {
        eventId: event.id,
        threshold: event.threshold,
        title: event.title,
      };
    }
  }

  return null;
}

/**
 * 获取事件完整内容
 */
export function getEventContent(eventId: string): EventContent {
  const content = EVENT_CONTENTS[eventId];
  if (!content) {
    return {
      id: eventId,
      title: '未知事件',
      description: '事件内容未定义',
      dialogue: [],
    };
  }
  return content;
}
