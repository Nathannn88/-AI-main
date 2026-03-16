/**
 * 趣味自我介绍流程 v2
 * 6 轮对话式引导，数据驱动自 INTRO_STEPS。
 * 诗人台词逐行浮现，用户选择/输入后展示诗人回应，再过渡到下一轮。
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { INTRO_STEPS, INTRO_TOTAL_ROUNDS } from '@/data/prompts/intro-prompt';
import type { IntroStep } from '@/data/prompts/intro-prompt';

/* ------------------------------------------------------------------ */
/*  常量                                                               */
/* ------------------------------------------------------------------ */

/** 每行诗人台词之间的出现延迟（秒） */
const LINE_STAGGER = 0.6;
/** 诗人台词单行动画时长（秒） */
const LINE_DURATION = 0.5;
/** 诗人回应停留时间后自动进入下一轮（毫秒） */
const RESPONSE_LINGER_MS = 2400;
/** 最后一轮（第 6 轮）自动完成延迟（毫秒） */
const FINAL_ROUND_DELAY_MS = 3000;

/* ------------------------------------------------------------------ */
/*  流程阶段枚举                                                        */
/* ------------------------------------------------------------------ */

/** 每一轮内的子阶段 */
type RoundPhase =
  | 'lines'       // 诗人台词逐行浮现中
  | 'interact'    // 台词展示完毕，等待用户操作
  | 'response'    // 展示诗人回应
  | 'exiting';    // 正在退出，准备下一轮

/* ------------------------------------------------------------------ */
/*  子组件：诗人台词行                                                    */
/* ------------------------------------------------------------------ */

interface PoetLineProps {
  text: string;
  index: number;
  onLastLineShown?: () => void;
  isLast: boolean;
}

/** 单行诗人台词 — fade-in-up + 延迟 */
function PoetLine({ text, index, onLastLineShown, isLast }: PoetLineProps) {
  return (
    <motion.p
      className="font-poetic text-poetic text-txt-primary leading-relaxed"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: LINE_DURATION,
        delay: index * LINE_STAGGER,
        ease: [0, 0, 0.2, 1],
      }}
      onAnimationComplete={() => {
        if (isLast) onLastLineShown?.();
      }}
    >
      {text}
    </motion.p>
  );
}

/* ------------------------------------------------------------------ */
/*  子组件：选项按钮组                                                    */
/* ------------------------------------------------------------------ */

interface OptionButtonsProps {
  step: IntroStep;
  onSelect: (value: string) => void;
}

function OptionButtons({ step, onSelect }: OptionButtonsProps) {
  if (!step.options) return null;

  return (
    <motion.div
      className="flex flex-wrap justify-center gap-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
    >
      {step.options.map((opt) => (
        <motion.button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          className="btn-primary"
          whileHover={{
            scale: 1.04,
            boxShadow: '0 0 36px rgba(0, 229, 160, 0.30)',
          }}
          whileTap={{ scale: 0.97 }}
        >
          {opt.label}
        </motion.button>
      ))}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  子组件：自由输入框                                                    */
/* ------------------------------------------------------------------ */

interface FreeInputProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
}

function FreeInput({ onSubmit, placeholder }: FreeInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 入场后自动聚焦
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && value.trim()) {
        e.preventDefault();
        onSubmit(value.trim());
      }
    },
    [value, onSubmit],
  );

  return (
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: [0, 0, 0.2, 1] }}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="input-chat w-full"
        placeholder={placeholder ?? '输入你的回答...'}
      />
      <AnimatePresence>
        {value.trim() && (
          <motion.button
            className="mt-4 mx-auto block text-caption text-jade-500 hover:text-jade-300 transition-colors"
            onClick={() => onSubmit(value.trim())}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            确认
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  子组件：诗人回应气泡                                                  */
/* ------------------------------------------------------------------ */

interface PoetResponseProps {
  text: string;
}

function PoetResponse({ text }: PoetResponseProps) {
  return (
    <motion.div
      className="bubble-poet max-w-md"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
    >
      {text}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  子组件：步骤指示器                                                    */
/* ------------------------------------------------------------------ */

interface StepIndicatorProps {
  total: number;
  current: number;
}

function StepIndicator({ total, current }: StepIndicatorProps) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: total }, (_, i) => (
        <motion.div
          key={i}
          className={`w-2 h-2 rounded-full transition-all duration-slow ${
            i < current
              ? 'bg-jade-500/50'
              : i === current
                ? 'bg-jade-500 shadow-jade-glow'
                : 'border border-white/[0.06]'
          }`}
          layout
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  主组件                                                             */
/* ------------------------------------------------------------------ */

interface IntroFlowProps {
  onComplete: () => void;
}

export default function IntroFlow({ onComplete }: IntroFlowProps) {
  /* --- Store --- */
  const { saveIntroAnswer, setUserName, completeIntro } = useGameStore();
  const userName = useGameStore((s) => s.user.name);

  /* --- 本地状态 --- */
  const [roundIndex, setRoundIndex] = useState(0);
  const [phase, setPhase] = useState<RoundPhase>('lines');
  const [responseText, setResponseText] = useState('');

  /* 防止 setTimeout 泄漏 */
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  /* 当前轮次数据（含边界保护） */
  const safeIndex = Math.min(roundIndex, INTRO_STEPS.length - 1);
  const currentStep = INTRO_STEPS[safeIndex];
  const isLastRound = safeIndex === INTRO_TOTAL_ROUNDS - 1;

  /* 替换第 6 轮中的 {userName} 占位符 */
  const resolvePoetLines = useCallback(
    (lines: string[]): string[] =>
      lines.map((line) => line.replace('{userName}', userName || '你')),
    [userName],
  );

  const poetLines = resolvePoetLines(currentStep.poetLines);

  /* --- 回调 --- */

  /** 诗人台词全部展示完毕 */
  const handleLinesComplete = useCallback(() => {
    // 最后一轮（第 6 轮）没有交互，展示完直接等待后 complete
    if (isLastRound) {
      setPhase('interact'); // 短暂展示，然后自动完成
      timerRef.current = setTimeout(() => {
        completeIntro();
        onComplete();
      }, FINAL_ROUND_DELAY_MS);
      return;
    }
    setPhase('interact');
  }, [isLastRound, completeIntro, onComplete]);

  /** 用户选择了一个预设选项 */
  const handleOptionSelect = useCallback(
    (value: string) => {
      // 保存回答
      if (currentStep.systemRecord) {
        saveIntroAnswer(currentStep.systemRecord, value);
      }

      // 查找回应
      const response = currentStep.responseMap?.[value];
      if (response) {
        setResponseText(response);
        setPhase('response');
        timerRef.current = setTimeout(() => {
          setPhase('exiting');
        }, RESPONSE_LINGER_MS);
      } else {
        // 无回应映射，直接进入下一轮
        setPhase('exiting');
      }
    },
    [currentStep, saveIntroAnswer],
  );

  /** 用户提交了自由输入 */
  const handleFreeSubmit = useCallback(
    (text: string) => {
      // 第 5 轮是名字
      if (currentStep.systemRecord === 'userName') {
        setUserName(text);
      }
      if (currentStep.systemRecord) {
        saveIntroAnswer(currentStep.systemRecord, text);
      }

      // 自由输入的回应暂不调用 GLM-5，用一句过渡性文字
      // （后续集成阶段会替换为真实 API 调用）
      setResponseText('......');
      setPhase('response');
      timerRef.current = setTimeout(() => {
        setPhase('exiting');
      }, RESPONSE_LINGER_MS * 0.6);
    },
    [currentStep, saveIntroAnswer, setUserName],
  );

  /** exiting 动画完成后推进到下一轮 */
  const handleExitComplete = useCallback(() => {
    if (phase !== 'exiting') return;
    setRoundIndex((prev) => prev + 1);
    setPhase('lines');
    setResponseText('');
  }, [phase]);

  /* --- 判断是否展示自由输入（同时有选项 + freeInput 时，选项下方追加输入框） --- */
  const showOptions = phase === 'interact' && !!currentStep.options && !isLastRound;
  const showFreeInput = phase === 'interact' && !!currentStep.freeInput && !isLastRound;

  /* --- 渲染 --- */

  return (
    <div className="fixed inset-0 bg-gradient-deep flex flex-col items-center justify-center px-4 sm:px-6 z-content overflow-hidden">
      {/* 深空背景微粒效果 — 纯 CSS */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-jade-500/[0.02] blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-amber-500/[0.015] blur-[100px]" />
      </div>

      <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
        <motion.div
          key={roundIndex}
          className="relative max-w-xl w-full flex flex-col items-center gap-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* 诗人台词区域 */}
          <div className="w-full flex flex-col gap-4 min-h-[140px]">
            {poetLines.map((line, i) => (
              <PoetLine
                key={`${roundIndex}-${i}`}
                text={line}
                index={i}
                isLast={i === poetLines.length - 1}
                onLastLineShown={handleLinesComplete}
              />
            ))}
          </div>

          {/* 交互区域 */}
          <AnimatePresence mode="wait">
            {showOptions && (
              <OptionButtons
                key="options"
                step={currentStep}
                onSelect={handleOptionSelect}
              />
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {showFreeInput && (
              <FreeInput
                key="free-input"
                onSubmit={handleFreeSubmit}
                placeholder={
                  currentStep.systemRecord === 'userName'
                    ? '你希望被叫的名字'
                    : '或者，用你自己的话说...'
                }
              />
            )}
          </AnimatePresence>

          {/* 最后一轮的"进入对话"按钮 */}
          <AnimatePresence>
            {isLastRound && phase === 'interact' && (
              <motion.button
                className="btn-primary"
                onClick={() => {
                  if (timerRef.current) clearTimeout(timerRef.current);
                  completeIntro();
                  onComplete();
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                进入对话
              </motion.button>
            )}
          </AnimatePresence>

          {/* 诗人回应气泡 */}
          <AnimatePresence>
            {phase === 'response' && responseText && (
              <PoetResponse key="response" text={responseText} />
            )}
          </AnimatePresence>

          {/* 步骤指示器 */}
          <div className="mt-4">
            <StepIndicator total={INTRO_TOTAL_ROUNDS} current={roundIndex} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
