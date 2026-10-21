import { Link } from 'react-router-dom'
import { Reveal } from '../../components/Reveal'
import { Section } from '../../components/Section'
import { useDB } from '../../hooks/useDB'
import { formatDate, publishedPosts, readingMinutes } from '../../api'

export function Writings() {
  const db = useDB()
  const posts = publishedPosts(db).slice(0, 3)

  return (
    <Section
      id="writing"
      index="04 / WRITING"
      title="最近在写"
      desc="把踩过的坑和想明白的原理写下来，顺便逼自己把细节搞准。"
    >
      <Reveal>
        {posts.length === 0 ? (
          <div className="empty">还没有发布的文章</div>
        ) : (
          <div className="post-list">
            {posts.map((post) => (
              <Link to={`/blog/${post.slug}`} className="post-row" key={post.id}>
                <h3 className="post-row__title">{post.title}</h3>
                <div className="post-row__meta">
                  <span>{formatDate(post.publishedAt)}</span>
                  <span>{readingMinutes(post.content)} min</span>
                </div>
                <p className="post-row__summary">{post.summary}</p>
                <div className="post-row__tags">
                  {post.tags.map((tag) => (
                    <span className="chip" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </Reveal>

      <div style={{ marginTop: 22 }}>
        <Link to="/blog" className="link-arrow">
          查看全部文章 <span aria-hidden="true">→</span>
        </Link>
      </div>
    </Section>
  )
}
