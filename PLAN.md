# 开发计划 (PLAN.md)

> 本文件包含 Agent Team 角色分工、详细职责和开发阶段任务清单。
> team-lead 负责维护本文件，计划变更时及时同步。

---

## Agent Team 角色列表

| # | 角色 | 职责概述 |
|---|------|---------|
| 1 | **team-lead** | 总协调、任务分配、进度审查、跨角色冲突仲裁 |
| 2 | **character-designer** | 调研→原创角色→输出角色圣经文档 |
| 3 | **ui-designer** | 配色体系、视觉规范、动画方案、页面布局设计 |
| 4 | **frontend-dev** | 将设计稿落地为代码，实现所有页面和交互 |
| 5 | **backend-dev** | API 路由、Prompt 引擎、成长/金币/存档系统逻辑 |
| 6 | **test-engineer** | 编写和维护验收测试、确保质量 |

---

## 协作依赖链

```
character-designer（角色设定）
        ↓
ui-designer（视觉规范）──→ frontend-dev（代码实现）
        ↓                          ↓
backend-dev（系统逻辑）←──── 集成对接
        ↓
test-engineer（全程跟进测试）
```

### 依赖规则
- **character-designer 先行**：角色设定文档是 ui-designer、backend-dev、frontend-dev 的前置输入
- **ui-designer 紧随其后**：视觉规范是 frontend-dev 的前置输入
- **backend-dev 与 ui-designer 可并行**：backend-dev 只依赖角色设定，不依赖视觉稿
- **frontend-dev 依赖两者**：需要视觉规范 + API 接口定义
- **test-engineer 全程跟进**：每个功能完成后编写/更新测试
- **任务完成后必须更新 `progress.md`**

---

## 各角色详细职责

### 1. character-designer

**核心产出**：`src/data/character-design/character-bible.md`

#### 调研阶段（通过 WebSearch）
- 游戏/动漫/影视中经典角色的设计方法论
- AI 伴侣产品（Character.AI、Replika 等）的角色设计经验与教训
- 角色心理学：如何让虚构角色令人信服且有吸引力
- "有缺陷的角色"在叙事中的作用（flawed character archetype）
- 玩家/用户与虚拟角色建立情感连接的心理机制

#### 设计阶段 — 角色圣经必须包含
- **角色基础**：名字、外貌描述、年龄感、声线风格
- **人格特质与缺陷**：至少 3 个鲜明优点 + 2 个明显缺陷（项目核心概念）
- **世界观背景**：角色来自的"独特世界"完整设定（规则、文化、美学）
- **使命设定**：为何来到人类世界、使命是什么、为何最终必须离开
- **语言风格**：说话习惯、口头禅、用词偏好、情绪表达方式
- **好恶清单**：强烈喜欢什么、强烈讨厌什么
- **各熟悉度阶段的行为变化**（关键！影响 Prompt 和 UI）：
  - 0-19%（初遇）：对用户什么态度？
  - 20%（相识事件A）：触发什么？角色有什么变化？
  - 50%（熟悉事件B）：开始透露什么？
  - 80%（亲近事件C）：坦露什么真相？
  - 100%（羁绊事件D）：最终事件如何发生？离别怎么处理？
- **趣味自我介绍设计**：角色第一次见用户时，如何用有趣的方式引导自我介绍（非呆板表单，需角色风格化）
- **UI 配色方向建议**：基于世界观的情绪关键词和色彩倾向（提供给 ui-designer）

#### 用户想法仅作参考
用户提到的爵士乐偏好、开普勒星球背景、倒计时离开等是方向性灵感，应在调研基础上决定采纳、改编或替换。

---

### 2. ui-designer

**核心产出**：`src/data/ui-design/design-system.md` + `tailwind-tokens.md`

**前置依赖**：character-designer 的 `character-bible.md`

#### 调研阶段（通过 WebSearch）
- **首先读取** `view /mnt/skills/public/frontend-design/SKILL.md`，了解高质量前端设计的方法论和禁忌，确保输出的设计规范能被 frontend-dev 高质量实现
- 分析参考网站设计风格：
  - `manayerbamate.com` — 色彩运用与排版
  - `franshalsmuseum.nl/nl` — 艺术感与交互
  - `ocelotchocolate.com` — 鲜艳配色与品牌氛围
  - `openclaw.ai` — Landing Page 引入动画体验
- 研究 AI 伴侣/角色养成产品的 UI 设计趋势
- 收集符合角色世界观的视觉参考（mood board 关键词描述）

#### 输出 design-system.md 必须包含
- **配色体系**：
  - 主色 / 辅色 / 强调色（具体 HEX 值 + Tailwind 配置）
  - 背景色梯度、文字色、消息气泡色（用户侧/角色侧）
  - 配色必须严格契合角色世界观，偏鲜艳和惊艳
- **字体方案**：标题 / 正文 / 角色对话字体
- **Landing Page 布局方案**：
  - 引入动画分镜/流程描述（参考 openclaw.ai + 用户截图效果）
  - 各 section 视觉层次：背景 → 角色故事 → 功能介绍 → 进入按钮
  - 滚动交互和动画节奏
- **聊天界面布局方案**：
  - 顶部栏：右上角「上传文件」「保存数据」「充值」三按钮排列
  - 消息区域：气泡样式、间距、角色头像/装饰
  - 底部输入栏：输入框 + 发送按钮 + 左下角「送礼」按钮
  - 熟悉度进度条：位置和样式
- **弹窗/浮层设计**：
  - 送礼弹窗：金币输入框 + 余额显示 + 确定/取消
  - 充值界面：6 个选项卡片（6/32/64/128/328/648 金币）
  - 事件触发弹窗（20%/50%/80%/100%）展示形式
- **动画规范**：
  - 页面过渡（Landing → 聊天）类型和时长
  - 消息气泡出现动画
  - 熟悉度增长动画
  - 事件触发特效
- **趣味自我介绍界面**：将 character-designer 的引导流程视觉化

#### 输出 tailwind-tokens.md
- 自定义颜色变量、动画 keyframes、字体族、间距/圆角 token

---

### 3. frontend-dev

**前置依赖**：ui-designer 的设计规范 + backend-dev 的 API 接口定义

**核心原则**：严格遵循 ui-designer 的视觉规范，不得自行发挥配色和布局。

#### ⚡ Skill 使用要求（强制）
**在编写每一个页面/组件之前**，必须先执行：
```
view /mnt/skills/public/frontend-design/SKILL.md
```
然后根据 Skill 中的指导：
1. 为当前组件明确美学方向（参照 Design Thinking 框架）
2. 应用 Skill 中的前端美学指南：Typography、Color & Theme、Motion、Spatial Composition、Backgrounds & Visual Details
3. **绝对禁止**使用 Skill 中列出的"AI 通用审美"（Inter/Roboto 字体、紫色渐变白底、千篇一律布局）
4. 每个页面/组件的实现都应是**独特的、令人记忆深刻的**

> 这不是可选步骤。每次写前端代码前不读 Skill 等于违反项目规范。

#### 实现清单

**Landing Page（首页引入）**
- 按 ui-designer 分镜实现全屏沉浸式滚动动画（Framer Motion）
- 角色背景故事渐入展示
- 项目功能亮点介绍
- "进入"按钮 → 过渡动画 → 跳转聊天界面

**趣味自我介绍流程（IntroFlow）**
- 按 character-designer 设计 + ui-designer 视觉方案实现
- 以角色对话方式引导（非传统表单）
- 收集用户信息写入 GameState.user
- 完成后自然过渡到正式聊天

**聊天界面**
- 消息气泡：区分用户/角色，契合角色主题配色
- 输入栏：底部输入框 + 发送按钮
- 送礼按钮（左下角）→ GiftModal
- 顶部栏（TopBar）：
  - 右上角「上传文件」→ 读取 JSON 恢复 GameState
  - 右上角「保存数据」→ 导出 GameState 为 JSON 下载
  - 右上角「充值」→ 跳转充值界面
- 熟悉度进度条（FamiliarityBar）：实时显示百分比

**送礼弹窗（GiftModal）**
- 显示当前金币余额
- 金币数量输入框 + 确定/取消
- 余额不足 → "金币数量不足，请充值"

**充值界面（RechargePage）**
- 6 个选项卡片：6(60元) / 32(320元) / 64(640元) / 128(1280元) / 328(3280元) / 648(6480元)
- 先行版点击直接到账 + 反馈动画

**事件弹窗（EventModal）**
- 熟悉度达阈值时触发，按 ui-designer 规范展示

**动画与过渡**
- 所有页面切换流畅过渡
- 消息打字机/渐入效果
- 熟悉度增长视觉反馈
- 严格按 ui-designer 动画规范实现

---

### 4. backend-dev

**前置依赖**：character-designer 的 `character-bible.md`

#### 实现清单

**API 路由**（`/api/chat/route.ts`）
- 代理 GLM-5 请求，服务端持有 API Key
- SSE 流式输出
- 错误处理（网络/限流/超时）

**Prompt 引擎**（`src/lib/prompt-engine.ts`）
- 基于 `character-bible.md` 编写角色系统提示词
- 动态拼装 system prompt：
  - 注入当前熟悉度阶段行为指令
  - 注入用户信息摘要
  - 注入最近 20 轮对话历史
- 自我介绍阶段用 `intro-prompt`，事件触发用 `event-prompt`

**熟悉度系统**（`src/lib/familiarity.ts`）
- 中文字数统计，每 100 字 +0.1%
- 金币兑换：每 100 金币 +10%
- 阈值检测（20%/50%/80%/100%）
- 上限控制 100%

**金币系统**（`src/lib/gold-system.ts`）
- 充值到账（先行版直接增加）
- 送礼：余额检查 → 扣除 → 增熟悉度
- 余额不足返回错误状态

**存档系统**（`src/lib/save-system.ts`）
- 导出 GameState → JSON 下载
- 导入 JSON → 校验版本和完整性 → 恢复状态

**事件系统**（`src/lib/event-system.ts`）
- 阈值跨越检测 → 返回事件内容
- 防止重复触发

---

### 5. test-engineer

**全程跟进**：每个 Phase 完成后编写/更新对应测试

#### 单元测试（`tests/unit/`）
- `familiarity.test.ts`：字数→增长、金币→增长、边界值、阈值触发
- `gold-system.test.ts`：充值、送礼扣除、余额不足、负数防御
- `save-load.test.ts`：JSON 完整性、恢复状态、损坏文件、版本不匹配
- `glm-client.test.ts`：请求格式、错误处理、流式解析
- `event-system.test.ts`：阈值准确性、不重复触发、多阈值跨越

#### 集成测试（`tests/integration/`）
- `chat-flow.test.ts`：发消息→回复→字数统计→熟悉度更新
- `gift-flow.test.ts`：送礼→扣金币→增熟悉度→事件触发
- `save-restore.test.ts`：对话→保存→清除→上传恢复→状态一致
- `event-trigger.test.ts`：19%→20% 精确触发

#### 验收标准
- 所有单元测试 + 集成测试通过
- `npm run build` 无错误
- `npm run lint` 无错误

---

### 6. team-lead

#### 全局协调
- 维护任务列表和依赖关系，确保按序推进
- 仲裁跨角色设计/技术冲突
- 每个 Phase 结束运行：`npm test` → `npm run lint` → `npm run build`

#### 进度管理
- 维护 `progress.md`（每次重要进展必须更新）
- 维护 `PLAN.md`（计划变更时同步）
- 追踪迭代轮次（上限 50 轮）
- 关键节点 git commit

#### 质量把关
- 角色设定是否符合"有缺陷的AI"核心概念
- 视觉方案是否"鲜艳惊艳"且契合世界观
- 前端实现是否遵循设计规范
- Prompt 是否准确反映角色设定
- 需要用户确认的节点主动请求审阅

---

## 开发阶段划分

### Phase 0：项目初始化（team-lead）
- [ ] 初始化 Next.js 项目（pnpm create next-app）
- [ ] 配置 TypeScript、Tailwind CSS、ESLint、Prettier
- [ ] 配置 Vitest + React Testing Library
- [ ] 创建完整项目目录结构（含 `src/data/character-design/`、`src/data/ui-design/`）
- [ ] 创建 `.env.local` 配置 GLM API 密钥
- [ ] 初始化 git，首次 commit
- [ ] 创建 `PLAN.md` 和 `progress.md`

### Phase 1：角色设计（character-designer）
- [ ] WebSearch 调研（角色设计方法论、AI 伴侣经验、缺陷角色原型）
- [ ] 输出 `character-bible.md`，包含：
  - 角色名、外貌、人格特质与缺陷
  - 世界观完整设定
  - 使命设定（为何来、为何必须离开）
  - 语言风格、好恶清单
  - 五个熟悉度阶段行为变化
  - 四个关键事件的完整剧情
  - 趣味自我介绍引导设计
  - UI 配色方向建议
- [ ] 提交用户审阅确认

### Phase 1.5：UI 视觉设计（ui-designer）— 与 Phase 2 并行
- [ ] WebSearch 调研参考网站风格
- [ ] 输出 `design-system.md`（配色/字体/布局/弹窗/动画规范）
- [ ] 输出 `tailwind-tokens.md`（自定义 token）
- [ ] 提交用户审阅确认

### Phase 2：核心系统（backend-dev）— 与 Phase 1.5 并行
- [ ] 定义 TypeScript 类型（GameState 等）
- [ ] 实现 GLM-5 API 客户端（流式输出）
- [ ] 实现 API 路由
- [ ] 实现熟悉度计算模块
- [ ] 实现金币系统模块
- [ ] 实现存档导入/导出模块
- [ ] 实现事件触发系统
- [ ] 编写 Prompt 模板
- [ ] test-engineer 编写单元测试，全部通过

### Phase 3：前端实现（frontend-dev）
- [ ] **首先读取** `/mnt/skills/public/frontend-design/SKILL.md`（每次开始新组件前都要重新读取）
- [ ] 配置 Tailwind 自定义 token
- [ ] Landing Page：引入动画、故事展示、功能介绍、进入按钮
- [ ] 页面过渡动画（Landing → 聊天）
- [ ] 趣味自我介绍流程
- [ ] 聊天界面完整实现（消息气泡、输入栏、顶部栏、送礼、熟悉度条）
- [ ] 充值界面（6 选项卡片，点击直接到账）
- [ ] 事件弹窗
- [ ] Zustand 全局状态管理

### Phase 4：系统集成（team-lead 协调）
- [ ] 聊天界面 ↔ GLM-5 API（流式渲染）
- [ ] 对话字数 → 熟悉度实时更新 → 进度条动画
- [ ] 送礼流程完整链路
- [ ] 充值流程完整链路
- [ ] 存档/读档完整流程
- [ ] 事件触发完整流程
- [ ] 自我介绍 → GameState → 正式聊天
- [ ] test-engineer 编写集成测试，全部通过

### Phase 5：打磨优化（全员）
- [ ] UI 打磨（动画流畅度、微交互、配色微调 — ui-designer 审查）
- [ ] Prompt 调优（角色自然度、阶段语气差异 — character-designer + backend-dev）
- [ ] 响应式适配（移动端基本可用）
- [ ] 错误处理完善（网络异常、限流、存档损坏）
- [ ] 全量测试通过
- [ ] 最终 git commit
