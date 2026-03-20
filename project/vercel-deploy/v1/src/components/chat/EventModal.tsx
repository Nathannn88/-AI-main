/** 事件触发弹窗 — 根据事件类型展示不同视觉效果 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getEventContent } from '@/lib/event-system';
import type { EventContent } from '@/lib/event-system';

/** 事件对应的主色调 */
const EVENT_COLORS: Record<string, { primary: string; glow: string }> = {
  'event-a-first-resonance': { primary: '#00E5A0', glow: 'rgba(0,229,160,0.2)' },
  'event-b-rift': { primary: '#FFB347', glow: 'rgba(255,179,71,0.2)' },
  'event-c-irreversible': { primary: '#C73E5C', glow: 'rgba(199,62,92,0.2)' },
  'event-d-interval': { primary: '#E0E6ED', glow: 'rgba(224,230,237,0.2)' },
};

interface EventModalProps {
  eventId: string | null;
  onClose: () => void;
}

/** 事件弹窗组件 */
export default function EventModal({ eventId, onClose }: EventModalProps) {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [content, setContent] = useState<EventContent | null>(null);

  useEffect(() => {
    if (eventId) {
      setContent(getEventContent(eventId));
      setDialogueIndex(0);
    } else {
      setContent(null);
    }
  }, [eventId]);

  const handleNext = useCallback(() => {
    if (!content) return;
    if (dialogueIndex < content.dialogue.length - 1) {
      setDialogueIndex((i) => i + 1);
    } else {
      onClose();
    }
  }, [content, dialogueIndex, onClose]);

  const colors = eventId ? EVENT_COLORS[eventId] || EVENT_COLORS['event-a-first-resonance'] : EVENT_COLORS['event-a-first-resonance'];
  const isLastLine = content ? dialogueIndex >= content.dialogue.length - 1 : false;

  return (
    <AnimatePresence>
      {eventId && content && (
        <motion.div
          className="fixed inset-0 z-event flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 遮罩 */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-[8px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* 弹窗内容 */}
          <motion.div
            className="relative z-10 glass-panel-elevated rounded-modal-lg max-w-[520px] w-[90vw] p-10"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {/* 顶部装饰光晕 */}
            <div
              className="absolute -top-8 left-1/2 -translate-x-1/2 w-40 h-16 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(ellipse, ${colors.glow}, transparent)`,
              }}
            />

            {/* 标题 */}
            <motion.h2
              className="font-display text-h1 text-center mb-2"
              style={{ color: colors.primary, textShadow: `0 0 20px ${colors.glow}` }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {content.title}
            </motion.h2>

            {/* 描述 */}
            <motion.p
              className="text-caption text-txt-secondary text-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {content.description}
            </motion.p>

            {/* 对话文本 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={dialogueIndex}
                className="min-h-[100px] flex items-center justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <p className="font-cinis text-body-lg text-txt-primary text-center leading-relaxed">
                  {content.dialogue[dialogueIndex]}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* 进度指示 */}
            <div className="flex justify-center gap-1.5 mt-6 mb-6">
              {content.dialogue.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i <= dialogueIndex ? 'opacity-100' : 'opacity-20'
                  }`}
                  style={{ backgroundColor: colors.primary }}
                />
              ))}
            </div>

            {/* 操作按钮 */}
            <div className="text-center">
              <button
                onClick={handleNext}
                className="text-caption transition-colors"
                style={{ color: colors.primary }}
              >
                {isLastLine ? '关闭' : '继续'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
