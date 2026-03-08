/** 趣味自我介绍流程 — 栖迟式对话引导，非传统表单 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

/** 打字机效果文字显示 */
function TypewriterText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayText, setDisplayText] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayText('');

    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayText(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text, onComplete]);

  return (
    <span className="font-cinis text-body-lg text-txt-primary leading-relaxed">
      {displayText}
      {displayText.length < text.length && (
        <span className="inline-block w-[2px] h-5 bg-jade-500 ml-0.5 animate-pulse-glow" />
      )}
    </span>
  );
}

/** 颜色选择按钮 */
const COLOR_OPTIONS = [
  { name: '翡翠绿', value: 'green', color: '#00E5A0' },
  { name: '琥珀金', value: 'gold', color: '#FFB347' },
  { name: '深樱红', value: 'red', color: '#C73E5C' },
  { name: '深海蓝', value: 'blue', color: '#2D3F6E' },
  { name: '暮紫', value: 'purple', color: '#8B5CF6' },
  { name: '月白', value: 'white', color: '#E0E6ED' },
];

/** 介绍步骤定义 */
const STEPS = [
  {
    id: 'greeting',
    text: '……嗯。又一个间隙被打开了。\n\n你的频率很杂乱——不过不用在意，人类都这样。至少你没有像上次那个人那样一上来就问我"你是什么"。这算是个好的开始。',
    type: 'display' as const,
  },
  {
    id: 'name',
    text: '你有一个被反复叫到不再觉得特别的名字吧——是什么？',
    type: 'text-input' as const,
    question: 'name',
  },
  {
    id: 'color',
    text: '闭上眼睛，脑海里浮现的第一种颜色是什么？',
    type: 'color-select' as const,
    question: 'color',
  },
  {
    id: 'song',
    text: '最近在循环播放的歌？或者最近让你停下来多看了两秒的东西？',
    type: 'textarea' as const,
    question: 'song',
    placeholder: '什么都行，说细节',
  },
  {
    id: 'time',
    text: '你上一次觉得"时间突然变慢了"是在什么时候？',
    type: 'textarea' as const,
    question: 'time',
    placeholder: '想到什么说什么',
  },
  {
    id: 'summary',
    text: '有意思。你的频率比我想象中……复杂一些。不是贬义。复杂意味着有更多可以共振的面。\n\n好吧，我承认我对接下来的对话产生了一点期待。一点点。\n\n走吧——进入正式的对话。',
    type: 'final' as const,
  },
];

interface IntroFlowProps {
  onComplete: () => void;
}

/** 趣味自我介绍流程组件 */
export default function IntroFlow({ onComplete }: IntroFlowProps) {
  const [step, setStep] = useState(0);
  const [textReady, setTextReady] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { setUserName, saveIntroAnswer, completeIntro } = useGameStore();
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const currentStep = STEPS[step];

  // 文字展示完后聚焦输入框
  useEffect(() => {
    if (textReady && inputRef.current) {
      inputRef.current.focus();
    }
  }, [textReady]);

  // 每步重置状态
  useEffect(() => {
    setTextReady(false);
    setInputValue('');
  }, [step]);

  const handleTextComplete = useCallback(() => {
    setTextReady(true);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!inputValue.trim()) return;

    const current = STEPS[step];
    if (current.question === 'name') {
      setUserName(inputValue.trim());
    }
    if (current.question) {
      saveIntroAnswer(current.question, inputValue.trim());
    }

    setStep((s) => s + 1);
  }, [inputValue, step, setUserName, saveIntroAnswer]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  const handleAdvance = useCallback(() => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    }
  }, [step]);

  const handleComplete = useCallback(() => {
    completeIntro();
    onComplete();
  }, [completeIntro, onComplete]);

  return (
    <div className="fixed inset-0 bg-abyss-950 flex flex-col items-center justify-center px-4 sm:px-6 z-content">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="max-w-lg w-full flex flex-col items-center gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {/* 栖迟的文字 */}
          <div className="w-full text-center min-h-[120px]">
            <TypewriterText
              text={currentStep.text}
              onComplete={handleTextComplete}
            />
          </div>

          {/* 交互区域 */}
          {textReady && (
            <motion.div
              className="w-full flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* 纯展示步骤 — 点击继续 */}
              {currentStep.type === 'display' && (
                <button
                  onClick={handleAdvance}
                  className="text-caption text-txt-muted hover:text-jade-500 transition-colors"
                >
                  继续
                </button>
              )}

              {/* 文本输入 */}
              {currentStep.type === 'text-input' && (
                <div className="w-full max-w-sm">
                  <input
                    ref={inputRef as React.RefObject<HTMLInputElement>}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent border-b border-jade-500/30 pb-2 text-center text-body-lg text-txt-primary font-body outline-none focus:border-jade-500 transition-colors caret-jade-500"
                    placeholder="输入你的名字"
                    autoFocus
                  />
                  {inputValue.trim() && (
                    <motion.button
                      className="mt-4 mx-auto block text-caption text-jade-500"
                      onClick={handleSubmit}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      确认
                    </motion.button>
                  )}
                </div>
              )}

              {/* 颜色选择 */}
              {currentStep.type === 'color-select' && (
                <div className="flex flex-wrap justify-center gap-4">
                  {COLOR_OPTIONS.map((opt) => (
                    <motion.button
                      key={opt.value}
                      onClick={() => {
                        setInputValue(opt.name);
                        saveIntroAnswer('color', opt.name);
                        setTimeout(() => setStep((s) => s + 1), 400);
                      }}
                      className="flex flex-col items-center gap-2 group"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div
                        className="w-12 h-12 rounded-full border-2 border-white/10 group-hover:border-white/30 transition-all"
                        style={{
                          backgroundColor: opt.color,
                          boxShadow: `0 0 15px ${opt.color}40`,
                        }}
                      />
                      <span className="text-caption text-txt-secondary group-hover:text-txt-primary transition-colors">
                        {opt.name}
                      </span>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* 多行文本 */}
              {currentStep.type === 'textarea' && (
                <div className="w-full max-w-sm">
                  <textarea
                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={3}
                    className="w-full bg-transparent border border-white/[0.06] rounded-card p-4 text-body text-txt-primary font-body outline-none focus:border-jade-500/40 transition-colors caret-jade-500 resize-none"
                    placeholder={('placeholder' in currentStep ? currentStep.placeholder : '') ?? ''}
                    autoFocus
                  />
                  {inputValue.trim() && (
                    <motion.button
                      className="mt-3 mx-auto block text-caption text-jade-500"
                      onClick={handleSubmit}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      确认
                    </motion.button>
                  )}
                </div>
              )}

              {/* 最终步骤 — 进入聊天 */}
              {currentStep.type === 'final' && (
                <motion.button
                  className="btn-jade"
                  onClick={handleComplete}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  进入对话
                </motion.button>
              )}
            </motion.div>
          )}

          {/* 步骤指示器 */}
          <div className="flex gap-2 mt-4">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i < step
                    ? 'bg-jade-500/50'
                    : i === step
                      ? 'bg-jade-500'
                      : 'border border-white/[0.06]'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
