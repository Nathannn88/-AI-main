/** 聊天 API 路由 — 代理转发到 GLM-5，服务端持有 API Key */

import { NextRequest, NextResponse } from 'next/server';
import { streamChat, createContentStream } from '@/lib/glm-client';
import type { ChatRequest, ChatError } from '@/types/chat';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  // 解析请求体
  let body: ChatRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: '请求格式错误' },
      { status: 400 }
    );
  }

  // 校验消息数组
  if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json(
      { error: '消息内容不能为空' },
      { status: 400 }
    );
  }

  try {
    // 调用 GLM-5 流式 API
    const sseStream = await streamChat({ messages: body.messages });

    // 转换为纯内容流
    const contentStream = createContentStream(sseStream);

    // 返回流式响应
    return new Response(contentStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error: unknown) {
    const chatError = error as ChatError;

    // 根据错误类型返回对应 HTTP 状态码
    const statusMap: Record<string, number> = {
      NETWORK_ERROR: 502,
      RATE_LIMIT: 429,
      TIMEOUT: 504,
      API_ERROR: 502,
      UNKNOWN: 500,
    };

    const status = statusMap[chatError.code] || 500;
    const message = chatError.message || '服务暂时不可用，请稍后重试';

    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}
