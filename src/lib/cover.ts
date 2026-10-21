/** 没有封面图时，按标题哈希生成一组稳定的渐变色，保证视觉不塌陷 */
export function coverGradient(seed: string): string {
  let hash = 0
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) % 360
  // 色相收在蓝紫色区间，保证多张卡片与整体主题一致
  const hue = 206 + (hash % 44)
  return `linear-gradient(150deg, hsl(${hue} 46% 26%), hsl(${(hue + 34) % 360} 54% 14%))`
}
