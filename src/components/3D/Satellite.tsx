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
  const lineRef = useRef<THREE.Line>(null)
  const [hovered, setHovered] = useState(false)

  // Calculate position on sphere (radius 1.2 to match globe scale, plus offset)
  const globeRadius = 1.2
  const satelliteOffset = 0.4 // Distance from globe surface
  
  // Memoize positions and geometry based on lat/lon
  const { satellitePos, line } = useMemo(() => {
    const surface = latLonToVector3(position.lat, position.lon, globeRadius)
    const satellite = latLonToVector3(position.lat, position.lon, globeRadius + satelliteOffset)
    const threadPoints = [
      new THREE.Vector3(surface.x, surface.y, surface.z),
      new THREE.Vector3(satellite.x, satellite.y, satellite.z),
    ]
    const geometry = new THREE.BufferGeometry().setFromPoints(threadPoints)
    const material = new THREE.LineBasicMaterial({ color, transparent: true, linewidth: 2 })
    const lineObj = new THREE.Line(geometry, material)
    return {
      satellitePos: satellite,
      line: lineObj,
    }
  }, [position.lat, position.lon, color])

  // Animate on hover
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = hovered ? ANIMATION.SATELLITE_HOVER_SCALE : 1
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.LineBasicMaterial
      material.opacity = hovered ? 0.8 : 0.4
    }
  })

  if (!visible) return null

  return (
    <group>
      {/* Thread connecting satellite to globe */}
      <primitive ref={lineRef} object={line} />

      {/* Satellite marker */}
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
          emissiveIntensity={hovered ? 0.8 : 0.4}
          roughness={0.3}
          metalness={0.7}
        />

        {/* Label - always visible */}
        <Html
          position={[0, 0.2, 0]}
          center
          distanceFactor={5}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div className="px-4 py-2 bg-black/90 backdrop-blur-sm rounded-lg text-white text-sm whitespace-nowrap" style={{ fontFamily: '"Shadows Into Light", "Indie Flower", cursive', fontWeight: 300 }}>
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
          opacity={hovered ? 0.3 : 0.1}
        />
      </mesh>
    </group>
  )
}
