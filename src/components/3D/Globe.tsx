import { useMemo, useRef } from 'react'
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

export default function Globe({ onHoverChange, onDragStart, onDragEnd }: GlobeProps) {
  const mobile = isMobile()
  const segments = mobile ? SCENE.GLOBE_MOBILE_SEGMENTS : SCENE.GLOBE_SEGMENTS
  const meshRef = useRef<THREE.Mesh>(null)
  const { camera, raycaster, pointer, gl } = useThree()
  const prevHoverRef = useRef(false)

  // Track pointer movement for velocity
  const prevPointer = useRef(new THREE.Vector2(0, 0))
  const pointerDelta = useRef(new THREE.Vector2(0, 0))

  // Load Earth texture
  const colorMap = useMemo(() => {
    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load('/assets/textures/earth.jpg')
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    return texture
  }, [])

  // Fluid simulation buffers - ping-pong for velocity and dye
  const simResolution = 512
  const dyeResolution = 512

  const velocityFBO1 = useFBO(simResolution, simResolution / 2, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.HalfFloatType,
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping,
  })

  const velocityFBO2 = useFBO(simResolution, simResolution / 2, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.HalfFloatType,
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping,
  })

  const dyeFBO1 = useFBO(dyeResolution, dyeResolution / 2, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.HalfFloatType,
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping,
  })

  const dyeFBO2 = useFBO(dyeResolution, dyeResolution / 2, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.HalfFloatType,
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping,
  })

  const divergenceFBO = useFBO(simResolution, simResolution / 2, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.HalfFloatType,
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping,
  })

  const curlFBO = useFBO(simResolution, simResolution / 2, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.HalfFloatType,
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping,
  })

  const pressureFBO1 = useFBO(simResolution, simResolution / 2, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.HalfFloatType,
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping,
  })

  const pressureFBO2 = useFBO(simResolution, simResolution / 2, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.HalfFloatType,
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping,
  })

  // Refs for ping-pong
  const velocityBuffers = useRef({ read: velocityFBO1, write: velocityFBO2 })
  const dyeBuffers = useRef({ read: dyeFBO1, write: dyeFBO2 })
  const pressureBuffers = useRef({ read: pressureFBO1, write: pressureFBO2 })

  const swap = (buffers: { read: any; write: any }) => {
    const temp = buffers.read
    buffers.read = buffers.write
    buffers.write = temp
  }

  // Fullscreen quad for shader passes
  const quadGeometry = useMemo(() => new THREE.PlaneGeometry(2, 2), [])

  // SHADER MATERIALS
  const shaders = useMemo(() => {
    const baseVertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `

    // Curl shader
    const curlMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uVelocity: { value: null },
        texelSize: { value: new THREE.Vector2(1.0 / simResolution, 2.0 / simResolution) },
      },
      vertexShader: baseVertexShader,
      fragmentShader: `
        uniform sampler2D uVelocity;
        uniform vec2 texelSize;
        varying vec2 vUv;

        void main() {
          float L = texture2D(uVelocity, vUv - vec2(texelSize.x, 0.0)).y;
          float R = texture2D(uVelocity, vUv + vec2(texelSize.x, 0.0)).y;
          float T = texture2D(uVelocity, vUv + vec2(0.0, texelSize.y)).x;
          float B = texture2D(uVelocity, vUv - vec2(0.0, texelSize.y)).x;

          float vorticity = R - L - T + B;
          gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
        }
      `,
    })

    // Vorticity (apply curl force)
    const vorticityMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uVelocity: { value: null },
        uCurl: { value: null },
        curl: { value: 30.0 },
        texelSize: { value: new THREE.Vector2(1.0 / simResolution, 2.0 / simResolution) },
        dt: { value: 0.016 },
      },
      vertexShader: baseVertexShader,
      fragmentShader: `
        uniform sampler2D uVelocity;
        uniform sampler2D uCurl;
        uniform float curl;
        uniform vec2 texelSize;
        uniform float dt;
        varying vec2 vUv;

        void main() {
          float L = texture2D(uCurl, vUv - vec2(texelSize.x, 0.0)).x;
          float R = texture2D(uCurl, vUv + vec2(texelSize.x, 0.0)).x;
          float T = texture2D(uCurl, vUv + vec2(0.0, texelSize.y)).x;
          float B = texture2D(uCurl, vUv - vec2(0.0, texelSize.y)).x;
          float C = texture2D(uCurl, vUv).x;

          vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
          force /= length(force) + 0.0001;
          force *= curl * C;
          force.y *= -1.0;

          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity += force * dt;
          velocity = min(max(velocity, -1000.0), 1000.0);

          gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `,
    })

    // Divergence
    const divergenceMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uVelocity: { value: null },
        texelSize: { value: new THREE.Vector2(1.0 / simResolution, 2.0 / simResolution) },
      },
      vertexShader: baseVertexShader,
      fragmentShader: `
        uniform sampler2D uVelocity;
        uniform vec2 texelSize;
        varying vec2 vUv;

        void main() {
          float L = texture2D(uVelocity, vUv - vec2(texelSize.x, 0.0)).x;
          float R = texture2D(uVelocity, vUv + vec2(texelSize.x, 0.0)).x;
          float T = texture2D(uVelocity, vUv + vec2(0.0, texelSize.y)).y;
          float B = texture2D(uVelocity, vUv - vec2(0.0, texelSize.y)).y;

          float div = 0.5 * (R - L + T - B);
          gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
        }
      `,
    })

    // Pressure (Jacobi iteration)
    const pressureMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPressure: { value: null },
        uDivergence: { value: null },
        texelSize: { value: new THREE.Vector2(1.0 / simResolution, 2.0 / simResolution) },
      },
      vertexShader: baseVertexShader,
      fragmentShader: `
        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;
        uniform vec2 texelSize;
        varying vec2 vUv;

        void main() {
          float L = texture2D(uPressure, vUv - vec2(texelSize.x, 0.0)).x;
          float R = texture2D(uPressure, vUv + vec2(texelSize.x, 0.0)).x;
          float T = texture2D(uPressure, vUv + vec2(0.0, texelSize.y)).x;
          float B = texture2D(uPressure, vUv - vec2(0.0, texelSize.y)).x;
          float C = texture2D(uDivergence, vUv).x;

          float pressure = (L + R + T + B - C) * 0.25;
          gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
        }
      `,
    })

    // Gradient subtraction
    const gradientSubtractMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPressure: { value: null },
        uVelocity: { value: null },
        texelSize: { value: new THREE.Vector2(1.0 / simResolution, 2.0 / simResolution) },
      },
      vertexShader: baseVertexShader,
      fragmentShader: `
        uniform sampler2D uPressure;
        uniform sampler2D uVelocity;
        uniform vec2 texelSize;
        varying vec2 vUv;

        void main() {
          float L = texture2D(uPressure, vUv - vec2(texelSize.x, 0.0)).x;
          float R = texture2D(uPressure, vUv + vec2(texelSize.x, 0.0)).x;
          float T = texture2D(uPressure, vUv + vec2(0.0, texelSize.y)).x;
          float B = texture2D(uPressure, vUv - vec2(0.0, texelSize.y)).x;

          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity.xy -= vec2(R - L, T - B);

          gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `,
    })

    // Advection
    const advectionMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uVelocity: { value: null },
        uSource: { value: null },
        texelSize: { value: new THREE.Vector2(1.0 / simResolution, 2.0 / simResolution) },
        dt: { value: 0.016 },
        dissipation: { value: 0.98 },
      },
      vertexShader: baseVertexShader,
      fragmentShader: `
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize;
        uniform float dt;
        uniform float dissipation;
        varying vec2 vUv;

        void main() {
          vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
          vec4 result = dissipation * texture2D(uSource, coord);
          gl_FragColor = result;
        }
      `,
    })

    // Splat (inject velocity and dye)
    const splatMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTarget: { value: null },
        aspectRatio: { value: 1.0 },
        point: { value: new THREE.Vector2() },
        color: { value: new THREE.Vector3(1.0, 0.4, 0.2) },
        radius: { value: 0.002 },
        force: { value: 0.0 },
      },
      vertexShader: baseVertexShader,
      fragmentShader: `
        uniform sampler2D uTarget;
        uniform float aspectRatio;
        uniform vec2 point;
        uniform vec3 color;
        uniform float radius;
        uniform float force;
        varying vec2 vUv;

        void main() {
          vec2 p = vUv - point;
          p.x *= aspectRatio;
          vec3 splat = exp(-dot(p, p) / radius) * color;
          vec3 base = texture2D(uTarget, vUv).xyz;
          gl_FragColor = vec4(base + splat * force, 1.0);
        }
      `,
    })

    return {
      curl: curlMaterial,
      vorticity: vorticityMaterial,
      divergence: divergenceMaterial,
      pressure: pressureMaterial,
      gradientSubtract: gradientSubtractMaterial,
      advection: advectionMaterial,
      splat: splatMaterial,
    }
  }, [simResolution])

  const quadMesh = useMemo(() => new THREE.Mesh(quadGeometry, shaders.curl), [quadGeometry, shaders])
  const simScene = useMemo(() => {
    const scene = new THREE.Scene()
    scene.add(quadMesh)
    return scene
  }, [quadMesh])

  const simCamera = useMemo(() => {
    const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    return cam
  }, [])

  // Globe shader material
  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          colorMap: { value: colorMap },
          dyeTexture: { value: dyeFBO1.texture },
          time: { value: 0 },
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
          uniform sampler2D dyeTexture;
          uniform float time;
          uniform vec3 uRimColor;

          varying vec2 vUv;
          varying vec3 vNormal;

          void main() {
            vec4 texColor = texture2D(colorMap, vUv);

            // Desaturate earth
            float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
            vec3 desaturated = mix(vec3(gray), texColor.rgb, 0.4);
            texColor.rgb = desaturated;

            // Sample fluid dye
            vec4 dye = texture2D(dyeTexture, vUv);

            // Blend dye with earth
            vec3 finalColor = mix(texColor.rgb, dye.rgb, dye.a * 0.7);

            // Rim light
            float rim = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
            rim = pow(rim, 3.0);
            vec3 redGlow = uRimColor * rim * 1.5;

            finalColor += redGlow;

            gl_FragColor = vec4(finalColor, 1.0);
          }
        `,
      }),
    [colorMap, dyeFBO1.texture]
  )

  const prevUvRef = useRef<THREE.Vector2 | null>(null)

  // Fluid simulation update
  useFrame((state, delta) => {
    if (!meshRef.current) return

    const time = state.clock.getElapsedTime()
    shaderMaterial.uniforms.time.value = time

    // Update pointer delta
    const currentPointer = new THREE.Vector2(pointer.x, pointer.y)
    pointerDelta.current.copy(currentPointer).sub(prevPointer.current)
    prevPointer.current.copy(currentPointer)

    // Raycasting
    raycaster.setFromCamera(pointer, camera)
    const intersects = raycaster.intersectObject(meshRef.current)
    const isHovered = intersects.length > 0

    if (isHovered) {
      if (!prevHoverRef.current) {
        prevHoverRef.current = true
        if (onHoverChange) onHoverChange(true)
      }

      const intersect = intersects[0]
      if (intersect.uv) {
        const uv = intersect.uv
        const force = pointerDelta.current.length() * 50.0

        // Only splat if moving
        if (force > 0.01) {
          // Splat velocity
          quadMesh.material = shaders.splat
          shaders.splat.uniforms.uTarget.value = velocityBuffers.current.read.texture
          shaders.splat.uniforms.aspectRatio.value = 2.0
          shaders.splat.uniforms.point.value.set(uv.x, uv.y)
          shaders.splat.uniforms.color.value.set(pointerDelta.current.x * 100.0, pointerDelta.current.y * 100.0, 0.0)
          shaders.splat.uniforms.radius.value = 0.0008
          shaders.splat.uniforms.force.value = force

          gl.setRenderTarget(velocityBuffers.current.write)
          gl.render(simScene, simCamera)
          swap(velocityBuffers.current)

          // Splat dye
          shaders.splat.uniforms.uTarget.value = dyeBuffers.current.read.texture
          shaders.splat.uniforms.color.value.set(0.96, 0.64, 0.38) // Orange/red
          shaders.splat.uniforms.radius.value = 0.001
          shaders.splat.uniforms.force.value = 1.0

          gl.setRenderTarget(dyeBuffers.current.write)
          gl.render(simScene, simCamera)
          swap(dyeBuffers.current)
        }
      }
    } else {
      if (prevHoverRef.current) {
        prevHoverRef.current = false
        if (onHoverChange) onHoverChange(false)
        prevUvRef.current = null
      }
    }

    // Fluid simulation steps
    const dt = Math.min(delta, 0.016)

    // 1. Curl
    quadMesh.material = shaders.curl
    shaders.curl.uniforms.uVelocity.value = velocityBuffers.current.read.texture
    gl.setRenderTarget(curlFBO)
    gl.render(simScene, simCamera)

    // 2. Vorticity
    quadMesh.material = shaders.vorticity
    shaders.vorticity.uniforms.uVelocity.value = velocityBuffers.current.read.texture
    shaders.vorticity.uniforms.uCurl.value = curlFBO.texture
    shaders.vorticity.uniforms.dt.value = dt
    gl.setRenderTarget(velocityBuffers.current.write)
    gl.render(simScene, simCamera)
    swap(velocityBuffers.current)

    // 3. Divergence
    quadMesh.material = shaders.divergence
    shaders.divergence.uniforms.uVelocity.value = velocityBuffers.current.read.texture
    gl.setRenderTarget(divergenceFBO)
    gl.render(simScene, simCamera)

    // 4. Pressure (iterations)
    quadMesh.material = shaders.pressure
    shaders.pressure.uniforms.uDivergence.value = divergenceFBO.texture
    for (let i = 0; i < 20; i++) {
      shaders.pressure.uniforms.uPressure.value = pressureBuffers.current.read.texture
      gl.setRenderTarget(pressureBuffers.current.write)
      gl.render(simScene, simCamera)
      swap(pressureBuffers.current)
    }

    // 5. Gradient subtraction
    quadMesh.material = shaders.gradientSubtract
    shaders.gradientSubtract.uniforms.uPressure.value = pressureBuffers.current.read.texture
    shaders.gradientSubtract.uniforms.uVelocity.value = velocityBuffers.current.read.texture
    gl.setRenderTarget(velocityBuffers.current.write)
    gl.render(simScene, simCamera)
    swap(velocityBuffers.current)

    // 6. Advection - Velocity
    quadMesh.material = shaders.advection
    shaders.advection.uniforms.uVelocity.value = velocityBuffers.current.read.texture
    shaders.advection.uniforms.uSource.value = velocityBuffers.current.read.texture
    shaders.advection.uniforms.dt.value = dt
    shaders.advection.uniforms.dissipation.value = 0.98
    shaders.advection.uniforms.texelSize.value.set(1.0 / simResolution, 2.0 / simResolution)
    gl.setRenderTarget(velocityBuffers.current.write)
    gl.render(simScene, simCamera)
    swap(velocityBuffers.current)

    // 7. Advection - Dye
    shaders.advection.uniforms.uVelocity.value = velocityBuffers.current.read.texture
    shaders.advection.uniforms.uSource.value = dyeBuffers.current.read.texture
    shaders.advection.uniforms.dissipation.value = 0.97
    shaders.advection.uniforms.texelSize.value.set(1.0 / dyeResolution, 2.0 / dyeResolution)
    gl.setRenderTarget(dyeBuffers.current.write)
    gl.render(simScene, simCamera)
    swap(dyeBuffers.current)

    // Update globe material
    shaderMaterial.uniforms.dyeTexture.value = dyeBuffers.current.read.texture

    gl.setRenderTarget(null)
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
