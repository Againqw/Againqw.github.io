import { Outlet } from 'react-router-dom'
import { Starfield } from '../components/Starfield'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Toaster } from '../components/Toaster'

export function SiteLayout() {
  return (
    <>
      <Starfield />
      <div className="app-shell">
        <Navbar />
        <main className="site-main">
          <Outlet />
        </main>
        <Footer />
      </div>
      <Toaster />
    </>
  )
}
