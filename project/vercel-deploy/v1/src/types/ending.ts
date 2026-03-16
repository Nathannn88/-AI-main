/** 终局系统类型定义 — 两个不可逆选择与后续状态 */

/** 终局选择：送诗人离开 / 成为诗人 / 未选择 */
export type EndingChoice = 'none' | 'send-away' | 'become-poet';

/** 终局状态 */
export interface EndingState {
  /** 是否已到达终局 */
  endingReached: boolean;
  /** 玩家做出的选择 */
  choiceMade: EndingChoice;
  /** 是否处于结局后的活跃状态（结局二的诗人模式） */
  postEndingActive: boolean;
}
