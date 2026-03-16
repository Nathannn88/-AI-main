/** 终极选择界面 — 全屏覆盖，颤抖 + 白光 + 双选项，不可逆 */

'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

/** 终极选择全屏组件 */
export default function EndingChoice() {
  const [phase, setPhase] = useState<'shake' | 'light' | 'choice' | 'chosen'>('shake');
  const [chosenOption, setChosenOption] = useState<'send-away' | 'become-poet' | null>(null);

  const endingState = useGameStore((s) => s.ending);
  const makeEndingChoice = useGameStore((s) => s.makeEndingChoice);

  /** 界面可见条件：已到达终局但尚未做出选择 */
  const isVisible = endingState.endingReached && endingState.choiceMade === 'none';

  /** 颤抖阶段结束后进入白光阶段 */
  const handleShakeComplete = useCallback(() => {
    setPhase('light');
  }, []);

  /** 白光阶段结束后显示选项 */
  const handleLightComplete = useCallback(() => {
    setPhase('choice');
  }, []);

  /** 玩家点击选项 — 不可逆 */
  const handleChoice = useCallback(
    (choice: 'send-away' | 'become-poet') => {
      setChosenOption(choice);
      setPhase('chosen');
      /** 短暂延迟后执行 store 操作，让退场动画有时间播放 */
      setTimeout(() => {
        makeEndingChoice(choice);
      }, 1500);
    },
    [makeEndingChoice]
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-finale flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 深色背景 */}
          <div className="absolute inset-0 bg-abyss-950" />

          {/* 阶段一：UI 颤抖 2s */}
          {phase === 'shake' && (
            <motion.div
              className="absolute inset-0"
              animate={{
                x: [0, -3, 3, -2, 2, -1, 1, 0],
              }}
              transition={{
                duration: 2,
                ease: 'easeInOut',
                repeat: 0,
              }}
              onAnimationComplete={handleShakeComplete}
            />
          )}

          {/* 阶段二：白色光线切割画面 */}
          <AnimatePresence>
            {(phase === 'light' || phase === 'choice' || phase === 'chosen') && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* 水平白光线 */}
                <motion.div
                  className="absolute w-full h-[2px] bg-white/80"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: 1.2,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onAnimationComplete={phase === 'light' ? handleLightComplete : undefined}
                  style={{ transformOrigin: 'center' }}
                />

                {/* 白光扩散辉光 */}
                <motion.div
                  className="absolute w-full h-[60px] bg-gradient-to-b from-transparent via-white/10 to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.8, 0.3] }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 阶段三：双选项文字 */}
          <AnimatePresence>
            {(phase === 'choice' || phase === 'chosen') && (
              <div className="relative z-10 flex flex-col items-center gap-16">
                {/* 送他离开 — 琥珀金 */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: chosenOption === 'become-poet' ? 0 : 1,
                    y: 0,
                    scale: chosenOption === 'send-away' ? 1.2 : 1,
                  }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`
                    text-h1 md:text-display font-poetic tracking-wide
                    text-amber-400 cursor-pointer select-none
                    transition-all duration-slow
                    hover:text-amber-300 hover:drop-shadow-[0_0_20px_rgba(255,179,71,0.4)]
                    ${chosenOption !== null ? 'pointer-events-none' : ''}
                  `}
                  onClick={() => handleChoice('send-away')}
                  disabled={chosenOption !== null}
                  aria-label="终极选择：送他离开"
                >
                  送他离开
                </motion.button>

                {/* 成为他 — 翡翠绿 */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: chosenOption === 'send-away' ? 0 : 1,
                    y: 0,
                    scale: chosenOption === 'become-poet' ? 1.2 : 1,
                  }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`
                    text-h1 md:text-display font-poetic tracking-wide
                    text-jade-400 cursor-pointer select-none
                    transition-all duration-slow
                    hover:text-jade-300 hover:drop-shadow-[0_0_20px_rgba(0,229,160,0.4)]
                    ${chosenOption !== null ? 'pointer-events-none' : ''}
                  `}
                  onClick={() => handleChoice('become-poet')}
                  disabled={chosenOption !== null}
                  aria-label="终极选择：成为他"
                >
                  成为他
                </motion.button>
              </div>
            )}
          </AnimatePresence>

          {/* 选择后：整屏淡出 */}
          {phase === 'chosen' && (
            <motion.div
              className="absolute inset-0 bg-abyss-950"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
