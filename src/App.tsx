import { useEffect } from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { useDB } from './hooks/useDB'
import { SiteLayout } from './pages/SiteLayout'
import { Home } from './pages/Home'
import { BlogList } from './pages/BlogList'
import { BlogPost } from './pages/BlogPost'
import { ProjectDetail } from './pages/ProjectDetail'
import { NotFound } from './pages/NotFound'
import { AdminLayout, RequireAuth } from './admin/AdminLayout'
import { Login } from './admin/Login'
import { Dashboard } from './admin/Dashboard'
import { ProfileAdmin } from './admin/ProfileAdmin'
import { SkillsAdmin } from './admin/SkillsAdmin'
import { ProjectsAdmin } from './admin/ProjectsAdmin'
import { PostsAdmin } from './admin/PostsAdmin'
import { SettingsAdmin } from './admin/SettingsAdmin'

function RouteEffects() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (!pathname.startsWith('/admin')) {
      window.scrollTo({ top: 0 })
    }
  }, [pathname])

  return null
}

export default function App() {
  const db = useDB()

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', db.settings.accent)
    document.title = db.settings.siteTitle
  }, [db.settings.accent, db.settings.siteTitle])

  return (
    <HashRouter>
      <RouteEffects />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<ProfileAdmin />} />
          <Route path="skills" element={<SkillsAdmin />} />
          <Route path="projects" element={<ProjectsAdmin />} />
          <Route path="posts" element={<PostsAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
