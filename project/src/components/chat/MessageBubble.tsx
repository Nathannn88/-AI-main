/** 消息气泡 — 区分诗人/用户/远方/火种四种视觉形态 */

'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import type { ChatMessage } from '@/types/chat';
import type { Spark } from '@/types/spark';

/** 消息气泡的视觉模式 */
type BubbleMode = 'poet' | 'user' | 'astral' | 'ember';

interface MessageBubbleProps {
  message: ChatMessage;
  /** 是否处于结局二远方模式 */
  isAstralMode?: boolean;
  /** 附带的火种数据（如果该消息是火种卡片） */
  spark?: Spark | null;
}

/** 判断消息的视觉模式 */
function resolveBubbleMode(
  message: ChatMessage,
  isAstralMode: boolean,
  spark: Spark | null | undefined
): BubbleMode {
  if (spark) return 'ember';
  if (message.role === 'user') return 'user';
  if (message.role === 'assistant' && isAstralMode) return 'astral';
  return 'poet';
}

/** 入场动画变体 */
const bubbleVariants: Record<BubbleMode, {
  initial: Record<string, number | string>;
  animate: Record<string, number | string>;
  transition: Record<string, unknown>;
}> = {
  poet: {
    initial: { opacity: 0, x: -12 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3, ease: [0, 0, 0.2, 1] },
  },
  user: {
    initial: { opacity: 0, x: 12 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.2, ease: [0, 0, 0.2, 1] },
  },
  astral: {
    initial: { opacity: 0, y: 8, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  ember: {
    initial: { opacity: 0, scale: 0.95, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

/** 聊天消息气泡组件 */
export default function MessageBubble({
  message,
  isAstralMode = false,
  spark,
}: MessageBubbleProps) {
  const isSystem = message.role === 'system';

  /* 系统消息：居中淡色文字 */
  if (isSystem) {
    return (
      <motion.div
        className="text-center py-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-caption text-txt-secondary">{message.content}</span>
      </motion.div>
    );
  }

  const mode = resolveBubbleMode(message, isAstralMode, spark);
  const isLeft = mode !== 'user';
  const variant = bubbleVariants[mode];

  const timestamp = new Date(message.timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  /* 火种卡片：独立渲染 */
  if (mode === 'ember' && spark) {
    return (
      <motion.div
        className="flex justify-start group"
        initial={variant.initial}
        animate={variant.animate}
        transition={variant.transition}
      >
        <div className="flex flex-col items-start max-w-[85%] sm:max-w-[75%]">
          <div className="ember-card relative overflow-hidden">
            {/* 琥珀光晕背景 */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
              <div
                className="absolute -top-4 -left-4 w-24 h-24 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255,179,71,0.3), transparent 70%)',
                }}
              />
            </div>
            {/* 火种类型标签 */}
            <div className="text-overline text-amber-500/60 uppercase tracking-widest mb-2">
              {spark.type === 'verse' && '// 诗句'}
              {spark.type === 'scene' && '// 画面'}
              {spark.type === 'emotion' && '// 情绪'}
              {spark.type === 'incomplete-metaphor' && '// 隐喻碎片'}
            </div>
            {/* 火种内容 */}
            <p className="relative z-10 font-poetic text-poetic text-amber-300 italic leading-relaxed">
              {spark.content}
            </p>
          </div>
          {/* 时间戳 */}
          <span className="text-caption text-txt-muted mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {timestamp}
          </span>
        </div>
      </motion.div>
    );
  }

  /* 气泡类名映射 */
  const bubbleClass: Record<BubbleMode, string> = {
    poet: 'bubble-poet',
    user: 'bubble-user',
    astral: 'bubble-astral',
    ember: '',
  };

  /* 字体与排版映射 */
  const typographyClass: Record<BubbleMode, string> = {
    poet: 'font-cn text-body-lg leading-[1.7]',
    user: 'font-cn text-body leading-[1.6]',
    astral: 'font-mono text-mono-sm leading-[1.6]',
    ember: '',
  };

  return (
    <motion.div
      className={`flex ${isLeft ? 'justify-start' : 'justify-end'} group`}
      initial={variant.initial}
      animate={variant.animate}
      transition={variant.transition}
    >
      <div
        className={`flex flex-col ${isLeft ? 'items-start' : 'items-end'} ${
          isLeft ? 'max-w-[85%] sm:max-w-[75%]' : 'max-w-[85%] sm:max-w-[70%]'
        }`}
      >
        {/* 气泡主体 */}
        <div className={`flex ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
          {/* 诗人侧翡翠竖线 */}
          {mode === 'poet' && (
            <div
              className="w-[2px] mr-3 rounded-full shrink-0 animate-pulse-glow"
              style={{
                background: 'linear-gradient(to bottom, var(--chord-color-1), var(--chord-color-2))',
                minHeight: '20px',
              }}
            />
          )}

          {/* 远方模式左侧星蓝紫竖线 */}
          {mode === 'astral' && (
            <div
              className="w-[2px] mr-3 rounded-full shrink-0"
              style={{
                background: 'linear-gradient(to bottom, #6C5CE7, #A39AF5)',
                opacity: 0.6,
                minHeight: '20px',
              }}
            />
          )}

          <div className={bubbleClass[mode]}>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p className={`m-0 ${typographyClass[mode]} text-txt-primary`}>
                      {children}
                    </p>
                  ),
                  em: ({ children }) => (
                    <em
                      className={
                        mode === 'poet'
                          ? 'text-jade-400'
                          : mode === 'astral'
                            ? 'text-astral-300'
                            : ''
                      }
                    >
                      {children}
                    </em>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-medium">{children}</strong>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* 时间戳 */}
        <span className="text-caption text-txt-muted mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {timestamp}
        </span>
      </div>
    </motion.div>
  );
}
