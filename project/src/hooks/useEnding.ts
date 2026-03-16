/** 终局 Hook — 封装终局状态检测与选择操作 */

'use client';

import { useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import type { EndingChoice } from '@/types/ending';
import { checkEndingTrigger } from '@/lib/ending-system';

interface UseEndingReturn {
  /** 是否已到达终局（熟悉度 100%） */
  isEndingReached: boolean;
  /** 当前终局选择 */
  endingChoice: EndingChoice;
  /** 是否处于结局后状态（已做出选择） */
  isPostEnding: boolean;
  /** 是否选择了"送他离开" */
  isSendAway: boolean;
  /** 是否选择了"成为诗人" */
  isBecomePoet: boolean;
  /** 检查是否到达终局条件并标记 */
  checkTrigger: () => boolean;
  /** 做出终极选择 */
  choose: (choice: 'send-away' | 'become-poet') => void;
}

/** 终局系统 Hook */
export function useEnding(): UseEndingReturn {
  const isEndingReached = useGameStore((s) => s.ending.endingReached);
  const endingChoice = useGameStore((s) => s.ending.choiceMade);
  const postEndingActive = useGameStore((s) => s.ending.postEndingActive);
  const familiarity = useGameStore((s) => s.character.familiarity);
  const triggerEnding = useGameStore((s) => s.triggerEnding);
  const makeEndingChoice = useGameStore((s) => s.makeEndingChoice);

  const isPostEnding = endingChoice !== 'none';
  const isSendAway = endingChoice === 'send-away';
  const isBecomePoet = endingChoice === 'become-poet';

  /** 检查是否到达终局并标记 */
  const checkTrigger = useCallback((): boolean => {
    if (isEndingReached) return true;

    const shouldTrigger = checkEndingTrigger(familiarity);
    if (shouldTrigger) {
      triggerEnding();
    }
    return shouldTrigger;
  }, [isEndingReached, familiarity, triggerEnding]);

  /** 做出终极选择 */
  const choose = useCallback((choice: 'send-away' | 'become-poet') => {
    makeEndingChoice(choice);
  }, [makeEndingChoice]);

  return {
    isEndingReached,
    endingChoice,
    isPostEnding,
    isSendAway,
    isBecomePoet,
    checkTrigger,
    choose,
  };
}
