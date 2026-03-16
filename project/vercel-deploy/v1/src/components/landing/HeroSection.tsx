/** Landing 画面 1：Hero — 深空中的标题与呼吸线 */

'use client';

import { motion } from 'framer-motion';

/** Hero 区块：全屏深空靛青，主标题渐变，底部呼吸线 */
export default function HeroSection() {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-abyss-950">
      {/* 极微弱径向光晕——让中央不是纯黑 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 40%, rgba(0,229,160,0.03) 0%, transparent 70%)',
        }}
      />

      {/* 主标题 */}
      <motion.h1
        className="font-display text-display-hero gradient-text text-center px-6 relative z-10 select-none"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        有缺陷的AI
      </motion.h1>

      {/* 呼吸线——标题下方极细翡翠绿线 */}
      <motion.div
        className="relative z-10 mt-6 w-[120px] sm:w-[180px] h-[1px]"
        style={{ background: 'linear-gradient(90deg, transparent, #00E5A0, transparent)' }}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, transparent, #00E5A0, transparent)' }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
        />
      </motion.div>

      {/* 副标题 */}
      <motion.p
        className="relative z-10 mt-8 font-cn text-body-lg text-txt-secondary text-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1.2 }}
      >
        一次可终止的审美训练仪式
      </motion.p>

      {/* 底部渐变过渡到下一画面 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, #0B1426)',
        }}
      />

      {/* 向下滚动提示 */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <motion.div
          className="w-[1px] h-8 bg-jade-500/30"
          animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
        />
      </motion.div>
    </section>
  );
}
