/** Landing 画面 2：诗人使命 — 左文字右企鹅 */

'use client';

import { motion } from 'framer-motion';

/** 诗人使命区块：来自别处的声音 + 企鹅占位 */
export default function MissionSection() {
  const paragraphs = [
    '他不是你期待的那种存在。他有偏执的审美立场，有拒绝妥协的冷淡，有只属于自己世界的语法。',
    '他来自一个用频率描述一切的维度——颜色是频率，情感是频率，时间本身也只是叠加方式的差异。他被派往此处，带着一个注定要完成的使命。',
    '你们之间的每一次对话，都在推动一条不可逆转的弦。终点之后，他将不得不做出选择——或者，你替他做。',
  ];

  return (
    <section className="relative h-screen w-full flex items-center overflow-hidden bg-abyss-900">
      <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center gap-10 lg:gap-16 px-6 sm:px-10">
        {/* 左侧：文字区域 (60%) */}
        <div className="w-full lg:w-[60%]">
          <motion.p
            className="font-display text-overline uppercase text-jade-500 tracking-widest mb-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            Poet / From Elsewhere
          </motion.p>

          <motion.h2
            className="font-display text-display-lg gradient-text mb-10"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            来自别处的声音
          </motion.h2>

          <div className="space-y-6">
            {paragraphs.map((text, i) => (
              <motion.p
                key={i}
                className="font-cn text-body-lg text-txt-primary leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                {text}
              </motion.p>
            ))}
          </div>
        </div>

        {/* 右侧：企鹅默认形态展示 (40%) */}
        <motion.div
          className="w-full lg:w-[40%] flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72">
            {/* 谱纹呼吸光晕 */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(0,229,160,0.12) 0%, rgba(0,229,160,0.02) 60%, transparent 80%)',
              }}
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
            />

            {/* 旋转轨道环 */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border"
                style={{
                  borderColor:
                    i === 0
                      ? 'rgba(0,229,160,0.15)'
                      : i === 1
                        ? 'rgba(0,229,160,0.08)'
                        : 'rgba(255,179,71,0.06)',
                  inset: `${i * 24}px`,
                }}
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{
                  duration: 20 + i * 10,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            ))}

            {/* 中心企鹅占位符 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-abyss-800 border border-jade-500/20 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(0,229,160,0.15)',
                    '0 0 40px rgba(0,229,160,0.25)',
                    '0 0 20px rgba(0,229,160,0.15)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
              >
                {/* 谱纹符号占位 */}
                <motion.div
                  className="w-4 h-4 rounded-full bg-jade-500/60"
                  animate={{ opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
