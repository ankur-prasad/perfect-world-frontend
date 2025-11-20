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

  // Custom shader material for interactive  // Shader material reference
  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          colorMap: { value: colorMap },
          hoverPoint: { value: new THREE.Vector3(999, 999, 999) },
          hoverRadius: { value: 1.0 }, // Reduced from 1.2 to match smaller scale
          isHovered: { value: 0.0 },
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D colorMap;
          uniform vec3 hoverPoint;
          uniform float hoverRadius;
          uniform float isHovered;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;

          void main() {
            vec4 texColor = texture2D(colorMap, vUv);
            
            // Calculate distance from hover point
            float dist = distance(vPosition, hoverPoint);
            
            // Create hover glow effect
            float hoverIntensity = 1.0 - smoothstep(0.0, hoverRadius, dist);
            hoverIntensity = max(0.0, hoverIntensity);
            
            // Base desaturation (50% gray)
            vec3 gray = vec3(dot(texColor.rgb, vec3(0.299, 0.587, 0.114)));
            vec3 desaturated = mix(texColor.rgb, gray, 0.5);
            
            // Cool tint for base state
            vec3 coolTint = vec3(0.8, 0.9, 1.0);
            vec3 finalColor = desaturated * coolTint;
            
            // Red border glow (rim light) - ONLY when NOT hovered
            float rim = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
            rim = pow(rim, 3.0);
            vec3 redGlow = vec3(0.96, 0.64, 0.38) * rim * 1.5; // #f4a261
            
            // Mix red glow based on hover state (fade out when hovered)
            finalColor += redGlow * (1.0 - isHovered);

            // Full color on hover
            if (isHovered > 0.5) {
              // Enhance color saturation and brightness on hover
              vec3 vibrantColor = texColor.rgb * 1.2;
              finalColor = mix(finalColor, vibrantColor, hoverIntensity);
            }

            gl_FragColor = vec4(finalColor, 1.0);
          }
        `,
      }),
    [colorMap]
  )

  // Update hover point on mouse move
  useFrame(() => {
    if (!meshRef.current) return

    raycaster.setFromCamera(pointer, camera)
    const intersects = raycaster.intersectObject(meshRef.current)
    const isHovered = intersects.length > 0

    if (isHovered) {
      const point = intersects[0].point
      const localPoint = meshRef.current.worldToLocal(point.clone())
      shaderMaterial.uniforms.hoverPoint.value.copy(localPoint)
      shaderMaterial.uniforms.isHovered.value = 1.0

      if (!prevHoverRef.current) {
        prevHoverRef.current = true
        if (onHoverChange) onHoverChange(true)
      }
    } else {
      shaderMaterial.uniforms.hoverPoint.value.set(999, 999, 999)
      shaderMaterial.uniforms.isHovered.value = 0.0

      if (prevHoverRef.current) {
        prevHoverRef.current = false
        if (onHoverChange) onHoverChange(false)
      }
    }
  })

  return (
    <group>
      {/* Main Globe - renders on top */}
      <mesh ref={meshRef} scale={1.04} material={shaderMaterial}>
        <sphereGeometry args={[1, segments, segments]} />
      </mesh>

      {/* Atmosphere Glow */}
      <mesh scale={1.073}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#4d9ed8"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Subtle rim light effect */}
      <mesh scale={1.053}>
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
