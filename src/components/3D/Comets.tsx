import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CometsProps {
  count?: number
  scrollProgress?: number
}

interface CometData {
  position: THREE.Vector3
  velocity: THREE.Vector3
  lifetime: number
  maxLifetime: number
  trailLength: number
  color: THREE.Color
  colorSpeed: number
}

export default function Comets({ count = 15, scrollProgress = 0 }: CometsProps) {
  const cometsRef = useRef<THREE.Points>(null)
  const trailsRef = useRef<THREE.Points>(null)
  const cometsData = useRef<CometData[]>([])

  // Initialize comet data
  useMemo(() => {
    cometsData.current = Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3
      ),
      lifetime: Math.random() * 3,
      maxLifetime: 3 + Math.random() * 2,
      trailLength: 20,
      color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6),
      colorSpeed: 0.1 + Math.random() * 0.2,
    }))
  }, [count])

  // Comet positions and colors
  const { positions, trailPositions, colors, trailColors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const trailPositions = new Float32Array(count * 20 * 3)
    const colors = new Float32Array(count * 3)
    const trailColors = new Float32Array(count * 20 * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = cometsData.current[i].position.x
      positions[i * 3 + 1] = cometsData.current[i].position.y
      positions[i * 3 + 2] = cometsData.current[i].position.z

      // Initialize colors
      colors[i * 3] = cometsData.current[i].color.r
      colors[i * 3 + 1] = cometsData.current[i].color.g
      colors[i * 3 + 2] = cometsData.current[i].color.b

      // Initialize trail positions and colors
      for (let j = 0; j < 20; j++) {
        const idx = (i * 20 + j) * 3
        trailPositions[idx] = cometsData.current[i].position.x
        trailPositions[idx + 1] = cometsData.current[i].position.y
        trailPositions[idx + 2] = cometsData.current[i].position.z

        trailColors[idx] = cometsData.current[i].color.r
        trailColors[idx + 1] = cometsData.current[i].color.g
        trailColors[idx + 2] = cometsData.current[i].color.b
      }
    }

    return { positions, trailPositions, colors, trailColors }
  }, [count])

  // Create circular comet texture (softer, thinner)
  const cometTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')!

    // Draw a soft circle
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)')
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.2)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 32, 32)

    const texture = new THREE.CanvasTexture(canvas)
    return texture
  }, [])

  // Animate comets - only when scrollProgress < 0.8 (while spinning)
  useFrame(() => {
    if (!cometsRef.current || !trailsRef.current || scrollProgress >= 0.8) return

    const positionAttr = cometsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const trailPositionAttr = trailsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const colorAttr = cometsRef.current.geometry.attributes.color as THREE.BufferAttribute
    const trailColorAttr = trailsRef.current.geometry.attributes.color as THREE.BufferAttribute

    for (let i = 0; i < count; i++) {
      const comet = cometsData.current[i]

      // Update lifetime
      comet.lifetime += 0.016 // ~60fps

      // Update color (cycle through hue)
      const hue = (comet.lifetime * comet.colorSpeed) % 1.0
      comet.color.setHSL(hue, 0.7, 0.6)

      if (comet.lifetime >= comet.maxLifetime) {
        // Reset comet
        comet.position.set(
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100
        )
        comet.velocity.set(
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3
        )
        comet.lifetime = 0
        comet.colorSpeed = 0.1 + Math.random() * 0.2
      } else {
        // Update position
        comet.position.add(comet.velocity)
      }

      // Update main comet position and color
      positionAttr.array[i * 3] = comet.position.x
      positionAttr.array[i * 3 + 1] = comet.position.y
      positionAttr.array[i * 3 + 2] = comet.position.z

      colorAttr.array[i * 3] = comet.color.r
      colorAttr.array[i * 3 + 1] = comet.color.g
      colorAttr.array[i * 3 + 2] = comet.color.b

      // Update trail positions and colors
      for (let j = 0; j < 20; j++) {
        const idx = (i * 20 + j) * 3
        const trailOffset = j * 0.5

        trailPositionAttr.array[idx] = comet.position.x - comet.velocity.x * trailOffset
        trailPositionAttr.array[idx + 1] = comet.position.y - comet.velocity.y * trailOffset
        trailPositionAttr.array[idx + 2] = comet.position.z - comet.velocity.z * trailOffset

        trailColorAttr.array[idx] = comet.color.r
        trailColorAttr.array[idx + 1] = comet.color.g
        trailColorAttr.array[idx + 2] = comet.color.b
      }
    }

    positionAttr.needsUpdate = true
    trailPositionAttr.needsUpdate = true
    colorAttr.needsUpdate = true
    trailColorAttr.needsUpdate = true
  })

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geom
  }, [positions, colors])

  const trailGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3))
    geom.setAttribute('color', new THREE.BufferAttribute(trailColors, 3))
    return geom
  }, [trailPositions, trailColors])

  // Only show comets while spinning (scrollProgress < 0.8)
  if (scrollProgress >= 0.8) return null

  return (
    <>
      {/* Comet heads */}
      <points ref={cometsRef} geometry={geometry}>
        <pointsMaterial
          size={2.0}
          transparent
          opacity={0.8}
          sizeAttenuation
          map={cometTexture}
          alphaTest={0.01}
          blending={THREE.AdditiveBlending}
          vertexColors
        />
      </points>

      {/* Comet trails */}
      <points ref={trailsRef} geometry={trailGeometry}>
        <pointsMaterial
          size={1.2}
          transparent
          opacity={0.6}
          sizeAttenuation
          map={cometTexture}
          alphaTest={0.01}
          blending={THREE.AdditiveBlending}
          vertexColors
        />
      </points>
    </>
  )
}
