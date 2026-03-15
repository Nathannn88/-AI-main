/** 熟悉度 Hook — 订阅熟悉度变化，提供阶段信息 */

'use client';

import { useGameStore } from '@/store/gameStore';
import type { FamiliarityPhase } from '@/types/character';

/** 阶段中文名映射 */
const PHASE_LABELS: Record<FamiliarityPhase, string> = {
  intro: '初遇',
  acquaintance: '相识',
  familiar: '熟悉',
  close: '亲近',
  bonded: '羁绊',
};

interface UseFamiliarityReturn {
  familiarity: number;
  phase: FamiliarityPhase;
  phaseLabel: string;
}

/** 熟悉度订阅 Hook */
export function useFamiliarity(): UseFamiliarityReturn {
  const familiarity = useGameStore((s) => s.character.familiarity);
  const phase = useGameStore((s) => s.character.currentPhase);

  return {
    familiarity,
    phase,
    phaseLabel: PHASE_LABELS[phase],
  };
}
