/**
 * 线上站点截图（交付物 04）。
 * DNS 在本机会被污染成错误 IP，导致 ERR_CONNECTION_CLOSED，因此固定解析到 Pages 的任一 A 记录。
 *
 * 运行：node tools/shoot-live.mjs
 */
import { mkdirSync } from 'node:fs'
import { getChromium, chromePath, chromiumArgs } from './browser.mjs'

const SITE = process.env.SITE || 'https://againqw.github.io'
const OUT = process.env.OUT || 'deliverables'
mkdirSync(OUT, { recursive: true })

const chromium = await getChromium()
const args = [...chromiumArgs, '--host-resolver-rules=MAP againqw.github.io 185.199.108.153']

const browser = await chromium.launch({ executablePath: chromePath, args })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 })
const page = await ctx.newPage()

const problems = []
page.on('console', (m) => {
  if (m.type() === 'error') problems.push(m.text())
})
page.on('pageerror', (e) => problems.push(e.message))
page.on('requestfailed', (r) => problems.push(`reqfail ${r.url()}`))

const wait = (ms) => page.waitForTimeout(ms)

async function open(hash = '/', attempts = 4) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      await page.goto(`${SITE}/#${hash}`, { waitUntil: 'networkidle', timeout: 30000 })
      await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' })
      await wait(500)
      return
    } catch (err) {
      if (i === attempts - 1) throw err
      await wait(1500)
    }
  }
}

async function scrollThrough() {
  const height = await page.evaluate(() => document.body.scrollHeight)
  for (let y = 0; y < height; y += 500) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y)
    await wait(80)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await wait(500)
}

const shot = async (name, full = false) => {
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: full })
  console.log('saved', name)
}

// 1. 首页（整页）
await open('/')
await scrollThrough()
await shot('04-1-首页-桌面', true)

// 2. 移动端首屏
await page.setViewportSize({ width: 390, height: 844 })
await open('/')
await wait(600)
await shot('04-2-首页-移动端')
await page.setViewportSize({ width: 1440, height: 900 })

// 3. 博客列表
await open('/blog')
await wait(300)
await shot('04-3-博客列表')

// 4. 文章详情
await open('/blog/hashmap-capacity-pow2')
await wait(600)
await shot('04-4-文章详情-代码高亮')

// 5. 项目详情
await open('/projects/edurag-dual-engine')
await wait(300)
await shot('04-5-项目详情')

// 6. 后台登录
await page.evaluate(() => localStorage.removeItem('portfolio.token'))
await open('/admin/login')
await shot('04-6-后台登录')

// 7. 登录
await page.fill('#login-user', 'admin')
await page.fill('#login-pass', 'admin123')
await page.click('button[type=submit]')
await wait(900)
await shot('04-7-后台仪表盘')

// 8. 个人信息编辑（改一句话介绍）
await open('/admin/profile')
await wait(300)
const tagline = '校招中 · Java 后端 / AI 应用，随时可以聊。'
await page.fill('#p-tagline', tagline)
await wait(200)
await shot('04-8-后台-修改个人信息')
await page.getByRole('button', { name: '保存修改' }).click()
await wait(500)

// 9. 回前台看效果（同一浏览器内的数据源已更新）
await open('/')
await wait(700)
const heroText = await page.locator('.hero__tagline').innerText()
console.log('前台标语:', heroText)
await page.locator('.hero').screenshot({ path: `${OUT}/04-9-前台已同步修改.png` })
console.log('saved 04-9-前台已同步修改')

// 10. 博客管理列表
await open('/admin/posts')
await wait(300)
await shot('04-10-后台-博客管理')

// 11. Markdown 编辑器
await page.getByRole('button', { name: '编辑' }).first().click()
await wait(600)
await shot('04-11-后台-Markdown编辑器')

// 12. 技能管理
await open('/admin/skills')
await wait(300)
await shot('04-12-后台-技能管理')

await browser.close()
console.log('\n控制台问题:', problems.length ? [...new Set(problems)].slice(0, 5).join('\n') : '无')
