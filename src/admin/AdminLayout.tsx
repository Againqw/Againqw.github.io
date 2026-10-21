import { useState, type ReactNode } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { NavLink, Outlet } from 'react-router-dom'
import { api } from '../api'
import { Starfield } from '../components/Starfield'
import { Toaster } from '../components/Toaster'
import { toast } from '../components/toast'

export function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation()
  if (!api.isAuthed()) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
  }
  return <>{children}</>
}

const LINKS = [
  { to: '/admin', label: '仪表盘', icon: '◈', end: true },
  { to: '/admin/profile', label: '个人信息', icon: '☺' },
  { to: '/admin/skills', label: '技能管理', icon: '▤' },
  { to: '/admin/projects', label: '项目管理', icon: '▦' },
  { to: '/admin/posts', label: '博客管理', icon: '✎' },
  { to: '/admin/settings', label: '站点设置', icon: '⚙' },
]

const TITLES: Record<string, string> = {
  '/admin': '仪表盘',
  '/admin/profile': '个人信息',
  '/admin/skills': '技能管理',
  '/admin/projects': '项目管理',
  '/admin/posts': '博客管理',
  '/admin/settings': '站点设置',
}

export function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen] = useState(true)

  const title = TITLES[location.pathname] ?? '后台管理'

  const logout = () => {
    api.logout()
    toast('已退出登录', 'info')
    navigate('/admin/login', { replace: true })
  }

  return (
    <>
      <Starfield />
      <div className="admin" data-sidebar={sidebarOpen ? 'open' : 'closed'}>
        <aside className="admin__sidebar">
          <div className="admin__brand">
            <span className="nav__logo">后</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>内容管理</div>
              <small>PORTFOLIO ADMIN</small>
            </div>
          </div>

          <nav className="admin__nav" aria-label="后台导航">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => (isActive ? 'is-active' : '')}
              >
                <span className="ico" aria-hidden="true">
                  {link.icon}
                </span>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="admin__side-foot">
            <div>数据保存在浏览器 localStorage</div>
            <div style={{ marginTop: 6 }}>v1.0 · 纯前端</div>
          </div>
        </aside>

        <div className="admin__main">
          <header className="admin__topbar">
            <span className="admin__crumb">admin /</span>
            <h1 className="admin__title">{title}</h1>
            <div className="spacer" />
            <button type="button" className="btn btn--sm" onClick={() => navigate('/')}>
              查看站点 ↗
            </button>
            <button type="button" className="btn btn--sm btn--ghost" onClick={logout}>
              退出
            </button>
          </header>

          <div className="admin__content">
            <Outlet />
          </div>
        </div>
      </div>
      <Toaster />
    </>
  )
}
