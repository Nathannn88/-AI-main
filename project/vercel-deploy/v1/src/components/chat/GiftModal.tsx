/** 送礼弹窗 — 显示余额、输入金币数量、确认/取消 */

'use client';

import { useState, useCallback } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useGameStore } from '@/store/gameStore';

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToRecharge: () => void;
}

/** 送礼弹窗组件 */
export default function GiftModal({ isOpen, onClose, onNavigateToRecharge }: GiftModalProps) {
  const [amount, setAmount] = useState('100');
  const [error, setError] = useState('');
  const { economy, sendGift } = useGameStore();

  const handleConfirm = useCallback(() => {
    const num = parseInt(amount, 10);
    if (isNaN(num) || num <= 0) {
      setError('请输入有效的金币数量');
      return;
    }

    const result = sendGift(num);
    if (!result.success) {
      setError(result.error || '赠送失败');
      return;
    }

    setError('');
    setAmount('100');
    onClose();
  }, [amount, sendGift, onClose]);

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    setError('');
  }, []);

  const isInsufficient = parseInt(amount, 10) > economy.goldBalance;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[360px] max-w-[90vw] p-8">
        {/* 标题 */}
        <h3 className="font-display text-h3 text-amber-500 text-center mb-6">
          赠送频率共振
        </h3>

        {/* 余额显示 */}
        <div className="text-center mb-6">
          <span className="text-caption text-txt-secondary">当前余额：</span>
          <span className="font-mono text-body-lg text-amber-500 ml-2">
            {economy.goldBalance}
          </span>
          <span className="text-caption text-txt-secondary ml-1">金币</span>
        </div>

        {/* 输入框 */}
        <div className="mb-4">
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            min="1"
            className="input-chat w-full text-center font-mono text-body-lg"
            placeholder="输入金币数量"
          />
        </div>

        {/* 提示 */}
        <p className="text-caption text-txt-secondary text-center mb-6">
          每 100 金币 → 熟悉度 +10%
        </p>

        {/* 错误提示 */}
        {error && (
          <p className="text-caption text-ember-400 text-center mb-4">
            {error}
          </p>
        )}

        {/* 余额不足提示 */}
        {isInsufficient && !error && (
          <p className="text-caption text-center mb-4">
            <span className="text-ember-400">余额不足，</span>
            <button
              onClick={() => {
                onClose();
                onNavigateToRecharge();
              }}
              className="text-amber-500 hover:text-amber-400 underline transition-colors"
            >
              去充值
            </button>
          </p>
        )}

        {/* 按钮 */}
        <div className="flex gap-3 justify-center">
          <Button variant="ghost" onClick={onClose}>
            取消
          </Button>
          <Button
            variant="amber"
            onClick={handleConfirm}
            disabled={isInsufficient || !amount || parseInt(amount, 10) <= 0}
          >
            确认赠送
          </Button>
        </div>
      </div>
    </Modal>
  );
}
