import { useState } from 'react'
import { Reveal } from '../../components/Reveal'
import { Section } from '../../components/Section'
import { toast } from '../../components/toast'
import { useDB } from '../../hooks/useDB'
import { api } from '../../api'
import { contactSchema, toFieldErrors, type FieldErrors } from '../../api/schemas'

const emptyForm = { name: '', email: '', content: '' }

export function Contact() {
  const { profile } = useDB()
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      toast('邮箱已复制')
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      toast('复制失败，请手动选中邮箱', 'error')
    }
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const parsed = contactSchema.safeParse(form)
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error))
      return
    }
    setErrors({})
    api.addMessage(parsed.data)
    setForm(emptyForm)
    toast('留言已保存，我会尽快回复')
  }

  return (
    <Section
      id="contact"
      index="05 / CONTACT"
      title="聊聊？"
      desc="校招、实习、技术交流都欢迎；邮件一般当天回。"
    >
      <div className="contact__grid">
        <Reveal>
          <div className="contact-card">
            <div className="contact-card__label">EMAIL</div>
            <div className="contact-card__mail">
              <span>{profile.email}</span>
              <button type="button" className="btn btn--sm" onClick={copyEmail}>
                {copied ? '已复制' : '复制'}
              </button>
            </div>

            <div className="contact-card__label" style={{ marginTop: 26 }}>
              ELSEWHERE
            </div>
            <div className="socials">
              {profile.socials.map((social) => (
                <a
                  key={social.label}
                  className="social-link"
                  href={social.url}
                  target={social.url.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                >
                  {social.label} ↗
                </a>
              ))}
            </div>

            <p style={{ marginTop: 24, fontSize: 13, color: 'var(--text-faint)', lineHeight: 1.8 }}>
              本站为纯前端实现，留言保存在浏览器本地。如果你希望我一定能收到，直接发邮件更稳妥。
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <form className="form card" onSubmit={submit} noValidate>
            <div className="form-grid">
              <div className="field">
                <label className="field__label" htmlFor="contact-name">
                  称呼 <b>*</b>
                </label>
                <input
                  id="contact-name"
                  className={`input ${errors.name ? 'is-error' : ''}`}
                  value={form.name}
                  placeholder="怎么称呼你"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                {errors.name && <span className="field__error">{errors.name}</span>}
              </div>
              <div className="field">
                <label className="field__label" htmlFor="contact-email">
                  邮箱 <b>*</b>
                </label>
                <input
                  id="contact-email"
                  className={`input ${errors.email ? 'is-error' : ''}`}
                  value={form.email}
                  placeholder="you@example.com"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                {errors.email && <span className="field__error">{errors.email}</span>}
              </div>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="contact-content">
                想说的话 <b>*</b>
              </label>
              <textarea
                id="contact-content"
                className={`textarea ${errors.content ? 'is-error' : ''}`}
                rows={5}
                value={form.content}
                placeholder="简单介绍一下来意，比如岗位、项目或想聊的技术问题"
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
              {errors.content && <span className="field__error">{errors.content}</span>}
            </div>

            <div className="row">
              <button type="submit" className="btn btn--primary">
                发送留言
              </button>
              <span className="field__hint">内容仅保存在本地浏览器</span>
            </div>
          </form>
        </Reveal>
      </div>
    </Section>
  )
}
