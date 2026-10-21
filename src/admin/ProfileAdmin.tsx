import { useState } from 'react'
import { api, newId } from '../api'
import { profileSchema, toFieldErrors, type FieldErrors } from '../api/schemas'
import { toast } from '../components/toast'
import { useDB } from '../hooks/useDB'
import type { Profile, SocialLink, TimelineItem } from '../types'

interface FormState {
  name: string
  role: string
  tagline: string
  avatarText: string
  location: string
  email: string
  resumeUrl: string
  bio: string
  stack: string
  socials: SocialLink[]
  timeline: TimelineItem[]
}

function toForm(profile: Profile): FormState {
  return {
    name: profile.name,
    role: profile.role,
    tagline: profile.tagline,
    avatarText: profile.avatarText,
    location: profile.location,
    email: profile.email,
    resumeUrl: profile.resumeUrl,
    bio: profile.bio.join('\n\n'),
    stack: profile.stack.join(', '),
    socials: profile.socials.map((s) => ({ ...s })),
    timeline: profile.timeline.map((t) => ({ ...t })),
  }
}

export function ProfileAdmin() {
  const db = useDB()
  const [form, setForm] = useState<FormState>(() => toForm(db.profile))
  const [errors, setErrors] = useState<FieldErrors>({})

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const save = (event: React.FormEvent) => {
    event.preventDefault()
    const parsed = profileSchema.safeParse(form)
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error))
      toast('有字段未通过校验，请检查红字提示', 'error')
      return
    }
    setErrors({})
    const result = api.updateProfile({
      name: parsed.data.name,
      role: parsed.data.role,
      tagline: parsed.data.tagline,
      avatarText: parsed.data.avatarText,
      location: parsed.data.location,
      email: parsed.data.email,
      resumeUrl: parsed.data.resumeUrl,
      bio: parsed.data.bio
        .split(/\n{2,}/)
        .map((s) => s.trim())
        .filter(Boolean),
      stack: parsed.data.stack
        .split(/[,，]/)
        .map((s) => s.trim())
        .filter(Boolean),
      socials: form.socials.filter((s) => s.label.trim() && s.url.trim()),
      timeline: form.timeline.filter((t) => t.title.trim()),
    })
    if (result.ok) toast('个人信息已保存，前台已同步更新')
    else toast(result.error ?? '保存失败', 'error')
  }

  return (
    <form className="form" onSubmit={save} noValidate>
      <div className="card">
        <div className="card__head">
          <div>
            <div className="card__title">基础信息</div>
            <div className="card__desc">展示在首页 Hero 区与页脚，保存后立即生效</div>
          </div>
        </div>

        <div className="form-grid">
          <div className="field">
            <label className="field__label" htmlFor="p-name">
              姓名 <b>*</b>
            </label>
            <input
              id="p-name"
              className={`input ${errors.name ? 'is-error' : ''}`}
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
            />
            {errors.name && <span className="field__error">{errors.name}</span>}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="p-role">
              职位 / 方向 <b>*</b>
            </label>
            <input
              id="p-role"
              className={`input ${errors.role ? 'is-error' : ''}`}
              value={form.role}
              onChange={(e) => set('role', e.target.value)}
            />
            {errors.role && <span className="field__error">{errors.role}</span>}
          </div>

          <div className="field field--full">
            <label className="field__label" htmlFor="p-tagline">
              一句话介绍 <b>*</b>
            </label>
            <input
              id="p-tagline"
              className={`input ${errors.tagline ? 'is-error' : ''}`}
              value={form.tagline}
              onChange={(e) => set('tagline', e.target.value)}
            />
            <span className="field__hint">Hero 区的主标语，建议 20 字以内</span>
            {errors.tagline && <span className="field__error">{errors.tagline}</span>}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="p-avatar">
              头像文字 <b>*</b>
            </label>
            <input
              id="p-avatar"
              className={`input ${errors.avatarText ? 'is-error' : ''}`}
              value={form.avatarText}
              maxLength={2}
              onChange={(e) => set('avatarText', e.target.value)}
            />
            {errors.avatarText && <span className="field__error">{errors.avatarText}</span>}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="p-location">
              所在地
            </label>
            <input
              id="p-location"
              className="input"
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="p-email">
              邮箱 <b>*</b>
            </label>
            <input
              id="p-email"
              className={`input ${errors.email ? 'is-error' : ''}`}
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
            />
            {errors.email && <span className="field__error">{errors.email}</span>}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="p-resume">
              简历链接
            </label>
            <input
              id="p-resume"
              className="input"
              placeholder="可选，如 /resume.pdf"
              value={form.resumeUrl}
              onChange={(e) => set('resumeUrl', e.target.value)}
            />
          </div>

          <div className="field field--full">
            <label className="field__label" htmlFor="p-bio">
              自我介绍 <b>*</b>
            </label>
            <textarea
              id="p-bio"
              className={`textarea ${errors.bio ? 'is-error' : ''}`}
              rows={9}
              value={form.bio}
              onChange={(e) => set('bio', e.target.value)}
            />
            <span className="field__hint">段落之间用一个空行分隔</span>
            {errors.bio && <span className="field__error">{errors.bio}</span>}
          </div>

          <div className="field field--full">
            <label className="field__label" htmlFor="p-stack">
              技术标签
            </label>
            <input
              id="p-stack"
              className="input"
              value={form.stack}
              onChange={(e) => set('stack', e.target.value)}
            />
            <span className="field__hint">用英文逗号分隔，显示在 Hero 区下方</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card__head">
          <div>
            <div className="card__title">社交链接</div>
            <div className="card__desc">显示在联系区与页脚</div>
          </div>
          <div className="card__actions">
            <button
              type="button"
              className="btn btn--sm"
              onClick={() => set('socials', [...form.socials, { label: '', url: '' }])}
            >
              ＋ 添加
            </button>
          </div>
        </div>

        <div className="repeater">
          {form.socials.map((social, index) => (
            <div className="repeater__row repeater__row--social" key={`${social.label}-${index}`}>
              <input
                className="input"
                placeholder="名称，如 GitHub"
                value={social.label}
                onChange={(e) => {
                  const next = [...form.socials]
                  next[index] = { ...next[index], label: e.target.value }
                  set('socials', next)
                }}
              />
              <input
                className="input"
                placeholder="链接，如 https://github.com/Againqw"
                value={social.url}
                onChange={(e) => {
                  const next = [...form.socials]
                  next[index] = { ...next[index], url: e.target.value }
                  set('socials', next)
                }}
              />
              <button
                type="button"
                className="btn btn--sm btn--danger"
                onClick={() => set('socials', form.socials.filter((_, i) => i !== index))}
              >
                删除
              </button>
            </div>
          ))}
          {form.socials.length === 0 && <div className="empty">还没有社交链接</div>}
        </div>
      </div>

      <div className="card">
        <div className="card__head">
          <div>
            <div className="card__title">经历时间线</div>
            <div className="card__desc">教育背景与项目经历，按时间倒序展示</div>
          </div>
          <div className="card__actions">
            <button
              type="button"
              className="btn btn--sm"
              onClick={() =>
                set('timeline', [
                  ...form.timeline,
                  { id: newId('tl'), period: '', title: '', org: '', desc: '' },
                ])
              }
            >
              ＋ 添加
            </button>
          </div>
        </div>

        <div className="repeater">
          {form.timeline.map((item, index) => (
            <div className="repeater__row" key={item.id} style={{ gridTemplateColumns: '1fr 1fr auto' }}>
              <input
                className="input"
                placeholder="时间，如 2025.09 — 2025.12"
                value={item.period}
                onChange={(e) => {
                  const next = [...form.timeline]
                  next[index] = { ...next[index], period: e.target.value }
                  set('timeline', next)
                }}
              />
              <input
                className="input"
                placeholder="标题，如 EduRAG · 独立开发"
                value={item.title}
                onChange={(e) => {
                  const next = [...form.timeline]
                  next[index] = { ...next[index], title: e.target.value }
                  set('timeline', next)
                }}
              />
              <button
                type="button"
                className="btn btn--sm btn--danger"
                onClick={() => set('timeline', form.timeline.filter((_, i) => i !== index))}
              >
                删除
              </button>
              <input
                className="input repeater__grow"
                placeholder="组织 / 团队"
                value={item.org}
                onChange={(e) => {
                  const next = [...form.timeline]
                  next[index] = { ...next[index], org: e.target.value }
                  set('timeline', next)
                }}
              />
              <textarea
                className="textarea repeater__grow"
                rows={2}
                placeholder="一句话描述"
                value={item.desc}
                onChange={(e) => {
                  const next = [...form.timeline]
                  next[index] = { ...next[index], desc: e.target.value }
                  set('timeline', next)
                }}
              />
            </div>
          ))}
          {form.timeline.length === 0 && <div className="empty">还没有经历记录</div>}
        </div>
      </div>

      <div className="admin-form-actions">
        <button type="submit" className="btn btn--primary">
          保存修改
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setForm(toForm(db.profile))}>
          重置为当前数据
        </button>
        <span className="field__hint">保存后前台首页立即使用新内容</span>
      </div>
    </form>
  )
}
