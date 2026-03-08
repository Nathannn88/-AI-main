/** GLM-5 API 客户端 — 服务端使用，支持 SSE 流式输出 */

import type { GLMMessage, ChatError } from '@/types/chat';

/** GLM API 请求参数 */
interface GLMRequestParams {
  messages: GLMMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

/** GLM API 配置 */
interface GLMConfig {
  apiKey: string;
  apiUrl: string;
  model: string;
}

/** 从环境变量获取配置 */
function getConfig(): GLMConfig {
  const apiKey = process.env.GLM_API_KEY;
  const apiUrl = process.env.GLM_API_URL;
  const model = process.env.GLM_MODEL || 'glm-5';

  if (!apiKey) {
    throw new Error('GLM_API_KEY 环境变量未配置');
  }
  if (!apiUrl) {
    throw new Error('GLM_API_URL 环境变量未配置');
  }

  return { apiKey, apiUrl, model };
}

/**
 * 创建 ChatError 对象
 */
function createChatError(code: ChatError['code'], message: string): ChatError {
  return { code, message };
}

/**
 * 调用 GLM-5 API（流式模式）
 * 返回 ReadableStream 用于 SSE 转发
 */
export async function streamChat(params: GLMRequestParams): Promise<ReadableStream<Uint8Array>> {
  const config = getConfig();

  const requestBody = {
    model: config.model,
    messages: params.messages,
    temperature: params.temperature ?? 0.8,
    max_tokens: params.maxTokens ?? 1024,
    stream: true,
  };

  let response: Response;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw createChatError('TIMEOUT', '请求超时，请稍后重试');
    }
    throw createChatError('NETWORK_ERROR', '网络连接失败，请检查网络后重试');
  }

  if (response.status === 429) {
    throw createChatError('RATE_LIMIT', '请求过于频繁，请稍等片刻再试');
  }

  if (!response.ok) {
    throw createChatError('API_ERROR', `服务暂时不可用（${response.status}），请稍后重试`);
  }

  if (!response.body) {
    throw createChatError('API_ERROR', '服务返回异常，请稍后重试');
  }

  return response.body;
}

/**
 * 解析 SSE 流中的内容文本
 * 将 GLM 的 SSE 格式转换为纯文本内容流
 */
export function createContentStream(sseStream: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = '';

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = sseStream.getReader();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            break;
          }

          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data:')) continue;

            const data = trimmed.slice(5).trim();
            if (data === '[DONE]') {
              controller.close();
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed?.choices?.[0]?.delta?.content;
              if (content) {
                controller.enqueue(encoder.encode(content));
              }
            } catch {
              // 跳过无法解析的行
            }
          }
        }
      } catch {
        controller.error(createChatError('NETWORK_ERROR', '流式传输中断'));
      }
    },
  });
}
