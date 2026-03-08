/** 底部输入栏 — 输入框 + 发送按钮 + 送礼按钮 */

'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface InputBarProps {
  onSend: (message: string) => void;
  onGiftClick: () => void;
  disabled?: boolean;
}

/** 聊天输入栏 */
export default function InputBar({ onSend, onGiftClick, disabled = false }: InputBarProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      // 发送后自动聚焦输入框
      textareaRef.current.focus();
    }
  }, [input, disabled, onSend]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // 自适应高度
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, []);

  const hasInput = input.trim().length > 0;

  return (
    <div className="glass-panel border-t border-white/[0.06] px-3 py-3 z-input shrink-0">
      <div className="max-w-3xl mx-auto flex items-end gap-3">
        {/* 送礼按钮 */}
        <motion.button
          onClick={onGiftClick}
          className="w-10 h-10 flex items-center justify-center rounded-[12px] text-amber-500 hover:text-amber-400 hover:bg-amber-500/[0.06] transition-all shrink-0 focus-visible:outline-2 focus-visible:outline-amber-500 focus-visible:outline-offset-2"
          whileTap={{ scale: 0.9 }}
          aria-label="送礼"
          title="送礼"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 12 20 22 4 22 4 12" />
            <rect x="2" y="7" width="20" height="5" />
            <line x1="12" y1="22" x2="12" y2="7" />
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
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
          placeholder="说点什么..."
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
