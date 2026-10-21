import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDB } from '../hooks/useDB'

const SECTIONS = [
  { id: 'about', label: '关于' },
  { id: 'skills', label: '技能' },
  { id: 'projects', label: '项目' },
  { id: 'contact', label: '联系' },
]

export function Navbar() {
  const db = useDB()
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')

  const onHome = location.pathname === '/'
  const onBlog = location.pathname.startsWith('/blog')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!onHome) return
    const compute = () => {
      const probe = window.scrollY + 150
      let current = 'home'
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id)
        if (!el) continue
        const top = el.getBoundingClientRect().top + window.scrollY
        if (top <= probe) current = section.id
      }
      setActive(current)
    }
    compute()
    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute)
    return () => {
      window.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
    }
  }, [onHome, location.pathname])

  const goto = (id: string) => {
    setOpen(false)
    if (!onHome) {
      navigate('/')
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 120)
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const brandInitial = db.profile.avatarText.slice(0, 1) || 'X'

  return (
    <>
      <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="nav__inner">
          <Link to="/" className="nav__brand" onClick={() => setOpen(false)}>
            <span className="nav__logo">{brandInitial}</span>
            <span>{db.profile.name}</span>
          </Link>

          <nav className="nav__links" aria-label="主导航">
            <button
              type="button"
              className={`nav__link ${onHome && active === 'home' ? 'is-active' : ''}`}
              onClick={() => {
                if (onHome) window.scrollTo({ top: 0, behavior: 'smooth' })
                else navigate('/')
              }}
            >
              首页
            </button>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`nav__link ${onHome && active === s.id ? 'is-active' : ''}`}
                onClick={() => goto(s.id)}
              >
                {s.label}
              </button>
            ))}
            <Link to="/blog" className={`nav__link ${onBlog ? 'is-active' : ''}`}>
              博客
            </Link>
            <Link to="/admin" className="nav__link nav__link--admin">
              后台
            </Link>
          </nav>

          <button
            type="button"
            className="nav__toggle"
            aria-label={open ? '关闭菜单' : '打开菜单'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
          </button>
        </div>
      </header>

      <div className={`nav__mobile ${open ? 'is-open' : ''}`}>
        <button type="button" onClick={() => { setOpen(false); navigate('/') }}>首页</button>
        {SECTIONS.map((s) => (
          <button key={s.id} type="button" onClick={() => goto(s.id)}>
            {s.label}
          </button>
        ))}
        <Link to="/blog" onClick={() => setOpen(false)}>博客</Link>
        <Link to="/admin" onClick={() => setOpen(false)}>后台管理</Link>
      </div>
    </>
  )
}
