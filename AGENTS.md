# AGENTS.md — AI 开发代理指令

> 本文件是交给 AI（Claude Code / Cursor / Codex 等）的常驻规范。开始任何改动前必须先读 `PRD.md` 与 `TECH_DESIGN.md`，三者冲突时优先级为：**PRD（做什么） > TECH_DESIGN（怎么做） > 本文件（代码风格）**。

---

## 一、项目概述

- **是什么**：一个深色星空主题的个人作品集网站（前台展示 + `/admin` 内容管理后台），纯前端 SPA。
- **技术栈**：React 19 + TypeScript 6 + Vite 8 + react-router-dom 7（HashRouter）+ 原生 CSS + localStorage + marked/DOMPurify/highlight.js + zod。
- **不做的事**：不引入后端、不引入 UI 组件库（Antd / MUI / shadcn）、不引入 CSS 框架（Tailwind / Sass）、不引入状态管理库。
- **运行方式**：

```bash
npm install        # 安装依赖
npm run dev        # 本地开发 http://localhost:5173
npm run build      # 类型检查 + 生产构建（必须通过）
npm run preview    # 预览构建产物
```

---

## 二、开发流程

1. **先读文档再动手**：确认需求在 PRD 中有编号（FR-xx），确认技术方案在 TECH_DESIGN 中有落点。
2. **小步提交**：一个功能一个 commit，消息用 `feat: … / fix: … / docs: … / style: …`。
3. **改完必须自检**：`npx tsc -b --noEmit` 通过、`npm run build` 通过、页面无控制台报错；不允许"应该能跑"。
4. **不要顺手重构**：只改与当前任务相关的文件，发现无关问题先记录在回复里，不擅自修改。
5. **验证优先于解释**：交付前用浏览器实际点一遍核心路径（首页 → 项目详情 → 博客 → 后台登录 → 改资料 → 回前台看效果）。

---

## 三、代码规范

### 3.1 TypeScript

- `strict` 开启，**禁止 `any`**；确实未知用 `unknown` 并做类型收窄。
- 领域模型统一放 `src/types.ts`，组件内不重复定义同名接口。
- 联合类型优于 `string` 魔法值：`status: 'draft' | 'published'`，不要写 `status: string`。
- 可选链 + 空值合并处理可能为空的数据，不允许出现 `xxx!` 非空断言掩盖问题。

### 3.2 React

- 只写函数组件 + hooks，不写 class 组件。
- 组件文件用 PascalCase，导出具名函数（`export function Navbar()`），默认导出仅用于页面级组件。
- 单文件不超过 **300 行**；超过就拆子组件或抽 hook。
- `useEffect` 必须有明确依赖数组；订阅类副作用必须返回清理函数（`removeEventListener` / `cancelAnimationFrame`）。
- 禁止在渲染函数里直接写 `localStorage` / `document.querySelector`，统一走 `api` 层或 ref。
- 列表 `key` 用稳定 `id`，不用数组下标。

### 3.3 CSS

- 颜色、圆角、间距、阴影、动效曲线**只能**取自 `src/styles/tokens.css` 中的 CSS 变量，禁止硬编码十六进制色值。
- 类名用语义化 kebab-case（`.project-card__title`），不用 `style={{}}` 写布局（仅动态数值如进度条宽度可以内联）。
- 新增样式按归属写进 `components.css` 对应区块，并按文件内注释分区，不新建散落的 css 文件。
- 移动端优先：默认样式面向窄屏，用 `@media (min-width: 640px)` 向上覆盖。

### 3.4 数据与 API

- 组件**禁止**直接访问 `localStorage`，一律通过 `src/api`。
- 新增字段必须同步三处：`types.ts` 类型、`seed.ts` 默认值、`schemas.ts` zod 校验。
- 写操作必须有反馈：成功 toast，失败提示原因；删除必须 `confirm` 二次确认。
- 纯前端鉴权只是门锁不是保险柜，相关代码需保留注释说明其边界。

---

## 四、视觉规范

| 项 | 要求 |
|---|---|
| 主题 | 深色；不得出现大面积纯白（`#fff`）背景 |
| 主色 | `--accent`（默认 `#6D8CFF`），来自设置项，可通过后台修改 |
| 正文 | `--text`（`#E6EAF2`），次级 `--text-dim`（`#8B96AD`） |
| 卡片 | 半透明面板 + 1px 描边 + 16px 圆角，hover 上浮 2px 并加强描边 |
| 动效 | 200–600ms，统一缓动；禁止弹跳、旋转等夸张动画 |
| 响应式 | 375 / 768 / 1024 / 1440 四个宽度必须无横向滚动、无文字截断 |
| 无障碍 | 焦点态可见（`:focus-visible` 描边）、图片有 `alt`、图标按钮有 `aria-label` |

---

## 五、测试要求

本项目不引入测试框架（纯展示型站点，成本不划算），改用**手动验收清单 + 构建校验**：

1. `npm run build` 零报错、零 TS 错误
2. 控制台无 error / warning（React key、DOM 嵌套警告都算问题）
3. 逐条走 `PRD.md` 第七章「验收标准」8 条
4. 关键路径回归：登录 → 改个人信息 → 前台生效 → 新建文章 → 草稿不可见 → 发布可见
5. 响应式抽查 375px 与 1440px 两个宽度

---

## 六、禁止事项

- ❌ 不提交 `dist/`、`node_modules/`、`.env*`、任何密钥
- ❌ 不引入新的运行时依赖，除非在回复中说明理由并获得确认
- ❌ 不使用 `dangerouslySetInnerHTML` 渲染未消毒内容（Markdown 渲染必须经 DOMPurify）
- ❌ 不删除或重写他人已写好的文档（`PRD.md` / `TECH_DESIGN.md`），需要变更时先说明再改
- ❌ 不做破坏性数据操作（清空 localStorage、删除全部内容）而不加确认

---

## 七、交付检查

每次交付前自问：

- [ ] 需求是否来自 PRD 且编号可追溯？
- [ ] 类型、种子数据、校验 schema 是否同步？
- [ ] 构建通过、控制台干净、验收清单走完？
- [ ] 是否引入了未经确认的依赖或脚手架的残留文件？
- [ ] 文档（README / 本文件）是否需要同步更新？
