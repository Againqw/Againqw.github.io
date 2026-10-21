import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { loginSchema } from '../api/schemas'
import { Starfield } from '../components/Starfield'
import { Toaster } from '../components/Toaster'
import { toast } from '../components/toast'
import { useDB } from '../hooks/useDB'

interface LocationState {
  from?: string
}

export function Login() {
  const db = useDB()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as LocationState | null)?.from ?? '/admin'

  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (api.isAuthed()) return <Navigate to={from} replace />

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    const parsed = loginSchema.safeParse({ username, password })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? '请检查输入')
      return
    }
    const result = api.login(parsed.data.username, parsed.data.password)
    if (!result.ok) {
      setError(result.error ?? '登录失败')
      return
    }
    toast('登录成功')
    navigate(from, { replace: true })
  }

  return (
    <>
      <Starfield />
      <div className="login">
        <form className="login__card" onSubmit={submit} noValidate>
          <div className="login__brand">
            <span className="nav__logo">{db.profile.avatarText.slice(0, 1)}</span>
            <div>
              <div className="login__title">后台登录</div>
              <div className="login__sub">{db.settings.siteTitle}</div>
            </div>
          </div>

          {error && <div className="login__alert">{error}</div>}

          <div className="form">
            <div className="field">
              <label className="field__label" htmlFor="login-user">
                账号
              </label>
              <input
                id="login-user"
                className="input"
                value={username}
                autoComplete="username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="login-pass">
                密码
              </label>
              <input
                id="login-pass"
                className="input"
                type="password"
                value={password}
                autoComplete="current-password"
                placeholder="请输入管理密码"
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="field__hint">演示账号 admin ／ 密码 admin123（可在站点设置里修改）</span>
            </div>

            <button type="submit" className="btn btn--primary btn--block">
              登录后台
            </button>
          </div>

          <div className="login__foot">
            <Link to="/">← 返回站点</Link>
            <span>纯前端演示 · 数据存本地</span>
          </div>
        </form>
      </div>
      <Toaster />
    </>
  )
}
