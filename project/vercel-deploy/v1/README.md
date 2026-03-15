# 有缺陷的AI — 栖迟（Qīchí）

一个拥有独特人格、审美偏好和成长系统的 AI 伴侣应用。

角色「栖迟」来自谱渊——一个由纯粹频率构成的维度。他拥有极致的审美直觉，却也有审美暴政和时间感知错位两大缺陷。随着你们的对话深入，熟悉度逐渐提升，他会逐步展露自己的世界、使命，以及最终不可避免的离别。

## 功能

- 沉浸式 Landing Page 引入动画
- 趣味性角色自我介绍引导（非表单）
- 与栖迟实时对话（基于智谱 GLM-5）
- 熟悉度成长系统（对话 + 送礼）
- 四个关键剧情事件（20% / 50% / 80% / 100%）
- 金币充值与送礼系统
- 对话记录导出 / 导入（JSON 文件）

## 快速启动

### 1. 安装 Node.js

前往 https://nodejs.org 下载 LTS 版本并安装。

### 2. 安装依赖

```bash
npm install
```

### 3. 配置 API Key

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

然后编辑 `.env.local`，填入你的智谱 API Key。

> 没有 Key？前往 https://open.bigmodel.cn 免费注册获取。

### 4. 启动

```bash
npm run dev
```

浏览器打开 http://localhost:3000

## 技术栈

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + Framer Motion
- Zustand 状态管理
- 智谱 GLM-5 大模型

## 部署到 Vercel

1. 将代码推到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 在 Settings → Environment Variables 中添加：
   - `GLM_API_KEY` = 你的 API Key
   - `GLM_API_URL` = `https://open.bigmodel.cn/api/paas/v4/chat/completions`
   - `GLM_MODEL` = `glm-5`
4. 点击 Deploy，完成后分享链接即可
