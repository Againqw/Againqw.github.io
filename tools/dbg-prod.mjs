import { getChromium, chromePath, chromiumArgs } from './browser.mjs'

const C = await getChromium()
const b = await C.launch({ executablePath: chromePath, args: chromiumArgs })
const p = await b.newPage()
const failed = []
p.on('requestfailed', (r) => failed.push(r.url()))

for (let i = 1; i <= 6; i += 1) {
  failed.length = 0
  try {
    const resp = await p.goto('https://againqw.github.io/', { waitUntil: 'networkidle', timeout: 25000 })
    const h1 = await p.locator('h1').count().catch(() => 0)
    const rootLen = await p.evaluate(() => document.getElementById('root')?.innerHTML.length ?? 0)
    console.log(`try${i} status=${resp?.status()} h1=${h1} root=${rootLen} failed=${failed.length}`)
    if (h1 > 0 && rootLen > 2000) {
      console.log('OK', await p.locator('h1').innerText())
      break
    }
  } catch (err) {
    console.log(`try${i} error: ${err.message.split('\n')[0]}`)
  }
  await p.waitForTimeout(2500)
}
await b.close()
