# TECH_DESIGN.md — 个人展示网站技术设计

> 配套文档：`PRD.md`（要做什么）、`AGENTS.md`（怎么写代码）
> 站点形态：纯前端 SPA ｜ 部署：GitHub Pages + GitHub Actions ｜ 数据：浏览器 localStorage

---

## 一、技术栈

| 层 | 选型 | 版本 | 理由 |
|---|---|---|---|
| 框架 | React | 19 | 组件化、生态成熟，面试与工程中都用得上 |
| 语言 | TypeScript | 6 | 全量类型标注，避免运行时字段拼写错误 |
| 构建 | Vite | 8 | 冷启动快、产物小，配置成本低 |
| 路由 | react-router-dom | 7 | HashRouter 适配静态托管，无需服务端 rewrite |
| 样式 | 原生 CSS + CSS 变量 | — | 不引入 UI 库 / CSS 框架，完全掌控视觉；设计令牌集中在 `:root` |
| 状态 | React Context + 自定义 hook | — | 规模足够小，不引入 Redux / Zustand |
| 数据 | localStorage（带版本号） | — | 零后端、可导出 JSON、便于后续替换为真实 API |
| Markdown | marked + DOMPurify | 18 / 3 | 解析与 XSS 消毒分离，安全边界清晰 |
| 代码高亮 | highlight.js（按语言按需注册） | 11 | 体积可控，样式与深色主题统一 |
| 表单校验 | zod | 4 | schema 即类型，错误信息可定位到字段 |
| 部署 | GitHub Actions → GitHub Pages | — | 免费、HTTPS、CDN，push 即自动发布 |

**为什么不用 Next.js / Nuxt**：站点是纯静态内容展示，没有 SSR 与 SEO 的强需求，SSR 会引入 Node 运行时与部署复杂度，收益不抵成本。

**为什么不用 Tailwind**：本项目视觉高度定制（星空、毛玻璃、渐变描边），原子类会淹没结构；改为「CSS 变量 + 语义化组件类」，同一套令牌同时服务前台与后台。

---

## 二、项目结构

```
portfolio/
├── .github/workflows/deploy.yml   # CI：构建并发布到 Pages
├── public/                        # 静态资源（favicon、简历 PDF）
├── src/
│   ├── main.tsx                   # 入口，挂载 Router
│   ├── App.tsx                    # 路由表
│   ├── types.ts                   # 领域模型（Profile/Skill/Project/Post/Settings）
│   ├── api/
│   │   ├── seed.ts                # 初始种子数据（站点第一次打开时写入）
│   │   ├── storage.ts             # localStorage 读写 + 版本迁移 + 订阅通知
│   │   ├── index.ts               # 统一数据接口（CRUD + 鉴权 + 导入导出）
│   │   └── schemas.ts             # zod 校验 schema
│   ├── hooks/
│   │   ├── useStore.ts            # useSyncExternalStore 订阅数据变化
│   │   └── useAuth.ts             # 登录态读取/写入
│   ├── components/
│   │   ├── Starfield.tsx          # Canvas 星空
│   │   ├── Navbar.tsx  Footer.tsx # 全局框架
│   │   ├── Reveal.tsx             # 进入视口淡入
│   │   ├── Markdown.tsx           # 渲染 + 高亮 + TOC
│   │   ├── Section.tsx            # 区块标题（编号 + 标题 + 描述）
│   │   └── Toast.tsx              # 轻提示
│   ├── pages/                     # 前台
│   │   ├── Home.tsx  BlogList.tsx  BlogPost.tsx  ProjectDetail.tsx  NotFound.tsx
│   ├── admin/                     # 后台
│   │   ├── AdminLayout.tsx  Login.tsx  Dashboard.tsx
│   │   ├── ProfileAdmin.tsx  SkillsAdmin.tsx
│   │   ├── ProjectsAdmin.tsx  PostsAdmin.tsx  SettingsAdmin.tsx
│   │   └── MarkdownEditor.tsx
│   └── styles/
│       ├── tokens.css             # 设计令牌（颜色/间距/圆角/动效）
│       ├── base.css               # reset、排版、滚动条
│       └── components.css         # 按钮/卡片/表单/表格等组件类
├── PRD.md  TECH_DESIGN.md  AGENTS.md  README.md
└── package.json  vite.config.ts  tsconfig*.json
```

**分层原则**：`pages` / `admin` 只负责视图与交互 → 一律通过 `api/index.ts` 读写数据 → `api` 内部再落到 `storage.ts`。任何组件都不允许直接访问 `localStorage`，这样未来把数据层换成 HTTP 只需要改 `api/index.ts`。

---

## 三、数据模型

所有实体均有 `id`（字符串）与 `updatedAt`（ISO 时间），用于排序与"最近更新"。

```ts
type ID = string;

interface Profile {
  name: string;            // 姓名
  role: string;            // 职位，如「Java 后端开发工程师」
  tagline: string;         // 一句话定位（Hero 展示）
  bio: string[];           // 自我介绍，多段
  avatarText: string;      // 头像占位文字（无图时渲染首字母/汉字）
  location: string;
  email: string;
  resumeUrl?: string;
  socials: { label: string; url: string }[];
  timeline: {
    id: ID; period: string; title: string; org: string; desc: string;
  }[];
  stack: string[];         // Hero 下方的技术标签带
}

interface SkillGroup {
  id: ID; name: string;
  items: { id: ID; name: string; level: number /* 1-5 */; note?: string }[];
}

interface Project {
  id: ID; slug: string; title: string; summary: string;
  tags: string[]; cover?: string; repoUrl?: string; demoUrl?: string;
  featured: boolean; content: string /* Markdown */; createdAt: string; updatedAt: string;
}

interface Post {
  id: ID; slug: string; title: string; summary: string;
  tags: string[]; content: string /* Markdown */;
  status: 'draft' | 'published';
  publishedAt: string; updatedAt: string;
}

interface SiteSettings {
  siteTitle: string; accent: string; footerText: string; adminPassword: string;
}

interface DB {
  version: number;         // schema 版本，用于迁移
  profile: Profile; skills: SkillGroup[]; projects: Project[];
  posts: Post[]; settings: SiteSettings;
}
```

**存储键**：`portfolio.db.v1`（整库一个键，写入是原子的，避免多键不同步）、`portfolio.token`（登录态）。

**迁移策略**：读取时比对 `DB.version`，低于当前版本则执行迁移函数链；缺失字段用 `seed.ts` 的默认值补齐，保证老数据不炸页面。

**派生数据**：阅读时长 = 正文字数 / 300（字/分钟，向上取整）；文章排序 = `publishedAt` 降序；"精选优先"排序 = `featured` 降序 + `updatedAt` 降序。

---

## 四、关键技术点

### 4.1 静态托管下的路由：HashRouter

GitHub Pages 是纯静态托管，直接访问 `/blog/xxx` 会 404（没有服务端 rewrite）。因此使用 `HashRouter`，URL 形如：

```
https://againqw.github.io/#/blog/hashmap-resize
https://againqw.github.io/#/admin/login
```

好处是刷新、分享、直接粘贴都能命中 `index.html`；代价是 URL 里带 `#`。这是静态站点最省心的取舍，若将来迁到 Vercel / Cloudflare Pages 支持 rewrite，换成 `BrowserRouter` 只需改一处。

### 4.2 数据层：单一数据源 + 订阅

```ts
// storage.ts（核心思路）
let cache: DB = load();                        // 启动时读一次并与 seed 合并
const listeners = new Set<() => void>();

export function getDB() { return cache; }
export function setDB(next: DB) {
  cache = { ...next, version: DB_VERSION };
  localStorage.setItem(KEY, JSON.stringify(cache));
  listeners.forEach(fn => fn());               // 通知 React
}
export function subscribe(fn: () => void) {
  listeners.add(fn);
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) { cache = load(); fn(); } };
  window.addEventListener('storage', onStorage); // 多标签页同步
  return () => { listeners.delete(fn); window.removeEventListener('storage', onStorage); };
}
```

组件侧用 `useSyncExternalStore(subscribe, getDB)` 订阅，任何后台写操作都会让前台同一标签页内的组件立刻重渲染；另开一个标签页时通过 `storage` 事件同步。

### 4.3 星空背景性能

- 单 `<canvas>` + `requestAnimationFrame`，粒子点用 `fillRect` 而非 `arc`（1000 次绘制的开销差一个量级）
- 粒子数按屏幕面积计算：`min(width * height / 9000, 160)`，移动端再乘 0.6
- 闪烁用每粒子独立的 `phase` 与 `sin` 曲线，不重排 DOM
- 滚动视差：监听 `scroll` 变换一个 CSS 变量，canvas 用 `translate3d` 位移（合成层，不触发重绘）
- `prefers-reduced-motion: reduce` 时只画一帧静态星空，不启动 rAF

### 4.4 Markdown 渲染与安全

1. `marked.parse(md, { gfm: true, breaks: true })` 得到 HTML
2. `DOMPurify.sanitize(html, { ADD_ATTR: ['target'] })` 消毒，禁止 `script` / `on*` / `javascript:`
3. 挂载后对 `pre code` 调用 `hljs.highlightElement`，语言按需注册（ts/java/sql/bash/json/python），未知语言降级为纯文本
4. TOC 不依赖 DOM，直接用 `marked.lexer()` 取 `heading` token 生成，锚点 id 用 slug 化后的标题，避免中文锚点问题

### 4.5 鉴权与路由守卫

- 登录：`zod` 校验用户名密码 → 与 `settings.adminPassword` 比对 → 生成随机 token（`crypto.randomUUID()`）写入 `localStorage`，不存明文密码
- 守卫：`<RequireAuth>` 包裹后台布局，未登录 `<Navigate to="/admin/login" state={{ from }} replace />`，登录成功后回跳
- 说明：纯前端鉴权只能防"误入"，不能防"有心人"——数据本来就在浏览器里。这是本项目的已知边界，真实产品必须放到服务端。

### 4.6 表单校验

每个后台表单一个 zod schema，提交时 `safeParse`，失败则把 `error.issues` 按 `path[0]` 映射为字段错误，输入框红边 + 下方红字；成功才调用 `api.updateX`。

### 4.7 构建与部署

```yaml
# .github/workflows/deploy.yml（要点）
on: { push: { branches: [main] }, workflow_dispatch: {} }
permissions: { contents: read, pages: write, id-token: write }
jobs.build.steps:
  - actions/checkout@v4
  - actions/setup-node@v4   (node 22, cache npm)
  - npm ci
  - npm run build           → dist/
  - actions/upload-pages-artifact@v3 (path: dist)
jobs.deploy: actions/deploy-pages@v4
```

部署目标为**用户主页仓库** `Againqw.github.io`，站点根路径即 `/`，因此 `vite.config.ts` 中 `base: '/'`；若部署到子路径仓库（如 `/portfolio/`），需改为 `base: '/portfolio/'`。

### 4.8 已知限制

| 限制 | 影响 | 后续方案 |
|---|---|---|
| 数据存在本地 | 换浏览器/清缓存即丢失 | 设置页支持导出/导入 JSON；后续接轻量后端（Supabase / 自建 API） |
| 前台鉴权可绕过 | 仅防误入 | 服务端 session + 密码哈希 |
| 无图片上传 | 封面只能填 URL | 接对象存储 / 图床 |
| 站点无 SSR | 搜索引擎收录依赖爬虫执行 JS | 需要 SEO 时预渲染 |
