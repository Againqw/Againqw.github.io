import { writeFileSync, mkdirSync } from 'node:fs'

mkdirSync('_shots/panels', { recursive: true })
import { getChromium, chromePath, chromiumArgs } from './browser.mjs'

const SITE = 'https://againqw.github.io'
const chromium = await getChromium()
const browser = await chromium.launch({
  executablePath: chromePath,
  args: [...chromiumArgs, '--host-resolver-rules=MAP againqw.github.io 185.199.108.153'],
})
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1.5 })
const page = await ctx.newPage()

await page.goto(`${SITE}/#/admin/login`, { waitUntil: 'networkidle' })
await page.fill('#login-user', 'admin')
await page.fill('#login-pass', 'admin123')
await page.click('button[type=submit]')
await page.waitForTimeout(800)

await page.goto(`${SITE}/#/admin/profile`, { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
await page.fill('#p-tagline', '校招中 · Java 后端 / AI 应用，随时可以聊。')
await page.waitForTimeout(200)

const card = page.locator('.card').first()
await card.scrollIntoViewIfNeeded()
await page.waitForTimeout(200)
const adminRel = await page.evaluate(() => {
  const c = document.querySelector('.card')
  const i = document.querySelector('#p-tagline')
  if (!c || !i) return null
  const cb = c.getBoundingClientRect()
  const ib = i.getBoundingClientRect()
  return { x: ib.x - cb.x, y: ib.y - cb.y, w: ib.width, h: ib.height }
})
await card.screenshot({ path: '_shots/panels/_panel-admin.png' })

await page.getByRole('button', { name: '保存修改' }).click()
await page.waitForTimeout(400)
await page.goto(`${SITE}/#/`, { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
const hero = page.locator('.hero')
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(200)
const frontRel = await page.evaluate(() => {
  const h = document.querySelector('.hero')
  const t = document.querySelector('.hero__tagline')
  if (!h || !t) return null
  const hb = h.getBoundingClientRect()
  const tb = t.getBoundingClientRect()
  return { x: tb.x - hb.x, y: tb.y - hb.y, w: tb.width, h: tb.height }
})
await hero.screenshot({ path: '_shots/panels/_panel-front.png' })

writeFileSync(
  '_shots/panels/_boxes.json',
  JSON.stringify({ admin: { input: adminRel }, front: { tagline: frontRel } }, null, 2),
)

await browser.close()
console.log('panels + boxes saved')
