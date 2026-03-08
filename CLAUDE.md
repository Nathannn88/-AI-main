# 项目：有缺陷的AI (Flawed AI)

## 🌐 语言要求（最高优先级）
本项目所有交互、输出、汇报必须使用**中文**。绝不切换为英文。

## 🔄 Session 启动规则
**每次新打开此项目时，必须按顺序执行：**
1. 阅读 `progress.md` — 了解当前进度、未完成工作、已知问题
2. 阅读 `PLAN.md` — 了解角色分工、阶段划分、任务清单
3. 运行 `npm test` 确认测试状态
4. 根据 `progress.md` 中的"未完成的工作"，向用户汇报当前状况并询问下一步

> ⚠️ `progress.md` 是跨 session 衔接的核心文件，每次有重要进展时都要更新它。
> ⚠️ `PLAN.md` 包含所有角色分工和任务清单，是 agent team 的执行指南。

## ⚠️ 安全红线（不可违反）
- **禁止访问 `D:\保存文件\claude库\` 目录以外的任何文件**
- 禁止读取、编辑、创建、删除项目目录范围之外的文件
- 禁止在 Bash 中使用 cd 切换到项目目录之外
- 禁止 git push（本项目无 remote，也不需要推送）
- 所有文件操作必须在 `D:\保存文件\claude库\有缺陷的AI\` 内完成
- 如果某个操作需要访问外部路径，跳过该操作并记录原因

---

## 项目简介
一个拥有独特人格、审美偏好和成长系统的 AI 伴侣应用。不同于追求公正中立的传统 AI，这个 AI 拥有鲜明的个性、强烈的好恶，以及一个完整的背景故事。

### 粗略背景
介绍一个独特的世界。来自这个世界的角色有"特定的"使命，有"特定的"喜好。他的世界观价值观和正常人类不同。
这个角色迫于"..."原因来到这个世界以外与人类与"用户相遇"，但是迫于使命它会与...离开这个世界，彻底终结（可能偶尔还能传回消息等等）。

### 项目必备功能
1. 项目预期描述的功能
2. 需要从 website 开始使用，无需登录，无需数据库。对话框右上角有"上传文件"和"保存数据"按钮，点击即可下载/上传对话记录和成长参数 JSON 文件
3. 所有大模型调用使用 GLM-5

### 项目预期描述
1. 开头有类似 openclaw.ai 的引入动画（参考 `PixPin_2026-02-28_11-58-03.png`），引入角色背景和功能介绍
2. 从 home 页面点进去，伴随动画来到角色所在界面
3. 趣味性自我介绍引导（非呆板表单）
4. 熟悉度系统：20%/50%/80%/100% 触发事件
5. 熟悉度增长：每 100 字 +0.1%，每 100 金币 +10%
6. 送礼按钮（左下角）：弹出金币输入框，余额不足提示充值
7. 充值按钮（右上角）：6/32/64/128/328/648 金币选项，先行版直接到账

### UI与设计风格
- 画面 UI 风格和背景颜色严格契合角色背景
- 偏向鲜艳和惊艳
- 参考：`manayerbamate.com`、`franshalsmuseum.nl/nl`、`ocelotchocolate.com`、`openclaw.ai`

---

## 技术栈

### 前端
- **框架**：Next.js 14（App Router）
- **语言**：TypeScript
- **样式**：Tailwind CSS + Framer Motion（动画）
- **状态管理**：Zustand
- **Markdown 渲染**：react-markdown
- **文件处理**：浏览器原生 File API

### 后端（轻量级）
- **API 路由**：Next.js API Routes（`/app/api/`）
- **AI 模型**：智谱 GLM-5
  - 端点：`https://open.bigmodel.cn/api/paas/v4/chat/completions`
- **数据持久化**：无数据库，localStorage + JSON 导入/导出

### 开发工具
- **包管理器**：pnpm
- **代码检查**：ESLint + Prettier
- **测试框架**：Vitest + React Testing Library
- **构建工具**：Next.js 内置（Turbopack）

### 部署（先行版）
- 本地 `npm run dev`，后续可部署 Vercel / Cloudflare Pages

---

## 项目结构

```
有缺陷的AI/
├── CLAUDE.md                    # 项目规则（本文件，稳定不变）
├── PLAN.md                      # 开发计划、角色分工、任务清单
├── progress.md                  # 跨 session 进度追踪
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── .env.local                   # API 密钥（不入 git）
│
├── public/
│   ├── fonts/
│   ├── images/
│   └── sounds/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Landing Page
│   │   ├── chat/page.tsx        # 聊天主界面
│   │   ├── recharge/page.tsx    # 充值界面
│   │   └── api/chat/route.ts    # GLM-5 API 代理
│   │
│   ├── components/
│   │   ├── landing/             # HeroSection, StoryIntro, FeatureShowcase, EnterButton
│   │   ├── chat/                # ChatContainer, MessageBubble, InputBar, GiftButton,
│   │   │                        # GiftModal, FamiliarityBar, EventModal, TopBar
│   │   ├── intro/IntroFlow.tsx  # 趣味自我介绍
│   │   └── ui/                  # Button, Modal, ProgressRing, AnimatedTransition
│   │
│   ├── data/
│   │   ├── character-design/character-bible.md   # character-designer 输出
│   │   ├── ui-design/                            # ui-designer 输出
│   │   │   ├── design-system.md
│   │   │   └── tailwind-tokens.md
│   │   ├── prompts/             # system-prompt.ts, intro-prompt.ts, event-prompts.ts
│   │   └── recharge-options.ts
│   │
│   ├── hooks/                   # useChat, useFamiliarity, useGold, useSaveLoad
│   ├── store/gameStore.ts       # Zustand 全局状态
│   ├── lib/                     # glm-client, familiarity, save-system, text-utils
│   ├── types/                   # chat.ts, character.ts, game-state.ts
│   └── styles/globals.css
│
└── tests/
    ├── unit/                    # familiarity, gold-system, save-load, glm-client
    └── integration/             # chat-flow, event-trigger, gift-flow, save-restore
```

---

## Skill 使用规则

本项目可调用 Claude 内置的 Skill 来提升输出质量。**前端开发任务必须优先读取 Skill 文件。**

### 必须使用的 Skill
| 场景 | Skill 路径 | 说明 |
|------|-----------|------|
| 创建任何前端页面/组件/UI | `/mnt/skills/public/frontend-design/SKILL.md` | **每次**编写前端代码前都必须先 `view` 读取此文件，遵循其设计原则 |

### 使用流程
1. frontend-dev 在编写**任何**页面或组件代码之前，必须先执行 `view /mnt/skills/public/frontend-design/SKILL.md`
2. 阅读后根据 Skill 中的设计思维框架（Design Thinking）确定当前组件的美学方向
3. 严格遵循 Skill 中的前端美学指南（Typography、Color、Motion、Spatial Composition、Backgrounds）
4. **禁止使用 Skill 中明确禁止的"AI 通用审美"**：禁止 Inter/Roboto/Arial 字体、禁止紫色渐变白底、禁止千篇一律的布局

### 与 ui-designer 的关系
- ui-designer 输出的 `design-system.md` 定义了**具体配色和布局**
- frontend-design Skill 提供了**通用的高质量前端实现方法论**
- frontend-dev 同时遵循两者：设计规范来自 ui-designer，实现质量标准来自 Skill
- 如果 ui-designer 的规范与 Skill 的通用原则冲突，以 ui-designer 的规范为准（因为更贴合项目角色设定）

---

## 代码规范

### 通用规则
- TypeScript strict 模式，禁止 `any`（特殊情况需注释）
- 函数式组件 + Hooks，禁止 class 组件
- 每个文件只导出一个主组件/函数
- 文件名：PascalCase（组件）/ kebab-case（工具/配置）
- 变量/函数：camelCase，类型/接口：PascalCase
- 字符串单引号，JSX 属性双引号
- 代码注释中文，变量名/函数名英文
- 每个函数/组件顶部需中文注释说明用途
- 禁止 `console.log` 留在生产代码中
- API 密钥通过 `.env.local` 引用，禁止硬编码

### 环境变量
```
# .env.local
GLM_API_KEY=8552dea5632449bfa23f33403e8aa98e.8t4Vy19IFk6yDsSi
GLM_API_URL=https://open.bigmodel.cn/api/paas/v4/chat/completions
GLM_MODEL=glm-5
```

### Git 规范
- 提交格式：`<type>: <简要中文描述>`
- type：`feat` / `fix` / `style` / `refactor` / `test` / `docs` / `chore`
- 示例：`feat: 实现熟悉度进度条组件`
- 每个 Phase 完成后必须 commit，关键功能完成后也应 commit
- 禁止 git push

### 测试规范
- 每个核心模块必须有对应单元测试
- 测试文件命名：`<模块名>.test.ts`，测试描述使用中文
- 命令：`npm test` / `npm run build` / `npm run lint`

---

## 核心数据结构

### GameState
```typescript
interface GameState {
  user: {
    name: string;
    introCompleted: boolean;
    introAnswers: Record<string, string>;
  };
  character: {
    familiarity: number;         // 0-100
    totalWordsFromUser: number;
    eventsTriggered: string[];
    currentPhase: 'intro' | 'acquaintance' | 'familiar' | 'close' | 'bonded';
  };
  economy: {
    goldBalance: number;
    totalGoldEarned: number;
    totalGoldSpent: number;
    rechargeHistory: Array<{ amount: number; timestamp: string }>;
  };
  chatHistory: Array<{
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
  }>;
  meta: {
    version: string;
    createdAt: string;
    lastSavedAt: string;
  };
}
```

### 存档格式
- 文件名：`flawed-ai-save-{timestamp}.json`
- 包含完整 GameState，上传即恢复

---

## 系统规则速查

### 熟悉度
| 触发方式 | 计算规则 |
|---------|---------|
| 对话 | 每 100 字 → +0.1% |
| 送礼 | 每 100 金币 → +10% |
| 上限 | 最大 100% |

### 事件阈值
| 熟悉度 | 阶段 | 事件 |
|--------|------|------|
| 0-19% | intro | 神秘、疏远 |
| 20% | acquaintance | **事件A** |
| 50% | familiar | **事件B** |
| 80% | close | **事件C** |
| 100% | bonded | **事件D** |

> 事件内容由 character-designer 定义于 `character-bible.md`。

### GLM-5 API
- 端点：`POST https://open.bigmodel.cn/api/paas/v4/chat/completions`
- 参数：`model: "glm-5"`, `temperature: 0.8`, `max_tokens: 1024`, `stream: true`
- 对话历史发送最近 20 轮
- 错误处理：网络错误/限流/超时均显示友好提示，不暴露技术细节

---

## 运行规则

### 运行方式
- Claude Code 中启动 agent team，session 持续运行
- 电脑接通电源不睡眠

### 迭代控制
- 上限 50 轮，每阶段完成后运行 `npm test` → `npm run lint` → `npm run build`
- 全通过 → 下一阶段；失败 → 修复重试

### 额度耗尽处理（MAX 套餐，4小时刷新）
- rate limit 暂停等待，刷新后自动恢复
- team-lead 在关键节点做 git commit

### 安全措施
- 每个 Phase 完成后 git commit
- 任务反复失败（>3次）→ 跳过并记录到 `progress.md`
- `progress.md` 每次重要进展都必须更新
