import { Hero } from './home/Hero'
import { About } from './home/About'
import { Skills } from './home/Skills'
import { Projects } from './home/Projects'
import { Writings } from './home/Writings'
import { Contact } from './home/Contact'

export function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Writings />
      <Contact />
    </>
  )
}
