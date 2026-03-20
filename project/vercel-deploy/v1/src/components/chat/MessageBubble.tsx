/** 消息气泡 — 区分栖迟侧和用户侧，支持 Markdown */

'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import type { ChatMessage } from '@/types/chat';

interface MessageBubbleProps {
  message: ChatMessage;
}

/** 聊天消息气泡组件 */
export default function MessageBubble({ message }: MessageBubbleProps) {
  const isCinis = message.role === 'assistant';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="text-center py-2">
        <span className="text-caption text-txt-secondary">{message.content}</span>
      </div>
    );
  }

  const timestamp = new Date(message.timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      className={`flex ${isCinis ? 'justify-start' : 'justify-end'} group`}
      initial={{ opacity: 0, x: isCinis ? -12 : 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: isCinis ? 0.3 : 0.2,
        ease: [0, 0, 0.2, 1],
      }}
    >
      <div className={`flex flex-col ${isCinis ? 'items-start' : 'items-end'} ${isCinis ? 'max-w-[85%] sm:max-w-[75%]' : 'max-w-[85%] sm:max-w-[70%]'}`}>
        {/* 气泡主体 */}
        <div className={`flex ${isCinis ? 'flex-row' : 'flex-row-reverse'}`}>
          {/* 栖迟侧谱纹光带 */}
          {isCinis && (
            <div
              className="w-[2px] mr-3 rounded-full shrink-0 animate-pulse-glow"
              style={{
                background: 'linear-gradient(to bottom, var(--chord-color-1), var(--chord-color-2))',
                minHeight: '20px',
              }}
            />
          )}

          <div className={isCinis ? 'bubble-cinis' : 'bubble-user'}>
            <div className={`prose prose-invert max-w-none ${isCinis ? 'prose-lg' : 'prose-sm'}`}>
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p className={`m-0 ${isCinis ? 'font-cinis text-body-lg leading-[1.7]' : 'font-body text-body leading-[1.6]'} text-txt-primary`}>
                      {children}
                    </p>
                  ),
                  em: ({ children }) => (
                    <em className={isCinis ? 'text-jade-400' : ''}>{children}</em>
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
