/** Landing 画面 3：企鹅能力 — 横向滚动的 5 形态卡片 */

'use client';

import { motion } from 'framer-motion';

interface PenguinForm {
  name: string;
  description: string;
  color: string;
  glowColor: string;
  borderColor: string;
}

const forms: PenguinForm[] = [
  {
    name: '默认形态',
    description: '深空靛青中的微光存在，带着翡翠绿谱纹的初始形态。',
    color: 'text-jade-500',
    glowColor: 'rgba(0,229,160,0.15)',
    borderColor: 'border-jade-500/20',
  },
  {
    name: '书卷形态',
    description: '沉浸在文字海洋中时展现的博学姿态，琥珀金的书页光晕。',
    color: 'text-amber-500',
    glowColor: 'rgba(255,179,71,0.15)',
    borderColor: 'border-amber-500/20',
  },
  {
    name: '闹钟形态',
    description: '时间紧迫时的焦躁变体，深樱红的脉冲提醒你——旅程有限。',
    color: 'text-ember-400',
    glowColor: 'rgba(199,62,92,0.15)',
    borderColor: 'border-ember-500/20',
  },
  {
    name: '星际形态',
    description: '与远方世界建立通信时的异维形态，星蓝紫的数据流环绕全身。',
    color: 'text-astral-400',
    glowColor: 'rgba(108,92,231,0.15)',
    borderColor: 'border-astral-500/20',
  },
  {
    name: '穿越器形态',
    description: '终局前的最终形态，所有颜色汇聚——翡翠、琥珀、樱红、星紫交织成光。',
    color: 'text-txt-primary',
    glowColor: 'rgba(232,237,244,0.1)',
    borderColor: 'border-white/10',
  },
];

/** 企鹅 5 形态横向滚动卡片 */
export default function PenguinShowcase() {
  return (
    <section className="relative h-screen w-full flex flex-col justify-center overflow-hidden bg-abyss-950">
      {/* 标题 */}
      <motion.div
        className="px-6 sm:px-10 mb-10 sm:mb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7 }}
      >
        <p className="font-display text-overline uppercase text-jade-500 tracking-widest mb-3">
          Five Forms
        </p>
        <h2 className="font-display text-h1 sm:text-display-lg text-txt-primary">
          他不只有一种样子
        </h2>
      </motion.div>

      {/* 横向滚动卡片区 */}
      <div
        className="flex gap-5 sm:gap-6 overflow-x-auto px-6 sm:px-10 pb-6 snap-x snap-mandatory no-scrollbar"
        style={{
          scrollbarWidth: 'none',
        }}
      >
        {forms.map((form, i) => (
          <motion.div
            key={form.name}
            className={`flex-shrink-0 w-[280px] h-[400px] glass-panel rounded-card ${form.borderColor} p-6 flex flex-col justify-between cursor-default snap-center
              transition-all duration-normal hover:-translate-y-1 hover:scale-[1.02]`}
            style={{
              boxShadow: `0 0 24px ${form.glowColor}`,
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{
              boxShadow: `0 0 40px ${form.glowColor}`,
            }}
          >
            {/* 形态视觉占位 */}
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center"
                style={{
                  background: `radial-gradient(circle, ${form.glowColor} 0%, transparent 70%)`,
                }}
                animate={{
                  scale: [1, 1.06, 1],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: [0.4, 0, 0.6, 1],
                }}
              >
                <div
                  className="w-5 h-5 rounded-full"
                  style={{
                    background: form.glowColor.replace('0.15', '0.6'),
                  }}
                />
              </motion.div>
            </div>

            {/* 形态信息 */}
            <div>
              <h3 className={`font-display text-h3 ${form.color} mb-2`}>
                {form.name}
              </h3>
              <p className="font-cn text-body-sm text-txt-secondary leading-relaxed">
                {form.description}
              </p>
            </div>
          </motion.div>
        ))}

        {/* 右侧留白，避免最后一张卡片贴边 */}
        <div className="flex-shrink-0 w-6 sm:w-10" aria-hidden="true" />
      </div>

      {/* 滚动提示 */}
      <motion.p
        className="text-center text-caption text-txt-muted mt-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
      >
        横向滑动查看更多形态
      </motion.p>
    </section>
  );
}
