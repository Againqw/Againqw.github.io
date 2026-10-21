import { Link } from 'react-router-dom'
import { Reveal } from '../../components/Reveal'
import { Section } from '../../components/Section'
import { useDB } from '../../hooks/useDB'
import { sortedProjects } from '../../api'
import { coverGradient } from '../../lib/cover'

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
