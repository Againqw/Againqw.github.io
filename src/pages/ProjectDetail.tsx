import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Markdown } from '../components/Markdown'
import { useDB } from '../hooks/useDB'
import { formatDate } from '../api'
import { coverGradient } from '../lib/cover'

export function ProjectDetail() {
  const { slug } = useParams()
  const db = useDB()
  const project = db.projects.find((p) => p.slug === slug)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [slug])

  if (!project) {
    return (
      <div className="container">
        <div className="page-head">
          <h1 className="page-head__title">项目不存在</h1>
          <p className="page-head__summary">链接可能已失效。</p>
          <p style={{ marginTop: 18 }}>
            <Link to="/" className="link-arrow">
              回到首页 <span>→</span>
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <header className="page-head">
        <Link to="/" className="page-head__back">
          ← 返回首页
        </Link>
        <h1 className="page-head__title">{project.title}</h1>
        <div className="page-head__meta">
          <span>更新于 {formatDate(project.updatedAt)}</span>
          {project.tags.map((tag) => (
            <span className="chip" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <p className="page-head__summary">{project.summary}</p>

        <div className="row row--wrap" style={{ marginTop: 20 }}>
          {project.demoUrl && (
            <a className="btn btn--primary" href={project.demoUrl} target="_blank" rel="noreferrer">
              在线预览 ↗
            </a>
          )}
          {project.repoUrl && (
            <a className="btn" href={project.repoUrl} target="_blank" rel="noreferrer">
              源码仓库 ↗
            </a>
          )}
        </div>
      </header>

      <div className="article">
        <div className="article__body">
          {project.cover && (
            <img
              src={project.cover}
              alt={project.title}
              style={{ borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: 24 }}
            />
          )}
          <Markdown content={project.content} />
        </div>

        <aside className="toc">
          <div className="toc__title">项目信息</div>
          <div style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 2 }}>
            <div>创建：{formatDate(project.createdAt)}</div>
            <div>更新：{formatDate(project.updatedAt)}</div>
            <div>状态：{project.featured ? '精选项目' : '归档项目'}</div>
          </div>
          <div
            aria-hidden="true"
            style={{
              marginTop: 16,
              height: 84,
              borderRadius: 12,
              background: project.cover ? 'none' : coverGradient(project.title),
              opacity: 0.85,
            }}
          />
        </aside>
      </div>
    </div>
  )
}
