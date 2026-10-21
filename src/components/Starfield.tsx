import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  r: number
  base: number
  phase: number
  twinkle: number
  depth: number
  drift: number
}

/**
 * 星空背景：单个 canvas + rAF。
 * - 粒子数按屏幕面积计算，移动端再降 40%
 * - 用 fillRect 而不是 arc，1000 次绘制的开销差一个量级
 * - 滚动时按 depth 做视差，prefers-reduced-motion 下只画静态一帧
 */
export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0
    let stars: Star[] = []
    let raf = 0

    const build = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const density = width < 640 ? 0.55 : 1
      const count = Math.min(Math.round((width * height) / 9000) * density, 170)
      stars = Array.from({ length: count }, () => {
        const depth = 0.3 + Math.random() * 0.9
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() < 0.12 ? 1.6 : Math.random() * 1.1 + 0.35,
          base: 0.25 + Math.random() * 0.55,
          phase: Math.random() * Math.PI * 2,
          twinkle: 0.4 + Math.random() * 1.2,
          depth,
          drift: 0.02 + Math.random() * 0.06,
        }
      })
    }

    const paint = (time: number) => {
      ctx.clearRect(0, 0, width, height)
      const scroll = window.scrollY
      for (const s of stars) {
        const y = (((s.y - scroll * 0.18 * s.depth) % height) + height) % height
        const alpha = reduceMotion
          ? s.base
          : s.base * (0.55 + 0.45 * Math.sin(time * 0.001 * s.twinkle + s.phase))
        ctx.fillStyle = `rgba(${s.r > 1.4 ? '190, 214, 255' : '226, 236, 255'}, ${alpha.toFixed(3)})`
        ctx.fillRect(s.x, y, s.r, s.r)
      }
    }

    const loop = (time: number) => {
      paint(time)
      raf = window.requestAnimationFrame(loop)
    }

    build()
    if (reduceMotion) paint(0)
    else raf = window.requestAnimationFrame(loop)

    let resizeTimer = 0
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        build()
        if (reduceMotion) paint(0)
      }, 150)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.cancelAnimationFrame(raf)
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={ref} className="starfield" aria-hidden="true" />
}
