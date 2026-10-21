import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDB } from '../hooks/useDB'
import { formatDate, publishedPosts, readingMinutes } from '../api'

export function BlogList() {
  const db = useDB()
  const posts = publishedPosts(db)
  const [tag, setTag] = useState('全部')

  const tags = useMemo(() => {
    const counter = new Map<string, number>()
    posts.forEach((post) => post.tags.forEach((t) => counter.set(t, (counter.get(t) ?? 0) + 1)))
    return ['全部', ...[...counter.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t)]
  }, [posts])

  const visible = tag === '全部' ? posts : posts.filter((post) => post.tags.includes(tag))

  return (
    <div className="container">
      <header className="page-head">
        <h1 className="page-head__title">博客</h1>
        <p className="page-head__summary">
          记录 Java、数据库与 RAG 落地过程中的原理与坑。目前共 {posts.length} 篇。
        </p>
      </header>

      <div className="section" style={{ paddingTop: 12 }}>
        <div className="tags-filter">
          {tags.map((item) => (
            <button
              key={item}
              type="button"
              className={tag === item ? 'is-active' : ''}
              onClick={() => setTag(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="empty">这个标签下还没有文章</div>
        ) : (
          <div className="post-list">
            {visible.map((post) => (
              <Link to={`/blog/${post.slug}`} className="post-row" key={post.id}>
                <h2 className="post-row__title">{post.title}</h2>
                <div className="post-row__meta">
                  <span>{formatDate(post.publishedAt)}</span>
                  <span>{readingMinutes(post.content)} min</span>
                </div>
                <p className="post-row__summary">{post.summary}</p>
                <div className="post-row__tags">
                  {post.tags.map((t) => (
                    <span className="chip" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
