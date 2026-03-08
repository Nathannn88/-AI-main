# 角色设定修改指南

## 文件清单

| 文件 | 内容 | 影响范围 |
|------|------|---------|
| `1-角色基础.md` | 名字、外貌、年龄、声线 | 页面标题、TopBar、Landing、system prompt |
| `2-世界观与背景.md` | 世界设定、身份、使命 | system prompt、Landing 文案、事件内容 |
| `3-人格与语言风格.md` | 优缺点、说话方式、好恶 | system prompt（最核心）、所有 prompt |
| `4-成长阶段与事件.md` | 5 个阶段行为 + 4 个关键事件 | system prompt 阶段指令、event-system、event-prompts |
| `5-自我介绍流程.md` | 开场到结束的对话步骤 | intro-prompt、IntroFlow 组件 |
| `6-UI配色方向.md` | 配色、氛围、阶段色调 | tailwind.config、globals.css、design-system |

## 修改流程

1. **编辑对应的 md 文件**——把你的新设定写进去
2. **告诉 Claude**——"我改了 X 文件，请同步到代码"
3. **Claude 会自动更新**对应的代码文件，然后运行测试确认没问题

## 注意事项

- 改名字：只需改 `1-角色基础.md` 中的名字，Claude 会全局替换
- 改世界观：可能连带需要调整配色（`6-UI配色方向.md`）
- 改事件内容：阈值（20/50/80/100）是固定的，只能改事件的故事内容
- 改配色：会影响整个 UI，改动较大
- `character-bible.md` 是完整版角色圣经，上面 6 个文件是它的拆分接口。大改完成后 Claude 会自动同步 character-bible.md
