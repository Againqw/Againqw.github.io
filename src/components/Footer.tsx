import { Link } from 'react-router-dom'
import { useDB } from '../hooks/useDB'

/** 年份在模块初始化时算一次，避免渲染期调用不纯函数 */
const YEAR = new Date().getFullYear()

export function Footer() {
  const db = useDB()

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span>{db.settings.footerText || `© ${YEAR} ${db.profile.name}`}</span>
        <div className="footer__links">
          {db.profile.socials.slice(0, 3).map((s) => (
            <a
              key={s.label}
              href={s.url}
              target={s.url.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
            >
              {s.label}
            </a>
          ))}
          <Link to="/admin">后台</Link>
        </div>
      </div>
    </footer>
  )
}
