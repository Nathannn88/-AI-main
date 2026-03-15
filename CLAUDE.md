# 项目：有缺陷的AI (Flawed AI)

## 语言要求
本项目所有交互、输出、汇报必须使用**中文**。

## Session 启动规则
每次新打开此项目时，按顺序执行：
1. 阅读 `progress.md` — 当前进度与未完成工作
2. 阅读 `PLAN.md` — 角色分工与阶段任务
3. 在 `project/` 下运行 `npm test` 确认测试状态
4. 向用户汇报当前状况并询问下一步

> `progress.md` 是跨 session 衔接的核心文件，每次有重要进展时更新。
> 所有设计细节以 `project/设计文档/项目圣经.md` 为唯一来源。

## 安全红线
- 禁止访问 `D:\保存文件\claude库\` 目录以外的任何文件
- 禁止 git push
- API 密钥通过 `.env.local` 引用，禁止硬编码

---

## 项目简介

一个拥有独特人格、鲜明审美立场与完整成长结构的 **AI 诗人应用**。

核心特征：
- 明确的审美倾向，不完全迎合用户
- 具有使命与终局，存在不可逆选择
- 满足精神与审美需求，而非效率需求

> 它是一次可终止的审美训练仪式。

详细设定见 `project/设计文档/项目圣经.md`。

---

## 项目结构

```
flawed-ai/
├── CLAUDE.md                          # 项目规则（本文件）
├── PLAN.md                            # 开发计划与角色分工
├── progress.md                        # 跨 session 进度追踪
├── .claude/
│   └── skills/my-update-design-doc/   # 设计文档更新 skill
│
└── project/                           # Next.js 项目代码
    ├── 设计文档/
    │   ├── 项目圣经.md                # 唯一设计来源
    │   ├── 角色资料/                  # 建模、立绘等具体资料
    │   └── 视觉参考/                  # UI 截图、配色参考
    │
    ├── src/
    │   ├── app/                       # 页面与 API 路由
    │   ├── components/                # UI 组件
    │   ├── data/prompts/              # Prompt 模板（.ts）
    │   ├── hooks/                     # React Hooks
    │   ├── store/                     # Zustand 状态管理
    │   ├── lib/                       # 工具函数与系统逻辑
    │   └── types/                     # TypeScript 类型定义
    │
    ├── public/                        # 静态资源
    ├── tests/                         # 测试
    ├── package.json
    └── ...（配置文件）
```

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 14（App Router） |
| 语言 | TypeScript（strict） |
| 样式 | Tailwind CSS + Framer Motion |
| 状态管理 | Zustand |
| AI 模型 | 智谱 GLM-5 |
| 包管理器 | pnpm |
| 测试 | Vitest + React Testing Library |
| 数据持久化 | localStorage + JSON 导入/导出（无数据库） |

### 环境变量（`project/.env.local`）
```
GLM_API_KEY=8552dea5632449bfa23f33403e8aa98e.8t4Vy19IFk6yDsSi
GLM_API_URL=https://open.bigmodel.cn/api/paas/v4/chat/completions
GLM_MODEL=glm-5
```

### GLM-5 API
- 端点：`POST https://open.bigmodel.cn/api/paas/v4/chat/completions`
- 参数：`model: "glm-5"`, `temperature: 0.8`, `max_tokens: 1024`, `stream: true`
- 对话历史发送最近 20 轮
- 错误处理：友好中文提示，不暴露技术细节

---

## 系统规则速查

> 完整设计见项目圣经。此处仅列关键量化规则供开发参考。

### 熟悉度

| 触发方式 | 计算规则 |
|---------|---------|
| 对话 | 每 100 字 → +0.1% |
| 上限 | 最大 100% |

> 金币**不影响**熟悉度。80% 后熟悉度条转为"航程燃料条"。

### 事件阈值

| 熟悉度 | 事件 |
|--------|------|
| 20% | 事件 A |
| 50% | 事件 B |
| 80% | 事件 C |
| 100% | 终极选择（双结局） |

### 金币（仅趣味层）

- 选项：6 / 32 / 64 / 128 / 328 / 648
- 用途：加速企鹅变形、解锁特殊变形效果、解锁视觉演出
- **不可**：延长时间、增加熟悉度、影响终局

### 终局

100% 时出现选择（无说明文字，不可逆）：
1. **送他离开** → 旁观者结局（企鹅变船，系统结束）
2. **成为他** → 身份转移结局（进入航程燃料/火种/灯塔系统）

### 航程燃料（结局二专属）

| 用户行为 | 燃料变化 |
|---------|---------|
| 忽略企鹅火种 | 下降 |
| 复述火种 | 不变 |
| 创造性转化 | 增长 |

---

## Skill 使用规则

| 场景 | Skill | 要求 |
|------|-------|------|
| 前端页面/组件 | `frontend-design` | 每次编写前端代码前必须先加载 |
| 设计文档更新 | `my-update-design-doc` | 接收设计素材时使用 |

### frontend-design 使用要求
1. 编写任何页面/组件前先加载 skill
2. 根据 Design Thinking 框架确定美学方向
3. 禁止 AI 通用审美（Inter/Roboto 字体、紫色渐变白底）

---

## 代码规范

- TypeScript strict，禁止 `any`
- 函数式组件 + Hooks，禁止 class 组件
- 文件名：PascalCase（组件）/ kebab-case（工具）
- 代码注释中文，变量名英文
- 禁止 `console.log` 留在生产代码

### Git 规范
- 格式：`<type>: <简要中文描述>`
- type：`feat` / `fix` / `style` / `refactor` / `test` / `docs` / `chore`
- 禁止 git push

### 测试规范
- 核心模块必须有单元测试
- 命令在 `project/` 目录下运行：`npm test` / `npm run build` / `npm run lint`

---

## 运行规则

- 迭代上限 50 轮
- 每阶段完成后：`npm test` → `npm run lint` → `npm run build`
- 每个 Phase 完成后 git commit
- 任务反复失败（>3次）→ 跳过并记录到 `progress.md`
- `progress.md` 每次重要进展都必须更新
