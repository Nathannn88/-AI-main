# 项目进度追踪

> 每次有重要进展时更新。新 session 启动时首先阅读本文件。

---

## 当前状态

**版本**：v2 重构
**阶段**：Phase 3 — 系统集成
**最后更新**：2026-03-16

---

## v2 已完成

- [x] 项目目录重构：代码移入 `project/`，文档留在根目录
- [x] 设计文档体系重建：`项目圣经.md` + `角色资料/` + `视觉参考/`
- [x] 项目圣经 v1 完成（8 个章节全部填充）
- [x] 创建 `my-update-design-doc` skill（项目级，`.claude/skills/`）
- [x] **Phase 0 完成**：9 个设计空白全部填入项目圣经
  - 诗人人格详解（语言风格、好恶、5阶段行为、裂缝、使命渗透）
  - 企鹅 6 形态完整描述（视觉+动画+金币定价）
  - 6 轮自我介绍对话脚本
  - 四事件剧情（20%/50%/80%/100%）
  - 燃料公式（5 级评定 + GLM-5 评估 prompt）
  - 火种规则（4 类型 + 动态频率 + 混合生成）
  - 失速三级系统 + 恢复条件
  - 双结局完整分镜（结局一 8 帧 / 结局二 5 帧）
  - 灯塔模式完整交互规则
- [x] **Phase 1 完成**：核心系统重构（247 测试通过，lint 0 错误，build 成功）
  - 类型系统：GameState + FuelState + PenguinState + EndingState + SparkState
  - 熟悉度系统：纯对话驱动，金币不影响
  - 金币系统：仅企鹅变形用途
  - 企鹅变形系统：6 形态 + 金币定价 + 终局形态切换
  - 航程燃料系统：5 级评定 + 失速三级 + 灯塔触发
  - 火种系统：4 类型 + 动态频率 + GLM-5 评估
  - 终局系统：双结局 + 不可逆选择 + 结局二系统激活
  - Prompt 引擎：诗人 5 阶段 + 结局二远方模式 + 火种/回声生成
  - 事件系统：四事件完整剧情脚本
  - 自我介绍：6 轮对话脚本
  - Store：Zustand 全部 actions（燃料/企鹅/火种/终局）
  - 存档系统：适配新 GameState 结构

- [x] **Phase 2 完成**：UI 视觉设计 + 前端实现（247 测试通过，lint 0 错误，build 成功）
  - 基础设施：tailwind.config.ts / globals.css / layout.tsx 完全重写为 v2 设计令牌
  - Landing 页面：5 个新组件（Hero / Mission / PenguinShowcase / GrowthTimeline / Entry）
  - 聊天界面：7 个组件更新（ChatContainer / MessageBubble / TopBar / InputBar / FamiliarityBar / GiftModal / EventModal）
  - 新增组件：IntroFlow（6 轮对话引导）/ EndingChoice（全屏终极选择）/ PenguinDisplay + FormSelector
  - v1→v2 类名全量迁移：btn-jade→btn-primary / glass-panel-elevated→glass-elevated / bubble-cinis→bubble-poet / font-cinis→font-poetic 等
  - 8 个 hooks 验证 v2 兼容，无需修改

- [x] **Phase 3 完成**：系统集成（278 测试通过，lint 0 错误，build 成功）
  - useChat 添加终局触发检查（checkEndingTrigger）
  - useChat 添加结局二后火种轮数计数（incrementTurnsSinceLastSpark）
  - 聊天页面集成 EndingChoice 组件（100% 全屏终极选择）
  - 聊天页面集成 PenguinDisplay 组件（左下角固定，形态展示+切换）
  - 聊天页面集成 SparkDisplay 组件（结局二后火种展示+回应）
  - 聊天页面集成 useSpark hook（自动检查火种生成时机）
  - 结局二后粒子颜色切换为星空紫色调
  - 新增集成测试：ending-flow（8 tests）/ spark-flow（10 tests）/ penguin-flow（8 tests）/ full-lifecycle（5 tests）

- [x] **Phase 4 完成**：打磨优化（278 测试通过，lint 0 错误，build 成功）
  - 新增 ErrorBoundary 组件，包裹聊天主界面和终局界面
  - Modal 添加焦点陷阱（Tab 循环 + 打开/关闭焦点管理）
  - ParticleCanvas 性能优化（平方距离跳过 sqrt + will-change）
  - useChat 修复 race condition（API 失败时回滚消息）
  - IntroFlow 添加数组越界保护
  - GiftModal 宽度响应式修复（w-full max-w-[420px]）
  - FamiliarityBar 垂直条小屏适配（h-32 sm:h-48）
  - FuelBar 高度限制（min(80vh, 400px)）
  - 输入框 placeholder 对比度提升（txt-muted → txt-secondary）

## v2 待做

- [ ] 部署到 Vercel（需用户操作）

---

## v1 存档

> v1 基于旧角色"栖迟"，已全部完成。代码保留在 `project/` 下，设计文档存档在 `设计文档/角色资料/v1-旧版角色设计/` 和 `设计文档/视觉参考/v1-旧版UI设计/`。

- Phase 0：项目初始化 — `ecf34fd`
- Phase 1：角色设计（栖迟）— `aa20ea4`
- Phase 1.5：UI 视觉设计 — `aa20ea4`
- Phase 2：核心系统（100 tests）— `aa20ea4`
- Phase 3：前端实现 — `178e09e`
- Phase 4：系统集成（152 tests）— `3a02ae5`
- Phase 5：打磨优化 — `c8a9446`

---

## 部署信息

- **GitHub**：https://github.com/Nathannn88/flawed-ai
- **Vercel**：https://flawed-agent.vercel.app
- **注意**：v1 部署版本，v2 完成后需重新部署
