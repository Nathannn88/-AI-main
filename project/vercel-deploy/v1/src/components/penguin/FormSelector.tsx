/** 形态选择面板 — 扇形排列 6 个形态图标，已解锁/未解锁不同表现 */

'use client';

import { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import type { PenguinForm, PenguinFormConfig } from '@/types/penguin';
import { PENGUIN_FORMS } from '@/types/penguin';

/** 可购买的 6 种形态（排除特殊形态 boat/judge/lighthouse） */
const PURCHASABLE_FORMS: PenguinFormConfig[] = PENGUIN_FORMS.filter(
  (f) => !f.isSpecial
);

/** 各形态对应的 emoji 图标 */
const FORM_EMOJI: Record<string, string> = {
  default: '🐧',
  toaster: '🍞',
  'alarm-clock': '⏰',
  'rocket-pack': '🚀',
  traverser: '🔮',
  'surreal-apparatus': '🎭',
};

/** 扇形排列角度计算：120度扇面，6个图标均匀分布 */
function getFanPosition(index: number, total: number): { x: number; y: number } {
  /** 扇面起始角度（从 -150 度到 -30 度，即左上方到右上方的 120 度扇面） */
  const startAngle = -150;
  const endAngle = -30;
  const angleStep = total > 1 ? (endAngle - startAngle) / (total - 1) : 0;
  const angleDeg = startAngle + angleStep * index;
  const angleRad = (angleDeg * Math.PI) / 180;

  const radius = 90;
  return {
    x: Math.cos(angleRad) * radius,
    y: Math.sin(angleRad) * radius,
  };
}

interface FormSelectorProps {
  onClose: () => void;
}

/** 形态选择面板 */
export default function FormSelector({ onClose }: FormSelectorProps) {
  const penguin = useGameStore((s) => s.penguin);
  const goldBalance = useGameStore((s) => s.economy.goldBalance);
  const transformPenguinForm = useGameStore((s) => s.transformPenguinForm);

  const availableForms = useMemo(() => new Set(penguin.availableForms), [penguin.availableForms]);
  const currentForm = penguin.currentForm;

  const handleSelectForm = useCallback(
    (form: PenguinForm) => {
      const result = transformPenguinForm(form);
      if (result.success) {
        onClose();
      }
    },
    [transformPenguinForm, onClose]
  );

  return (
    <div className="relative" role="group" aria-label="企鹅形态选择">
      <p className="text-overline text-txt-muted uppercase tracking-widest mb-3">
        形态切换
      </p>

      <div className="relative w-full h-[100px]">
        {PURCHASABLE_FORMS.map((formConfig, index) => {
          const isUnlocked = availableForms.has(formConfig.form);
          const isCurrent = currentForm === formConfig.form;
          const canAfford = goldBalance >= formConfig.cost;
          const pos = getFanPosition(index, PURCHASABLE_FORMS.length);

          return (
            <motion.button
              key={formConfig.form}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: index * 0.06,
                duration: 0.3,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              style={{
                position: 'absolute',
                left: `calc(50% + ${pos.x}px)`,
                bottom: `${-pos.y}px`,
                transform: 'translate(-50%, 50%)',
              }}
              className={`
                relative flex items-center justify-center
                w-10 h-10 rounded-full
                transition-all duration-normal
                ${isCurrent
                  ? 'border-2 border-jade-500 bg-jade-500/20 shadow-jade-glow'
                  : isUnlocked
                    ? 'border border-jade-500/40 bg-abyss-800/80 hover:border-jade-500 hover:bg-jade-500/10'
                    : 'border border-white/10 bg-abyss-900/80 opacity-60'
                }
              `}
              onClick={() => handleSelectForm(formConfig.form)}
              disabled={isCurrent}
              aria-label={`${formConfig.name}${isCurrent ? '（当前）' : isUnlocked ? '' : `（${formConfig.cost} 金币）`}`}
              title={formConfig.name}
            >
              {/* emoji 或锁定图标 */}
              {isUnlocked ? (
                <span className="text-lg" role="img" aria-hidden="true">
                  {FORM_EMOJI[formConfig.form] ?? '❓'}
                </span>
              ) : (
                <span className="text-sm" role="img" aria-hidden="true">
                  🔒
                </span>
              )}

              {/* 未解锁时显示金币价格标签 */}
              {!isUnlocked && formConfig.cost > 0 && (
                <span
                  className={`
                    absolute -bottom-5 left-1/2 -translate-x-1/2
                    text-[10px] font-mono whitespace-nowrap
                    ${canAfford ? 'text-amber-400' : 'text-txt-ghost'}
                  `}
                >
                  {formConfig.cost}💰
                </span>
              )}

              {/* 免费标签 */}
              {!isUnlocked && formConfig.cost === 0 && (
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-jade-500 font-mono whitespace-nowrap">
                  免费
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* 金币余额 */}
      <div className="mt-8 pt-3 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-caption text-txt-muted">金币余额</span>
        <span className="text-caption text-amber-400 font-mono">
          {goldBalance} 💰
        </span>
      </div>
    </div>
  );
}
