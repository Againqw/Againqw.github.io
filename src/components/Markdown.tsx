import { useEffect, useMemo, useRef } from 'react'
import hljs from 'highlight.js/lib/core'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import sql from 'highlight.js/lib/languages/sql'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import yaml from 'highlight.js/lib/languages/yaml'
import { renderMarkdown } from '../lib/markdown'

hljs.registerLanguage('java', java)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('ts', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('py', python)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('json', json)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('yaml', yaml)

interface MarkdownProps {
  content: string
  className?: string
}

export function Markdown({ content, className = '' }: MarkdownProps) {
  const html = useMemo(() => renderMarkdown(content), [content])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    // 给标题分配稳定 id，与 extractToc 的序号一一对应
    root.querySelectorAll('h2, h3').forEach((el, index) => {
      el.id = `h-${index}`
    })

    // 代码高亮（未知语言交给自动识别）
    root.querySelectorAll('pre > code').forEach((node) => {
      const el = node as HTMLElement
      if (el.dataset.highlighted === 'yes') return
      const lang = /language-([\w-]+)/.exec(el.className)?.[1]
      if (lang && !hljs.getLanguage(lang)) el.className = ''
      try {
        hljs.highlightElement(el)
      } catch {
        // 高亮失败不影响正文
      }
    })

    root.querySelectorAll('a[href^="http"]').forEach((a) => {
      a.setAttribute('target', '_blank')
      a.setAttribute('rel', 'noopener noreferrer')
    })
  }, [html])

  return (
    <div
      ref={ref}
      className={`prose ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
