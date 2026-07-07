import { Suspense, useState, useEffect, useRef, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, useProgress } from '@react-three/drei'
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

function GlobeGroup({ mousePosition, onSatelliteClick, collectionsScrollProgress, onGlobeHoverChange, scrollProgress, onReady }: {
  mousePosition: { x: number; y: number }
  onSatelliteClick: (slug: string, clickPosition: { x: number; y: number }) => void
  collectionsScrollProgress: number
  onGlobeHoverChange?: (hover: boolean) => void
  scrollProgress: number
  onReady?: () => void
}) {
  const groupRef = useRef<Group>(null)
  const [isDragging, setIsDragging] = useState(false)

  const ambientSpeed = 0.05 // constant slow rotation speed (rad/sec)
  const dragVelocity = useRef(0) // momentum after release (rad/sec)

  const mobile = isMobile()
  const globeScale = mobile ? 0.83125 : 1.1875
  // How far the globe turns per pixel of horizontal drag (screen-space, 1:1 feel)
  const ROT_PER_PX = mobile ? 0.006 : 0.005

  // Global event listener to release drag anywhere on the page/window
  useEffect(() => {
    const handleGlobalRelease = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener('pointerup', handleGlobalRelease)
      window.addEventListener('touchend', handleGlobalRelease)
    }

    return () => {
      window.removeEventListener('pointerup', handleGlobalRelease)
      window.removeEventListener('touchend', handleGlobalRelease)
    }
  }, [isDragging])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    // Manual drag rotation is applied directly in handleDragMove for a 1:1
    // feel; here we only run momentum + ambient spin when not actively dragging.
    if (!isDragging) {
      dragVelocity.current *= mobile ? 0.88 : 0.94
      if (Math.abs(dragVelocity.current) > 0.02) {
        groupRef.current.rotation.y += dragVelocity.current * delta
      } else {
        dragVelocity.current = 0
        groupRef.current.rotation.y -= ambientSpeed * delta
      }
    }

    // Parallax tilt - completely disable on mobile, disable during dragging on desktop
    const parallaxMultiplier = (isDragging || mobile) ? 0 : 1.0
    const targetTiltX = mousePosition.y * ANIMATION.PARALLAX_STRENGTH * parallaxMultiplier
    const targetTiltZ = -mousePosition.x * ANIMATION.PARALLAX_STRENGTH * parallaxMultiplier

    // Smoother tilt interpolation
    const tiltSmoothing = (isDragging || mobile) ? 0.02 : 0.1
    groupRef.current.rotation.x += (targetTiltX - groupRef.current.rotation.x) * tiltSmoothing
    groupRef.current.rotation.z += (targetTiltZ - groupRef.current.rotation.z) * tiltSmoothing

    // Scroll-based upward movement (Stage 1: 0-250px scroll)
    const stage1End = 250 / 1500
    const baseY = 0.6
    let yOffset = 0
    if (scrollProgress > 0 && scrollProgress <= stage1End) {
      const moveProgress = scrollProgress / stage1End
      yOffset = moveProgress * 8
    } else if (scrollProgress > stage1End) {
      yOffset = 8
    }

    const targetY = baseY + yOffset
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.1
  })

  const handleGlobeHover = (hovered: boolean) => {
    if (onGlobeHoverChange) onGlobeHoverChange(hovered)
  }

  const handleDragStart = () => {
    setIsDragging(true)
    dragVelocity.current = 0
  }

  const handleDragMove = (dx: number) => {
    if (groupRef.current) groupRef.current.rotation.y += dx * ROT_PER_PX
  }

  const handleDragEnd = (velPxPerMs: number) => {
    setIsDragging(false)
    // px/ms → rad/s, capped so a hard flick doesn't spin forever
    const v = velPxPerMs * 1000 * ROT_PER_PX
    dragVelocity.current = Math.max(-2.5, Math.min(2.5, v))
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
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onReady={onReady}
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

  // Fade the whole scene in once the Earth model (and its textures) finish
  // loading, so the hero appears as a smooth reveal instead of popping in.
  //
  // The globe must ALWAYS become visible, so we reveal on the first of:
  //  1. Globe's onReady (fires when the GLB has actually loaded — most reliable),
  //  2. the loading manager reporting 100% (smooth path), or
  //  3. a failsafe timer (covers cached loads where the loader never reports).
  const { active, progress } = useProgress()
  const [revealed, setRevealed] = useState(false)
  const reveal = useCallback(() => setRevealed(true), [])

  useEffect(() => {
    if (!active && progress >= 100) reveal()
  }, [active, progress, reveal])

  useEffect(() => {
    const t = setTimeout(reveal, 4000)
    return () => clearTimeout(t)
  }, [reveal])

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
    <div
      className="w-full h-full bg-transparent transition-opacity ease-out"
      style={{ opacity: revealed ? 1 : 0, transitionDuration: '1200ms' }}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        // pan-y lets a vertical swipe scroll the page; horizontal drags still
        // rotate the globe (handled via pointer capture on the helper sphere).
        style={{ touchAction: 'pan-y' }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0) // Transparent background
          // Vertical swipes scroll the page; horizontal drags rotate the globe.
          gl.domElement.style.touchAction = 'pan-y'
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
            onReady={reveal}
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
