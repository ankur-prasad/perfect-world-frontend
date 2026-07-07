import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import { SCENE } from '../../utils/constants'
import { isMobile } from '../../utils/animations'

interface GlobeProps {
  onHoverChange?: (hover: boolean) => void
  onDragStart?: () => void
  onDragEnd?: () => void
  isDragging?: boolean
}

export default function Globe({ onHoverChange, onDragStart, onDragEnd }: GlobeProps) {
  const mobile = isMobile()
  const segments = mobile ? SCENE.GLOBE_MOBILE_SEGMENTS : SCENE.GLOBE_SEGMENTS
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  
  const { camera, raycaster, pointer } = useThree()
  const prevHoverRef = useRef(false)

  // Load the Earth GLTF/GLB model
  const { scene, animations } = useGLTF('/assets/models/earth.glb')
  
  // Set up animations if the model contains them
  const { actions } = useAnimations(animations, groupRef)

  // Enable shadows on the model's meshes and customize materials to match Sketchfab look
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.castShadow = !mobile
        mesh.receiveShadow = !mobile

        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        materials.forEach((mat) => {
          if (!mat) return
          const stdMat = mat as THREE.MeshStandardMaterial

          // Force single-sided rendering on all materials to match Sketchfab's Single Sided ON mode
          stdMat.side = THREE.FrontSide

          // 1. Clouds Material
          if (stdMat.name === 'clouds') {
            stdMat.transparent = true
            stdMat.opacity = 0.75 // Make clouds more opaque (75%)
          }

          // 2. Atmosphere Glow (atmous) - Remove completely as requested
          if (stdMat.name === 'atmous') {
            stdMat.visible = false
          }

          // 3. Ocean Material (water surface) - Revert back to the vibrant transmissive blue setup
          if (stdMat.name === 'ocean') {
            stdMat.transparent = true
            stdMat.opacity = 0.85
            stdMat.color.setRGB(0.08, 0.38, 0.85) // Vibrant blue water
            stdMat.metalness = 0.1 // Low metalness to prevent pitch black mirroring
            stdMat.roughness = 0.4 // Diffuse light capturing
          }

          // 4. Landmasses (earth) - Make land brighter and match sRGB color space
          if (stdMat.name === 'earth') {
            if (stdMat.map) {
              stdMat.map.colorSpace = THREE.SRGBColorSpace
            }
            stdMat.color.setRGB(1.25, 1.25, 1.25) // Boost brightness of landmass textures
          }

          // 5. Ocean Floor
          if (stdMat.name === 'oceanFloor') {
            if (stdMat.map) {
              stdMat.map.colorSpace = THREE.SRGBColorSpace
            }
          }
        })
      }
    })
  }, [scene, mobile])

  // Play the default animation (rotating clouds) slowly
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstActionName = Object.keys(actions)[0]
      const action = actions[firstActionName]
      if (action) {
        action.timeScale = 0.033 // Made 10% faster (from 0.03)
        action.play()
      }
    }
  }, [actions])

  // Hover state detection using the invisible helper sphere
  useFrame(() => {
    if (!meshRef.current) return

    raycaster.setFromCamera(pointer, camera)
    const intersects = raycaster.intersectObject(meshRef.current)
    const isHovered = intersects.length > 0

    if (isHovered) {
      if (!prevHoverRef.current) {
        prevHoverRef.current = true
        if (onHoverChange) onHoverChange(true)
      }
    } else {
      if (prevHoverRef.current) {
        prevHoverRef.current = false
        if (onHoverChange) onHoverChange(false)
      }
    }
  })

  return (
    <group ref={groupRef}>
      {/* High-fidelity 3D Earth GLB Model */}
      <primitive object={scene} />

      {/* Invisible helper sphere for fast, mathematically precise raycasting and drag events */}
      <mesh
        ref={meshRef}
        onPointerDown={(e) => {
          e.stopPropagation()
          if (onDragStart) onDragStart()
        }}
        onPointerUp={(e) => {
          e.stopPropagation()
          if (onDragEnd) onDragEnd()
        }}
      >
        <sphereGeometry args={[1, segments, segments]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}

// Preload the earth model to prevent lag when the home page mounts
useGLTF.preload('/assets/models/earth.glb')

