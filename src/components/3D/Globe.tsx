import { useMemo, useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useFBO } from '@react-three/drei'
import * as THREE from 'three'
import { SCENE } from '../../utils/constants'
import { isMobile } from '../../utils/animations'

interface GlobeProps {
  onHoverChange?: (hover: boolean) => void
  onDragStart?: () => void
  onDragEnd?: () => void
  isDragging?: boolean
}

export default function Globe({ onHoverChange, onDragStart, onDragEnd, isDragging = false }: GlobeProps) {
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
    const texture = textureLoader.load('/assets/textures/earth.jpg')
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    return texture
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
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping,
  })

  const renderTargetB = useFBO(1024, 512, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
    depthBuffer: false,
    stencilBuffer: false,
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping,
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

  const prevUvRef = useRef<THREE.Vector2 | null>(null)

  // Ensure wrapping is applied (sometimes useFBO options are not enough for internal texture)
  useEffect(() => {
    renderTargetA.texture.wrapS = THREE.RepeatWrapping
    renderTargetA.texture.wrapT = THREE.RepeatWrapping
    renderTargetB.texture.wrapS = THREE.RepeatWrapping
    renderTargetB.texture.wrapT = THREE.RepeatWrapping
  }, [renderTargetA, renderTargetB])

  // --- Scenes ---
  const { maskScene, maskCamera, brushMesh, simScene, simMesh } = useMemo(() => {
    // 1. Brush Scene
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0, 10)
    camera.position.set(0, 0, 1)
    camera.lookAt(0, 0, 0)

    // Brush Mesh
    // Larger brush size for better visibility with slower movements
    const geometry = new THREE.PlaneGeometry(0.15, 0.15)
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
          
          // Sharper, more particle-like cloud brush
          float cloud = smoothstep(0.4, 0.8, n1 * alpha);
          
          gl_FragColor = vec4(uColor, cloud * 1.0);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.frustumCulled = false // Prevent culling when wrapping around edges
    scene.add(mesh)

    // 2. Simulation Scene (Advection)
    const simScene = new THREE.Scene()
    const simGeo = new THREE.PlaneGeometry(2, 2) // Fullscreen clip space
    const simMat = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null }, // Previous frame
        time: { value: 0 },
        uDissipation: { value: 0.992 }, // Slower fade for longer-lasting clouds
        uCurlStrength: { value: 0.12 }, // Even stronger swirl/spreading
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
            
            // Desaturate the earth texture for a muted look
            float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
            vec3 desaturated = mix(vec3(gray), texColor.rgb, 0.4); // 60% saturation
            texColor.rgb = desaturated;
            
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

      if (!prevHoverRef.current) {
        prevHoverRef.current = true
        if (onHoverChange) onHoverChange(true)
      }

      if (intersect.uv) {
        const uv = intersect.uv

        // Draw clouds - more frequent for slower movements
        let shouldDraw = false
        const drawThreshold = isDragging ? 0.0005 : 0.001 // Lower threshold when dragging

        if (!prevUvRef.current) {
          shouldDraw = true
          prevUvRef.current = new THREE.Vector2(uv.x, uv.y)
        } else {
          const dist = prevUvRef.current.distanceTo(new THREE.Vector2(uv.x, uv.y))
          if (dist > drawThreshold) {
            shouldDraw = true
            prevUvRef.current.set(uv.x, uv.y)
          }
        }

        if (shouldDraw) {
          // Larger spray effect for slower movements
          const baseOffset = 0.025
          const velocityScale = Math.min(velocityRef.current * 0.5, 1.0)
          const offset = baseOffset * (1.5 - velocityScale) // Larger splat for slow movement

          // Draw multiple overlapping splatters for fuller coverage
          const numSplats = isDragging ? 3 : 2
          for (let i = 0; i < numSplats; i++) {
            const randomX = (Math.random() - 0.5) * offset
            const randomY = (Math.random() - 0.5) * offset

            brushMesh.position.set(uv.x + randomX, uv.y + randomY, 0)
            gl.render(maskScene, maskCamera)

            // Wrapping
            if (uv.x < 0.15) {
              brushMesh.position.set(uv.x + 1 + randomX, uv.y + randomY, 0)
              gl.render(maskScene, maskCamera)
            }
            if (uv.x > 0.85) {
              brushMesh.position.set(uv.x - 1 + randomX, uv.y + randomY, 0)
              gl.render(maskScene, maskCamera)
            }
          }
        }
      }
    } else {
      prevUvRef.current = null
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
      <mesh
        ref={meshRef}
        scale={1.04}
        material={shaderMaterial}
        onPointerDown={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'grabbing'
          if (onDragStart) onDragStart()
        }}
        onPointerUp={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'grab'
          if (onDragEnd) onDragEnd()
        }}
        onPointerEnter={() => {
          document.body.style.cursor = 'grab'
        }}
        onPointerLeave={(e) => {
          document.body.style.cursor = 'default'
          if (isDragging && onDragEnd) onDragEnd()
        }}
      >
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
