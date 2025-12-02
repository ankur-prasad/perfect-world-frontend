import { useState, useMemo, useCallback, startTransition } from 'react'
import { Link } from 'react-router-dom'

interface GlassyButtonProps {
  label?: string
  children?: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  href?: string
  to?: string
  background?: string
  hoverBackground?: string
  textColor?: string
  className?: string
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'dark' | 'light'
  borderRadius?: number
  blur?: number
  lightDirection?: 'top-left' | 'top' | 'top-right' | 'right' | 'bottom-right' | 'bottom' | 'bottom-left' | 'left'
  shadowHoverColor?: string
  shadowHoverIntensity?: number
  fontSize?: string
  fontWeight?: number
  paddingX?: string
  paddingY?: string
}

export default function GlassyButton({
  label,
  children,
  onClick,
  href,
  to,
  background,
  hoverBackground,
  textColor,
  className = '',
  type = 'button',
  variant = 'primary',
  borderRadius = 16,
  blur = 18,
  lightDirection = 'top-left',
  shadowHoverColor = 'rgba(0, 0, 0, 0.18)',
  shadowHoverIntensity = 1,
  fontSize = '18px',
  fontWeight = 700,
  paddingX = '32px',
  paddingY = '12px'
}: GlassyButtonProps) {
  const [hovered, setHovered] = useState(false)
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })

  // Variant-based default colors
  const variants = {
    primary: {
      bg: background || 'rgba(0, 0, 0, 0.2)',
      hoverBg: hoverBackground || 'rgba(0, 0, 0, 0.4)',
      text: textColor || '#ffffff'
    },
    secondary: {
      bg: background || 'rgba(255, 255, 255, 0.2)',
      hoverBg: hoverBackground || 'rgba(255, 255, 255, 0.4)',
      text: textColor || '#000000'
    },
    dark: {
      bg: background || 'rgba(17, 24, 39, 0.2)',
      hoverBg: hoverBackground || 'rgba(17, 24, 39, 0.4)',
      text: textColor || '#ffffff'
    },
    light: {
      bg: background || 'rgba(255, 255, 255, 0.2)',
      hoverBg: hoverBackground || 'rgba(255, 255, 255, 0.4)',
      text: textColor || '#000000'
    }
  }

  const style = variants[variant]

  // Light direction mapping to gradient angles and highlight positions
  const lightMap = {
    'top-left': { angle: 135, x: '10%', y: '10%' },
    'top': { angle: 180, x: '50%', y: '8%' },
    'top-right': { angle: 225, x: '90%', y: '10%' },
    'right': { angle: 270, x: '92%', y: '50%' },
    'bottom-right': { angle: 315, x: '90%', y: '90%' },
    'bottom': { angle: 0, x: '50%', y: '92%' },
    'bottom-left': { angle: 45, x: '10%', y: '90%' },
    'left': { angle: 90, x: '8%', y: '50%' }
  }

  const { angle, x, y } = lightMap[lightDirection]

  // Mouse move handler for light following
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const mouseX = (e.clientX - rect.left) / rect.width
    const mouseY = (e.clientY - rect.top) / rect.height
    startTransition(() => {
      setMouse({
        x: Math.max(0, Math.min(1, mouseX)),
        y: Math.max(0, Math.min(1, mouseY))
      })
    })
  }, [])

  // Highlight style
  const highlightStyle = useMemo(() => {
    const dx = mouse.x - 0.5
    const dy = mouse.y - 0.5
    const offsetX = dx * (hovered ? 28 : 16)
    const offsetY = dy * (hovered ? 28 : 16)

    return {
      position: 'absolute' as const,
      left: `calc(${x} + ${offsetX}px)`,
      top: `calc(${y} + ${offsetY + (hovered ? -4 : 0)}px)`,
      width: hovered ? '74%' : '60%',
      height: hovered ? '42%' : '30%',
      background: hovered
        ? 'linear-gradient(120deg, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.18) 100%)'
        : 'linear-gradient(120deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.12) 100%)',
      borderRadius: '50%',
      filter: `blur(${hovered ? 22 : 14}px)`,
      opacity: hovered ? 0.82 : 0.5,
      pointerEvents: 'none' as const,
      transform: `translate(-50%, -50%) scale(${hovered ? 1.13 : 1})${hovered ? ' translateY(-2.5px)' : ''}`,
      transition: 'all 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 2
    }
  }, [x, y, hovered, mouse])

  // Reflection style
  const reflectionStyle = useMemo(() => {
    const dx = mouse.x - 0.5
    const dy = mouse.y - 0.5
    const offsetX = dx * (hovered ? 16 : 8)
    const offsetY = dy * (hovered ? 16 : 8)

    return {
      position: 'absolute' as const,
      left: `calc(${x} + ${offsetX}px)`,
      top: `calc(${y} + ${offsetY}px)`,
      width: hovered ? '38%' : '30%',
      height: hovered ? '18%' : '14%',
      background: 'linear-gradient(120deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 100%)',
      borderRadius: '50%',
      filter: `blur(${hovered ? 10 : 7}px)`,
      opacity: hovered ? 0.45 : 0.28,
      pointerEvents: 'none' as const,
      transform: `translate(-50%, -50%) scale(${hovered ? 1.12 : 1})${hovered ? ' translateY(-1px)' : ''}`,
      transition: 'all 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 1
    }
  }, [x, y, hovered, mouse])

  // Glassy background style
  const glassStyle = useMemo(() => ({
    position: 'relative' as const,
    width: '100%',
    height: '100%',
    minHeight: '48px',
    padding: `${paddingY} ${paddingX}`,
    borderRadius: `${borderRadius}px`,
    background: `linear-gradient(${angle}deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 100%), ${hovered ? style.hoverBg : style.bg}`,
    boxShadow: hovered
      ? `0 18px ${48 * shadowHoverIntensity}px 0 ${shadowHoverColor}, 0 6px 24px 0 rgba(0,0,0,0.12)`
      : '0 6px 18px 0 rgba(0,0,0,0.10)',
    backdropFilter: `blur(${blur}px) saturate(1.2)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(1.2)`,
    border: '1.5px solid rgba(255,255,255,0.22)',
    boxSizing: 'border-box' as const,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'box-shadow 0.32s cubic-bezier(0.4, 0, 0.2, 1), background 0.32s cubic-bezier(0.4, 0, 0.2, 1), transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: hovered ? 'translateY(-11px) scale(1.08)' : 'none',
    textDecoration: 'none'
  }), [angle, style.bg, style.hoverBg, borderRadius, blur, hovered, shadowHoverColor, shadowHoverIntensity, paddingX, paddingY])

  // Text style
  const textStyle = useMemo(() => ({
    color: style.text,
    zIndex: 3,
    userSelect: 'none' as const,
    fontWeight,
    fontSize,
    letterSpacing: '-0.01em',
    lineHeight: '1.2em',
    textAlign: 'center' as const,
    minWidth: 'max-content',
    width: 'max-content',
    pointerEvents: 'none' as const,
    transition: 'color 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative' as const
  }), [style.text, fontSize, fontWeight])

  // Inset border for depth
  const insetBorderStyle = {
    pointerEvents: 'none' as const,
    position: 'absolute' as const,
    inset: 0,
    borderRadius: `${borderRadius}px`,
    border: '1.5px solid rgba(255,255,255,0.22)',
    boxShadow: 'inset 0 1.5px 8px 0 rgba(255,255,255,0.10), 0 1.5px 8px 0 rgba(0,0,0,0.06)',
    zIndex: 4
  }

  const content = (
    <div
      style={glassStyle}
      role="button"
      tabIndex={0}
      aria-label={label}
      onMouseEnter={() => startTransition(() => setHovered(true))}
      onMouseLeave={() => {
        startTransition(() => setMouse({ x: 0.5, y: 0.5 }))
        startTransition(() => setHovered(false))
      }}
      onFocus={() => startTransition(() => setHovered(true))}
      onBlur={() => startTransition(() => setHovered(false))}
      onMouseMove={handleMouseMove}
      className={className}
    >
      <div style={highlightStyle} />
      <div style={reflectionStyle} />
      <span style={textStyle}>{children || label}</span>
      <div style={insetBorderStyle} />
    </div>
  )

  if (to) {
    return (
      <Link
        to={to}
        style={{ display: 'inline-block', textDecoration: 'none' }}
        tabIndex={-1}
        aria-label={label}
        onClick={onClick}
      >
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        href={href}
        style={{ display: 'inline-block', textDecoration: 'none' }}
        tabIndex={-1}
        aria-label={label}
        onClick={onClick}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      style={{ background: 'none', border: 'none', padding: 0, display: 'inline-block' }}
    >
      {content}
    </button>
  )
}
