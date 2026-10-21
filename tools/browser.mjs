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

/** 本机系统代理指向一个未运行的本地端口，浏览器会被它拦成 ERR_CONNECTION_CLOSED，直接绕过 */
export const chromiumArgs = ['--no-proxy-server', '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding']

if (process.env.PIN_DNS) {
  // 形如 againqw.github.io:185.199.108.153，用于绕开被污染的 DNS
  chromiumArgs.push(`--host-resolver-rules=MAP ${process.env.PIN_DNS}`)
}

export const chromePath =
  process.env.CHROME ||
  `${process.env.HOME}/AppData/Local/ms-playwright/chromium-1161/chrome-win/chrome.exe`
