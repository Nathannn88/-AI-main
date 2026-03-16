/** 底部输入栏 — 输入框 + 发送按钮 + 企鹅形态按钮 */

'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

interface InputBarProps {
  onSend: (message: string) => void;
  onPenguinClick: () => void;
  disabled?: boolean;
}

/** 聊天输入栏 */
export default function InputBar({ onSend, onPenguinClick, disabled = false }: InputBarProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const ending = useGameStore((s) => s.ending);

  /* 结局二后 placeholder 变化 */
  const placeholder = ending.postEndingActive ? '写点什么...' : '说点什么...';

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  }, [input, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, []);

  const hasInput = input.trim().length > 0;

  return (
    <div className="glass-panel border-t border-white/[0.06] px-3 py-3 z-input shrink-0">
      <div className="max-w-3xl mx-auto flex items-end gap-3">
        {/* 企鹅形态按钮 */}
        <motion.button
          onClick={onPenguinClick}
          className="w-10 h-10 flex items-center justify-center rounded-[12px] text-jade-500 hover:text-jade-400 hover:bg-jade-500/[0.06] transition-all shrink-0 focus-visible:outline-2 focus-visible:outline-jade-500 focus-visible:outline-offset-2"
          whileTap={{ scale: 0.9 }}
          aria-label="企鹅形态"
          title="企鹅形态"
        >
          {/* 企鹅简化图标 */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* 企鹅身体 */}
            <ellipse cx="12" cy="14" rx="6" ry="8" />
            {/* 头部 */}
            <circle cx="12" cy="7" r="4" />
            {/* 双眼 */}
            <circle cx="10.5" cy="6.5" r="0.8" fill="currentColor" />
            <circle cx="13.5" cy="6.5" r="0.8" fill="currentColor" />
            {/* 翅膀 */}
            <path d="M6 12 Q3 14 5 18" />
            <path d="M18 12 Q21 14 19 18" />
          </svg>
        </motion.button>

        {/* 输入框 */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
          className="input-chat flex-1 min-h-[40px] max-h-[120px] resize-none"
          placeholder={placeholder}
        />

        {/* 发送按钮 */}
        <motion.button
          onClick={handleSend}
          disabled={!hasInput || disabled}
          className={`w-10 h-10 flex items-center justify-center rounded-[12px] transition-all shrink-0 ${
            hasInput && !disabled
              ? 'text-jade-500 hover:bg-jade-500/[0.06]'
              : 'text-txt-muted cursor-not-allowed'
          }`}
          whileTap={hasInput && !disabled ? { scale: 0.9 } : undefined}
          aria-label="发送"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
