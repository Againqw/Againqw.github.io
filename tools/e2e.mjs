/**
 * 端到端验收：走一遍 PRD 第七章的核心路径。
 * 每个浏览器上下文都有独立的 localStorage，测试不会污染真实数据。
 *
 * 运行：node tools/e2e.mjs
 */
import { mkdirSync } from 'node:fs'
import { getChromium, chromePath } from './browser.mjs'

const chromium = await getChromium()
const base = process.env.BASE || 'http://127.0.0.1:5178'
const chrome = chromePath
mkdirSync('_shots', { recursive: true })

let failed = 0
const pass = (name) => console.log(`  ✓ ${name}`)
const fail = (name, detail) => {
  failed += 1
  console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`)
}
const assert = (cond, name, detail) => (cond ? pass(name) : fail(name, detail))

const browser = await chromium.launch({ executablePath: chrome })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
const errors = []
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text())
})
page.on('pageerror', (e) => errors.push(e.message))
page.on('dialog', (d) => d.accept())

const wait = (ms) => page.waitForTimeout(ms)
const text = () => page.locator('body').innerText()

console.log('\n[1] 前台')
await page.goto(base, { waitUntil: 'networkidle' })
assert((await page.locator('h1').innerText()).includes('薛志豪'), '首页渲染姓名')
assert((await page.locator('canvas.starfield').count()) === 1, '星空 canvas 存在')
assert((await page.locator('.project-card').count()) === 4, '项目卡片数量 = 4')
assert((await page.locator('.skill-group').count()) === 4, '技能分组 = 4')
assert((await page.locator('.post-row').count()) === 3, '首页最新文章 = 3 篇（草稿不展示）')

await page.getByRole('button', { name: '技能' }).click()
await wait(900)
assert((await page.evaluate(() => window.scrollY)) > 200, '导航「技能」滚动到对应区块')

console.log('\n[2] 博客')
await page.goto(`${base}/#/blog`, { waitUntil: 'networkidle' })
assert((await page.locator('.post-row').count()) === 3, '博客列表 3 篇已发布')
assert(!(await text()).includes('用 GitHub Actions 把 Vite 站点自动发布到 Pages'), '草稿不在列表出现')

await page.goto(`${base}/#/blog/hashmap-capacity-pow2`, { waitUntil: 'networkidle' })
await wait(700)
assert((await page.locator('.prose h2').count()) > 0, '文章正文渲染 h2')
assert((await page.locator('.prose pre code .hljs-keyword').count()) > 0, '代码块有语法高亮')
assert((await page.locator('.toc a').count()) > 2, '文章目录生成')

console.log('\n[3] 后台守卫与登录')
await page.evaluate(() => localStorage.removeItem('portfolio.token'))
await page.goto(`${base}/#/admin`, { waitUntil: 'networkidle' })
await wait(400)
assert(page.url().includes('/admin/login'), '未登录访问 /admin 跳登录页', page.url())

await page.fill('#login-user', 'admin')
await page.fill('#login-pass', 'wrong-pass')
await page.click('button[type=submit]')
await wait(300)
assert(await page.locator('.login__alert').isVisible(), '错误密码显示提示')

await page.fill('#login-pass', 'admin123')
await page.click('button[type=submit]')
await wait(700)
assert(page.url().includes('/admin') && !page.url().includes('login'), '正确密码进入后台', page.url())
assert((await page.locator('.metric').count()) === 4, '仪表盘 4 个指标卡')

console.log('\n[4] 改资料 → 前台生效')
await page.goto(`${base}/#/admin/profile`, { waitUntil: 'networkidle' })
const tagline = `端到端验证 ${Date.now().toString().slice(-4)}`
await page.fill('#p-tagline', tagline)
await page.getByRole('button', { name: '保存修改' }).click()
await wait(400)
await page.goto(base, { waitUntil: 'networkidle' })
assert((await text()).includes(tagline), '修改一句话介绍后首页同步')

console.log('\n[5] 草稿 → 发布')
await page.goto(`${base}/#/admin/posts`, { waitUntil: 'networkidle' })
await page.getByRole('button', { name: '＋ 写文章' }).click()
await wait(300)
const title = `测试草稿 ${Date.now().toString().slice(-4)}`
await page.fill('#po-title', title)
await page.fill('#po-summary', '这是一条端到端测试创建的摘要，用来验证草稿不会被前台展示。')
await page.locator('.textarea--code').fill('## 小节\n\n正文内容用于测试，包含一段 `code` 与列表。\n\n- 一\n- 二')
await page.getByRole('button', { name: '保存文章' }).click()
await wait(500)

await page.goto(`${base}/#/blog`, { waitUntil: 'networkidle' })
assert(!(await text()).includes(title), '草稿不出现在前台')

await page.goto(`${base}/#/admin/posts`, { waitUntil: 'networkidle' })
const row = page.locator('tr', { hasText: title })
await row.getByRole('button', { name: '发布' }).click()
await wait(500)
await page.goto(`${base}/#/blog`, { waitUntil: 'networkidle' })
assert((await text()).includes(title), '发布后前台可见')

console.log('\n[6] 创建 / 删除项目（二次确认）')
await page.goto(`${base}/#/admin/projects`, { waitUntil: 'networkidle' })
await page.getByRole('button', { name: '＋ 新建项目' }).click()
await wait(300)
const projectTitle = `临时项目 ${Date.now().toString().slice(-4)}`
await page.fill('#pr-title', projectTitle)
await page.fill('#pr-summary', '端到端测试创建的项目摘要，稍后会被删除。')
await page.fill('#pr-tags', 'Test, Playwright')
await page.locator('.textarea--code').fill('## 背景\n\n临时项目正文，用于验证创建与删除流程。')
await page.getByRole('button', { name: '保存项目' }).click()
await wait(500)
assert((await text()).includes(projectTitle), '新建项目出现在后台列表')

await page.locator('tr', { hasText: projectTitle }).getByRole('button', { name: '删除' }).click()
await wait(400)
assert(!(await text()).includes(projectTitle), '确认后项目被删除')

console.log('\n[7] 响应式')
for (const width of [375, 768, 1440]) {
  await page.setViewportSize({ width, height: 900 })
  await page.goto(base, { waitUntil: 'networkidle' })
  await wait(300)
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  )
  assert(overflow <= 0, `${width}px 无横向滚动`, `溢出 ${overflow}px`)
}

console.log('\n[8] 控制台')
assert(errors.length === 0, '无 console error', errors.slice(0, 3).join(' | '))

await browser.close()
console.log(failed === 0 ? '\n全部通过 ✅' : `\n${failed} 项失败 ❌`)
process.exit(failed === 0 ? 0 : 1)
