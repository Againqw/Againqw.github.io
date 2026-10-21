import { Link } from 'react-router-dom'
import { Reveal } from '../../components/Reveal'
import { Section } from '../../components/Section'
import { useDB } from '../../hooks/useDB'
import { sortedProjects } from '../../api'

/** 没有封面图时，按标题哈希生成一组稳定的渐变色，保证视觉不塌陷 */
export function coverGradient(seed: string): string {
  let hash = 0
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) % 360
  // 色相收在蓝紫色区间，保证四张卡片与主题一致
  const hue = 206 + (hash % 44)
  return `linear-gradient(150deg, hsl(${hue} 46% 26%), hsl(${(hue + 34) % 360} 54% 14%))`
}

export function Projects() {
  const db = useDB()
  const projects = sortedProjects(db)

  return (
    <Section
      id="projects"
      index="03 / PROJECTS"
      title="项目"
      desc="每个项目都写了「为什么这样做」和「踩了什么坑」，而不只是功能列表。"
    >
      <div className="projects__grid">
        {projects.map((project, index) => (
          <Reveal key={project.id} delay={index * 70}>
            <Link to={`/projects/${project.slug}`} className="project-card">
              <div
                className="project-card__cover"
                style={{ background: project.cover ? undefined : coverGradient(project.title) }}
              >
                {project.cover ? <img src={project.cover} alt={project.title} /> : String(index + 1).padStart(2, '0')}
              </div>
              <div className="project-card__body">
                <h3 className="project-card__title">
                  {project.title}
                  {project.featured && <span className="badge">精选</span>}
                </h3>
                <p className="project-card__summary">{project.summary}</p>
                <div className="project-card__tags">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span className="chip" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="project-card__foot">
                  <span>查看详情</span>
                  <span aria-hidden="true">→</span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
