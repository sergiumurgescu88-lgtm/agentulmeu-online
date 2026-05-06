import { useEffect, useRef } from 'react'

interface Orb {
  x: number
  y: number
  radius: number
  vx: number
  vy: number
  color: string
  opacity: number
}

export default function FloatingOrbs() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let width = window.innerWidth
    let height = window.innerHeight

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }
    resize()
    window.addEventListener('resize', resize)

    const colors = [
      'hsl(187, 85%, 53%)',
      'hsl(270, 60%, 55%)',
      'hsl(320, 80%, 60%)',
      'hsl(200, 80%, 60%)',
      'hsl(250, 70%, 60%)',
    ]

    const orbs: Orb[] = Array.from({ length: 25 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 3 + 1,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5 - 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.5 + 0.2,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      orbs.forEach((orb) => {
        orb.x += orb.vx
        orb.y += orb.vy

        if (orb.x < 0 || orb.x > width) orb.vx *= -1
        if (orb.y < -50) {
          orb.y = height + 50
          orb.x = Math.random() * width
        }
        if (orb.y > height + 50) orb.y = -50

        ctx.beginPath()
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2)
        ctx.fillStyle = orb.color
        ctx.globalAlpha = orb.opacity
        ctx.fill()

        // Glow effect
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius * 4)
        gradient.addColorStop(0, orb.color)
        gradient.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(orb.x, orb.y, orb.radius * 4, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.globalAlpha = orb.opacity * 0.15
        ctx.fill()
      })

      ctx.globalAlpha = 1
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  )
}
