/** 顶部栏 — 栖迟状态 + 上传/保存/充值按钮 */

'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import ProgressRing from '@/components/ui/ProgressRing';

/** 阶段标签中文映射 */
const PHASE_LABELS: Record<string, string> = {
  intro: '初遇',
  acquaintance: '相识',
  familiar: '熟悉',
  close: '亲近',
  bonded: '羁绊',
};

/** 阶段标签颜色映射 */
const PHASE_COLORS: Record<string, string> = {
  intro: 'text-jade-500',
  acquaintance: 'text-jade-400',
  familiar: 'text-amber-500',
  close: 'text-ember-500',
  bonded: 'text-txt-secondary',
};

interface TopBarProps {
  onUpload: () => void;
  onSave: () => void;
  onRecharge: () => void;
}

/** 聊天界面顶部栏 */
export default function TopBar({ onUpload, onSave, onRecharge }: TopBarProps) {
  const { character, economy } = useGameStore();
  const phaseLabel = PHASE_LABELS[character.currentPhase] || '初遇';
  const phaseColor = PHASE_COLORS[character.currentPhase] || 'text-jade-500';

  return (
    <motion.header
      className="glass-panel-light h-14 flex items-center justify-between px-3 sm:px-4 z-topbar shrink-0"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 左侧：栖迟状态 */}
      <div className="flex items-center gap-2 sm:gap-3">
        <ProgressRing value={character.familiarity} size={32} strokeWidth={2.5} />
        <div className="flex flex-col">
          <span className="font-cinis text-body sm:text-body-lg text-txt-primary leading-tight">栖迟</span>
          <span className={`text-overline uppercase tracking-widest ${phaseColor}`}>
            {phaseLabel}
          </span>
        </div>
      </div>

      {/* 右侧：金币余额 + 操作按钮 */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* 金币余额 */}
        <span className="font-mono text-caption text-amber-500 mr-1 hidden sm:inline">
          {economy.goldBalance}
        </span>
        {/* 上传存档 */}
        <button
          onClick={onUpload}
          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-[10px] text-txt-secondary hover:text-jade-500 hover:bg-white/[0.04] transition-all focus-visible:outline-2 focus-visible:outline-jade-500 focus-visible:outline-offset-2"
          aria-label="导入存档"
          title="导入存档"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[18px] sm:h-[18px]">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </button>

        {/* 保存存档 */}
        <button
          onClick={onSave}
          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-[10px] text-txt-secondary hover:text-jade-500 hover:bg-white/[0.04] transition-all focus-visible:outline-2 focus-visible:outline-jade-500 focus-visible:outline-offset-2"
          aria-label="保存数据"
          title="保存数据"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[18px] sm:h-[18px]">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>

        {/* 充值 */}
        <button
          onClick={onRecharge}
          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-[10px] text-amber-500 hover:text-amber-400 hover:bg-amber-500/[0.06] transition-all focus-visible:outline-2 focus-visible:outline-amber-500 focus-visible:outline-offset-2"
          aria-label="充值金币"
          title="充值金币"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[18px] sm:h-[18px]">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </button>
      </div>
    </motion.header>
  );
}
