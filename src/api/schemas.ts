import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().trim().min(1, '请输入账号'),
  password: z.string().min(1, '请输入密码'),
})

export const profileSchema = z.object({
  name: z.string().trim().min(1, '姓名不能为空').max(20, '姓名不超过 20 个字'),
  role: z.string().trim().min(1, '职位不能为空').max(40, '职位不超过 40 个字'),
  tagline: z.string().trim().min(1, '一句话介绍不能为空').max(60, '不超过 60 个字'),
  avatarText: z.string().trim().min(1, '头像文字不能为空').max(2, '最多 2 个字'),
  location: z.string().trim().max(30, '不超过 30 个字'),
  email: z.string().trim().email('邮箱格式不正确'),
  resumeUrl: z.string().trim(),
  bio: z.string().trim().min(1, '简介不能为空'),
  stack: z.string().trim(),
})

export const projectSchema = z.object({
  title: z.string().trim().min(2, '标题至少 2 个字').max(50, '标题不超过 50 个字'),
  slug: z.string().trim().max(60, 'slug 不超过 60 个字符'),
  summary: z.string().trim().min(10, '摘要至少 10 个字').max(160, '摘要不超过 160 个字'),
  tags: z.string().trim(),
  cover: z.string().trim(),
  repoUrl: z.string().trim(),
  demoUrl: z.string().trim(),
  content: z.string().trim().min(20, '正文至少 20 个字'),
})

export const postSchema = z.object({
  title: z.string().trim().min(2, '标题至少 2 个字').max(60, '标题不超过 60 个字'),
  slug: z.string().trim().max(60, 'slug 不超过 60 个字符'),
  summary: z.string().trim().min(10, '摘要至少 10 个字').max(160, '摘要不超过 160 个字'),
  tags: z.string().trim(),
  content: z.string().trim().min(20, '正文至少 20 个字'),
})

export const settingsSchema = z.object({
  siteTitle: z.string().trim().min(1, '站点标题不能为空').max(40, '不超过 40 个字'),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/, '请填写 #RRGGBB 格式的颜色'),
  footerText: z.string().trim().max(120, '不超过 120 个字'),
  adminPassword: z.string().min(6, '密码至少 6 位').max(32, '密码不超过 32 位'),
})

export const contactSchema = z.object({
  name: z.string().trim().min(1, '请填写称呼').max(20, '不超过 20 个字'),
  email: z.string().trim().email('邮箱格式不正确'),
  content: z.string().trim().min(10, '内容至少 10 个字').max(500, '不超过 500 个字'),
})

export type FieldErrors = Record<string, string>

/** 把 zod 的 issues 压成 { 字段: 错误提示 } */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? '_')
    if (!out[key]) out[key] = issue.message
  }
  return out
}
