/** 火种展示 — 企鹅"吐出"的审美碎片卡片，ember-card 样式 + 入场动画 */

'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import type { Spark } from '@/types/spark';
import SparkResponse from './SparkResponse';

/** 火种类型的中文名 */
const SPARK_TYPE_LABELS: Record<string, string> = {
  verse: '诗句',
  scene: '画面',
  emotion: '情绪',
  'incomplete-metaphor': '隐喻',
};

interface SparkDisplayProps {
  /** 企鹅在屏幕上的大致位置，用于计算起点动画 */
  penguinPosition?: { x: number; y: number };
}

/** 火种展示组件 */
export default function SparkDisplay({ penguinPosition }: SparkDisplayProps) {
  const [showResponse, setShowResponse] = useState(false);
  const pendingSpark = useGameStore((s) => s.spark.pendingSpark);

  const handleRespond = useCallback(() => {
    setShowResponse(true);
  }, []);

  const handleResponseComplete = useCallback(() => {
    setShowResponse(false);
  }, []);

  /** 没有待回应火种时不渲染 */
  if (!pendingSpark) return null;

  /** 计算入场动画起始位置（从企鹅位置"吐出"） */
  const originX = penguinPosition?.x ?? 40;
  const originY = penguinPosition?.y ?? (typeof window !== 'undefined' ? window.innerHeight - 80 : 600);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pendingSpark.id}
        className="w-full max-w-md mx-auto my-4"
        initial={{
          opacity: 0,
          scale: 0.3,
          x: originX - (typeof window !== 'undefined' ? window.innerWidth / 2 : 200),
          y: originY > 300 ? 100 : 0,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.8,
          y: -20,
        }}
        transition={{
          duration: 0.6,
          ease: [0.34, 1.56, 0.64, 1],
        }}
      >
        {/* 火种卡片 */}
        <SparkCard spark={pendingSpark} />

        {/* 回应区域 */}
        <AnimatePresence mode="wait">
          {showResponse ? (
            <motion.div
              key="response"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <SparkResponse
                sparkId={pendingSpark.id}
                onComplete={handleResponseComplete}
              />
            </motion.div>
          ) : (
            <motion.div
              key="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="mt-3 flex justify-center"
            >
              <motion.button
                onClick={handleRespond}
                className="btn-ghost text-amber-400 hover:text-amber-300 text-body-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                回应这个火种
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

/** 火种卡片内容 */
function SparkCard({ spark }: { spark: Spark }) {
  const typeLabel = SPARK_TYPE_LABELS[spark.type] ?? '火种';

  return (
    <div className="ember-card relative">
      {/* 类型标签 */}
      <span className="absolute top-3 right-4 text-[10px] text-amber-500/60 font-mono uppercase tracking-widest">
        {typeLabel}
      </span>

      {/* 火种内容 */}
      <p className="font-poetic text-poetic text-amber-300 italic leading-relaxed pr-12">
        {spark.content}
      </p>

      {/* 底部装饰线 */}
      <motion.div
        className="mt-4 h-[1px] bg-gradient-to-r from-amber-500/30 via-amber-500/10 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: 'left' }}
      />
    </div>
  );
}
