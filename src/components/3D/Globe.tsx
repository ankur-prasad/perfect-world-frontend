import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useFBO } from '@react-three/drei'
import * as THREE from 'three'
import { SCENE } from '../../utils/constants'
import { isMobile } from '../../utils/animations'

export default function Globe({ onHoverChange }: { onHoverChange?: (hover: boolean) => void }) {
  const mobile = isMobile()
  const segments = mobile ? SCENE.GLOBE_MOBILE_SEGMENTS : SCENE.GLOBE_SEGMENTS
  const meshRef = useRef<THREE.Mesh>(null)
  const { camera, raycaster, pointer, gl } = useThree()
  const prevHoverRef = useRef(false)

  // Track previous pointer for velocity calculation
  const prevPointer = useRef(new THREE.Vector2(0, 0))
  const velocityRef = useRef(0)

  // Load Earth texture only
  const colorMap = useMemo(() => {
    const textureLoader = new THREE.TextureLoader()
    return textureLoader.load('/assets/textures/earth.jpg')
  }, [])

  // --- Ping-Pong Buffers for Fluid Simulation ---
  // We need two buffers: Read (Previous Frame) and Write (Next Frame)
  // We swap them every frame.
  const renderTargetA = useFBO(1024, 512, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType, // Standard type for compatibility
    depthBuffer: false,
    stencilBuffer: false,
  })

  const renderTargetB = useFBO(1024, 512, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
    depthBuffer: false,
    stencilBuffer: false,
  })

  // Refs to keep track of ping-pong state
  const targetRef = useRef({
    read: renderTargetA,
    write: renderTargetB,
    swap: function () {
      const temp = this.read
      this.read = this.write
      this.write = temp
    }
  })

  // --- Scenes ---
  const { maskScene, maskCamera, brushMesh, simScene, simMesh } = useMemo(() => {
    // 1. Brush Scene
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0, 10)
    camera.position.set(0, 0, 1)
    camera.lookAt(0, 0, 0)

    // Brush Mesh
    const geometry = new THREE.PlaneGeometry(0.25, 0.25)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        uVelocity: { value: 0 },
        uColor: { value: new THREE.Vector3(1.0, 1.0, 1.0) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float uVelocity;
        uniform vec3 uColor;
        varying vec2 vUv;
        
        float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
        float noise(vec2 p) {
            vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
            return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
                       mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
        }
        float fbm(vec2 p) {
            float v = 0.0; float amp = 0.5;
            for (int i = 0; i < 4; i++) { v += amp * noise(p); p *= 2.0; amp *= 0.5; }
            return v;
        }

        void main() {
          vec2 center = vec2(0.5);
          float dist = distance(vUv, center);
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          
          vec2 nUV = vUv * 3.0 + time * 0.2;
          float n1 = fbm(nUV);
          vec2 nUV2 = vUv * 6.0 - time * 0.1;
          float n2 = fbm(nUV2);
          float noiseVal = mix(n1, n2, 0.5);
          
          alpha *= smoothstep(0.2, 0.8, noiseVal);
          
          // --- Dynamics ---
          // Modulate opacity based on velocity (faster = more opaque/intense)
          float velocityFactor = smoothstep(0.0, 0.5, uVelocity);
          float dynamicAlpha = mix(0.5, 1.0, velocityFactor); // Increased intensity
          
          alpha = smoothstep(0.0, 0.8, alpha);
          
          // Final Color with slight off-white variation
          vec3 cloudColor = mix(vec3(0.95, 0.95, 0.95), vec3(1.0), n1);

          gl_FragColor = vec4(cloudColor, alpha * dynamicAlpha); 
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // 2. Simulation Scene (Advection)
    const simScene = new THREE.Scene()
    const simGeo = new THREE.PlaneGeometry(2, 2) // Fullscreen clip space
    const simMat = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null }, // Previous frame
        time: { value: 0 },
        uDissipation: { value: 0.996 }, // Very slow fade for persistent trails
        uCurlStrength: { value: 0.01 }, // Gentle swirl
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0); 
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform float time;
        uniform float uDissipation;
        uniform float uCurlStrength;
        varying vec2 vUv;

        // Curl Noise Function
        // Based on: https://al-ro.github.io/projects/embers/
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
        float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy) );
            vec2 x0 = v -   i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod289(i);
            vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
            m = m*m ;
            m = m*m ;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
            vec3 g;
            g.x  = a0.x  * x0.x  + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }

        vec2 curl(vec2 p) {
            float eps = 0.1;
            float n1 = snoise(p + vec2(0, eps));
            float n2 = snoise(p + vec2(0, -eps));
            float n3 = snoise(p + vec2(eps, 0));
            float n4 = snoise(p + vec2(-eps, 0));
            float x = (n1 - n2) / (2.0 * eps);
            float y = (n3 - n4) / (2.0 * eps);
            return vec2(x, -y);
        }

        void main() {
            vec2 uv = vUv;
            
            // Calculate flow vector (Curl Noise)
            // Scale UV for noise frequency
            vec2 flow = curl(uv * 10.0 + time * 0.1);
            
            // Advection: Sample PREVIOUS frame at (uv - flow * strength)
            // We move the lookup point backwards along the flow vector
            vec2 coord = uv - flow * uCurlStrength * 0.01;
            
            vec4 color = texture2D(uTexture, coord);
            
            // Dissipation
            color *= uDissipation;
            
            gl_FragColor = color;
        }
      `,
      depthTest: false,
      depthWrite: false,
    })
    const simMesh = new THREE.Mesh(simGeo, simMat)
    simScene.add(simMesh)

    return { maskScene: scene, maskCamera: camera, brushMesh: mesh, simScene, simMesh }
  }, [])

  // Custom shader material for the Globe
  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          colorMap: { value: colorMap },
          cloudLayer: { value: renderTargetA.texture }, // Will be updated frame-by-frame
          hoverPoint: { value: new THREE.Vector3(999, 999, 999) },
          hoverRadius: { value: 1.0 },
          isHovered: { value: 0.0 },
          time: { value: 0 },
          uCloudColor: { value: new THREE.Vector3(1.0, 1.0, 1.0) },
          uRimColor: { value: new THREE.Vector3(0.96, 0.64, 0.38) },
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
          uniform sampler2D cloudLayer;
          uniform vec3 hoverPoint;
          uniform float hoverRadius;
          uniform float isHovered;
          uniform float time;
          uniform vec3 uCloudColor;
          uniform vec3 uRimColor;
          
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;

          void main() {
            vec4 texColor = texture2D(colorMap, vUv);
            
            // Sample cloud layer (already advected)
            vec4 cloudMain = texture2D(cloudLayer, vUv);
            
            // Sample cloud at offset UV (Shadow/Highlight)
            vec2 offset = vec2(-0.004, 0.004);
            vec4 cloudShadow = texture2D(cloudLayer, vUv + offset);
            
            // Calculate distance from hover point
            float dist = distance(vPosition, hoverPoint);
            float hoverIntensity = 1.0 - smoothstep(0.0, hoverRadius, dist);
            hoverIntensity = max(0.0, hoverIntensity);
            
            // Base color (Earth)
            vec3 finalColor = texColor.rgb;
            
            // --- Cloud Rendering ---
            float cloudAlpha = cloudMain.r; 
            float shadowAlpha = cloudShadow.r;
            
            // Apply Shadow to Earth
            float shadowStrength = max(0.0, shadowAlpha - cloudAlpha * 0.5);
            finalColor = mix(finalColor, finalColor * 0.5, shadowStrength);
            
            // Apply Clouds on top
            float cloudRim = max(0.0, cloudAlpha - shadowAlpha);
            vec3 cloudFinalColor = uCloudColor + vec3(0.2) * cloudRim; 
            
            finalColor = mix(finalColor, cloudFinalColor, cloudAlpha);

            // Red border glow (rim light)
            float rim = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
            rim = pow(rim, 3.0);
            vec3 redGlow = uRimColor * rim * 1.5;
            
            finalColor += redGlow;

            gl_FragColor = vec4(finalColor, 1.0);
          }
        `,
      }),
    [colorMap, renderTargetA.texture]
  )

  // Update hover point and paint clouds
  useFrame((state) => {
    if (!meshRef.current) return

    const time = state.clock.getElapsedTime()
    shaderMaterial.uniforms.time.value = time
    // @ts-ignore
    brushMesh.material.uniforms.time.value = time
    // @ts-ignore
    simMesh.material.uniforms.time.value = time

    // --- Cursor Dynamics ---
    const currentPointer = pointer.clone()
    const delta = currentPointer.sub(prevPointer.current)
    const speed = delta.length() * 100.0
    velocityRef.current += (speed - velocityRef.current) * 0.1
    // @ts-ignore
    brushMesh.material.uniforms.uVelocity.value = velocityRef.current
    const targetScale = 1.0 + velocityRef.current * 0.5
    brushMesh.scale.setScalar(targetScale)
    prevPointer.current.copy(pointer)

    // --- Raycasting ---
    raycaster.setFromCamera(pointer, camera)
    const intersects = raycaster.intersectObject(meshRef.current)
    const isHovered = intersects.length > 0

    // --- FLUID SIMULATION STEP ---
    // 1. Swap Buffers
    targetRef.current.swap()
    const readBuffer = targetRef.current.read
    const writeBuffer = targetRef.current.write

    // 2. Advection Pass (Read from Read, Write to Write)
    // @ts-ignore
    simMesh.material.uniforms.uTexture.value = readBuffer.texture

    const currentRenderTarget = gl.getRenderTarget()
    gl.setRenderTarget(writeBuffer)
    gl.render(simScene, maskCamera) // Reuse maskCamera (ortho)

    // 3. Brush Pass (Draw on top of Advection)
    if (isHovered) {
      const intersect = intersects[0]
      const point = intersect.point
      const localPoint = meshRef.current.worldToLocal(point.clone())
      shaderMaterial.uniforms.hoverPoint.value.copy(localPoint)
      shaderMaterial.uniforms.isHovered.value += (1.0 - shaderMaterial.uniforms.isHovered.value) * 0.1

      if (!prevHoverRef.current) {
        prevHoverRef.current = true
        if (onHoverChange) onHoverChange(true)
      }

      if (intersect.uv) {
        const uv = intersect.uv
        brushMesh.position.set(uv.x, uv.y, 0)

        // Render brush to Write Buffer (additive)
        gl.render(maskScene, maskCamera)

        // Wrapping
        if (uv.x < 0.1) {
          brushMesh.position.set(uv.x + 1, uv.y, 0)
          gl.render(maskScene, maskCamera)
        }
        if (uv.x > 0.9) {
          brushMesh.position.set(uv.x - 1, uv.y, 0)
          gl.render(maskScene, maskCamera)
        }
      }
    } else {
      shaderMaterial.uniforms.hoverPoint.value.set(999, 999, 999)
      shaderMaterial.uniforms.isHovered.value += (0.0 - shaderMaterial.uniforms.isHovered.value) * 0.1
      if (prevHoverRef.current) {
        prevHoverRef.current = false
        if (onHoverChange) onHoverChange(false)
      }
    }

    gl.setRenderTarget(currentRenderTarget)

    // 4. Update Globe Material to use the NEW Write Buffer
    shaderMaterial.uniforms.cloudLayer.value = writeBuffer.texture
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
