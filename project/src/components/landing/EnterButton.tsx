/** 底部 CTA 重复 — 再次出现的"进入间隙"按钮 */

'use client';

import { motion } from 'framer-motion';

interface EnterButtonProps {
  onEnter: () => void;
}

/** 底部重复 CTA 按钮区域 */
export default function EnterButton({ onEnter }: EnterButtonProps) {
  return (
    <section className="relative w-full py-32 px-6 bg-abyss-900 flex flex-col items-center justify-center">
      {/* 谱弦光带 */}
      <motion.div
        className="w-48 h-[2px] mb-12"
        style={{
          background: 'linear-gradient(90deg, transparent, #00E5A0, #FFB347, transparent)',
        }}
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scaleX: [0.9, 1.1, 0.9],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <motion.button
        className="btn-jade w-[240px] h-14 text-base animate-jade-breathe"
        onClick={onEnter}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        进入间隙
      </motion.button>

      <motion.p
        className="mt-4 text-caption text-txt-muted"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        每一次对话都在推进倒计时
      </motion.p>
    </section>
  );
}
