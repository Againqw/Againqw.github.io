import type { DB } from '../types'

export const DB_VERSION = 1
export const STORAGE_KEY = 'portfolio.db.v1'
export const TOKEN_KEY = 'portfolio.token'

export const seed: DB = {
  version: DB_VERSION,
  settings: {
    siteTitle: '薛志豪 · 个人站',
    accent: '#6D8CFF',
    footerText: '© 2026 薛志豪 · 用 React + Vite 手写，部署在 GitHub Pages',
    adminPassword: 'admin123',
  },
  profile: {
    name: '薛志豪',
    role: 'Java 后端开发工程师 · AI 应用方向',
    tagline: '用 Java 把后端写稳，用 RAG 让数据会说话。',
    avatarText: '薛',
    location: '辽宁 · 大连',
    email: '2220233568@dlmu.edu.cn',
    resumeUrl: '',
    bio: [
      '大连海事大学软件工程专业 2026 届本科生，主攻 Java 后端与 AI 应用落地。日常写 Spring Boot + MyBatis + MySQL，也把 LangChain、Milvus 这些工具真正用在能跑起来的项目里，而不是停在 Demo。',
      '我更在意「为什么这样设计」：为什么用 Redis 做缓存而不是本地 Map，为什么 RAG 的召回率一直卡在 0.6、切片策略到底该怎么调。这些取舍写进了博客，也写进了项目的技术文档。',
      '目前在校招中寻找 Java 后端 / AI 应用开发方向的机会，随时可以聊。',
    ],
    socials: [
      { label: 'GitHub', url: 'https://github.com/Againqw' },
      { label: 'Email', url: 'mailto:2220233568@dlmu.edu.cn' },
      { label: '博客', url: '#/blog' },
    ],
    timeline: [
      {
        id: 'tl-1',
        period: '2022.09 — 2026.06',
        title: '软件工程 · 本科',
        org: '大连海事大学',
        desc: '主修数据结构、操作系统、计算机网络、数据库原理与软件工程实践，课程项目多次担任后端与文档负责人。',
      },
      {
        id: 'tl-2',
        period: '2025.03 — 2025.08',
        title: '校园二手交易平台 · 后端负责人',
        org: '课程项目 / 4 人小组',
        desc: '负责商品与订单模块，设计基于 JWT 的登录态与乐观锁扣减库存，接口平均响应 80ms。',
      },
      {
        id: 'tl-3',
        period: '2025.09 — 2025.12',
        title: 'EduRAG 双引擎问答系统 · 独立开发',
        org: '个人项目',
        desc: '向量检索 + 关键词检索双路召回，加入重排序与引用溯源，Recall@5 从 0.62 提升到 0.86。',
      },
      {
        id: 'tl-4',
        period: '2026.03 — 2026.06',
        title: '养老机构后台管理系统 · 后端开发',
        org: '课程项目 / 5 人小组',
        desc: '落地 RBAC 权限模型、Redis 缓存与 Excel 报表导出，负责权限与统计模块。',
      },
    ],
    stack: [
      'Java 21',
      'Spring Boot',
      'MyBatis',
      'MySQL',
      'Redis',
      'LangChain',
      'Milvus',
      'FastAPI',
      'Vue 3',
      'Docker',
    ],
  },
  skills: [
    {
      id: 'g-backend',
      name: '后端开发',
      items: [
        { id: 's-1', name: 'Java 21', level: 5, note: '集合 / 并发 / JVM 基础' },
        { id: 's-2', name: 'Spring Boot', level: 4, note: '分层架构、拦截器、全局异常' },
        { id: 's-3', name: 'MyBatis', level: 4, note: '动态 SQL、二级缓存' },
        { id: 's-4', name: 'MySQL', level: 4, note: '索引优化、事务与 MVCC' },
        { id: 's-5', name: 'Redis', level: 3, note: '缓存穿透/击穿、分布式锁' },
        { id: 's-6', name: 'Maven', level: 4 },
      ],
    },
    {
      id: 'g-frontend',
      name: '前端开发',
      items: [
        { id: 's-7', name: 'JavaScript ES6+', level: 4 },
        { id: 's-8', name: 'Vue 3', level: 3, note: '组合式 API、Pinia' },
        { id: 's-9', name: 'HTML / CSS', level: 4, note: '响应式、Flex/Grid' },
        { id: 's-10', name: 'Vite', level: 3 },
      ],
    },
    {
      id: 'g-ai',
      name: 'AI 应用',
      items: [
        { id: 's-11', name: 'LangChain', level: 4, note: 'Chain、Retriever、Memory' },
        { id: 's-12', name: 'LangGraph', level: 3 },
        { id: 's-13', name: 'Milvus', level: 3, note: '集合设计、HNSW 索引' },
        { id: 's-14', name: 'BGE-M3', level: 3, note: 'Embedding 与重排序' },
        { id: 's-15', name: 'FastAPI', level: 3 },
        { id: 's-16', name: 'RAGAS', level: 2, note: '召回率 / 忠实度评估' },
      ],
    },
    {
      id: 'g-ops',
      name: '工程化',
      items: [
        { id: 's-17', name: 'Git', level: 4 },
        { id: 's-18', name: 'Linux', level: 3, note: '常用命令、日志排查' },
        { id: 's-19', name: 'Docker / podman', level: 3 },
        { id: 's-20', name: 'GitHub Actions', level: 3 },
        { id: 's-21', name: 'Nginx', level: 2 },
      ],
    },
  ],
  projects: [
    {
      id: 'p-1',
      slug: 'edurag-dual-engine',
      title: 'EduRAG 双引擎问答系统',
      summary:
        '面向课程资料的检索增强问答系统：向量检索 + 关键词检索双路召回，配合重排序与引用溯源，Recall@5 从 0.62 提升到 0.86。',
      tags: ['RAG', 'LangChain', 'Milvus', 'BGE-M3', 'FastAPI'],
      cover: '',
      repoUrl: 'https://github.com/Againqw',
      demoUrl: '',
      featured: true,
      createdAt: '2025-09-10T09:00:00.000Z',
      updatedAt: '2026-09-18T09:00:00.000Z',
      content: `## 背景

课程资料散落在 PDF、PPT 和老师的答疑文档里，关键词搜索经常「搜得到但答不準」。做了一个能引用出处的问答系统：问一句，返回答案 + 命中的原文片段。

## 方案

1. **解析与切片**：PyMuPDF 提取 PDF 文本，按标题层级切块，单块 400–600 字并保留 80 字重叠，避免答案被切断。
2. **双路召回**：Milvus 向量检索（BGE-M3，topK=20）+ BM25 关键词检索（topK=20），用 RRF 融合。
3. **重排序**：BGE-reranker 对融合后的 40 条重排，取 top5 送进上下文。
4. **生成与溯源**：Prompt 中强制要求「只依据给定片段回答，并标注来源编号」，前端把编号映射回原文位置。

\`\`\`python
def retrieve(question: str, top_k: int = 5):
    vec_hits = vector_store.search(embed(question), top_k=20)
    kw_hits = bm25.search(question, top_k=20)
    fused = rrf([vec_hits, kw_hits])          # Reciprocal Rank Fusion
    return reranker.rerank(question, fused)[:top_k]
\`\`\`

## 结果

| 指标 | 单路向量召回 | 双路 + 重排 |
|---|---|---|
| Recall@5 | 0.62 | 0.86 |
| 答案带正确引用比例 | 61% | 92% |
| 平均响应耗时 | 1.1s | 1.6s |

## 取舍

- **要不要上微调**：先做了 Prompt + 检索优化，收益已经足够；微调成本高且需要标注数据，本期不做。
- **切片粒度**：400 字比 1000 字召回更高，但上下文更碎，靠重叠窗口弥补。
- **代价**：双路 + 重排让延迟增加 0.5s，用流式输出掩盖等待感。`,
    },
    {
      id: 'p-2',
      slug: 'campus-market',
      title: '校园二手交易平台',
      summary:
        '面向校内学生的二手交易平台，覆盖商品发布、检索、下单与站内消息。负责商品与订单模块，用乐观锁解决超卖，接口 P95 响应 80ms。',
      tags: ['Spring Boot', 'MyBatis', 'MySQL', 'Vue 2', 'JWT'],
      cover: '',
      repoUrl: 'https://github.com/Againqw',
      demoUrl: '',
      featured: true,
      createdAt: '2025-03-05T09:00:00.000Z',
      updatedAt: '2026-08-20T09:00:00.000Z',
      content: `## 我的职责

4 人小组，我负责**商品模块 + 订单模块 + 鉴权**，以及数据库设计与接口文档。

## 关键设计

### 1. 登录态

Spring Boot 拦截器校验 JWT，token 里只放 \`userId\` 与过期时间，权限信息每次从缓存取，避免改权限后要等 token 过期。

\`\`\`java
public boolean preHandle(HttpServletRequest req, HttpServletResponse resp, Object handler) {
    String token = req.getHeader("Authorization");
    Claims claims = jwtUtil.parse(token);        // 签名 + 过期校验
    if (claims == null) { resp.setStatus(401); return false; }
    UserContext.set(Long.valueOf(claims.getSubject()));
    return true;
}
\`\`\`

### 2. 库存扣减

下单时用一条带条件的 UPDATE 保证原子性，影响行数为 0 就说明被别人抢先买走：

\`\`\`sql
UPDATE item SET stock = stock - 1, version = version + 1
WHERE id = #{id} AND stock > 0 AND version = #{version};
\`\`\`

比先查再改安全，也避免了为了一个低频场景引入分布式锁。

### 3. 列表检索

商品列表按「分类 + 关键词 + 价格区间」组合查询，用 MyBatis 动态 SQL；给 \`(category_id, status, created_at)\` 建联合索引，翻页用游标（\`id < lastId\`）替代 \`LIMIT offset\`，深翻页不再变慢。

## 结果

- 500 并发压测：P95 80ms，错误率 0.2%（库存冲突返回业务错误码，不计入失败）
- 上线后修掉的坑：文件上传未限制大小导致 OOM；分页参数未校验负数导致 SQL 报错`,
    },
    {
      id: 'p-3',
      slug: 'elder-care-admin',
      title: '养老机构后台管理系统',
      summary:
        '面向养老机构的运营后台：老人档案、床位、护理记录与统计报表。负责 RBAC 权限模型、Redis 缓存与 Excel 导出。',
      tags: ['Spring Boot', 'RBAC', 'Redis', 'ECharts', 'EasyExcel'],
      cover: '',
      repoUrl: 'https://github.com/Againqw',
      demoUrl: '',
      featured: true,
      createdAt: '2026-03-01T09:00:00.000Z',
      updatedAt: '2026-06-28T09:00:00.000Z',
      content: `## 背景

课程项目，5 人小组，为养老机构做一个内部运营系统。我负责权限模块与统计模块，并主导接口规范与代码评审。

## 权限模型

采用标准 RBAC：用户 — 角色 — 权限，多对多关系用中间表。

| 表 | 说明 |
|---|---|
| \`sys_user\` | 账号、密码（BCrypt）、状态 |
| \`sys_role\` | 角色，如院长 / 护士长 / 护工 |
| \`sys_menu\` | 菜单与按钮级权限，\`type\` 区分 |
| \`sys_role_menu\` | 角色-权限关联 |

鉴权用自定义注解 + AOP 实现，方法级校验：

\`\`\`java
@RequirePerm("elder:record:edit")
@PostMapping("/records")
public Result<Void> saveRecord(@RequestBody @Valid RecordDTO dto) { ... }
\`\`\`

## 缓存

统计接口聚合了 4 张表，直接查要 1.2s。用 Redis 缓存 5 分钟，并给不同 key 加随机过期时间，避免同一时刻集体失效；数据变更时按前缀批量删除，不做逐条维护。

## 报表导出

EasyExcel 流式写出，1 万行导出从 40s 降到 3s，内存占用稳定在 100MB 以内（原 POI 写法直接 OOM）。

## 收获

权限系统最麻烦的不是表结构，而是「按钮级权限怎么在前后端保持一致」。最后的做法是后端返回权限码列表，前端用一个 \`v-perm\` 指令统一判断，而不是在每处写 \`if\`。`,
    },
    {
      id: 'p-4',
      slug: 'imagegrab-extension',
      title: 'imagegrab · 电商图片提取插件',
      summary:
        'Chrome MV3 扩展：在电商详情页一键提取全部商品图，集中预览勾选，批量转换为 PNG 下载。已开源并上线官网。',
      tags: ['Chrome MV3', 'JavaScript', 'Playwright', 'Canvas'],
      cover: '',
      repoUrl: 'https://github.com/Againqw/imagegrab',
      demoUrl: 'https://againqw.github.io/imagegrab/',
      featured: false,
      createdAt: '2026-10-01T09:00:00.000Z',
      updatedAt: '2026-10-19T09:00:00.000Z',
      content: `## 它解决什么

运营和美工从商品详情页存图，要一张张右键，还常常存到缩略图、漏掉懒加载的图。这个插件一次点击提取全部图片，在独立页面勾选后统一转 PNG 下载。

## 实现要点

- **提取**：覆盖 \`img[src]\`、\`data-src\`、\`data-lazyload\`、\`srcset\`（取最大分辨率）、CSS \`background-image\`，再按 URL 规则去重
- **转 PNG**：MV3 的 service worker 里 \`URL.createObjectURL\` 不可用，改为 fetch → base64 → data URL，实测 19.7MB 图片（base64 26MB）下载正常
- **端到端测试**：Playwright 加载扩展，校验提取数量、预览卡片数、下载完成数与落盘文件名

## 踩坑

端到端脚本最初 \`acceptDownloads: false\`，Playwright 会把所有下载取消，日志却仍打印「已下载 10 张」——假通过。改为 \`true\` 并用 CDP 指定下载目录后才校验出真实结果。`,
    },
  ],
  posts: [
    {
      id: 'a-1',
      slug: 'hashmap-capacity-pow2',
      title: 'HashMap 扩容：为什么容量必须是 2 的幂',
      summary:
        '从 (n - 1) & hash 说起，讲清 HashMap 用位运算替代取模的收益、扩容时高低位拆分的过程，以及为什么自定义初始容量会被"向上取整"。',
      tags: ['Java', '集合'],
      status: 'published',
      publishedAt: '2026-09-12T02:00:00.000Z',
      updatedAt: '2026-09-12T02:00:00.000Z',
      content: `## 一句话结论

容量取 2 的幂，是为了把「取模」换成「按位与」，代价是扩容时元素只能落在原位或原位 + 旧容量两个位置——而这恰好让 rehash 变得极快。

## 索引是怎么算的

\`HashMap\` 定位桶用的是：

\`\`\`java
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}

// 定位：n 为 table 长度
int index = (n - 1) & hash;
\`\`\`

当 \`n = 2^k\` 时，\`n - 1\` 的二进制是 \`0...0111...1\`（低位全 1），此时 \`(n-1) & hash\` 与 \`hash % n\` 结果完全相同，但位运算比除法快得多。

如果容量是 15（非 2 的幂），\`14 = 1110\`，最低位永远是 0，所有 key 只能落在偶数桶里，一半空间直接浪费。

## 扰动函数在干什么

\`h ^ (h >>> 16)\` 把高 16 位异或到低 16 位。因为索引只用到低位，高位信息被丢弃，哈希分布容易变差。扰动让高位也参与运算，减少碰撞。

## 扩容时为什么快

容量翻倍后，\`n - 1\` 只多了一个高位 1。因此元素的新位置只有两种可能：

- \`(hash & oldCap) == 0\` → 留在原索引 \`j\`
- 否则 → 移动到 \`j + oldCap\`

JDK 8 正是这么拆的（\`loHead / hiHead\` 两条链），不需要重新计算哈希，也不用逐个取模：

\`\`\`java
if ((e.hash & oldCap) == 0) {   // 留在低位链
    if (loTail == null) loHead = e; else loTail.next = e;
    loTail = e;
} else {                        // 移到高位链
    if (hiTail == null) hiHead = e; else hiTail.next = e;
    hiTail = e;
}
\`\`\`

## 两个容易被追问的点

**1. 为什么加载因子是 0.75**
空间与冲突概率的折中。太小浪费空间，太大链表变长。0.75 时，在泊松分布下单个桶长度达到 8 的概率约为千万分之六——这也是树化阈值定为 8 的依据。

**2. 自定义容量为什么会被改**
\`new HashMap<>(1000)\` 实际容量是 1024：

\`\`\`java
static final int tableSizeFor(int cap) {
    int n = cap - 1;          // 防止 cap 本身是 2 的幂时被翻倍
    n |= n >>> 1; n |= n >>> 2; n |= n >>> 4;
    n |= n >>> 8; n |= n >>> 16;
    return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
}
\`\`\`

把最高位之后全部填 1，再 +1 就得到不小于 cap 的最小 2 的幂。`,
    },
    {
      id: 'a-2',
      slug: 'rag-recall-pitfalls',
      title: 'RAG 召回率上不去？我踩过的 5 个坑',
      summary:
        '从切片、Embedding、检索策略到重排序，复盘 EduRAG 项目里把 Recall@5 从 0.62 拉到 0.86 的过程，每个坑都附了判断方法和改法。',
      tags: ['RAG', '检索', 'LangChain'],
      status: 'published',
      publishedAt: '2026-09-28T03:00:00.000Z',
      updatedAt: '2026-09-28T03:00:00.000Z',
      content: `## 先测，再调

优化召回之前先建了 60 条「问题 → 正确片段」的测试集，每次改动都跑一遍算 Recall@5。没有这条基线，所有调参都是玄学。

## 坑 1：切片把答案切成两半

固定 500 字硬切，答案正好跨在边界上，两段都不完整。

**改法**：按标题层级优先切，超过阈值再按段落切，并保留 80 字重叠。重叠不是为了"多给点上下文"，而是为了让跨边界的句子至少在一段里完整。

## 坑 2：Embedding 模型选错语言

一开始用的是英文语料为主的模型，中文问答召回明显偏低——语义相近但字面不同的句子排不到前面。

**改法**：换 BGE-M3，中英混合场景表现稳定，且支持长文本，减少切片压力。

## 坑 3：只用向量检索

向量擅长语义，但对**专有名词、课程编号、缩写**不敏感。问「CS101 的考核方式」，向量可能会召回一堆"考核"相关但不同课的内容。

**改法**：向量 + BM25 双路召回，用 RRF 融合：

\`\`\`python
def rrf(result_lists, k: int = 60):
    score = {}
    for results in result_lists:
        for rank, doc in enumerate(results):
            score[doc.id] = score.get(doc.id, 0) + 1.0 / (k + rank + 1)
    return sorted(score.items(), key=lambda x: -x[1])
\`\`\`

RRF 只看排名不看分数，省去了两路分数量纲不一致的麻烦。

## 坑 4：topK 给太大

topK=20 直接塞进上下文，噪声淹没关键片段，模型反而答得更差。

**改法**：先召回 40 条，再用 reranker 取 top5。重排序模型对「问题-片段」逐对打分，比向量相似度准得多，代价是延迟增加约 0.4s。

## 坑 5：没有引用，答错也不知道

早期答案看起来流畅但经常张冠李戴。

**改法**：Prompt 里强制模型输出 \`[1]\` \`[2]\` 这样的片段编号，前端把编号映射回原文位置并高亮。有了引用，错误立刻暴露，评估也有了抓手。

## 最终的收益

| 阶段 | Recall@5 | 带正确引用的答案占比 |
|---|---|---|
| 基线（硬切 + 单路向量） | 0.62 | 61% |
| 结构化切分 | 0.71 | 70% |
| + 双路召回 | 0.79 | 84% |
| + 重排序 | 0.86 | 92% |

每一档提升都能追溯到具体改动，这也是我坚持先建测试集的原因。`,
    },
    {
      id: 'a-3',
      slug: 'mysql-mvcc',
      title: '从 MVCC 看 MySQL 的可重复读',
      summary:
        'undo log、ReadView 与版本链如何配合实现快照读；为什么"可重复读"下仍会出现幻读，以及间隙锁到底锁了什么。',
      tags: ['MySQL', '事务'],
      status: 'published',
      publishedAt: '2026-10-09T01:00:00.000Z',
      updatedAt: '2026-10-09T05:00:00.000Z',
      content: `## 三种读，两种实现

- **当前读**：\`SELECT ... FOR UPDATE\`、\`UPDATE\`、\`DELETE\`，读最新版本并加锁
- **快照读**：普通 \`SELECT\`，读到事务开始时的版本
- **实现**：快照读靠 MVCC（undo log + ReadView），当前读靠锁

## 版本链

每行记录有两个隐藏列：\`DB_TRX_ID\`（最后修改它的事务 id）和 \`DB_ROLL_PTR\`（指向 undo log 中的上一个版本）。修改一行时，旧版本被写进 undo log，通过回滚指针串成链表。

## ReadView 的可见性判断

ReadView 记录了四个关键值：

| 字段 | 含义 |
|---|---|
| \`m_ids\` | 生成快照时活跃（未提交）的事务 id 列表 |
| \`min_trx_id\` | 活跃事务中的最小值 |
| \`max_trx_id\` | 下一个将分配的事务 id |
| \`creator_trx_id\` | 创建该 ReadView 的事务 id |

判断某版本是否可见：

1. \`trx_id == creator_trx_id\` → 自己改的，可见
2. \`trx_id < min_trx_id\` → 提交早于快照，可见
3. \`trx_id >= max_trx_id\` → 快照之后才开启的事务，不可见
4. \`min_trx_id <= trx_id < max_trx_id\` → 在 \`m_ids\` 里说明还没提交，不可见；否则可见

不可见就顺着 \`DB_ROLL_PTR\` 找上一个版本，直到找到可见版本或链表结束。

## RC 与 RR 的差别只在一处

- **RC**：每条 SELECT 都生成新的 ReadView
- **RR**：只在事务内第一次 SELECT 时生成，之后复用

这也解释了为什么 RR 能可重复读：快照不变。

## 那幻读呢

快照读天然没有幻读（读的是同一份快照）。但**当前读**会看到别人插入的新行，于是出现幻读。InnoDB 用间隙锁（Gap Lock）来解决：在 RR 下，范围查询除了锁住记录本身，还锁住记录之间的间隙，让别的事务无法在这个范围内插入。

Next-Key Lock = 记录锁 + 间隙锁，锁的是左开右闭区间。

## 一个实践结论

如果业务能接受 RC，用 RC 可以减少间隙锁带来的死锁概率；这也是很多互联网公司把隔离级别设为 RC 的原因。默认的 RR 并不是「更安全所以无脑用」。`,
    },
    {
      id: 'a-4',
      slug: 'gh-actions-pages',
      title: '用 GitHub Actions 把 Vite 站点自动发布到 Pages',
      summary: '记录这个个人站点的部署流水线：如何在 push 后自动构建、发布，以及静态托管下 HashRouter 的取舍。',
      tags: ['CI/CD', 'Vite'],
      status: 'draft',
      publishedAt: '2026-10-21T02:00:00.000Z',
      updatedAt: '2026-10-21T02:00:00.000Z',
      content: `## 草稿

这篇文章还在写，先记录要点：

- \`actions/configure-pages\` + \`upload-pages-artifact\` + \`deploy-pages\`
- 仓库 Settings → Pages → Source 选 GitHub Actions
- 用户主页仓库（\`<user>.github.io\`）根路径部署，\`base: '/'\`；
  项目仓库要写 \`base: '/<repo>/'\`
- 纯静态托管没有 rewrite，SPA 用 HashRouter 最省心`,
    },
  ],
  messages: [],
}
