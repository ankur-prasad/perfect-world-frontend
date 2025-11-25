import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { latLonToVector3 } from '../../utils/animations'
import { ANIMATION } from '../../utils/constants'

interface SatelliteProps {
  position: { lat: number; lon: number }
  label: string
  color: string
  onClick: () => void
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
  const [hovered, setHovered] = useState(false)

  // Calculate position on sphere (radius 1.02 to match globe scale 1.04)
  const globeRadius = 1.02

  // Memoize positions based on lat/lon
  const satellitePos = useMemo(() => {
    return latLonToVector3(position.lat, position.lon, globeRadius)
  }, [position.lat, position.lon, globeRadius])

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
          onClick()
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
          position={[0, 0.2, 0]}
          center
          distanceFactor={5}
          style={{
            pointerEvents: 'auto', // Enable pointer events
            userSelect: 'none',
          }}
        >
          <div
            className="px-4 py-2 bg-black/90 backdrop-blur-sm rounded-lg text-white text-sm whitespace-nowrap cursor-pointer hover:bg-white/20 transition-colors font-light"
            onClick={(e) => {
              e.stopPropagation()
              onClick()
            }}
          >
            {label}
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
