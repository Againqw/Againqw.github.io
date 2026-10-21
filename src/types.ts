export type ID = string

export interface SocialLink {
  label: string
  url: string
}

export interface TimelineItem {
  id: ID
  period: string
  title: string
  org: string
  desc: string
}

export interface Profile {
  name: string
  role: string
  tagline: string
  bio: string[]
  avatarText: string
  location: string
  email: string
  resumeUrl: string
  socials: SocialLink[]
  timeline: TimelineItem[]
  stack: string[]
}

export interface SkillItem {
  id: ID
  name: string
  level: number
  note?: string
}

export interface SkillGroup {
  id: ID
  name: string
  items: SkillItem[]
}

export interface Project {
  id: ID
  slug: string
  title: string
  summary: string
  tags: string[]
  cover: string
  repoUrl: string
  demoUrl: string
  featured: boolean
  content: string
  createdAt: string
  updatedAt: string
}

export type PostStatus = 'draft' | 'published'

export interface Post {
  id: ID
  slug: string
  title: string
  summary: string
  tags: string[]
  content: string
  status: PostStatus
  publishedAt: string
  updatedAt: string
}

export interface Message {
  id: ID
  name: string
  email: string
  content: string
  createdAt: string
}

export interface SiteSettings {
  siteTitle: string
  accent: string
  footerText: string
  adminPassword: string
}

export interface DB {
  version: number
  profile: Profile
  skills: SkillGroup[]
  projects: Project[]
  posts: Post[]
  messages: Message[]
  settings: SiteSettings
}
