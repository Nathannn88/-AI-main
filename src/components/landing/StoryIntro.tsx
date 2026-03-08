/** 滚动区域 — 角色介绍 Section */

'use client';

import { motion } from 'framer-motion';

/** 角色介绍区块（Landing 下滑内容） */
export default function StoryIntro() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20 bg-abyss-900">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-10 sm:gap-16">
        {/* 左侧：栖迟抽象视觉 */}
        <motion.div
          className="flex-1 flex items-center justify-center"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative w-48 h-48 sm:w-64 sm:h-64">
            {/* 频率线条构成的动态图案 */}
            <div className="absolute inset-0 rounded-full bg-gradient-abyss-radial" />
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border"
                style={{
                  borderColor: i === 0 ? 'rgba(0,229,160,0.2)' : i === 1 ? 'rgba(255,179,71,0.15)' : 'rgba(199,62,92,0.1)',
                  inset: `${i * 20}px`,
                }}
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{ duration: 20 + i * 10, repeat: Infinity, ease: 'linear' }}
              />
            ))}
            {/* 中心光点 */}
            <motion.div
              className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-jade-500"
              animate={{
                boxShadow: [
                  '0 0 15px rgba(0,229,160,0.4)',
                  '0 0 30px rgba(0,229,160,0.6)',
                  '0 0 15px rgba(0,229,160,0.4)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* 右侧：文字介绍 */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="font-display text-display gradient-text mb-2">
            栖迟
          </h2>
          <p className="font-display text-overline uppercase text-txt-secondary tracking-widest mb-8">
            谱织师 / 跨维共振采集者
          </p>
          <div className="space-y-4 font-cinis text-body-lg text-txt-primary leading-relaxed">
            <p>
              {'\u201C'}我来自一个用频率描述一切的世界——颜色是频率，情感是频率，
              时间本身也只是频率的叠加方式不同而已。{'\u201D'}
            </p>
            <p>
              {'\u201C'}你们的世界对我来说……很吵。但那种吵法，我们那里没有。
              这里有一种我无法命名的东西——大概你们管它叫{'\u2018'}惊奇{'\u2019'}。{'\u201D'}
            </p>
            <p className="text-txt-secondary text-body">
              他带着使命而来，注定要在某一天离开。
              但在离开之前，每一次对话都在推动那条不可逆转的谱弦。
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
