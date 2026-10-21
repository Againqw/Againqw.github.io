import { Reveal } from '../../components/Reveal'
import { Section } from '../../components/Section'
import { useDB } from '../../hooks/useDB'
import { publishedPosts, skillCount } from '../../api'

export function About() {
  const db = useDB()
  const { profile } = db

  const stats = [
    { value: db.projects.length, unit: '个', label: '项目' },
    { value: publishedPosts(db).length, unit: '篇', label: '技术文章' },
    { value: skillCount(db), unit: '项', label: '技能点' },
  ]

  return (
    <Section
      id="about"
      index="01 / ABOUT"
      title="关于我"
      desc="一名把「为什么」问到底的后端开发者：写代码之前先想清楚数据怎么流、失败怎么办。"
    >
      <div className="about__grid">
        <Reveal>
          <div className="about__text">
            {profile.bio.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="stats">
            {stats.map((s) => (
              <div className="stat" key={s.label}>
                <div className="stat__value">
                  {s.value}
                  <span>{s.unit}</span>
                </div>
                <div className="stat__label">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <ol className="timeline">
            {profile.timeline.map((item) => (
              <li className="timeline__item" key={item.id}>
                <div className="timeline__period">{item.period}</div>
                <div className="timeline__title">{item.title}</div>
                <div className="timeline__org">{item.org}</div>
                <p className="timeline__desc">{item.desc}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </Section>
  )
}
