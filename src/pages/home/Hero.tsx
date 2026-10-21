import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDB } from '../../hooks/useDB'
import { toast } from '../../components/toast'

export function Hero() {
  const { profile } = useDB()
  const [copied, setCopied] = useState(false)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      toast('邮箱已复制到剪贴板')
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      toast('复制失败，请手动选中邮箱地址', 'error')
    }
  }

  return (
    <section className="hero">
      <div className="container hero__grid">
        <div>
          <span className="hero__eyebrow">
            <i className="hero__dot" />
            2026 届校招中 · {profile.location}
          </span>

          <h1 className="hero__title">
            你好，我是
            <em>{profile.name}</em>
          </h1>

          <p className="hero__role">{profile.role}</p>
          <p className="hero__tagline">{profile.tagline}</p>

          <div className="hero__actions">
            <button type="button" className="btn btn--primary" onClick={() => scrollTo('projects')}>
              查看项目 <span aria-hidden="true">→</span>
            </button>
            <Link to="/blog" className="btn">
              阅读博客
            </Link>
            <button type="button" className="btn btn--ghost" onClick={copyEmail}>
              {copied ? '已复制 ✓' : '复制邮箱'}
            </button>
          </div>

          <div className="hero__stack">
            {profile.stack.map((item) => (
              <span key={item} className="chip">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="terminal" aria-hidden="true">
          <div className="terminal__bar">
            <span className="terminal__dot" />
            <span className="terminal__dot" />
            <span className="terminal__dot" />
            <span className="terminal__name">zsh — ~/portfolio</span>
          </div>
          <div className="terminal__body">
            <div>$ whoami</div>
            <div>
              <i>{profile.name}</i> · 软件工程 / 2026 届
            </div>
            <div>$ cat focus.txt</div>
            <div>
              <b>后端工程化</b> · <b>RAG 应用落地</b>
            </div>
            <div>$ ls projects/</div>
            <div>edurag/ campus-market/ elder-care/</div>
            <div>$ status</div>
            <div className="ok">open to work — 随时可以聊</div>
          </div>
        </div>
      </div>
    </section>
  )
}
