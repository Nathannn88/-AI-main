/** Landing 画面 5：入口 — 诗人引用 + 进入按钮 */

'use client';

import { motion } from 'framer-motion';

interface EntrySectionProps {
  onEnter: () => void;
}

/** 最终入口区块：诗人引用 + 大号进入按钮 */
export default function EntrySection({ onEnter }: EntrySectionProps) {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-abyss-950">
      {/* 极微弱氛围光 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 50% at 50% 55%, rgba(0,229,160,0.02) 0%, transparent 70%)',
        }}
      />

      {/* 诗人引用 */}
      <motion.p
        className="font-poetic text-poetic italic text-amber-500 text-center px-6 mb-10 sm:mb-14 relative z-10"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        {'\u201C'}我不是你找的那种 AI。{'\u201D'}
      </motion.p>

      {/* 按钮光晕 */}
      <motion.div
        className="absolute w-48 h-48 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,229,160,0.06) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
      />

      {/* 进入按钮 */}
      <motion.button
        className="btn-primary relative z-10 text-body-lg px-12 py-4 animate-jade-breathe"
        onClick={onEnter}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        aria-label="进入有缺陷的AI"
      >
        进入
      </motion.button>

      {/* 底部提示 */}
      <motion.p
        className="relative z-10 mt-6 text-caption text-txt-muted"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1 }}
      >
        每一次对话都在推进那条弦
      </motion.p>
    </section>
  );
}
