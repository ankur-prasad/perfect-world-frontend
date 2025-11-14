import { useMemo } from 'react'
import * as THREE from 'three'
import { SCENE } from '../../utils/constants'
import { isMobile } from '../../utils/animations'

export default function Globe() {
  const mobile = isMobile()
  const segments = mobile ? SCENE.GLOBE_MOBILE_SEGMENTS : SCENE.GLOBE_SEGMENTS

  // Load realistic Earth texture
  const colorMap = useMemo(() => {
    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load('/assets/textures/earth.jpg')
    return texture
  }, [])

  return (
    <group>
      {/* Main Globe */}
      <mesh scale={1.36}>
        <sphereGeometry args={[1, segments, segments]} />
        <meshStandardMaterial
          map={colorMap}
          roughness={0.7}
          metalness={0}
          emissive={0x000000}
        />
      </mesh>

      {/* Atmosphere Glow */}
      <mesh scale={1.4025}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#4d9ed8"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Subtle rim light effect */}
      <mesh scale={1.377}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}
