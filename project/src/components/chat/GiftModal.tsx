/** 企鹅变形入口 — 展示 6 个企鹅形态选项，金币购买/切换 */

'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useGameStore } from '@/store/gameStore';
import { PENGUIN_FORMS } from '@/types/penguin';
import type { PenguinForm } from '@/types/penguin';

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToRecharge: () => void;
}

/** 可购买的企鹅形态（排除特殊形态） */
const PURCHASABLE_FORMS = PENGUIN_FORMS.filter((f) => !f.isSpecial);

/** 企鹅形态图标（简化的 SVG 表示） */
function PenguinFormIcon({ form, isActive }: { form: PenguinForm; isActive: boolean }) {
  const baseColor = isActive ? '#00E5A0' : '#576173';

  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      {/* 企鹅基础轮廓 */}
      <ellipse cx="24" cy="28" rx="12" ry="14" fill={baseColor} fillOpacity={0.15} stroke={baseColor} strokeWidth="1.5" />
      {/* 双眼 */}
      <circle cx="20" cy="22" r="2" fill={form === 'default' ? '#00E5A0' : baseColor} />
      <circle cx="28" cy="22" r="2" fill={form === 'default' ? '#FFB347' : baseColor} />
      {/* 形态特征标记 */}
      {form === 'toaster' && (
        <rect x="16" y="12" width="16" height="4" rx="1" fill={baseColor} fillOpacity={0.5} />
      )}
      {form === 'alarm-clock' && (
        <>
          <circle cx="15" cy="16" r="3" fill="none" stroke={baseColor} strokeWidth="1" />
          <circle cx="33" cy="16" r="3" fill="none" stroke={baseColor} strokeWidth="1" />
        </>
      )}
      {form === 'rocket-pack' && (
        <path d="M18 38 L14 46 M30 38 L34 46" stroke={baseColor} strokeWidth="2" strokeLinecap="round" />
      )}
      {form === 'traverser' && (
        <circle cx="24" cy="24" r="18" fill="none" stroke={baseColor} strokeWidth="1" strokeDasharray="4 3" />
      )}
      {form === 'surreal-apparatus' && (
        <path d="M12 20 Q24 8 36 20 Q24 32 12 20" fill="none" stroke={baseColor} strokeWidth="1" />
      )}
    </svg>
  );
}

/** 企鹅变形弹窗组件 */
export default function GiftModal({ isOpen, onClose, onNavigateToRecharge }: GiftModalProps) {
  const [selectedForm, setSelectedForm] = useState<PenguinForm | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const penguin = useGameStore((s) => s.penguin);
  const economy = useGameStore((s) => s.economy);
  const transformPenguinForm = useGameStore((s) => s.transformPenguinForm);

  const handleTransform = useCallback(() => {
    if (!selectedForm) return;
    setError('');
    setSuccessMessage('');

    const result = transformPenguinForm(selectedForm);
    if (!result.success) {
      setError(result.error || '变形失败');
      return;
    }

    if (result.goldCost > 0) {
      setSuccessMessage(`解锁成功！消耗 ${result.goldCost} 金币`);
    } else {
      setSuccessMessage('形态切换成功');
    }

    /* 短暂展示成功消息后关闭 */
    setTimeout(() => {
      setSuccessMessage('');
      setSelectedForm(null);
      onClose();
    }, 1200);
  }, [selectedForm, transformPenguinForm, onClose]);

  const handleClose = useCallback(() => {
    setSelectedForm(null);
    setError('');
    setSuccessMessage('');
    onClose();
  }, [onClose]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="w-full max-w-[420px] p-6 sm:p-8">
        {/* 标题 */}
        <h3 className="font-display text-h3 gradient-text text-center mb-2">
          企鹅形态
        </h3>
        <p className="text-caption text-txt-secondary text-center mb-6">
          选择一个形态，让企鹅变身
        </p>

        {/* 余额显示 */}
        <div className="text-center mb-6">
          <span className="text-caption text-txt-secondary">金币余额：</span>
          <span className="font-mono text-body-lg text-amber-500 ml-1">
            {economy.goldBalance}
          </span>
        </div>

        {/* 形态网格 */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {PURCHASABLE_FORMS.map((formConfig, index) => {
            const isUnlocked = penguin.availableForms.includes(formConfig.form);
            const isCurrent = penguin.currentForm === formConfig.form;
            const isSelected = selectedForm === formConfig.form;
            const canAfford = economy.goldBalance >= formConfig.cost || isUnlocked;

            return (
              <motion.button
                key={formConfig.form}
                onClick={() => {
                  setSelectedForm(formConfig.form);
                  setError('');
                }}
                className={`
                  relative flex flex-col items-center p-3 rounded-card border transition-all
                  ${isCurrent
                    ? 'border-jade-500/60 bg-jade-500/[0.08]'
                    : isSelected
                      ? 'border-amber-500/60 bg-amber-500/[0.06]'
                      : isUnlocked
                        ? 'border-white/[0.08] bg-white/[0.03] hover:border-jade-500/30 hover:bg-jade-500/[0.03]'
                        : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                  }
                `}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.96 }}
              >
                {/* 锁定遮罩 */}
                {!isUnlocked && (
                  <div className="absolute inset-0 rounded-card bg-abyss-950/40 flex items-center justify-center z-10 pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#576173" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                )}

                {/* 企鹅图标 */}
                <div className={!isUnlocked ? 'opacity-40 grayscale' : ''}>
                  <PenguinFormIcon form={formConfig.form} isActive={isCurrent || isSelected} />
                </div>

                {/* 形态名称 */}
                <span className={`text-caption mt-1 ${isUnlocked ? 'text-txt-primary' : 'text-txt-muted'}`}>
                  {formConfig.name}
                </span>

                {/* 价格/状态 */}
                <span className={`text-overline mt-0.5 ${
                  isCurrent
                    ? 'text-jade-500'
                    : isUnlocked
                      ? 'text-txt-secondary'
                      : canAfford
                        ? 'text-amber-500'
                        : 'text-ember-400'
                }`}>
                  {isCurrent
                    ? '使用中'
                    : isUnlocked
                      ? '已解锁'
                      : formConfig.cost === 0
                        ? '免费'
                        : `${formConfig.cost} 金币`
                  }
                </span>

                {/* 当前形态指示 */}
                {isCurrent && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-jade-500 border-2 border-abyss-900" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* 选中形态的描述 */}
        <AnimatePresence mode="wait">
          {selectedForm && (
            <motion.div
              key={selectedForm}
              className="mb-4 p-3 rounded-card bg-white/[0.03] border border-white/[0.06]"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {(() => {
                const config = PENGUIN_FORMS.find((f) => f.form === selectedForm);
                if (!config) return null;
                return (
                  <>
                    <p className="text-caption text-txt-secondary leading-relaxed">
                      {config.description}
                    </p>
                    <p className="text-overline text-jade-500/60 mt-2 italic">
                      {config.symbolism}
                    </p>
                  </>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 错误提示 */}
        {error && (
          <p className="text-caption text-ember-400 text-center mb-3">{error}</p>
        )}

        {/* 成功提示 */}
        <AnimatePresence>
          {successMessage && (
            <motion.p
              className="text-caption text-jade-400 text-center mb-3"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {successMessage}
            </motion.p>
          )}
        </AnimatePresence>

        {/* 操作按钮 */}
        <div className="flex gap-3 justify-center">
          <Button variant="ghost" onClick={handleClose}>
            关闭
          </Button>
          {selectedForm && !penguin.availableForms.includes(selectedForm) && (
            (() => {
              const formConfig = PENGUIN_FORMS.find((f) => f.form === selectedForm);
              const cost = formConfig?.cost ?? 0;
              const canAfford = economy.goldBalance >= cost;
              if (!canAfford) {
                return (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      handleClose();
                      onNavigateToRecharge();
                    }}
                  >
                    去充值
                  </Button>
                );
              }
              return (
                <Button variant="secondary" onClick={handleTransform}>
                  解锁 ({cost} 金币)
                </Button>
              );
            })()
          )}
          {selectedForm && penguin.availableForms.includes(selectedForm) && penguin.currentForm !== selectedForm && (
            <Button variant="primary" onClick={handleTransform}>
              切换形态
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
