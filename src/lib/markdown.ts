import { marked } from 'marked'
import DOMPurify from 'dompurify'

marked.setOptions({ gfm: true, breaks: true })

export interface TocItem {
  id: string
  text: string
  level: number
}

/** 去掉行内 Markdown 标记，得到目录里显示的纯文本 */
function stripInline(text: string): string {
  return text
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*([^*]*)\*\*/g, '$1')
    .replace(/\*([^*]*)\*/g, '$1')
    .replace(/~~([^~]*)~~/g, '$1')
    .trim()
}

/**
 * 从 Markdown 里提取 h2/h3 生成目录。
 * id 用序号（h-0、h-1…）而不是中文 slug：稳定、不会重复、也不受编码影响。
 */
export function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = []
  let inFence = false
  for (const raw of markdown.split('\n')) {
    const line = raw.trimEnd()
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const match = /^(#{2,3})\s+(.+)$/.exec(line)
    if (!match) continue
    items.push({
      id: `h-${items.length}`,
      text: stripInline(match[2]),
      level: match[1].length,
    })
  }
  return items
}

/** Markdown → 安全的 HTML */
export function renderMarkdown(markdown: string): string {
  const raw = marked.parse(markdown) as string
  return DOMPurify.sanitize(raw, {
    ADD_ATTR: ['target', 'rel'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input'],
  })
}
