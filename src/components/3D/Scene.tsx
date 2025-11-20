import { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Group } from 'three'
import Globe from './Globe'
import Satellite from './Satellite'
import Stars from './Stars'
import { projects } from '../../data/projects'
import { SCENE, ANIMATION } from '../../utils/constants'
import { throttle } from '../../utils/animations'

interface SceneProps {
  onSatelliteClick: (projectSlug: string) => void
  enableControls?: boolean
  scrollProgress?: number
  collectionsScrollProgress?: number
  onGlobeHoverChange?: (hover: boolean) => void
}

// Camera controller that tilts down based on scroll
function CameraController({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree()

  useFrame(() => {
    // Map scrollProgress to tilt: 0-0.15 = no tilt, 0.15-0.5 = full tilt
    // This makes full downward tilt happen much faster (at 50% instead of 100%)
    let tiltProgress = 0
    if (scrollProgress > 0.15) {
      tiltProgress = Math.min((scrollProgress - 0.15) / 0.35, 1) // Normalize 0.15-0.5 range to 0-1
    }

    const targetRotationX = tiltProgress * -1.2 // 0 to -69 degrees

    // Smooth interpolation
    camera.rotation.x += (targetRotationX - camera.rotation.x) * 0.1
  })

  return null
}

function GlobeGroup({ mousePosition, onSatelliteClick, scrollProgress, collectionsScrollProgress, onGlobeHoverChange }: {
  mousePosition: { x: number; y: number }
  onSatelliteClick: (slug: string) => void
  scrollProgress: number
  collectionsScrollProgress: number
  onGlobeHoverChange?: (hover: boolean) => void
}) {
  const groupRef = useRef<Group>(null)
  const [isGlobeHovered, setIsGlobeHovered] = useState(false)
  const { pointer } = useThree()
  const currentSpeedRef = useRef(0) // Track current speed for smooth transitions

  useFrame((_, delta) => {
    if (!groupRef.current) return

    // --- Mouse-Controlled Rotation ---
    // Get normalized mouse X position (-1 to 1)
    const mouseX = pointer.x

    // Base rotation speed (radians per second)
    // Set to 0.1 for very gentle rotation
    // Positive mouseX (right) -> negative rotation (clockwise)
    // Negative mouseX (left) -> positive rotation (counter-clockwise)
    let targetRotationSpeed = -mouseX * 0.1

    // Slow down when hovering over globe (changed from 0.1 to 0.3 for less dramatic change)
    if (isGlobeHovered) {
      targetRotationSpeed *= 0.3
    }

    // Smoothly interpolate to target speed (lerp factor 0.05 for gradual transitions)
    currentSpeedRef.current += (targetRotationSpeed - currentSpeedRef.current) * 0.05

    // Stop rotation when scroll progress reaches 0.8 (80% through the scroll)
    const rotationMultiplier = Math.max(0, 1 - (scrollProgress - 0.8) / 0.2)
    groupRef.current.rotation.y += currentSpeedRef.current * delta * rotationMultiplier

    // Reduce parallax effect when frozen
    const parallaxMultiplier = rotationMultiplier
    const targetTiltX = mousePosition.y * ANIMATION.PARALLAX_STRENGTH * parallaxMultiplier
    const targetTiltZ = -mousePosition.x * ANIMATION.PARALLAX_STRENGTH * parallaxMultiplier

    groupRef.current.rotation.x += (targetTiltX - groupRef.current.rotation.x) * 0.1
    groupRef.current.rotation.z += (targetTiltZ - groupRef.current.rotation.z) * 0.1
  })

  const handleGlobeHover = (hovered: boolean) => {
    setIsGlobeHovered(hovered)
    if (onGlobeHoverChange) onGlobeHoverChange(hovered)
  }

  return (
    <group ref={groupRef} position={[0, 0.6, 0]}>
      {/* Stars now rotate with the globe */}
      <Stars
        collectionsScrollProgress={collectionsScrollProgress}
        scrollProgress={scrollProgress}
      />

      <Globe onHoverChange={handleGlobeHover} />

      {/* Satellites rotate with the globe */}
      {projects.map((project) => (
        <Satellite
          key={project.id}
          position={project.location}
          label={project.name}
          color={project.theme.primaryColor}
          onClick={() => onSatelliteClick(project.slug)}
        />
      ))}
    </group>
  )
}

export default function Scene({ onSatelliteClick, enableControls = false, scrollProgress = 0, collectionsScrollProgress = 0, onGlobeHoverChange }: SceneProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const throttledUpdateRef = useRef<((event: MouseEvent) => void) | null>(null)

  // Attach mouse move listener
  useEffect(() => {
    // Create throttled handler
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2
      const y = (event.clientY / window.innerHeight - 0.5) * 2
      setMousePosition({ x, y })
    }

    // Throttle the handler
    throttledUpdateRef.current = throttle(handleMouseMove, 16) // ~60fps

    // Add event listener
    window.addEventListener('mousemove', throttledUpdateRef.current)

    // Cleanup
    return () => {
      if (throttledUpdateRef.current) {
        window.removeEventListener('mousemove', throttledUpdateRef.current)
      }
    }
  }, [])

  return (
    <div className="w-full h-full bg-transparent">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0) // Transparent background
        }}
      >
        {/* Camera */}
        <PerspectiveCamera
          makeDefault
          position={[SCENE.CAMERA_POSITION.x, SCENE.CAMERA_POSITION.y, SCENE.CAMERA_POSITION.z]}
          fov={50}
        />

        {/* Camera controller for scroll-based tilt */}
        <CameraController scrollProgress={scrollProgress} />

        {/* Lights */}
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={2}
          castShadow
        />
        <pointLight position={[-5, -5, -5]} intensity={1} />

        {/* Scene Content */}
        <Suspense fallback={null}>

          {/* Globe, stars, and satellites rotate together, with parallax tilt */}
          <GlobeGroup
            mousePosition={mousePosition}
            onSatelliteClick={onSatelliteClick}
            scrollProgress={scrollProgress}
            collectionsScrollProgress={collectionsScrollProgress}
            onGlobeHoverChange={onGlobeHoverChange}
          />
        </Suspense>

        {/* Optional Orbit Controls for debugging */}
        {enableControls && (
          <OrbitControls
            enableZoom
            enablePan
            enableRotate
            minDistance={3}
            maxDistance={10}
          />
        )}
      </Canvas>
    </div>
  )
}
