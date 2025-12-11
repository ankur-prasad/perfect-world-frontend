import { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Group } from 'three'
import Globe from './Globe'
import Satellite from './Satellite'
import Stars from './Stars'
import { projects } from '../../data/projects'
import { SCENE, ANIMATION } from '../../utils/constants'
import { throttle, isMobile } from '../../utils/animations'

interface SceneProps {
  onSatelliteClick: (projectSlug: string, clickPosition: { x: number; y: number }) => void
  enableControls?: boolean
  scrollProgress?: number
  collectionsScrollProgress?: number
  onGlobeHoverChange?: (hover: boolean) => void
}

// Camera controller that tilts down based on scroll
function CameraController({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree()

  useFrame(() => {
    // Map scrollProgress to tilt: 0-0.1 = no tilt, 0.1-0.3 = full tilt
    // This makes full downward tilt happen much faster (at 30% instead of 50%)
    let tiltProgress = 0
    if (scrollProgress > 0.1) {
      tiltProgress = Math.min((scrollProgress - 0.1) / 0.2, 1) // Normalize 0.1-0.3 range to 0-1
    }

    const targetRotationX = tiltProgress * -1.2 // 0 to -69 degrees

    // Smooth interpolation
    camera.rotation.x += (targetRotationX - camera.rotation.x) * 0.1
  })

  return null
}

function GlobeGroup({ mousePosition, onSatelliteClick, collectionsScrollProgress, onGlobeHoverChange, scrollProgress }: {
  mousePosition: { x: number; y: number }
  onSatelliteClick: (slug: string, clickPosition: { x: number; y: number }) => void
  collectionsScrollProgress: number
  onGlobeHoverChange?: (hover: boolean) => void
  scrollProgress: number
}) {
  const groupRef = useRef<Group>(null)
  const [isGlobeHovered, setIsGlobeHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const { pointer } = useThree()
  const currentSpeedRef = useRef(0) // Track current speed for smooth transitions
  const dragStartRef = useRef({ x: 0, rotation: 0 })
  const dragVelocityRef = useRef(0)
  const prevPointerRef = useRef({ x: 0, y: 0 })
  const mobile = isMobile()
  const globeScale = mobile ? 0.83125 : 1.1875

  useFrame((_, delta) => {
    if (!groupRef.current) return

    // Store previous pointer for next frame (do this first)
    const currentPointerX = pointer.x
    const currentPointerY = pointer.y

    // --- Mouse-Controlled Rotation ---
    let targetRotationSpeed = 0

    if (isDragging) {
      // During drag: rotate based on mouse movement delta
      const dragDelta = currentPointerX - prevPointerRef.current.x

      // Cap delta to prevent huge jumps on mobile
      const cappedDelta = Math.max(-0.1, Math.min(0.1, dragDelta))

      // Smoother drag with damping - increased sensitivity for mobile
      const smoothDragDelta = cappedDelta * (mobile ? 3.5 : 2.5)
      dragVelocityRef.current = smoothDragDelta // Store velocity for momentum
      groupRef.current.rotation.y += smoothDragDelta // Direct control during drag

      // Reset current speed to prevent interference
      currentSpeedRef.current = 0
    } else if (isGlobeHovered) {
      // When hovering but not dragging: slower ambient rotation + momentum decay
      targetRotationSpeed = -currentPointerX * 0.09 // Much slower when hovered

      // Add decaying momentum from previous drag
      dragVelocityRef.current *= 0.95 // Decay momentum
      if (Math.abs(dragVelocityRef.current) > 0.001) {
        groupRef.current.rotation.y += dragVelocityRef.current
      }
    } else {
      // Normal mode: rotate based on mouse position
      targetRotationSpeed = -currentPointerX * 0.3
      dragVelocityRef.current = 0 // Reset momentum when not hovering
    }

    // Apply normal rotation speed (when not dragging)
    if (!isDragging) {
      currentSpeedRef.current += (targetRotationSpeed - currentSpeedRef.current) * 0.05
      groupRef.current.rotation.y += currentSpeedRef.current * delta
    }

    // Update previous pointer
    prevPointerRef.current.x = currentPointerX
    prevPointerRef.current.y = currentPointerY

    // Parallax tilt - completely disable on mobile, disable during dragging on desktop
    const parallaxMultiplier = (isDragging || mobile) ? 0 : 1.0
    const targetTiltX = mousePosition.y * ANIMATION.PARALLAX_STRENGTH * parallaxMultiplier
    const targetTiltZ = -mousePosition.x * ANIMATION.PARALLAX_STRENGTH * parallaxMultiplier

    // Smoother tilt interpolation
    const tiltSmoothing = (isDragging || mobile) ? 0.02 : 0.1
    groupRef.current.rotation.x += (targetTiltX - groupRef.current.rotation.x) * tiltSmoothing
    groupRef.current.rotation.z += (targetTiltZ - groupRef.current.rotation.z) * tiltSmoothing

    // Scroll-based upward movement (Stage 1: 0-250px scroll)
    // 250px = 16.7% of 1500px hero height
    const stage1End = 250 / 1500 // 0.167
    const baseY = 0.6 // Original Y position
    let yOffset = 0
    if (scrollProgress > 0 && scrollProgress <= stage1End) {
      const moveProgress = scrollProgress / stage1End // 0-1 over first 250px
      yOffset = moveProgress * 8 // Move 8 units upward (positive Y = up)
    } else if (scrollProgress > stage1End) {
      yOffset = 8 // Stay at +8 after 250px
    }

    // Smooth interpolation for Y position (baseY + offset)
    const targetY = baseY + yOffset
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.1
  })

  const handleGlobeHover = (hovered: boolean) => {
    setIsGlobeHovered(hovered)
    if (onGlobeHoverChange) onGlobeHoverChange(hovered)
  }

  const handleDragStart = () => {
    setIsDragging(true)
    dragStartRef.current = { x: pointer.x, rotation: groupRef.current?.rotation.y || 0 }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <group ref={groupRef} position={[0, 0.6, 0]} scale={globeScale}>
      {/* Stars now rotate with the globe */}
      <Stars
        collectionsScrollProgress={collectionsScrollProgress}
      />

      <Globe
        onHoverChange={handleGlobeHover}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        isDragging={isDragging}
      />

      {/* Satellites rotate with the globe */}
      {projects.map((project) => (
        <Satellite
          key={project.id}
          position={project.location}
          label={project.name}
          color={project.theme.primaryColor}
          onClick={(clickPosition) => onSatelliteClick(project.slug, clickPosition)}
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
            collectionsScrollProgress={collectionsScrollProgress}
            onGlobeHoverChange={onGlobeHoverChange}
            scrollProgress={scrollProgress}
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
