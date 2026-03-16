/** 熟悉度/航程燃料条 — 0-79% 底部水平条，80%+ 右侧垂直燃料条 */

'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import type { FamiliarityPhase } from '@/types/character';

/** 阶段中文名 */
const PHASE_NAMES: Record<FamiliarityPhase, string> = {
  intro: '初遇',
  acquaintance: '相识',
  familiar: '熟悉',
  close: '亲近',
  bonded: '羁绊',
};

/** 水平条颜色渐变 */
function getHorizontalGradient(phase: FamiliarityPhase): string {
  switch (phase) {
    case 'intro':
      return 'bg-jade-500';
    case 'acquaintance':
      return 'bg-gradient-to-r from-jade-500 to-jade-300';
    case 'familiar':
      return 'bg-gradient-to-r from-jade-500 via-amber-500 to-amber-400';
    case 'close':
    case 'bonded':
      return 'bg-gradient-to-r from-jade-500 via-amber-500 to-ember-500';
  }
}

/** 燃料条颜色：>60翡翠绿，30-60琥珀金，<30深樱红 */
function getFuelGradient(fuel: number): string {
  if (fuel > 60) return 'bg-gradient-fuel-healthy';
  if (fuel >= 30) return 'bg-gradient-fuel-warning';
  return 'bg-gradient-fuel-danger';
}

/** 燃料条发光色 */
function getFuelGlowColor(fuel: number): string {
  if (fuel > 60) return 'rgba(0, 229, 160, 0.25)';
  if (fuel >= 30) return 'rgba(255, 179, 71, 0.25)';
  return 'rgba(199, 62, 92, 0.25)';
}

/** 熟悉度进度/航程燃料组件 */
export default function FamiliarityBar() {
  const [expanded, setExpanded] = useState(false);

  const character = useGameStore((s) => s.character);
  const fuel = useGameStore((s) => s.fuel);
  const ending = useGameStore((s) => s.ending);

  const percentage = Math.min(character.familiarity, 100);
  const isVoyageMode = percentage >= 80 || ending.postEndingActive;

  /* 水平模式（0-79%）的渐变 */
  const gradientClass = useMemo(
    () => getHorizontalGradient(character.currentPhase),
    [character.currentPhase]
  );

  const phaseName = PHASE_NAMES[character.currentPhase] || '初遇';

  /* ========================================
   * 80%+：右侧垂直航程燃料条
   * ======================================== */
  if (isVoyageMode) {
    const fuelValue = ending.postEndingActive
      ? fuel.currentFuel
      : Math.max(0, ((percentage - 80) / 20) * 100);

    const fuelPercent = Math.min(Math.max(fuelValue, 0), 100);
    const fuelGradient = getFuelGradient(fuelPercent);
    const glowColor = getFuelGlowColor(fuelPercent);

    return (
      <motion.div
        className="fixed right-0 top-1/2 -translate-y-1/2 z-content flex items-center gap-2 pr-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* 旁侧文字 */}
        <div className="flex flex-col items-end gap-1">
          <span
            className="text-overline text-txt-secondary tracking-widest"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            {ending.postEndingActive ? '航程燃料' : '航程'}
          </span>
          <span
            className="font-mono text-caption text-txt-muted"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            {'距离——未知'}
          </span>
        </div>

        {/* 垂直燃料条容器 */}
        <div
          className="relative w-1 h-32 sm:h-48 bg-white/[0.06] rounded-bar overflow-hidden cursor-pointer"
          onClick={() => setExpanded(!expanded)}
          role="progressbar"
          aria-valuenow={fuelPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`航程燃料 ${fuelPercent.toFixed(0)}%`}
        >
          {/* 燃料填充（从底部往上） */}
          <motion.div
            className={`absolute bottom-0 left-0 w-full rounded-bar ${fuelGradient}`}
            animate={{ height: `${fuelPercent}%` }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            style={{
              boxShadow: `0 0 12px ${glowColor}`,
            }}
          />

          {/* 液态光效果 */}
          <motion.div
            className="absolute bottom-0 left-0 w-full opacity-40"
            animate={{ height: `${fuelPercent}%` }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="w-full h-full animate-liquid-rise" />
          </motion.div>

          {/* 顶端光点 */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full animate-dot-pulse"
            style={{
              bottom: `${fuelPercent}%`,
              backgroundColor: fuelPercent > 60 ? '#00E5A0' : fuelPercent >= 30 ? '#FFB347' : '#C73E5C',
            }}
            animate={{ bottom: `${fuelPercent}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>

        {/* 展开时显示数值 */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              className="absolute right-10 top-1/2 -translate-y-1/2 glass-panel rounded-card px-3 py-2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <span className="font-mono text-caption text-txt-primary">
                {fuelPercent.toFixed(0)}%
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  /* ========================================
   * 0-79%：底部水平熟悉度条
   * ======================================== */
  return (
    <motion.div
      className="w-full cursor-pointer shrink-0"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onClick={() => setExpanded(!expanded)}
      animate={{ height: expanded ? 24 : 6 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`熟悉度 ${percentage.toFixed(1)}%`}
    >
      <div className="relative w-full h-full bg-white/[0.04] rounded-[3px] overflow-hidden">
        {/* 填充条 + shimmer 动画 */}
        <motion.div
          className={`absolute top-0 left-0 h-full rounded-[3px] ${gradientClass}`}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* shimmer 叠加层 */}
          <div
            className="absolute inset-0 animate-shimmer"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
              backgroundSize: '200% 100%',
            }}
          />
        </motion.div>

        {/* 末端光点 */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full animate-dot-pulse"
          style={{
            left: `${percentage}%`,
            backgroundColor: 'var(--phase-primary)',
            color: 'var(--phase-primary)',
          }}
          animate={{ left: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />

        {/* 展开时显示文字 */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              className="absolute inset-0 flex items-center justify-between px-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
