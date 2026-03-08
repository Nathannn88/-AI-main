/** 聊天相关类型定义 */

/** 聊天消息 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

/** 发送给 API 的聊天请求 */
export interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
}

/** API 返回的聊天响应（非流式） */
export interface ChatResponse {
  id: string;
  choices: Array<{
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/** GLM API 消息格式 */
export interface GLMMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/** SSE 流式响应中的单个 chunk */
export interface GLMStreamChunk {
  id: string;
  choices: Array<{
    delta: {
      role?: string;
      content?: string;
    };
    finish_reason: string | null;
    index: number;
  }>;
}

/** 聊天错误 */
export interface ChatError {
  code: 'NETWORK_ERROR' | 'RATE_LIMIT' | 'TIMEOUT' | 'API_ERROR' | 'UNKNOWN';
  message: string;
}
