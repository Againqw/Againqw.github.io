import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

interface SectionProps {
  id: string
  index: string
  title: string
  desc?: string
  children: ReactNode
}

export function Section({ id, index, title, desc, children }: SectionProps) {
  return (
    <section className="section" id={id}>
      <div className="container">
        <Reveal>
          <header className="section__head">
            <span className="section__index">{index}</span>
            <h2 className="section__title">{title}</h2>
            {desc && <p className="section__desc">{desc}</p>}
          </header>
        </Reveal>
        {children}
      </div>
    </section>
  )
}
