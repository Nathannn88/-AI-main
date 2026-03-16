/** 玻璃态弹窗容器 — Framer Motion 进出动画 + 遮罩层 + 焦点陷阱 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useCallback } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** 是否为事件弹窗（使用更高 z-index） */
  isEvent?: boolean;
}

/** 获取 dialog 内的可聚焦元素 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
  );
}

/** 玻璃态模态弹窗 */
export default function Modal({ isOpen, onClose, children, isEvent = false }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // ESC 关闭 + 焦点陷阱
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    // Tab 焦点陷阱
    if (e.key === 'Tab' && dialogRef.current) {
      const focusable = getFocusableElements(dialogRef.current);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      // 记住打开前的焦点位置
      previousFocusRef.current = document.activeElement as HTMLElement;

      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      // 延迟聚焦到 dialog 内第一个可聚焦元素
      requestAnimationFrame(() => {
        if (dialogRef.current) {
          const focusable = getFocusableElements(dialogRef.current);
          if (focusable.length > 0) {
            focusable[0].focus();
          } else {
            dialogRef.current.focus();
          }
        }
      });
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';

      // 关闭后恢复焦点
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 ${isEvent ? 'z-event' : 'z-modal-backdrop'} flex items-center justify-center`}>
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-[4px]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* 弹窗内容 */}
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            className={`relative ${isEvent ? 'z-event' : 'z-modal'} glass-elevated rounded-modal max-w-[90vw]`}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
