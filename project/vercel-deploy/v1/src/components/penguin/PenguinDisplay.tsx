/** 企鹅当前形态展示 — 固定在聊天区域左下角，点击展开扇形面板 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import type { PenguinForm } from '@/types/penguin';
import { PENGUIN_FORMS } from '@/types/penguin';
import FormSelector from './FormSelector';

/** 各形态的 emoji 图标与边框色 */
const FORM_VISUALS: Record<PenguinForm, { emoji: string; borderColor: string; glowColor: string }> = {
  default: { emoji: '🐧', borderColor: 'border-jade-500', glowColor: 'shadow-jade-glow' },
  toaster: { emoji: '🍞', borderColor: 'border-amber-500', glowColor: 'shadow-amber-glow' },
  'alarm-clock': { emoji: '⏰', borderColor: 'border-astral-500', glowColor: 'shadow-astral-glow' },
  'rocket-pack': { emoji: '🚀', borderColor: 'border-ember-400', glowColor: 'shadow-ember-glow' },
  traverser: { emoji: '🔮', borderColor: 'border-astral-300', glowColor: 'shadow-astral-glow' },
  'surreal-apparatus': { emoji: '🎭', borderColor: 'border-amber-300', glowColor: 'shadow-amber-glow' },
  boat: { emoji: '⛵', borderColor: 'border-jade-300', glowColor: 'shadow-jade-glow' },
  judge: { emoji: '👁', borderColor: 'border-white/50', glowColor: 'shadow-jade-glow' },
  lighthouse: { emoji: '🏠', borderColor: 'border-amber-200', glowColor: 'shadow-amber-glow' },
};

/** 获取形态的审美格言 */
function getFormQuote(form: PenguinForm): string {
  const config = PENGUIN_FORMS.find((f) => f.form === form);
  return config?.symbolism ?? '';
}

/** 企鹅展示组件 */
export default function PenguinDisplay() {
  const [panelOpen, setPanelOpen] = useState(false);
  const penguin = useGameStore((s) => s.penguin);
  const ending = useGameStore((s) => s.ending);

  const currentForm = penguin.currentForm;
  const visual = FORM_VISUALS[currentForm];
  const formConfig = useMemo(
    () => PENGUIN_FORMS.find((f) => f.form === currentForm),
    [currentForm]
  );

  const handleTogglePanel = useCallback(() => {
    setPanelOpen((prev) => !prev);
  }, []);

  const handleClosePanel = useCallback(() => {
    setPanelOpen(false);
  }, []);

  /** 终局后特殊形态不允许切换 */
  const canSwitchForm = ending.choiceMade === 'none';

  return (
    <div className="fixed bottom-6 left-6 z-penguin">
      {/* 企鹅本体 */}
      <motion.button
        onClick={handleTogglePanel}
        className={`
          relative flex items-center justify-center
          w-[56px] h-[56px] md:w-[80px] md:h-[80px]
          rounded-full bg-abyss-900
          border-2 ${visual.borderColor} ${visual.glowColor}
          cursor-pointer select-none
          transition-shadow duration-normal
        `}
        animate={{
          rotate: [0, -2, 2, -2, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`企鹅形态：${formConfig?.name ?? '默认'}`}
        aria-expanded={panelOpen}
      >
        {/* 呼吸光效 */}
        <motion.div
          className={`absolute inset-0 rounded-full ${visual.borderColor} opacity-0`}
          animate={{
            boxShadow: [
              `0 0 15px rgba(0, 229, 160, 0.15)`,
              `0 0 30px rgba(0, 229, 160, 0.35)`,
              `0 0 15px rgba(0, 229, 160, 0.15)`,
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: [0.4, 0, 0.6, 1],
          }}
        />

        {/* emoji 图标 */}
        <span className="text-2xl md:text-4xl" role="img" aria-hidden="true">
          {visual.emoji}
        </span>
      </motion.button>

      {/* 扇形信息面板 */}
      <AnimatePresence>
        {panelOpen && (
          <>
            {/* 点击空白区域关闭 */}
            <motion.div
              className="fixed inset-0 z-[-1]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClosePanel}
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
              className="absolute bottom-[calc(100%+12px)] left-0 glass-panel rounded-card p-4 min-w-[200px]"
            >
              {/* 当前形态名称 */}
              <p className="text-overline text-txt-muted uppercase tracking-widest mb-1">
                当前形态
              </p>
              <p className="text-h4 text-txt-primary font-display mb-2">
                {formConfig?.name ?? '默认'}
              </p>

              {/* 审美格言 */}
              <p className="text-caption text-txt-secondary italic font-poetic mb-4 leading-relaxed">
                &ldquo;{getFormQuote(currentForm)}&rdquo;
              </p>

              {/* 形态选择器 */}
              {canSwitchForm && (
                <FormSelector onClose={handleClosePanel} />
              )}

              {!canSwitchForm && (
                <p className="text-caption text-txt-ghost italic">
                  此形态已锁定
                </p>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
