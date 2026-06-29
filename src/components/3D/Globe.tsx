import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
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
  const { camera, raycaster, pointer } = useThree()
  const prevHoverRef = useRef(false)

  // Load Earth texture
  const colorMap = useMemo(() => {
    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load('/assets/textures/earth.jpg')
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    return texture
  }, [])

  // Globe shader material
  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          colorMap: { value: colorMap },
          uRimColor: { value: new THREE.Vector3(0.96, 0.64, 0.38) },
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D colorMap;
          uniform vec3 uRimColor;

          varying vec2 vUv;
          varying vec3 vNormal;

          void main() {
            vec4 texColor = texture2D(colorMap, vUv);

            // Desaturate earth
            float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
            vec3 desaturated = mix(vec3(gray), texColor.rgb, 0.4);

            // Rim light
            float rim = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
            rim = pow(rim, 3.0);
            vec3 redGlow = uRimColor * rim * 1.5;

            vec3 finalColor = desaturated + redGlow;

            gl_FragColor = vec4(finalColor, 1.0);
          }
        `,
      }),
    [colorMap]
  )

  // Simple hover state check
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
    <mesh
      ref={meshRef}
      material={shaderMaterial}
      onPointerDown={(e) => {
        e.stopPropagation()
        if (onDragStart) onDragStart()
      }}
      onPointerUp={(e) => {
        e.stopPropagation()
        if (onDragEnd) onDragEnd()
      }}
      castShadow={!mobile}
      receiveShadow={!mobile}
    >
      <sphereGeometry args={[1, segments, segments]} />
    </mesh>
  )
}
