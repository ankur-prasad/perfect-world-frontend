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
        hoverRadius: { value: 1.2 }, // Increased from 0.6 for bigger hover area
        isHovered: { value: 0.0 }, // Track if globe is being hovered
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        void main() {
          vUv = uv;
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        uniform vec3 hoverPoint;
        uniform float hoverRadius;
        uniform float isHovered;

        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        void main() {
          vec4 texColor = texture2D(map, vUv);

          // Less aggressive desaturation - keep more color (50% saturation instead of full desaturation)
          float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
          vec3 desaturated = mix(texColor.rgb, vec3(gray), 0.5); // 50% desaturated
          vec3 baseColor = desaturated * vec3(0.85, 0.9, 1.0); // Cool tint

          // Calculate distance from hover point for hover glow
          float dist = distance(vPosition, hoverPoint);
          float hoverInfluence = smoothstep(hoverRadius, 0.0, dist);

          // Mix in full color on hover
          vec3 finalColor = mix(baseColor, texColor.rgb * 1.2, hoverInfluence);

          // Red border glow when NOT hovering
          vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
          float rimIntensity = 1.0 - max(0.0, dot(viewDirection, vNormal));
          rimIntensity = pow(rimIntensity, 3.0); // Sharp falloff

          // Red glow color (logo red: #f4a261)
          vec3 redGlow = vec3(0.957, 0.635, 0.380);
          
          // Fade out border glow when hovering
          float borderGlowStrength = (1.0 - isHovered) * rimIntensity * 0.6;
          finalColor += redGlow * borderGlowStrength;

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
