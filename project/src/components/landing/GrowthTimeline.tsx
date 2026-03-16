/** Landing 画面 4：成长系统 — 垂直时间线，4 节点滚动触发点亮 */

'use client';

import { motion } from 'framer-motion';

interface TimelineNode {
  percentage: string;
  title: string;
  description: string;
}

const nodes: TimelineNode[] = [
  {
    percentage: '20%',
    title: '事件 A — 初识',
    description: '他开始注意到你。对话从冷淡试探转向谨慎的好奇。世界的第一道裂缝出现。',
  },
  {
    percentage: '50%',
    title: '事件 B — 信任',
    description: '他向你展示了不被允许展示的东西。琥珀金开始渗入原本纯粹的翡翠绿世界。',
  },
  {
    percentage: '80%',
    title: '事件 C — 临界',
    description: '旅程进入最终航段。熟悉度条变形为航程燃料条，倒计时不可逆地加速。',
  },
  {
    percentage: '100%',
    title: '终极选择',
    description: '两个选项，没有说明，不可撤回。你的选择将决定他的命运——以及你们之间关系的本质。',
  },
];

/** 成长系统时间线：4 阶段，翡翠绿连接线，滚动触发点亮 */
export default function GrowthTimeline() {
  return (
    <section className="relative h-screen w-full flex items-center overflow-hidden bg-abyss-900">
      <div className="max-w-3xl mx-auto w-full px-6 sm:px-10">
        {/* 标题 */}
        <motion.div
          className="mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-display text-overline uppercase text-jade-500 tracking-widest mb-3">
            Growth System
          </p>
          <h2 className="font-display text-h1 sm:text-display-lg text-txt-primary">
            一条不可逆的弦
          </h2>
        </motion.div>

        {/* 时间线 */}
        <div className="relative">
          {/* 连接线 */}
          <div className="absolute left-[19px] sm:left-[23px] top-0 bottom-0 w-[2px] bg-abyss-600" />

          {/* 渐进点亮的翡翠绿线 */}
          <motion.div
            className="absolute left-[19px] sm:left-[23px] top-0 w-[2px] origin-top"
            style={{
              background: 'linear-gradient(to bottom, #00E5A0, #00E5A0 60%, #FFB347 80%, #C73E5C)',
            }}
            initial={{ height: 0 }}
            whileInView={{ height: '100%' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* 节点列表 */}
          <div className="space-y-10 sm:space-y-12">
            {nodes.map((node, i) => (
              <motion.div
                key={node.percentage}
                className="relative pl-12 sm:pl-16"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {/* 节点圆点 */}
                <motion.div
                  className="absolute left-0 top-1 w-[10px] h-[10px] sm:w-[12px] sm:h-[12px] rounded-full border-2 border-jade-500 bg-abyss-900"
                  style={{
                    left: '14px',
                  }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.3 + i * 0.2,
                    duration: 0.4,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                >
                  {/* 脉动光晕 */}
                  <motion.div
                    className="absolute inset-[-4px] rounded-full"
                    style={{
                      background: 'rgba(0,229,160,0.2)',
                    }}
                    animate={{
                      scale: [1, 1.8, 1],
                      opacity: [0.3, 0, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: [0.4, 0, 0.6, 1],
                    }}
                  />
                </motion.div>

                {/* 百分比标签 */}
                <span className="font-display text-overline text-jade-500 tracking-widest">
                  {node.percentage}
                </span>

                {/* 标题 */}
                <h3 className="font-display text-h3 text-txt-primary mt-1 mb-2">
                  {node.title}
                </h3>

                {/* 描述 */}
                <p className="font-cn text-body text-txt-secondary leading-relaxed">
                  {node.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
