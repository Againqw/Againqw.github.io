import type { DB } from '../types'
import { DB_VERSION, STORAGE_KEY, TOKEN_KEY, seed } from './seed'

let cache: DB = boot()
const listeners = new Set<() => void>()

export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

/** 用种子数据补齐缺失字段，保证老数据 / 半截数据不会把页面打挂 */
function hydrate(raw: Partial<DB> | null): DB {
  const base = clone(seed)
  if (!raw) return base
  return {
    version: DB_VERSION,
    profile: { ...base.profile, ...(raw.profile ?? {}) },
    skills: Array.isArray(raw.skills) ? raw.skills : base.skills,
    projects: Array.isArray(raw.projects) ? raw.projects : base.projects,
    posts: Array.isArray(raw.posts) ? raw.posts : base.posts,
    messages: Array.isArray(raw.messages) ? raw.messages : base.messages,
    settings: { ...base.settings, ...(raw.settings ?? {}) },
  }
}

function boot(): DB {
  try {
    const text = localStorage.getItem(STORAGE_KEY)
    if (!text) {
      const fresh = clone(seed)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
      return fresh
    }
    return hydrate(JSON.parse(text) as Partial<DB>)
  } catch {
    return clone(seed)
  }
}

export function getDB(): DB {
  return cache
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return
    cache = boot()
    fn()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(fn)
    window.removeEventListener('storage', onStorage)
  }
}

export function commit(next: DB): void {
  cache = { ...next, version: DB_VERSION }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
  } catch (err) {
    console.error('[storage] 写入失败，可能是存储空间已满', err)
  }
  listeners.forEach((fn) => fn())
}

export function resetDB(): void {
  commit(clone(seed))
}

export function exportJSON(): string {
  return JSON.stringify(cache, null, 2)
}

export function importJSON(text: string): void {
  const parsed = JSON.parse(text) as Partial<DB>
  if (typeof parsed !== 'object' || parsed === null) throw new Error('文件格式不正确')
  commit(hydrate(parsed))
}

/* ---------------- 登录态 ---------------- */

interface TokenPayload {
  token: string
  at: string
}

export function saveToken(): void {
  const payload: TokenPayload = {
    token: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now()),
    at: new Date().toISOString(),
  }
  localStorage.setItem(TOKEN_KEY, JSON.stringify(payload))
}

export function readToken(): TokenPayload | null {
  try {
    const text = localStorage.getItem(TOKEN_KEY)
    if (!text) return null
    const payload = JSON.parse(text) as TokenPayload
    if (!payload.token) return null
    return payload
  } catch {
    return null
  }
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}
