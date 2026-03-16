/** 事件弹窗 — 戏剧舞台风格，文字逐行浮现 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getEventContentById } from '@/lib/event-system';
import type { EventContent } from '@/lib/event-system';

/** 事件对应的主色调 */
const EVENT_COLORS: Record<string, { primary: string; glow: string; gradient: string }> = {
  'event-20-first-crack': {
    primary: '#4A9EFF',
    glow: 'rgba(74,158,255,0.2)',
    gradient: 'linear-gradient(135deg, #4A9EFF, #7BB8FF)',
  },
  'event-50-unnamed': {
    primary: '#FFB347',
    glow: 'rgba(255,179,71,0.2)',
    gradient: 'linear-gradient(135deg, #FFB347, #FFD98E)',
  },
  'event-80-voyage-start': {
    primary: '#1A3A6A',
    glow: 'rgba(26,58,106,0.3)',
    gradient: 'linear-gradient(135deg, #1A3A6A, #234B8A)',
  },
  'event-100-two-doors': {
    primary: '#E0E6ED',
    glow: 'rgba(224,230,237,0.2)',
    gradient: 'linear-gradient(135deg, #E0E6ED, #8B95A6)',
  },
};

/** 默认颜色 */
const DEFAULT_COLOR = {
  primary: '#4A9EFF',
  glow: 'rgba(74,158,255,0.2)',
  gradient: 'linear-gradient(135deg, #4A9EFF, #7BB8FF)',
};

/** 每行文字显示延迟（ms） */
const LINE_DELAY = 600;
/** 每行文字入场时长（ms） */
const LINE_DURATION = 400;

interface EventModalProps {
  eventId: string | null;
  onClose: () => void;
}

/** 事件弹窗组件 */
export default function EventModal({ eventId, onClose }: EventModalProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [allRevealed, setAllRevealed] = useState(false);
  const [content, setContent] = useState<EventContent | null>(null);

  /* 加载事件内容 */
  useEffect(() => {
    if (eventId) {
      setContent(getEventContentById(eventId));
      setVisibleLines(0);
      setAllRevealed(false);
    } else {
      setContent(null);
    }
  }, [eventId]);

  /* 逐行浮现定时器 */
  useEffect(() => {
    if (!content || !eventId) return;

    const totalLines = content.dialogueLines.length;
    if (visibleLines >= totalLines) {
      /* 所有行都已显示，延迟后显示按钮 */
      const timer = setTimeout(() => setAllRevealed(true), LINE_DURATION + 200);
      return () => clearTimeout(timer);
    }

    /* 递增可见行数 */
    const timer = setTimeout(
      () => {
        setVisibleLines((n) => n + 1);
      },
      visibleLines === 0 ? 800 : LINE_DELAY
    );

    return () => clearTimeout(timer);
  }, [content, eventId, visibleLines]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const colors = useMemo(
    () => (eventId ? EVENT_COLORS[eventId] || DEFAULT_COLOR : DEFAULT_COLOR),
    [eventId]
  );

  return (
    <AnimatePresence>
      {eventId && content && (
        <motion.div
          className="fixed inset-0 z-event flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 全屏遮罩 — bg-abyss-950/90 */}
          <motion.div
            className="absolute inset-0 bg-abyss-950/90 backdrop-blur-[12px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />

          {/* 舞台区域 */}
          <motion.div
            className="relative z-10 max-w-[600px] w-[90vw] px-8 py-12 sm:px-12 sm:py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            {/* 顶部装饰线 */}
            <motion.div
              className="w-16 h-[1px] mx-auto mb-8"
              style={{ background: colors.gradient }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />

            {/* 事件标题 — display 字体 + 渐变文字 */}
            <motion.h2
              className="font-display text-display text-center mb-3"
              style={{
                background: colors.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: 'none',
                filter: `drop-shadow(0 0 30px ${colors.glow})`,
              }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {content.title}
            </motion.h2>

            {/* 事件描述 */}
            <motion.p
              className="text-caption text-txt-secondary text-center mb-10 max-w-[400px] mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              {content.description}
            </motion.p>

            {/* 台词区域 — 逐行浮现 */}
            <div className="space-y-4 min-h-[200px]">
              {content.dialogueLines.map((line, i) => (
                <AnimatePresence key={i}>
                  {i < visibleLines && (
                    <motion.p
                      className="font-poetic text-body-lg text-txt-primary text-center leading-relaxed"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: LINE_DURATION / 1000,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      {line}
                    </motion.p>
                  )}
                </AnimatePresence>
              ))}
            </div>

            {/* 底部装饰线 */}
            <motion.div
              className="w-8 h-[1px] mx-auto mt-10 mb-6"
              style={{ background: colors.gradient }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: allRevealed ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            />

            {/* 继续按钮 — 文字全部显示后淡入 */}
            <AnimatePresence>
              {allRevealed && (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <button
                    onClick={handleClose}
                    className="text-caption tracking-widest uppercase transition-all duration-300 hover:tracking-[0.2em]"
                    style={{ color: colors.primary }}
                  >
                    继续
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
