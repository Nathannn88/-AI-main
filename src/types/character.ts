/** 角色状态相关类型定义 */

/** 熟悉度阶段 */
export type FamiliarityPhase = 'intro' | 'acquaintance' | 'familiar' | 'close' | 'bonded';

/** 角色状态 */
export interface CharacterState {
  familiarity: number;
  totalWordsFromUser: number;
  eventsTriggered: string[];
  currentPhase: FamiliarityPhase;
}

/** 熟悉度阈值定义 */
export interface FamiliarityThreshold {
  value: number;
  phase: FamiliarityPhase;
  eventId: string;
}

/** 熟悉度变更结果 */
export interface FamiliarityUpdateResult {
  newFamiliarity: number;
  newPhase: FamiliarityPhase;
  crossedThresholds: string[];
}
