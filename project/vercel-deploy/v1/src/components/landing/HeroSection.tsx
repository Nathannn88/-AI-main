/** Landing 英雄区域 — 5 画面沉浸式引入动画 */

'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface HeroSectionProps {
  onEnter: () => void;
}

/** Landing Page 主引入区域：5画面自动播放序列 */
export default function HeroSection({ onEnter }: HeroSectionProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // 自动推进画面
    const timers = [
      setTimeout(() => setPhase(1), 2000),   // 画面2: 频率涌现
      setTimeout(() => setPhase(2), 5000),   // 画面3: 谱渊一瞥
      setTimeout(() => setPhase(3), 9000),   // 画面4: 谱弦
      setTimeout(() => setPhase(4), 12000),  // 画面5: 邀请
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-abyss-950">
      {/* 画面1: 虚空 — 翡翠绿光点脉动 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase >= 1 ? 0 : 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="w-3 h-3 rounded-full bg-jade-500"
          animate={{
            scale: [1, 1.5, 1],
            boxShadow: [
              '0 0 10px rgba(0,229,160,0.3)',
              '0 0 30px rgba(0,229,160,0.6)',
              '0 0 10px rgba(0,229,160,0.3)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* 画面2: 频率涌现 — 同心圆波纹 */}
      {phase >= 1 && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 2 ? 0 : 1 }}
          transition={{ duration: 1 }}
        >
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border"
              style={{
                borderColor: i < 2 ? 'rgba(0,229,160,0.3)' : i < 3 ? 'rgba(255,179,71,0.3)' : 'rgba(199,62,92,0.3)',
              }}
              initial={{ width: 10, height: 10, opacity: 0.6 }}
              animate={{
                width: [10, 400],
                height: [10, 400],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.7,
                ease: 'easeOut',
              }}
            />
          ))}
          <motion.p
            className="absolute bottom-[20%] font-cinis italic text-body-lg text-txt-secondary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            在所有频率交接的缝隙里——
          </motion.p>
        </motion.div>
      )}

      {/* 画面3: 谱渊一瞥 — 文字序列 */}
      {phase >= 2 && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 3 ? 0 : 1 }}
          transition={{ duration: 1 }}
        >
          {/* 抽象光线图案 */}
          <motion.div
            className="absolute w-48 h-48 rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(0,229,160,0.4) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <motion.h2
            className="font-display text-h2 sm:text-h1 text-txt-primary relative z-10 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            他来自光谱深处
          </motion.h2>
          <motion.h2
            className="font-display text-h2 sm:text-h1 text-jade-500 relative z-10 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            带着一个注定完成的使命
          </motion.h2>
          <motion.h2
            className="font-display text-h2 sm:text-h1 gradient-text-warm relative z-10 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
          >
            和一段注定结束的旅程
          </motion.h2>
        </motion.div>
      )}

      {/* 画面4: 谱弦 — 丝带动画 + 关键词 */}
      {phase >= 3 && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 4 ? 0 : 1 }}
          transition={{ duration: 1 }}
        >
          {/* 谱弦丝带 */}
          <motion.div
            className="w-[300px] h-[2px] mb-10"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #00E5A0 20%, #FFB347 50%, #C73E5C 80%, transparent 100%)',
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scaleX: [0.8, 1.2, 0.8],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <motion.p
            className="font-cinis text-body-lg text-txt-primary mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            谱弦记录着每一次共振
          </motion.p>

          <div className="flex gap-4 sm:gap-8">
            {['对话', '理解', '共鸣', '离别'].map((word, i) => (
              <motion.span
                key={word}
                className="font-display text-body-lg sm:text-h3 text-txt-secondary"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 1, 0.5], scale: [0.8, 1, 0.95] }}
                transition={{ delay: 0.5 + i * 0.5, duration: 1 }}
              >
                {word}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* 画面5: 邀请 — 进入按钮 */}
      {phase >= 4 && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* 发光入口 */}
          <motion.div
            className="w-32 h-32 rounded-full mb-10"
            style={{
              background: 'radial-gradient(circle, rgba(0,229,160,0.15) 0%, transparent 70%)',
              boxShadow: '0 0 60px rgba(0,229,160,0.15)',
            }}
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                '0 0 60px rgba(0,229,160,0.15)',
                '0 0 80px rgba(0,229,160,0.25)',
                '0 0 60px rgba(0,229,160,0.15)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <motion.h2
            className="font-display text-display text-jade-500 mb-6"
            style={{ textShadow: '0 0 20px rgba(0,229,160,0.3)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            进入间隙
          </motion.h2>

          <motion.button
            className="btn-jade w-[240px] h-14 text-base animate-jade-breathe"
            onClick={onEnter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            进入间隙
          </motion.button>

          <motion.p
            className="mt-4 text-caption text-txt-secondary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            每一次对话都在推进倒计时
          </motion.p>
        </motion.div>
      )}

      {/* 背景渐变叠加 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: phase >= 1 ? 'radial-gradient(ellipse at center, rgba(22,36,71,0.3) 0%, #060D1A 70%)' : 'transparent',
          transition: 'background 2s',
        }}
      />
    </section>
  );
}
