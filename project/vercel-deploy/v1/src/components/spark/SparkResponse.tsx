/** 火种回应输入 — 展开输入框 + 提交按钮 + 加载状态 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

interface SparkResponseProps {
  sparkId: string;
  onComplete: () => void;
}

type ResponsePhase = 'input' | 'submitting' | 'done';

/** 火种回应输入组件 */
export default function SparkResponse({ sparkId, onComplete }: SparkResponseProps) {
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<ResponsePhase>('input');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const recordSparkResponse = useGameStore((s) => s.recordSparkResponse);
  const updateFuelValue = useGameStore((s) => s.updateFuelValue);

  /** 自动聚焦输入框 */
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  /** 提交回应 */
  const handleSubmit = useCallback(async () => {
    if (!text.trim() || phase !== 'input') return;

    setPhase('submitting');

    /**
     * 此处应调用 GLM-5 API 评估回应质量。
     * 暂时使用基于文本长度和关键词的简单评级占位。
     * 集成阶段替换为真实 API 调用。
     */
    const rating = estimateRating(text.trim());

    /** 模拟网络延迟 */
    await new Promise((resolve) => setTimeout(resolve, 1200));

    /** 记录火种回应 */
    recordSparkResponse(sparkId, rating);

    /** 根据评级更新燃料 */
    const fuelChange = getFuelChangeByRating(rating);
    updateFuelValue(fuelChange);

    setPhase('done');

    /** 短暂展示结果后关闭 */
    setTimeout(() => {
      onComplete();
    }, 800);
  }, [text, phase, sparkId, recordSparkResponse, updateFuelValue, onComplete]);

  /** 键盘快捷键：Ctrl+Enter 提交 */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <motion.div
      className="mt-3 space-y-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* 输入阶段 */}
      {phase === 'input' && (
        <>
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="input-chat w-full min-h-[80px] resize-none"
            placeholder="用你的方式回应这个火种..."
            rows={3}
            aria-label="火种回应输入"
          />
          <div className="flex items-center justify-between">
            <span className="text-caption text-txt-ghost">
              Ctrl + Enter 提交
            </span>
            <motion.button
              onClick={handleSubmit}
              disabled={!text.trim()}
              className={`
                btn-primary text-body-sm px-5 py-1.5
                ${!text.trim() ? 'opacity-40 cursor-not-allowed' : ''}
              `}
              whileTap={text.trim() ? { scale: 0.96 } : {}}
            >
              提交回应
            </motion.button>
          </div>
        </>
      )}

      {/* 提交中 — 等待 GLM-5 评估 */}
      {phase === 'submitting' && (
        <div className="flex items-center justify-center gap-3 py-4">
          <LoadingDots />
          <span className="text-body-sm text-txt-secondary">
            诗人正在感受你的回应...
          </span>
        </div>
      )}

      {/* 完成 */}
      {phase === 'done' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center py-4"
        >
          <span className="text-body-sm text-jade-400">
            回应已记录
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}

/** 加载点动画 */
function LoadingDots() {
  return (
    <div className="flex gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-amber-400"
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/**
 * 临时评级估算（集成阶段替换为 GLM-5 API 调用）
 * 1=复述 2=常规转化 3=创造性转化 4=卓越转化
 */
function estimateRating(text: string): number {
  const length = text.length;
  if (length < 10) return 1;
  if (length < 30) return 2;
  if (length < 80) return 3;
  return 4;
}

/** 各评级对应的燃料变化量 */
function getFuelChangeByRating(rating: number): number {
  switch (rating) {
    case 1: return -2;
    case 2: return 3;
    case 3: return 8;
    case 4: return 15;
    default: return 0;
  }
}
