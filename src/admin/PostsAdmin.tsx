import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api, formatDate, readingMinutes, type PostInput } from '../api'
import { postSchema, toFieldErrors, type FieldErrors } from '../api/schemas'
import { toast } from '../components/toast'
import { useDB } from '../hooks/useDB'
import { MarkdownEditor } from './MarkdownEditor'
import type { Post, PostStatus } from '../types'

interface Draft {
  id?: string
  title: string
  slug: string
  summary: string
  tags: string
  content: string
  status: PostStatus
  publishedAt: string
}

function today(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const EMPTY: Draft = {
  title: '',
  slug: '',
  summary: '',
  tags: '',
  content: '',
  status: 'draft',
  publishedAt: today(),
}

export function PostsAdmin() {
  const db = useDB()
  const [draft, setDraft] = useState<Draft | null>(null)
  const [errors, setErrors] = useState<FieldErrors>({})

  const posts = [...db.posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

  const startEdit = (post: Post) => {
    setErrors({})
    setDraft({
      id: post.id,
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      tags: post.tags.join(', '),
      content: post.content,
      status: post.status,
      publishedAt: post.publishedAt.slice(0, 10),
    })
  }

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  const save = () => {
    if (!draft) return
    const parsed = postSchema.safeParse(draft)
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error))
      toast('有字段未通过校验', 'error')
      return
    }
    setErrors({})
    const date = new Date(`${draft.publishedAt}T09:00:00`)
    const payload: PostInput = {
      ...(draft.id ? { id: draft.id } : {}),
      title: parsed.data.title,
      slug: parsed.data.slug,
      summary: parsed.data.summary,
      tags: parsed.data.tags
        .split(/[,，]/)
        .map((s) => s.trim())
        .filter(Boolean),
      content: parsed.data.content,
      status: draft.status,
      publishedAt: Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString(),
    }
    const result = api.savePost(payload)
    if (result.ok) {
      toast(draft.id ? '文章已更新' : '文章已创建')
      setDraft(null)
    } else {
      toast(result.error ?? '保存失败', 'error')
    }
  }

  const remove = (post: Post) => {
    if (!window.confirm(`确定删除文章「${post.title}」吗？删除后不可恢复。`)) return
    const result = api.deletePost(post.id)
    if (result.ok) toast('文章已删除', 'info')
    else toast(result.error ?? '删除失败', 'error')
  }

  const toggleStatus = (post: Post) => {
    const next: PostStatus = post.status === 'published' ? 'draft' : 'published'
    const result = api.savePost({
      id: post.id,
      slug: post.slug,
      title: post.title,
      summary: post.summary,
      tags: post.tags,
      content: post.content,
      status: next,
      publishedAt: post.publishedAt,
    })
    if (result.ok) toast(next === 'published' ? '已发布，前台可见' : '已转为草稿，前台隐藏')
    else toast(result.error ?? '操作失败', 'error')
  }

  if (draft) {
    return (
      <div className="form">
        <div className="card">
          <div className="card__head">
            <div>
              <div className="card__title">{draft.id ? '编辑文章' : '写新文章'}</div>
              <div className="card__desc">草稿不会出现在前台，发布后立即进入博客列表</div>
            </div>
            <div className="card__actions">
              <button type="button" className="btn btn--sm btn--ghost" onClick={() => setDraft(null)}>
                返回列表
              </button>
            </div>
          </div>

          <div className="form-grid">
            <div className="field">
              <label className="field__label" htmlFor="po-title">
                标题 <b>*</b>
              </label>
              <input
                id="po-title"
                className={`input ${errors.title ? 'is-error' : ''}`}
                value={draft.title}
                onChange={(e) => set('title', e.target.value)}
              />
              {errors.title && <span className="field__error">{errors.title}</span>}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="po-slug">
                URL 标识（slug）
              </label>
              <input
                id="po-slug"
                className="input"
                placeholder="留空自动生成"
                value={draft.slug}
                onChange={(e) => set('slug', e.target.value)}
              />
              {errors.slug && <span className="field__error">{errors.slug}</span>}
            </div>

            <div className="field field--full">
              <label className="field__label" htmlFor="po-summary">
                摘要 <b>*</b>
              </label>
              <textarea
                id="po-summary"
                className={`textarea ${errors.summary ? 'is-error' : ''}`}
                rows={2}
                value={draft.summary}
                onChange={(e) => set('summary', e.target.value)}
              />
              <span className="field__hint">展示在列表页，建议 60–120 字</span>
              {errors.summary && <span className="field__error">{errors.summary}</span>}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="po-tags">
                标签
              </label>
              <input
                id="po-tags"
                className="input"
                placeholder="Java, 集合"
                value={draft.tags}
                onChange={(e) => set('tags', e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="po-date">
                日期
              </label>
              <input
                id="po-date"
                type="date"
                className="input"
                value={draft.publishedAt}
                onChange={(e) => set('publishedAt', e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="po-status">
                状态
              </label>
              <select
                id="po-status"
                className="select"
                value={draft.status}
                onChange={(e) => set('status', e.target.value as PostStatus)}
              >
                <option value="draft">草稿（前台不可见）</option>
                <option value="published">已发布</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <MarkdownEditor
              value={draft.content}
              onChange={(value) => set('content', value)}
              error={errors.content}
              rows={18}
            />
          </div>

          <div className="admin-form-actions">
            <button type="button" className="btn btn--primary" onClick={save}>
              保存文章
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => setDraft(null)}>
              取消
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card__head">
        <div>
          <div className="card__title">全部文章</div>
          <div className="card__desc">
            共 {posts.length} 篇，已发布 {posts.filter((p) => p.status === 'published').length} 篇
          </div>
        </div>
        <div className="card__actions">
          <button
            type="button"
            className="btn btn--sm btn--primary"
            onClick={() => {
              setErrors({})
              setDraft({ ...EMPTY })
            }}
          >
            ＋ 写文章
          </button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>标题</th>
              <th>标签</th>
              <th>状态</th>
              <th>日期</th>
              <th style={{ textAlign: 'right' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <div className="table__title">{post.title}</div>
                  <div className="table__sub">
                    /{post.slug} · {readingMinutes(post.content)} min
                  </div>
                </td>
                <td>
                  <div className="row row--wrap" style={{ gap: 4 }}>
                    {post.tags.slice(0, 2).map((tag) => (
                      <span className="chip" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <span className={`badge ${post.status === 'draft' ? 'badge--draft' : ''}`}>
                    {post.status === 'draft' ? '草稿' : '已发布'}
                  </span>
                </td>
                <td className="table__sub">{formatDate(post.publishedAt)}</td>
                <td>
                  <div className="table__actions">
                    {post.status === 'published' && (
                      <Link to={`/blog/${post.slug}`} className="btn btn--sm btn--ghost">
                        查看
                      </Link>
                    )}
                    <button type="button" className="btn btn--sm" onClick={() => startEdit(post)}>
                      编辑
                    </button>
                    <button type="button" className="btn btn--sm btn--ghost" onClick={() => toggleStatus(post)}>
                      {post.status === 'published' ? '转草稿' : '发布'}
                    </button>
                    <button type="button" className="btn btn--sm btn--danger" onClick={() => remove(post)}>
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && <div className="empty">还没有文章</div>}
      </div>
    </div>
  )
}
