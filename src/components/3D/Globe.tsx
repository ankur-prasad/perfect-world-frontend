import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { SCENE } from '../../utils/constants'
import { isMobile } from '../../utils/animations'

export default function Globe({ onHoverChange }: { onHoverChange?: (hover: boolean) => void }) {
  const mobile = isMobile()
  const segments = mobile ? SCENE.GLOBE_MOBILE_SEGMENTS : SCENE.GLOBE_SEGMENTS
  const meshRef = useRef<THREE.Mesh>(null)
  const { camera, raycaster, pointer } = useThree()
  const prevHoverRef = useRef(false)

  // Load Earth texture with desaturation
  const colorMap = useMemo(() => {
    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load('/assets/textures/earth.jpg')
    return texture
  }, [])

  // Custom shader material for interactive desaturation
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        map: { value: colorMap },
        hoverPoint: { value: new THREE.Vector3(999, 999, 999) },
        hoverRadius: { value: 0.6 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;

        void main() {
          vUv = uv;
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        uniform vec3 hoverPoint;
        uniform float hoverRadius;

        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;

        void main() {
          vec4 texColor = texture2D(map, vUv);

          // Calculate grayscale
          float gray = dot(texColor.rgb, vec3(0.299, 0.222, 0.179));
          vec3 monochrome = vec3(gray) * vec3(0.7, 0.75, 0.8); // Cool monochrome tint

          // Calculate distance from hover point
          float dist = distance(vPosition, hoverPoint);
          float influence = smoothstep(hoverRadius, 0.0, dist);

          // Mix between monochrome and color based on hover
          vec3 finalColor = mix(monochrome, texColor.rgb, influence);

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    })
  }, [colorMap])

  // Update hover point on mouse move
  useFrame(() => {
    if (!meshRef.current) return

    raycaster.setFromCamera(pointer, camera)
    const intersects = raycaster.intersectObject(meshRef.current)

    if (intersects.length > 0) {
      const point = intersects[0].point
      const localPoint = meshRef.current.worldToLocal(point.clone())
      shaderMaterial.uniforms.hoverPoint.value.copy(localPoint)
      if (!prevHoverRef.current) {
        prevHoverRef.current = true
        if (onHoverChange) onHoverChange(true)
      }
    } else {
      shaderMaterial.uniforms.hoverPoint.value.set(999, 999, 999)
      if (prevHoverRef.current) {
        prevHoverRef.current = false
        if (onHoverChange) onHoverChange(false)
      }
    }
  })

  return (
    <group>
      {/* Main Globe */}
      <mesh ref={meshRef} scale={1.224} material={shaderMaterial}>
        <sphereGeometry args={[1, segments, segments]} />
      </mesh>

      {/* Atmosphere Glow */}
      <mesh scale={1.26225}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#4d9ed8"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Subtle rim light effect */}
      <mesh scale={1.2393}>
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
