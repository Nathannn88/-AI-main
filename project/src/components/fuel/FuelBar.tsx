/** 航程燃料条 — 垂直条，右侧边缘，结局二后 / 80%以上时显示 */

'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import type { FuelState } from '@/types/fuel';

/** 根据燃料值返回渐变类名 */
function getFuelGradient(fuel: number): string {
  if (fuel >= 60) return 'bg-gradient-fuel-healthy';
  if (fuel >= 30) return 'bg-gradient-fuel-warning';
  return 'bg-gradient-fuel-danger';
}

/** 根据燃料值返回辉光颜色 */
function getGlowStyle(fuel: number): string {
  if (fuel >= 60) return '0 0 8px rgba(0, 229, 160, 0.4)';
  if (fuel >= 30) return '0 0 8px rgba(255, 179, 71, 0.4)';
  return '0 0 8px rgba(199, 62, 92, 0.4)';
}

/** 判断燃料条是否可见 */
function shouldShowFuelBar(
  fuelState: FuelState,
  familiarity: number,
  postEndingActive: boolean
): boolean {
  /** 结局二后始终显示 */
  if (postEndingActive) return true;
  /** 80% 以上进入预览期也显示（此时显示为航程燃料条预览） */
  if (familiarity >= 80) return true;
  return false;
}

/** 航程燃料条组件 */
export default function FuelBar() {
  const fuel = useGameStore((s) => s.fuel);
  const familiarity = useGameStore((s) => s.character.familiarity);
  const postEndingActive = useGameStore((s) => s.ending.postEndingActive);

  const visible = useMemo(
    () => shouldShowFuelBar(fuel, familiarity, postEndingActive),
    [fuel, familiarity, postEndingActive]
  );

  const fuelPercentage = Math.max(0, Math.min(100, fuel.currentFuel));
  const gradientClass = getFuelGradient(fuelPercentage);
  const glowStyle = getGlowStyle(fuelPercentage);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed right-3 top-1/2 -translate-y-1/2 z-content flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          role="meter"
          aria-valuenow={fuelPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`航程燃料 ${fuelPercentage.toFixed(0)}%`}
        >
          {/* 旁侧文字 */}
          <div className="flex flex-col items-center gap-1">
            <span
              className="text-overline text-txt-muted tracking-widest"
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            >
              距离
            </span>
            <span
              className="text-overline text-txt-ghost tracking-widest"
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            >
              未知
            </span>
          </div>

          {/* 燃料条容器 */}
          <div className="relative w-[4px] rounded-full overflow-hidden bg-white/[0.06]"
            style={{ height: 'min(80vh, 400px)' }}
          >
            {/* 燃料填充 — 从下往上 */}
            <motion.div
              className={`absolute bottom-0 left-0 w-full rounded-full ${gradientClass}`}
              animate={{ height: `${fuelPercentage}%` }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              style={{ boxShadow: glowStyle }}
            />

            {/* 液面微波动动画 */}
            <motion.div
              className="absolute left-0 w-full h-[3px] rounded-full bg-white/30"
              animate={{
                y: [1, -1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ bottom: `${fuelPercentage}%` }}
            />

            {/* 辉光层 — 扩展视觉宽度到 8px */}
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[8px] rounded-full pointer-events-none"
              animate={{
                height: `${fuelPercentage}%`,
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                height: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              }}
              style={{ boxShadow: glowStyle }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
