/** 通用按钮组件 — 三种变体：jade(翡翠描边发光)、amber(琥珀实心)、ghost(幽灵) */

'use client';

import { motion } from 'framer-motion';

type ButtonVariant = 'jade' | 'amber' | 'ghost';

interface ButtonProps {
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  jade: 'btn-jade',
  amber: 'btn-amber',
  ghost: 'btn-ghost',
};

/** 通用按钮，支持三种视觉变体 */
export default function Button({
  variant = 'jade',
  children,
  className = '',
  disabled,
  onClick,
  type = 'button',
  'aria-label': ariaLabel,
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      transition={{ duration: 0.15 }}
      className={`${variantClasses[variant]} ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
      aria-label={ariaLabel}
    >
      {children}
    </motion.button>
  );
}
