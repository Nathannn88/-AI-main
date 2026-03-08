/** 页面过渡动画包装器 — 统一的淡入淡出效果 */

'use client';

import { motion } from 'framer-motion';

interface AnimatedTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/** 页面/区块级过渡动画容器 */
export default function AnimatedTransition({ children, className = '' }: AnimatedTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
