import type { CSSProperties } from 'react'
import { Reveal } from '../../components/Reveal'
import { Section } from '../../components/Section'
import { useDB } from '../../hooks/useDB'

export function Skills() {
  const { skills } = useDB()

  return (
    <Section
      id="skills"
      index="02 / SKILLS"
      title="技能栈"
      desc="按使用频率与深度排序：能独立交付的写在前面，熟悉原理但用得少的放在后面。"
    >
      <div className="skills__grid">
        {skills.map((group, groupIndex) => (
          <Reveal key={group.id} delay={groupIndex * 80}>
            <div className="skill-group">
              <div className="skill-group__head">
                <span className="skill-group__no">{String(groupIndex + 1).padStart(2, '0')}</span>
                <h3 className="skill-group__title">{group.name}</h3>
                <span className="skill-group__count">{group.items.length} 项</span>
              </div>

              {group.items.map((item) => (
                <div className="skill-item" key={item.id}>
                  <div className="skill-item__meta">
                    <span className="skill-item__name">{item.name}</span>
                    {item.note && <span className="skill-item__note">{item.note}</span>}
                    <span className="skill-item__level">{'■'.repeat(item.level)}</span>
                  </div>
                  <div className="bar">
                    <div
                      className="bar__fill"
                      style={{ '--level': `${Math.min(Math.max(item.level, 0), 5) * 20}%` } as CSSProperties}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
