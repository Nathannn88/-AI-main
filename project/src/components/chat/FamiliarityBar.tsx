/** 熟悉度进度条 — 3px 默认高度，hover 展开显示详情 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

/** 阶段对应的进度条颜色渐变 */
function getProgressGradient(phase: string): string {
  switch (phase) {
    case 'intro':
      return 'bg-jade-500';
    case 'acquaintance':
      return 'bg-gradient-to-r from-jade-500 to-amber-500';
    case 'familiar':
      return 'bg-gradient-to-r from-jade-500 via-amber-500 to-ember-500';
    case 'close':
      return 'bg-gradient-to-r from-ember-500 to-ember-400';
    case 'bonded':
      return 'bg-gradient-to-r from-white to-gray-400';
    default:
      return 'bg-jade-500';
  }
}

/** 阶段中文名 */
const PHASE_NAMES: Record<string, string> = {
  intro: '初遇',
  acquaintance: '相识',
  familiar: '熟悉',
  close: '亲近',
  bonded: '羁绊',
};

/** 熟悉度线性进度条 */
export default function FamiliarityBar() {
  const [expanded, setExpanded] = useState(false);
  const { character } = useGameStore();
  const percentage = Math.min(character.familiarity, 100);
  const gradientClass = getProgressGradient(character.currentPhase);
  const phaseName = PHASE_NAMES[character.currentPhase] || '初遇';

  return (
    <motion.div
      className="w-full cursor-pointer shrink-0"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onClick={() => setExpanded(!expanded)}
      animate={{ height: expanded ? 24 : 3 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`熟悉度 ${percentage.toFixed(1)}%`}
    >
      <div className="relative w-full h-full bg-white/[0.04] rounded-[1.5px] overflow-hidden">
        {/* 填充条 */}
        <motion.div
          className={`absolute top-0 left-0 h-full rounded-[1.5px] ${gradientClass}`}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* 末端光点 */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full animate-dot-pulse"
          style={{
            left: `${percentage}%`,
            backgroundColor: 'var(--phase-primary)',
            color: 'var(--phase-primary)',
          }}
          animate={{ left: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />

        {/* 展开时显示文字 */}
        {expanded && (
          <motion.div
            className="absolute inset-0 flex items-center justify-between px-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span className="text-overline text-txt-secondary uppercase tracking-widest">
              {phaseName}
            </span>
            <span className="font-mono text-caption text-txt-primary">
              {percentage.toFixed(1)}%
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
