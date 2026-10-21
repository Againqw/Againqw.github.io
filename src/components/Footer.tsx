import { Link } from 'react-router-dom'
import { useDB } from '../hooks/useDB'

export function Footer() {
  const db = useDB()
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span>{db.settings.footerText || `© ${year} ${db.profile.name}`}</span>
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
