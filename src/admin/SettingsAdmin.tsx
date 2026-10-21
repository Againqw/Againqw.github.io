import { useRef, useState } from 'react'
import { api } from '../api'
import { settingsSchema, toFieldErrors, type FieldErrors } from '../api/schemas'
import { toast } from '../components/toast'
import { useDB } from '../hooks/useDB'

const PRESETS = ['#6D8CFF', '#22D3EE', '#A78BFA', '#34D399', '#FBBF24', '#FB7185']

export function SettingsAdmin() {
  const db = useDB()
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState(() => ({
    siteTitle: db.settings.siteTitle,
    accent: db.settings.accent,
    footerText: db.settings.footerText,
    adminPassword: db.settings.adminPassword,
  }))
  const [errors, setErrors] = useState<FieldErrors>({})

  const save = (event: React.FormEvent) => {
    event.preventDefault()
    const parsed = settingsSchema.safeParse(form)
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error))
      toast('设置有字段不合法', 'error')
      return
    }
    setErrors({})
    const result = api.saveSettings(parsed.data)
    if (result.ok) toast('站点设置已保存')
    else toast(result.error ?? '保存失败', 'error')
  }

  const exportData = () => {
    const blob = new Blob([api.exportData()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast('已导出 JSON 备份')
  }

  const importData = async (file: File) => {
    const text = await file.text()
    const result = api.importData(text)
    if (result.ok) toast('数据已导入')
    else toast(result.error ?? '导入失败', 'error')
  }

  const reset = () => {
    if (!window.confirm('确定恢复为初始演示数据吗？当前所有修改（含文章、项目）都会被覆盖。')) return
    api.resetAll()
    toast('已恢复初始数据', 'info')
  }

  return (
    <div className="form">
      <form className="card form" onSubmit={save} noValidate>
        <div className="card__head">
          <div>
            <div className="card__title">站点设置</div>
            <div className="card__desc">改完保存，前台标题与配色立即生效</div>
          </div>
        </div>

        <div className="form-grid">
          <div className="field field--full">
            <label className="field__label" htmlFor="st-title">
              站点标题 <b>*</b>
            </label>
            <input
              id="st-title"
              className={`input ${errors.siteTitle ? 'is-error' : ''}`}
              value={form.siteTitle}
              onChange={(e) => setForm({ ...form, siteTitle: e.target.value })}
            />
            <span className="field__hint">显示在浏览器标签页与登录页</span>
            {errors.siteTitle && <span className="field__error">{errors.siteTitle}</span>}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="st-accent">
              强调色 <b>*</b>
            </label>
            <div className="row">
              <input
                id="st-accent"
                type="color"
                aria-label="选择强调色"
                value={form.accent}
                onChange={(e) => setForm({ ...form, accent: e.target.value })}
                style={{ width: 46, height: 38, padding: 3, borderRadius: 8, background: 'transparent', border: '1px solid var(--border)' }}
              />
              <input
                className={`input ${errors.accent ? 'is-error' : ''}`}
                value={form.accent}
                onChange={(e) => setForm({ ...form, accent: e.target.value })}
              />
            </div>
            <div className="row row--wrap" style={{ gap: 6 }}>
              {PRESETS.map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={`使用颜色 ${color}`}
                  onClick={() => setForm({ ...form, accent: color })}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    background: color,
                    border: form.accent === color ? '2px solid #fff' : '1px solid var(--border)',
                  }}
                />
              ))}
            </div>
            {errors.accent && <span className="field__error">{errors.accent}</span>}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="st-pass">
              后台密码 <b>*</b>
            </label>
            <input
              id="st-pass"
              className={`input ${errors.adminPassword ? 'is-error' : ''}`}
              value={form.adminPassword}
              onChange={(e) => setForm({ ...form, adminPassword: e.target.value })}
            />
            <span className="field__hint">至少 6 位；演示站点请勿使用真实密码</span>
            {errors.adminPassword && <span className="field__error">{errors.adminPassword}</span>}
          </div>

          <div className="field field--full">
            <label className="field__label" htmlFor="st-footer">
              页脚文案
            </label>
            <input
              id="st-footer"
              className="input"
              value={form.footerText}
              onChange={(e) => setForm({ ...form, footerText: e.target.value })}
            />
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="btn btn--primary">
            保存设置
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() =>
              setForm({
                siteTitle: db.settings.siteTitle,
                accent: db.settings.accent,
                footerText: db.settings.footerText,
                adminPassword: db.settings.adminPassword,
              })
            }
          >
            重置表单
          </button>
        </div>
      </form>

      <div className="card">
        <div className="card__head">
          <div>
            <div className="card__title">数据备份</div>
            <div className="card__desc">
              数据保存在浏览器 localStorage，换设备或清缓存会丢失，建议定期导出
            </div>
          </div>
        </div>

        <div className="row row--wrap">
          <button type="button" className="btn btn--sm" onClick={exportData}>
            导出 JSON
          </button>
          <button type="button" className="btn btn--sm" onClick={() => fileRef.current?.click()}>
            导入 JSON
          </button>
          <button type="button" className="btn btn--sm btn--danger" onClick={reset}>
            恢复初始数据
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void importData(file)
              e.target.value = ''
            }}
          />
        </div>

        <div className="field__hint" style={{ marginTop: 14 }}>
          当前数据：{db.projects.length} 个项目 · {db.posts.length} 篇文章 · {db.skills.length} 个技能分组 ·{' '}
          {db.messages.length} 条留言
        </div>
      </div>
    </div>
  )
}
