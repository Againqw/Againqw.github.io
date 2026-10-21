/**
 * 把 PRD / TECH_DESIGN / AGENTS 渲染成"文档截图"。
 * 用浅色纸张样式整页截图，便于直接上传作业平台。
 *
 * 运行：node tools/shoot-docs.mjs
 */
import { readFileSync, mkdirSync } from 'node:fs'
import { marked } from 'marked'
import { getChromium, chromePath, chromiumArgs } from './browser.mjs'

const OUT = process.env.OUT || 'deliverables'
mkdirSync(OUT, { recursive: true })

const DOCS = [
  { file: 'PRD.md', name: '03-1-PRD' },
  { file: 'TECH_DESIGN.md', name: '03-2-TECH_DESIGN' },
  { file: 'AGENTS.md', name: '03-3-AGENTS' },
]

const CSS = `
  * { box-sizing: border-box; }
  body {
    margin: 0; background: #fff; color: #1b2230;
    font-family: -apple-system, "Segoe UI", "Microsoft YaHei", "PingFang SC", sans-serif;
    font-size: 15px; line-height: 1.85;
  }
  .page { max-width: 940px; margin: 0 auto; padding: 56px 64px 72px; }
  .doc-head { display: flex; align-items: center; gap: 10px; margin-bottom: 26px;
    padding-bottom: 12px; border-bottom: 1px solid #e6eaf2; color: #6b7691; font-size: 12.5px;
    font-family: ui-monospace, Consolas, monospace; letter-spacing: .04em; }
  .doc-head i { width: 8px; height: 8px; border-radius: 50%; background: #6D8CFF; }
  h1 { font-size: 27px; line-height: 1.35; letter-spacing: -.01em; margin: 0 0 18px;
       padding-bottom: 14px; border-bottom: 2px solid #6D8CFF; }
  h2 { font-size: 19px; margin: 34px 0 12px; padding-left: 11px; border-left: 3px solid #6D8CFF; line-height: 1.4; }
  h3 { font-size: 16px; margin: 24px 0 8px; color: #24304a; }
  p { margin: 10px 0; color: #2c3648; }
  strong { color: #141b28; }
  a { color: #3f5fd6; text-decoration: none; border-bottom: 1px solid #c9d4f5; }
  ul, ol { margin: 10px 0; padding-left: 22px; }
  li { margin: 5px 0; }
  blockquote { margin: 14px 0; padding: 10px 16px; background: #f5f7ff;
    border-left: 3px solid #6D8CFF; color: #4b5771; border-radius: 0 8px 8px 0; }
  table { width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 13.5px; }
  th, td { border: 1px solid #dfe5f0; padding: 8px 11px; text-align: left; vertical-align: top; }
  th { background: #f4f7fd; font-weight: 600; color: #2a3550; }
  tr:nth-child(even) td { background: #fafbfe; }
  code { background: #f1f4fa; padding: 1px 5px; border-radius: 4px;
    font-family: ui-monospace, Consolas, monospace; font-size: 12.8px; color: #2f4a7a; }
  pre { background: #f7f9fd; border: 1px solid #e4e9f3; border-radius: 10px;
    padding: 14px 16px; overflow-x: auto; margin: 14px 0; }
  pre code { background: none; padding: 0; font-size: 12.5px; line-height: 1.7; color: #33415c; }
  hr { border: none; border-top: 1px solid #e6eaf2; margin: 26px 0; }
  .checkbox { color: #6b7691; }
  .footer { margin-top: 44px; padding-top: 14px; border-top: 1px solid #e6eaf2;
    color: #98a2b8; font-size: 12px; font-family: ui-monospace, Consolas, monospace; }
`

const C = await getChromium()
const browser = await C.launch({ executablePath: chromePath, args: chromiumArgs })
const page = await browser.newPage({ viewport: { width: 1000, height: 1200 }, deviceScaleFactor: 1.5 })

for (const doc of DOCS) {
  const md = readFileSync(doc.file, 'utf8')
  const html = marked.parse(md, { gfm: true, breaks: true })
  const body = html
    .replace(/<li>\s*\[ \]/g, '<li class="checkbox">☐')
    .replace(/<li>\s*\[x\]/gi, '<li class="checkbox">☑')

  await page.setContent(
    `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8" />
     <style>${CSS}</style></head><body><div class="page">
     <div class="doc-head"><i></i>${doc.file} · 薛志豪 · 个人展示网站</div>
     ${body}
     <div class="footer">${doc.file} · portfolio · https://againqw.github.io/</div>
     </div></body></html>`,
    { waitUntil: 'load' },
  )
  await page.waitForTimeout(300)
  await page.screenshot({ path: `${OUT}/${doc.name}.png`, fullPage: true })
  const size = await page.evaluate(() => document.body.scrollHeight)
  console.log(`saved ${doc.name}.png (${size}px tall)`)
}

await browser.close()
