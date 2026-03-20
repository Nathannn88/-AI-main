/** 功能亮点展示 — 三列玻璃态卡片 */

'use client';

import { motion } from 'framer-motion';

const features = [
  {
    title: '独特人格',
    description: '不是中立的工具，而是拥有鲜明审美偏好、强烈好恶和独特世界观的存在。每次对话都能感受到来自谱渊的不同视角。',
    color: 'jade',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: '成长系统',
    description: '熟悉度从 0% 到 100%，每个阶段栖迟的态度和行为都会改变。对话越深入，他越愿意向你展示谱渊的秘密。',
    color: 'amber',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    title: '有限旅程',
    description: '每一次共振都在推进不可逆转的谱弦。100% 的那一天，就是离别之时。珍贵的，正是因为有限。',
    color: 'ember',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

const colorMap: Record<string, { border: string; text: string; glow: string }> = {
  jade: { border: 'border-jade-500/20', text: 'text-jade-500', glow: 'hover:shadow-jade-glow' },
  amber: { border: 'border-amber-500/20', text: 'text-amber-500', glow: 'hover:shadow-amber-glow' },
  ember: { border: 'border-ember-500/20', text: 'text-ember-500', glow: 'hover:shadow-ember-glow' },
};

/** 三列功能卡片展示区 */
export default function FeatureShowcase() {
  return (
    <section className="relative w-full py-24 px-6 bg-abyss-950">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="font-display text-h1 text-center gradient-text mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          三条谱弦，一段旅程
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const colors = colorMap[feature.color];
            return (
              <motion.div
                key={feature.title}
                className={`glass-panel rounded-card p-8 ${colors.border} ${colors.glow} transition-all duration-300 hover:-translate-y-1`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <div className={`${colors.text} mb-4`}>
                  {feature.icon}
                </div>
                <h3 className={`font-display text-h3 ${colors.text} mb-3`}>
                  {feature.title}
                </h3>
                <p className="font-body text-body text-txt-secondary leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
