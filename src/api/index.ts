import type { DB, ID, Post, Project, SiteSettings, SkillGroup, Message, Profile } from '../types'
import { clone, commit, clearToken, exportJSON, getDB, importJSON, readToken, resetDB, saveToken } from './storage'

export { subscribe, getDB } from './storage'

const ADMIN_USER = 'admin'

export interface AuthResult {
  ok: boolean
  error?: string
}

export interface ProjectInput extends Omit<Project, 'id' | 'createdAt' | 'updatedAt'> {
  id?: ID
  createdAt?: string
}

export interface PostInput extends Omit<Post, 'id' | 'updatedAt'> {
  id?: ID
}

export function newId(prefix: string): string {
  const rand =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10)
  return `${prefix}-${rand}`
}

export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/[\u4e00-\u9fa5]/g, '')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
  return base || `item-${Date.now().toString(36)}`
}

export function uniqueSlug(existing: { id: ID; slug: string }[], slug: string, selfId?: ID): string {
  const taken = new Set(existing.filter((x) => x.id !== selfId).map((x) => x.slug))
  if (!taken.has(slug)) return slug
  let n = 2
  while (taken.has(`${slug}-${n}`)) n += 1
  return `${slug}-${n}`
}

function patchDB(mutate: (db: DB) => void): void {
  const next = clone(getDB())
  mutate(next)
  commit(next)
}

/* ---------------- 鉴权 ---------------- */

function auth(): AuthResult {
  if (!readToken()) return { ok: false, error: '请先登录' }
  return { ok: true }
}

export const api = {
  login(username: string, password: string): AuthResult {
    const { settings } = getDB()
    if (username.trim() !== ADMIN_USER) return { ok: false, error: '账号不存在' }
    if (!password.trim()) return { ok: false, error: '请输入密码' }
    if (password !== settings.adminPassword) return { ok: false, error: '密码错误，请重新输入' }
    saveToken()
    return { ok: true }
  },

  logout(): void {
    clearToken()
  },

  isAuthed(): boolean {
    return readToken() !== null
  },

  /* ---------------- 个人信息 ---------------- */

  updateProfile(patch: Partial<Profile>): AuthResult {
    const guard = auth()
    if (!guard.ok) return guard
    patchDB((db) => {
      db.profile = { ...db.profile, ...patch }
    })
    return { ok: true }
  },

  /* ---------------- 技能 ---------------- */

  saveSkillGroup(group: SkillGroup): AuthResult {
    const guard = auth()
    if (!guard.ok) return guard
    patchDB((db) => {
      const idx = db.skills.findIndex((g) => g.id === group.id)
      if (idx >= 0) db.skills[idx] = group
      else db.skills.push(group)
    })
    return { ok: true }
  },

  deleteSkillGroup(id: ID): AuthResult {
    const guard = auth()
    if (!guard.ok) return guard
    patchDB((db) => {
      db.skills = db.skills.filter((g) => g.id !== id)
    })
    return { ok: true }
  },

  /* ---------------- 项目 ---------------- */

  saveProject(input: ProjectInput): AuthResult & { id?: ID } {
    const guard = auth()
    if (!guard.ok) return guard
    const now = new Date().toISOString()
    let savedId = input.id
    patchDB((db) => {
      const slug = uniqueSlug(db.projects, slugify(input.slug || input.title), input.id)
      if (input.id) {
        const idx = db.projects.findIndex((p) => p.id === input.id)
        if (idx >= 0) {
          db.projects[idx] = { ...db.projects[idx], ...input, slug, updatedAt: now }
        }
      } else {
        savedId = newId('p')
        db.projects.unshift({
          ...input,
          id: savedId,
          slug,
          createdAt: input.createdAt ?? now,
          updatedAt: now,
        })
      }
    })
    return { ok: true, id: savedId }
  },

  deleteProject(id: ID): AuthResult {
    const guard = auth()
    if (!guard.ok) return guard
    patchDB((db) => {
      db.projects = db.projects.filter((p) => p.id !== id)
    })
    return { ok: true }
  },

  /* ---------------- 博客 ---------------- */

  savePost(input: PostInput): AuthResult & { id?: ID } {
    const guard = auth()
    if (!guard.ok) return guard
    const now = new Date().toISOString()
    let savedId = input.id
    patchDB((db) => {
      const slug = uniqueSlug(db.posts, slugify(input.slug || input.title), input.id)
      if (input.id) {
        const idx = db.posts.findIndex((p) => p.id === input.id)
        if (idx >= 0) {
          db.posts[idx] = { ...db.posts[idx], ...input, slug, updatedAt: now }
        }
      } else {
        savedId = newId('a')
        db.posts.unshift({
          ...input,
          id: savedId,
          slug,
          publishedAt: input.publishedAt || now,
          updatedAt: now,
        })
      }
    })
    return { ok: true, id: savedId }
  },

  deletePost(id: ID): AuthResult {
    const guard = auth()
    if (!guard.ok) return guard
    patchDB((db) => {
      db.posts = db.posts.filter((p) => p.id !== id)
    })
    return { ok: true }
  },

  /* ---------------- 站点设置 ---------------- */

  saveSettings(patch: Partial<SiteSettings>): AuthResult {
    const guard = auth()
    if (!guard.ok) return guard
    patchDB((db) => {
      db.settings = { ...db.settings, ...patch }
    })
    return { ok: true }
  },

  /* ---------------- 留言 ---------------- */

  addMessage(input: Omit<Message, 'id' | 'createdAt'>): void {
    patchDB((db) => {
      db.messages.unshift({ ...input, id: newId('m'), createdAt: new Date().toISOString() })
    })
  },

  deleteMessage(id: ID): AuthResult {
    const guard = auth()
    if (!guard.ok) return guard
    patchDB((db) => {
      db.messages = db.messages.filter((m) => m.id !== id)
    })
    return { ok: true }
  },

  /* ---------------- 数据备份 ---------------- */

  exportData(): string {
    return exportJSON()
  },

  importData(text: string): AuthResult {
    try {
      importJSON(text)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : '导入失败' }
    }
  },

  resetAll(): void {
    resetDB()
  },
}

/* ---------------- 选择器（视图侧只读） ---------------- */

export function publishedPosts(db: DB): Post[] {
  return db.posts
    .filter((p) => p.status === 'published')
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export function sortedProjects(db: DB): Project[] {
  return [...db.projects].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    return b.updatedAt.localeCompare(a.updatedAt)
  })
}

export function skillCount(db: DB): number {
  return db.skills.reduce((sum, g) => sum + g.items.length, 0)
}

export function readingMinutes(markdown: string): number {
  const words = markdown.replace(/\s+/g, '').length
  return Math.max(1, Math.round(words / 300))
}

export function formatDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
