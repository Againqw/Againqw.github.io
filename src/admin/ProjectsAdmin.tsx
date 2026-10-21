import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api, formatDate, type ProjectInput } from '../api'
import { projectSchema, toFieldErrors, type FieldErrors } from '../api/schemas'
import { toast } from '../components/toast'
import { useDB } from '../hooks/useDB'
import { MarkdownEditor } from './MarkdownEditor'
import type { Project } from '../types'

interface Draft {
  id?: string
  title: string
  slug: string
  summary: string
  tags: string
  cover: string
  repoUrl: string
  demoUrl: string
  featured: boolean
  content: string
}

const EMPTY: Draft = {
  title: '',
  slug: '',
  summary: '',
  tags: '',
  cover: '',
  repoUrl: '',
  demoUrl: '',
  featured: false,
  content: '',
}

export function ProjectsAdmin() {
  const db = useDB()
  const [draft, setDraft] = useState<Draft | null>(null)
  const [errors, setErrors] = useState<FieldErrors>({})

  const projects = [...db.projects].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  const startEdit = (project: Project) => {
    setErrors({})
    setDraft({
      id: project.id,
      title: project.title,
      slug: project.slug,
      summary: project.summary,
      tags: project.tags.join(', '),
      cover: project.cover,
      repoUrl: project.repoUrl,
      demoUrl: project.demoUrl,
      featured: project.featured,
      content: project.content,
    })
  }

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  const save = () => {
    if (!draft) return
    const parsed = projectSchema.safeParse(draft)
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error))
      toast('有字段未通过校验', 'error')
      return
    }
    setErrors({})
    const payload: ProjectInput = {
      ...(draft.id ? { id: draft.id } : {}),
      title: parsed.data.title,
      slug: parsed.data.slug,
      summary: parsed.data.summary,
      tags: parsed.data.tags
        .split(/[,，]/)
        .map((s) => s.trim())
        .filter(Boolean),
      cover: parsed.data.cover,
      repoUrl: parsed.data.repoUrl,
      demoUrl: parsed.data.demoUrl,
      featured: draft.featured,
      content: parsed.data.content,
    }
    const result = api.saveProject(payload)
    if (result.ok) {
      toast(draft.id ? '项目已更新' : '项目已创建')
      setDraft(null)
    } else {
      toast(result.error ?? '保存失败', 'error')
    }
  }

  const remove = (project: Project) => {
    if (!window.confirm(`确定删除项目「${project.title}」吗？删除后前台立即消失，且不可恢复。`)) return
    const result = api.deleteProject(project.id)
    if (result.ok) toast('项目已删除', 'info')
    else toast(result.error ?? '删除失败', 'error')
  }

  if (draft) {
    return (
      <div className="form">
        <div className="card">
          <div className="card__head">
            <div>
              <div className="card__title">{draft.id ? '编辑项目' : '新建项目'}</div>
              <div className="card__desc">正文用 Markdown，右侧可实时预览</div>
            </div>
            <div className="card__actions">
              <button type="button" className="btn btn--sm btn--ghost" onClick={() => setDraft(null)}>
                返回列表
              </button>
            </div>
          </div>

          <div className="form-grid">
            <div className="field">
              <label className="field__label" htmlFor="pr-title">
                项目名称 <b>*</b>
              </label>
              <input
                id="pr-title"
                className={`input ${errors.title ? 'is-error' : ''}`}
                value={draft.title}
                onChange={(e) => set('title', e.target.value)}
              />
              {errors.title && <span className="field__error">{errors.title}</span>}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="pr-slug">
                URL 标识（slug）
              </label>
              <input
                id="pr-slug"
                className="input"
                placeholder="留空自动生成，如 edurag-dual-engine"
                value={draft.slug}
                onChange={(e) => set('slug', e.target.value)}
              />
              {errors.slug && <span className="field__error">{errors.slug}</span>}
            </div>

            <div className="field field--full">
              <label className="field__label" htmlFor="pr-summary">
                一句话摘要 <b>*</b>
              </label>
              <textarea
                id="pr-summary"
                className={`textarea ${errors.summary ? 'is-error' : ''}`}
                rows={2}
                value={draft.summary}
                onChange={(e) => set('summary', e.target.value)}
              />
              <span className="field__hint">展示在卡片上，建议 60–120 字</span>
              {errors.summary && <span className="field__error">{errors.summary}</span>}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="pr-tags">
                技术标签
              </label>
              <input
                id="pr-tags"
                className="input"
                placeholder="Spring Boot, MySQL, Redis"
                value={draft.tags}
                onChange={(e) => set('tags', e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="pr-cover">
                封面图 URL
              </label>
              <input
                id="pr-cover"
                className="input"
                placeholder="留空则使用渐变色占位"
                value={draft.cover}
                onChange={(e) => set('cover', e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="pr-repo">
                仓库地址
              </label>
              <input
                id="pr-repo"
                className="input"
                placeholder="https://github.com/…"
                value={draft.repoUrl}
                onChange={(e) => set('repoUrl', e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="pr-demo">
                演示地址
              </label>
              <input
                id="pr-demo"
                className="input"
                placeholder="https://…"
                value={draft.demoUrl}
                onChange={(e) => set('demoUrl', e.target.value)}
              />
            </div>

            <div className="field field--full">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={(e) => set('featured', e.target.checked)}
                />
                标记为精选项目（首页优先展示）
              </label>
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <MarkdownEditor
              value={draft.content}
              onChange={(value) => set('content', value)}
              error={errors.content}
            />
          </div>

          <div className="admin-form-actions">
            <button type="button" className="btn btn--primary" onClick={save}>
              保存项目
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
          <div className="card__title">全部项目</div>
          <div className="card__desc">共 {projects.length} 个，精选 {projects.filter((p) => p.featured).length} 个</div>
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
            ＋ 新建项目
          </button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>项目</th>
              <th>标签</th>
              <th>状态</th>
              <th>更新时间</th>
              <th style={{ textAlign: 'right' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>
                  <div className="table__title">{project.title}</div>
                  <div className="table__sub">/{project.slug}</div>
                </td>
                <td>
                  <div className="row row--wrap" style={{ gap: 4 }}>
                    {project.tags.slice(0, 3).map((tag) => (
                      <span className="chip" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <span className={`badge ${project.featured ? '' : 'badge--muted'}`}>
                    {project.featured ? '精选' : '普通'}
                  </span>
                </td>
                <td className="table__sub">{formatDate(project.updatedAt)}</td>
                <td>
                  <div className="table__actions">
                    <Link to={`/projects/${project.slug}`} className="btn btn--sm btn--ghost">
                      查看
                    </Link>
                    <button type="button" className="btn btn--sm" onClick={() => startEdit(project)}>
                      编辑
                    </button>
                    <button type="button" className="btn btn--sm btn--danger" onClick={() => remove(project)}>
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {projects.length === 0 && <div className="empty">还没有项目，点击右上角新建</div>}
      </div>
    </div>
  )
}
