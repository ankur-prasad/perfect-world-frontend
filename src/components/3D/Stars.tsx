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
  const trailsRef = useRef<THREE.Points>(null)
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

  // Create trail positions (multiple points per star for trail effect)
  const { trailPositions, trailOpacities } = useMemo(() => {
    const trailLength = 20 // Increased trail points for longer trails
    const trailPositions = new Float32Array(starCount * trailLength * 3)
    const trailOpacities = new Float32Array(starCount * trailLength)

    for (let i = 0; i < starCount; i++) {
      for (let j = 0; j < trailLength; j++) {
        const idx = (i * trailLength + j) * 3
        const opacityIdx = i * trailLength + j

        // Copy star position for each trail point
        trailPositions[idx] = positions[i * 3]
        trailPositions[idx + 1] = positions[i * 3 + 1]
        trailPositions[idx + 2] = positions[i * 3 + 2]

        // Opacity decreases along trail
        trailOpacities[opacityIdx] = 1 - (j / trailLength)
      }
    }

    return { trailPositions, trailOpacities }
  }, [positions, starCount])

  // Animate trails based on collections scroll progress
  // Only show trails after rotation has stopped (scrollProgress >= 0.8)
  useFrame(() => {
    if (trailsRef.current && collectionsScrollProgress > 0 && scrollProgress >= 0.8) {
      const positionAttr = trailsRef.current.geometry.attributes.position as THREE.BufferAttribute
      const trailLength = 20

      for (let i = 0; i < starCount; i++) {
        for (let j = 0; j < trailLength; j++) {
          const idx = (i * trailLength + j) * 3

          // Offset trail points to create flat/horizontal trails with faster, longer effect
          const offset = j * collectionsScrollProgress * 5.0 // Much faster and longer trails
          positionAttr.array[idx] = positions[i * 3]
          positionAttr.array[idx + 1] = positions[i * 3 + 1] // Keep y position same (flat)
          positionAttr.array[idx + 2] = positions[i * 3 + 2] - offset // Trail extends in z-direction
        }
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
    geom.setAttribute('opacity', new THREE.BufferAttribute(trailOpacities, 1))
    return geom
  }, [trailPositions, trailOpacities])

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

      {/* Star trails - only visible when rotation has stopped and collections scroll is active */}
      {collectionsScrollProgress > 0 && scrollProgress >= 0.8 && (
        <points ref={trailsRef} geometry={trailGeometry}>
          <pointsMaterial
            size={0.8}
            color="#ffffff"
            transparent
            opacity={collectionsScrollProgress * 0.9}
            sizeAttenuation
            vertexColors={false}
            map={starTexture}
            alphaTest={0.01}
          />
        </points>
      )}
    </>
  )
}
