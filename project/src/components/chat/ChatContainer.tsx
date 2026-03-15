/** 消息容器 — 消息列表 + 自动滚动 + 打字指示器 */

'use client';

import { useRef, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import MessageBubble from './MessageBubble';

interface ChatContainerProps {
  isTyping: boolean;
}

/** 聊天消息列表容器 */
export default function ChatContainer({ isTyping }: ChatContainerProps) {
  const { chatHistory } = useGameStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory.length, isTyping]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-4 relative z-content"
    >
    <div className="max-w-3xl mx-auto space-y-4">
      {/* 空状态提示 */}
      {chatHistory.length === 0 && !isTyping && (
        <div className="flex items-center justify-center h-full">
          <p className="text-caption text-txt-muted text-center">
            开始你们的对话吧
          </p>
        </div>
      )}

      {/* 消息列表 */}
      {chatHistory.map((msg, i) => {
        const prevMsg = i > 0 ? chatHistory[i - 1] : null;
        const isSameSide = prevMsg && prevMsg.role === msg.role;
        return (
          <div key={msg.id} className={isSameSide ? 'mt-2' : 'mt-5'}>
            <MessageBubble message={msg} />
          </div>
        );
      })}

      {/* 打字指示器 */}
      {isTyping && (
        <div className="flex justify-start">
          <div className="flex items-center gap-3">
            <div
              className="w-[2px] h-6 rounded-full animate-pulse-glow"
              style={{
                background: 'linear-gradient(to bottom, var(--chord-color-1), var(--chord-color-2))',
              }}
            />
            <div className="bubble-cinis flex items-center gap-1.5 py-3 px-5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-jade-500 animate-typing-dot"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
    </div>
  );
}
