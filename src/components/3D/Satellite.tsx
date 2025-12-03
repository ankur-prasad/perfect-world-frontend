import { useRef, useState, useMemo, useCallback, startTransition } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { latLonToVector3 } from '../../utils/animations'
import { ANIMATION } from '../../utils/constants'

interface SatelliteProps {
  position: { lat: number; lon: number }
  label: string
  color: string
  onClick: (clickPosition: { x: number; y: number }) => void
  visible?: boolean
  globeRotation?: number
}

export default function Satellite({
  position,
  label,
  color,
  onClick,
  visible = true,
}: SatelliteProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [labelHovered, setLabelHovered] = useState(false)
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })

  // Calculate position on sphere (radius 1.02 to match globe scale 1.04)
  const globeRadius = 1.02

  // Memoize positions based on lat/lon
  const satellitePos = useMemo(() => {
    return latLonToVector3(position.lat, position.lon, globeRadius)
  }, [position.lat, position.lon, globeRadius])

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

  // Glassy effect styles
  const highlightStyle = useMemo(() => {
    const dx = mouse.x - 0.5
    const dy = mouse.y - 0.5
    const offsetX = dx * (labelHovered ? 28 : 16)
    const offsetY = dy * (labelHovered ? 28 : 16)

    return {
      position: 'absolute' as const,
      left: `calc(50% + ${offsetX}px)`,
      top: `calc(50% + ${offsetY + (labelHovered ? -4 : 0)}px)`,
      width: labelHovered ? '74%' : '60%',
      height: labelHovered ? '42%' : '30%',
      background: labelHovered
        ? 'linear-gradient(120deg, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.18) 100%)'
        : 'linear-gradient(120deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.12) 100%)',
      borderRadius: '50%',
      filter: `blur(${labelHovered ? 22 : 14}px)`,
      opacity: labelHovered ? 0.82 : 0.5,
      pointerEvents: 'none' as const,
      transform: `translate(-50%, -50%) scale(${labelHovered ? 1.13 : 1})${labelHovered ? ' translateY(-2.5px)' : ''}`,
      transition: 'all 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 2
    }
  }, [labelHovered, mouse])

  const reflectionStyle = useMemo(() => {
    const dx = mouse.x - 0.5
    const dy = mouse.y - 0.5
    const offsetX = dx * (labelHovered ? 16 : 8)
    const offsetY = dy * (labelHovered ? 16 : 8)

    return {
      position: 'absolute' as const,
      left: `calc(50% + ${offsetX}px)`,
      top: `calc(50% + ${offsetY}px)`,
      width: labelHovered ? '38%' : '30%',
      height: labelHovered ? '18%' : '14%',
      background: 'linear-gradient(120deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 100%)',
      borderRadius: '50%',
      filter: `blur(${labelHovered ? 10 : 7}px)`,
      opacity: labelHovered ? 0.45 : 0.28,
      pointerEvents: 'none' as const,
      transform: `translate(-50%, -50%) scale(${labelHovered ? 1.12 : 1})${labelHovered ? ' translateY(-1px)' : ''}`,
      transition: 'all 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 1
    }
  }, [labelHovered, mouse])

  // Animate on hover
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = hovered ? ANIMATION.SATELLITE_HOVER_SCALE : 1
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  if (!visible) return null

  return (
    <group>
      {/* Satellite marker directly on surface */}
      <mesh
        ref={meshRef}
        position={[satellitePos.x, satellitePos.y, satellitePos.z]}
        onClick={(e) => {
          e.stopPropagation()
          onClick({ x: e.clientX, y: e.clientY })
        }}
        onPointerEnter={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerLeave={(e) => {
          e.stopPropagation()
          setHovered(false)
          document.body.style.cursor = 'default'
        }}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1.0 : 0.8} // Always bright, brighter on hover
          roughness={0.3}
          metalness={0.7}
        />

        {/* Label - always visible */}
        <Html
          position={[0, label === 'One World' ? 0.35 : 0.15, 0]}
          center
          distanceFactor={5}
          zIndexRange={[100, 0]}
          style={{
            pointerEvents: 'auto',
            userSelect: 'none',
          }}
        >
          <div
            ref={labelRef}
            className="relative overflow-hidden cursor-pointer"
            style={{
              borderRadius: '16px',
              background: `linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 100%), ${color}`,
              border: '1.5px solid rgba(255, 255, 255, 0.22)',
              boxShadow: labelHovered
                ? '0 18px 48px 0 rgba(0, 0, 0, 0.18), 0 6px 24px 0 rgba(0, 0, 0, 0.12)'
                : '0 6px 18px 0 rgba(0, 0, 0, 0.10)',
              backdropFilter: 'blur(18px) saturate(1.2)',
              WebkitBackdropFilter: 'blur(18px) saturate(1.2)',
              transition: 'box-shadow 0.32s cubic-bezier(0.4, 0, 0.2, 1), background 0.32s cubic-bezier(0.4, 0, 0.2, 1), transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: labelHovered ? 'translateY(-2px)' : 'translateY(0)'
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setLabelHovered(true)}
            onMouseLeave={() => {
              setLabelHovered(false)
              setMouse({ x: 0.5, y: 0.5 })
            }}
            onClick={(e) => {
              e.stopPropagation()

              // Get click position from label center
              const rect = labelRef.current?.getBoundingClientRect()
              if (rect) {
                const clickPosition = {
                  x: rect.left + rect.width / 2,
                  y: rect.top + rect.height / 2
                }
                onClick(clickPosition)
              }
            }}
          >
            {/* Glassy highlight effect */}
            <div style={highlightStyle} />
            <div style={reflectionStyle} />

            {/* Inset border for depth */}
            <div
              style={{
                pointerEvents: 'none',
                position: 'absolute',
                inset: 0,
                borderRadius: '16px',
                border: '1.5px solid rgba(255,255,255,0.22)',
                boxShadow: 'inset 0 1.5px 8px 0 rgba(255,255,255,0.10), 0 1.5px 8px 0 rgba(0,0,0,0.06)',
                zIndex: 4
              }}
            />

            <div
              className="relative whitespace-nowrap text-white text-xs font-semibold"
              style={{
                padding: '6px 16px',
                zIndex: 3,
                userSelect: 'none',
                pointerEvents: 'none'
              }}
            >
              {label}
            </div>
          </div>
        </Html>
      </mesh>

      {/* Glow effect */}
      <mesh position={[satellitePos.x, satellitePos.y, satellitePos.z]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.4 : 0.25} // More visible glow even when not hovering
        />
      </mesh>
    </group>
  )
}
