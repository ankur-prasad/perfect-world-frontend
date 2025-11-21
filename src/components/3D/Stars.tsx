import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SCENE } from '../../utils/constants'
import { isMobile } from '../../utils/animations'

interface StarsProps {
  collectionsScrollProgress?: number
  scrollProgress?: number
}

export default function Stars({ collectionsScrollProgress = 0, scrollProgress = 0 }: StarsProps) {
  const starsRef = useRef<THREE.Points>(null)
  const trailsRef = useRef<THREE.LineSegments>(null)
  const mobile = isMobile()
  const starCount = mobile ? SCENE.STAR_COUNT_MOBILE : SCENE.STAR_COUNT

  // Generate random star positions
  const positions = useMemo(() => {
    const positions = new Float32Array(starCount * 3)

    for (let i = 0; i < starCount; i++) {
      // Create stars in a sphere around the origin, but ensure they're far from camera
      const radius = 30 + Math.random() * 120 // 30 to 150 units away
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
    }

    return positions
  }, [starCount])

  // Create trail positions (2 points per star: start and end)
  const trailPositions = useMemo(() => {
    const trailPositions = new Float32Array(starCount * 2 * 3) // 2 points per star

    for (let i = 0; i < starCount; i++) {
      // Initialize both points to the star's position
      const x = positions[i * 3]
      const y = positions[i * 3 + 1]
      const z = positions[i * 3 + 2]

      // Point 1 (Start)
      trailPositions[i * 6] = x
      trailPositions[i * 6 + 1] = y
      trailPositions[i * 6 + 2] = z

      // Point 2 (End) - initially same as start
      trailPositions[i * 6 + 3] = x
      trailPositions[i * 6 + 4] = y
      trailPositions[i * 6 + 5] = z
    }

    return trailPositions
  }, [positions, starCount])

  // Animate trails based on collections scroll progress
  // Show trails earlier, as soon as camera starts tilting down (scrollProgress >= 0.3)
  useFrame(() => {
    if (trailsRef.current && collectionsScrollProgress > 0 && scrollProgress >= 0.3) {
      const positionAttr = trailsRef.current.geometry.attributes.position as THREE.BufferAttribute

      // Length multiplier - controls how long the trails get
      const lengthMultiplier = 300.0

      for (let i = 0; i < starCount; i++) {
        // Update the end point (Point 2) of each segment
        const idx = i * 6 // Start index for this star's segment

        // Original position (Point 1 is fixed at original position)
        const x = positions[i * 3]
        const y = positions[i * 3 + 1]
        const z = positions[i * 3 + 2]

        // Calculate offset based on scroll progress
        // Extend in Z direction which maps to vertical on screen when looking down
        // Add some randomness to length for more natural look
        const randomFactor = 1 + Math.sin(i) * 0.2
        const offset = collectionsScrollProgress * lengthMultiplier * randomFactor

        // Update Point 2 (End)
        positionAttr.array[idx + 3] = x
        positionAttr.array[idx + 4] = y
        positionAttr.array[idx + 5] = z + offset
      }

      positionAttr.needsUpdate = true
    }
  })

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geom
  }, [positions])

  const trailGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3))
    return geom
  }, [trailPositions])

  // Create circular star texture
  const starTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')!

    // Draw a white circle with soft edges
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 32, 32)

    const texture = new THREE.CanvasTexture(canvas)
    return texture
  }, [])

  return (
    <>
      {/* Main stars */}
      <points ref={starsRef} geometry={geometry}>
        <pointsMaterial
          size={0.5}
          color="#ffffff"
          transparent
          opacity={1}
          sizeAttenuation
          map={starTexture}
          alphaTest={0.01}
        />
      </points>

      {/* Star trails - only visible when camera is tilted and collections scroll is active */}
      {collectionsScrollProgress > 0 && scrollProgress >= 0.3 && (
        <lineSegments ref={trailsRef} geometry={trailGeometry}>
          <lineBasicMaterial
            color="#ffffff"
            transparent
            // Fade in at start (0 to 0.2), stay visible, then fade out as background turns white (0.6 to 0.9)
            // Background starts turning white at 0.4 and is fully white at 0.9
            opacity={
              collectionsScrollProgress < 0.6
                ? Math.min(1, collectionsScrollProgress * 5) // Quick fade in
                : Math.max(0, 1 - (collectionsScrollProgress - 0.6) * 3.33) // Fade out before 0.9
            }
            linewidth={1}
          />
        </lineSegments>
      )}
    </>
  )
}
