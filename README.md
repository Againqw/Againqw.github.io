# 薛志豪 · 个人站

深色星空主题的个人作品集站点：个人介绍、技能、项目、博客、联系方式，外加一个可以改内容的后台。

- 在线地址：https://againqw.github.io/
- 后台入口：https://againqw.github.io/#/admin （演示账号 `admin` / `admin123`，可在站点设置里修改）
- 技术栈：React 19 + TypeScript 6 + Vite 8 + react-router-dom 7 + 原生 CSS + localStorage

## 功能

**前台**

- 吸顶毛玻璃导航、Canvas 星空（闪烁 + 滚动视差，尊重 `prefers-reduced-motion`）
- Hero 区：姓名、方向、一句话定位、技术标签、邮箱一键复制
- 关于：多段简介、经历时间线、数据卡片
- 技能：四个分类，熟练度进度条进入视口时播放动画
- 项目：卡片网格 + 详情页（Markdown 正文、技术栈、仓库/演示链接）
- 博客：列表（标签筛选、阅读时长）+ 详情（代码高亮、目录、上一篇/下一篇）
- 联系：邮箱复制、社交链接、留言表单（zod 校验）

**后台 `/admin`**

| 路由 | 功能 |
|---|---|
| `/admin/login` | 账号密码登录，登录态存 token，路由守卫拦截未登录访问 |
| `/admin` | 仪表盘：项目/文章/草稿/技能统计 + 最近更新 |
| `/admin/profile` | 个人信息：基础资料、社交链接、经历时间线（可增删） |
| `/admin/skills` | 技能：分组与条目增删改、熟练度调整 |
| `/admin/projects` | 项目：列表 + 新建/编辑/删除，Markdown 正文 |
| `/admin/posts` | 博客：列表 + 编辑器（实时预览）+ 草稿/发布切换 |
| `/admin/settings` | 站点标题、强调色、页脚、后台密码、JSON 导入导出 |

所有修改写入同一份数据源，前台立即生效；删除操作均二次确认；表单用 zod 校验并把错误定位到字段。

## 本地运行

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run preview  # 预览构建产物
```

## 端到端验收

`tools/e2e.mjs` 用 Playwright 走一遍核心路径（前台渲染、博客、登录守卫、改资料生效、草稿发布、项目增删、三档宽度无横向滚动、控制台零报错）。

```bash
npm i -D playwright-core && npx playwright install chromium
node tools/e2e.mjs     # 需要先 npm run dev，或用 BASE=https://againqw.github.io node tools/e2e.mjs
```

## 文档

| 文件 | 内容 |
|---|---|
| [PRD.md](./PRD.md) | 需求文档：目标、场景、功能清单（FR 编号）、MoSCoW、验收标准 |
| [TECH_DESIGN.md](./TECH_DESIGN.md) | 技术设计：技术栈、目录结构、数据模型、关键技术点、已知限制 |
| [AGENTS.md](./AGENTS.md) | AI 开发规范：流程、代码风格、视觉规范、测试要求、禁止事项 |

## 目录结构

```
src/
├── api/        # 数据层：storage（读写/迁移/订阅）、index（CRUD/鉴权）、seed、schemas
├── components/ # 星空、导航、Markdown、Toast、区块壳
├── pages/      # 前台页面（首页按区块拆分在 pages/home/）
├── admin/      # 后台页面与后台布局
├── hooks/      # useDB（useSyncExternalStore 订阅）
├── lib/        # Markdown 渲染与目录提取
├── styles/     # tokens / base / components 三层 CSS
└── types.ts    # 领域模型
```

## 部署

仓库名 `Againqw.github.io`，push 到 `main` 后由 GitHub Actions 自动构建并发布到 Pages（`.github/workflows/deploy.yml`）。用户主页仓库部署在根路径，因此 `vite.config.ts` 不需要改 `base`。

## 已知限制

数据存在浏览器 `localStorage`：换设备、清缓存会丢失，建议在「站点设置 → 数据备份」里导出 JSON。纯前端登录只能防误入，真实产品必须把鉴权放到服务端。详见 `TECH_DESIGN.md` 4.8。
