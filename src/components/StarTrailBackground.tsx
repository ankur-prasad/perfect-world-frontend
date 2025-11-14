import { useEffect, useRef } from 'react'

interface StarTrailBackgroundProps {
  scrollProgress: number // 0 to 1, where 1 is fully scrolled through collections
}

export default function StarTrailBackground({ scrollProgress }: StarTrailBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Array<{ x: number; y: number; size: number; speed: number }>>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize stars
    if (starsRef.current.length === 0) {
      for (let i = 0; i < 100; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speed: Math.random() * 2 + 1,
        })
      }
    }

    // Animation loop
    let animationId: number
    const animate = () => {
      if (!ctx || !canvas) return

      // Fade previous frame for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw stars with trails based on scroll progress
      starsRef.current.forEach((star) => {
        // Create trail effect by drawing multiple points
        const trailLength = Math.floor(scrollProgress * 20)

        for (let i = 0; i < trailLength; i++) {
          const alpha = 1 - (i / trailLength)
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`
          ctx.beginPath()
          ctx.arc(
            star.x - (i * star.speed * scrollProgress),
            star.y,
            star.size * (1 - i / trailLength),
            0,
            Math.PI * 2
          )
          ctx.fill()
        }

        // Draw main star
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()

        // Move stars slowly to create flowing pattern
        star.x += star.speed * scrollProgress * 0.1
        if (star.x > canvas.width + 10) {
          star.x = -10
          star.y = Math.random() * canvas.height
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [scrollProgress])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
