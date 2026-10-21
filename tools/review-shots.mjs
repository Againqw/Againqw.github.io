import { mkdirSync } from 'node:fs'
import { getChromium, chromePath } from './browser.mjs'

const chromium = await getChromium()
const base = process.env.BASE || 'http://127.0.0.1:5178'
const out = process.env.OUT || '_shots'
const chrome = chromePath
mkdirSync(out, { recursive: true })

const browser = await chromium.launch({
  executablePath: chrome,
  args: ['--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding'],
})
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
const page = await ctx.newPage()

const problems = []
page.on('console', (msg) => {
  if (msg.type() === 'error' || msg.type() === 'warning') problems.push(`[${msg.type()}] ${msg.text()}`)
})
page.on('pageerror', (err) => problems.push(`[pageerror] ${err.message}`))

const wait = (ms) => page.waitForTimeout(ms)

async function open(path) {
  await page.goto(`${base}${path}`, { waitUntil: 'networkidle' })
  await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' })
}

async function scrollThrough() {
  const height = await page.evaluate(() => document.body.scrollHeight)
  for (let y = 0; y < height; y += 500) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y)
    await wait(90)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await wait(500)
}

async function shot(name, { full = true } = {}) {
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: full })
  console.log('saved', name)
}

// 1. 首页（桌面）
await open('/')
await wait(600)
await scrollThrough()
await shot('01-home')

// 2. 博客列表
await open('/#/blog')
await wait(400)
await scrollThrough()
await shot('02-blog', { full: false })

// 3. 文章详情
await open('/#/blog/hashmap-capacity-pow2')
await wait(500)
await scrollThrough()
await shot('03-post')

// 4. 项目详情
await open('/#/projects/edurag-dual-engine')
await wait(400)
await scrollThrough()
await shot('04-project')

// 5. 移动端首页
await page.setViewportSize({ width: 390, height: 844 })
await open('/')
await wait(600)
await scrollThrough()
await shot('05-home-mobile')

// 6. 后台登录
await page.setViewportSize({ width: 1440, height: 900 })
await open('/#/admin/login')
await wait(300)
await shot('06-login', { full: false })

// 7. 登录后台
await page.fill('#login-user', 'admin')
await page.fill('#login-pass', 'admin123')
await page.click('button[type=submit]')
await wait(900)
await shot('07-admin-dashboard')

// 8. 个人信息
await open('/#/admin/profile')
await wait(400)
await shot('08-admin-profile', { full: false })

// 9. 博客编辑器
await open('/#/admin/posts')
await wait(300)
const editBtn = page.getByRole('button', { name: '编辑' }).first()
await editBtn.click()
await wait(500)
await shot('09-admin-editor')

// 10. 技能管理
await open('/#/admin/skills')
await wait(300)
await shot('10-admin-skills', { full: false })

console.log('\n--- console problems ---')
console.log(problems.length ? [...new Set(problems)].join('\n') : 'none')

await browser.close()
