import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Markdown } from '../components/Markdown'
import { useDB } from '../hooks/useDB'
import { extractToc } from '../lib/markdown'
import { formatDate, publishedPosts, readingMinutes } from '../api'

export function BlogPost() {
  const { slug } = useParams()
  const db = useDB()
  const posts = publishedPosts(db)
  const index = posts.findIndex((p) => p.slug === slug)
  const post = index >= 0 ? posts[index] : undefined
  const toc = useMemo(() => (post ? extractToc(post.content) : []), [post])
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    if (!post) return
    window.scrollTo({ top: 0 })
    const timer = window.setTimeout(() => {
      const headings = Array.from(
        document.querySelectorAll<HTMLElement>('.article__body h2, .article__body h3'),
      )
      if (headings.length === 0) return
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
          if (visible) setActiveId(visible.target.id)
        },
        { rootMargin: '-90px 0px -65% 0px', threshold: 0 },
      )
      headings.forEach((h) => observer.observe(h))
      return () => observer.disconnect()
    }, 60)
    return () => window.clearTimeout(timer)
  }, [post])

  if (!post) {
    return (
      <div className="container">
        <div className="page-head">
          <h1 className="page-head__title">文章不存在</h1>
          <p className="page-head__summary">可能已被删除，或者链接不对。</p>
          <p style={{ marginTop: 18 }}>
            <Link to="/blog" className="link-arrow">
              返回博客列表 <span>→</span>
            </Link>
          </p>
        </div>
      </div>
    )
  }

  const prev = index < posts.length - 1 ? posts[index + 1] : undefined
  const next = index > 0 ? posts[index - 1] : undefined

  return (
    <div className="container">
      <header className="page-head">
        <Link to="/blog" className="page-head__back">
          ← 全部文章
        </Link>
        <h1 className="page-head__title">{post.title}</h1>
        <div className="page-head__meta">
          <span>{formatDate(post.publishedAt)}</span>
          <span>·</span>
          <span>{readingMinutes(post.content)} 分钟阅读</span>
          {post.tags.map((tag) => (
            <span className="chip" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <p className="page-head__summary">{post.summary}</p>
      </header>

      <div className="article">
        <div className="article__body">
          <Markdown content={post.content} />

          <nav className="prev-next" aria-label="上一篇下一篇">
            {prev ? (
              <Link to={`/blog/${prev.slug}`}>
                <small>← 更早</small>
                <strong>{prev.title}</strong>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link to={`/blog/${next.slug}`} style={{ textAlign: 'right' }}>
                <small>更新 →</small>
                <strong>{next.title}</strong>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>

        {toc.length > 2 && (
          <aside className="toc" aria-label="目录">
            <div className="toc__title">目录</div>
            {toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`${item.level === 3 ? 'lv-3' : ''} ${activeId === item.id ? 'is-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  setActiveId(item.id)
                }}
              >
                {item.text}
              </a>
            ))}
          </aside>
        )}
      </div>
    </div>
  )
}
