/**
 * 截图 / 端到端脚本共用的浏览器启动器。
 * 优先用本地安装的 playwright-core；没有装时回退到 PW_BASE 指定的工程目录。
 */
import { createRequire } from 'node:module'

export async function getChromium() {
  try {
    const mod = await import('playwright-core')
    return mod.chromium
  } catch {
    const base = process.env.PW_BASE || 'D:/Projects/软件工程实践/imagegrab'
    const require = createRequire(`${base}/package.json`)
    return require('playwright-core').chromium
  }
}

export const chromePath =
  process.env.CHROME ||
  `${process.env.HOME}/AppData/Local/ms-playwright/chromium-1161/chrome-win/chrome.exe`
