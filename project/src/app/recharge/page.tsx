/** 充值界面 — 6 个金币选项卡片，先行版直接到账 */

'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { RECHARGE_OPTIONS, RECHARGE_PRICES } from '@/lib/gold-system';
import Button from '@/components/ui/Button';

/** 标记特殊选项 */
const TAGS: Record<number, string> = {
  64: '推荐',
  648: '最惠',
};

export default function RechargePage() {
  const router = useRouter();
  const { economy, addGold } = useGameStore();
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ amount: number; show: boolean } | null>(null);

  const handleRecharge = useCallback(() => {
    if (selected === null) return;

    addGold(selected);
    setFeedback({ amount: selected, show: true });
    setSelected(null);

    // 清除反馈动画
    setTimeout(() => setFeedback(null), 2000);
  }, [selected, addGold]);

  return (
    <div className="min-h-screen bg-abyss-900 flex flex-col">
      {/* 顶部栏 */}
      <div className="glass-panel-light h-14 flex items-center justify-between px-4 shrink-0">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-txt-secondary hover:text-txt-primary transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span className="text-body">返回</span>
        </button>
        <h1 className="font-display text-body-lg text-txt-primary">先行版充值中心</h1>
        <div className="w-16" />
      </div>

      {/* 当前余额 */}
      <div className="text-center py-8">
        <span className="text-caption text-txt-secondary">当前余额</span>
        <div className="mt-2">
          <span className="font-mono text-display text-amber-500">
            {economy.goldBalance}
          </span>
          <span className="text-body-lg text-txt-secondary ml-2">金币</span>
        </div>
      </div>

      {/* 充值选项 */}
      <div className="flex-1 px-6 pb-8">
        <div className="max-w-lg mx-auto grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {RECHARGE_OPTIONS.map((amount, i) => {
            const price = RECHARGE_PRICES[amount];
            const tag = TAGS[amount];
            const isSelected = selected === amount;

            return (
              <motion.button
                key={amount}
                onClick={() => setSelected(isSelected ? null : amount)}
                className={`relative glass-panel rounded-card p-4 flex flex-col items-center gap-2 transition-all ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/[0.06] shadow-amber-glow'
                    : 'hover:border-white/[0.10] hover:-translate-y-0.5'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileTap={{ scale: 0.97 }}
              >
                {/* 标签 */}
                {tag && (
                  <span className="absolute -top-2 -right-2 text-overline bg-ember-500 text-white px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                )}

                <span className="font-mono text-h2 text-amber-500">
                  {amount}
                </span>
                <span className="text-caption text-txt-secondary">金币</span>
                <span className="text-caption text-txt-muted">
                  ¥{price / 100}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* 提示 */}
        <p className="text-center text-caption text-txt-muted mt-8">
          先行版：选择即直接到账，无需支付
        </p>

        {/* 确认按钮 */}
        <div className="flex justify-center mt-6">
          <Button
            variant="amber"
            disabled={selected === null}
            onClick={handleRecharge}
          >
            确认充值
          </Button>
        </div>
      </div>

      {/* 充值成功反馈 */}
      <AnimatePresence>
        {feedback?.show && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-toast pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="glass-panel-elevated rounded-modal px-8 py-6 text-center"
              initial={{ scale: 0.5, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -30, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <motion.div
                className="font-mono text-display text-amber-500 mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                style={{ textShadow: '0 0 20px rgba(255,179,71,0.3)' }}
              >
                +{feedback.amount}
              </motion.div>
              <motion.div
                className="text-body text-txt-secondary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                金币已到账
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
