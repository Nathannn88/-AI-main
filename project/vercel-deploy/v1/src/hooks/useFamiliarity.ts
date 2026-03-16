/** 熟悉度 Hook — 订阅熟悉度变化，提供阶段信息和火种预览期检测 */

'use client';

import { useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import type { FamiliarityPhase } from '@/types/character';
import { isInPreviewSparkPhase, checkFuelTransition } from '@/lib/familiarity';

/** 阶段中文名映射 */
const PHASE_LABELS: Record<FamiliarityPhase, string> = {
  intro: '初遇',
  acquaintance: '相识',
  familiar: '熟悉',
  close: '亲近',
  bonded: '羁绊',
};

interface UseFamiliarityReturn {
  /** 当前熟悉度值（0-100） */
  familiarity: number;
  /** 当前阶段标识 */
  phase: FamiliarityPhase;
  /** 当前阶段中文名 */
  phaseLabel: string;
  /** 是否处于火种预览期（80%-100%） */
  isInSparkPreview: boolean;
  /** 是否已到达燃料条转换阈值（>=80%） */
  shouldTransformToFuel: boolean;
}

/** 熟悉度订阅 Hook */
export function useFamiliarity(): UseFamiliarityReturn {
  const familiarity = useGameStore((s) => s.character.familiarity);
  const phase = useGameStore((s) => s.character.currentPhase);

  /** 是否处于火种预览期（80%-100% 之间） */
  const isInSparkPreview = useMemo(
    () => isInPreviewSparkPhase(familiarity),
    [familiarity]
  );

  /** 是否应将熟悉度条转换为燃料条（>=80%） */
  const shouldTransformToFuel = useMemo(
    () => checkFuelTransition(familiarity),
    [familiarity]
  );

  return {
    familiarity,
    phase,
    phaseLabel: PHASE_LABELS[phase],
    isInSparkPreview,
    shouldTransformToFuel,
  };
}
