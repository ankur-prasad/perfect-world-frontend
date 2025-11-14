// Convert lat/lon to 3D coordinates on a sphere
export function latLonToVector3(lat: number, lon: number, radius: number = 1) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)

  return {
    x: -(radius * Math.sin(phi) * Math.cos(theta)),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta),
  }
}

// Calculate rotation needed to position a location at front-center
export function calculateRotationFromLatLon(lat: number, lon: number) {
  return {
    x: (lat * Math.PI) / 180,
    y: (-lon * Math.PI) / 180,
  }
}

// Smooth interpolation (lerp)
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

// Cubic bezier easing function
export function cubicBezier(t: number): number {
  // cubic-bezier(0.4, 0, 0.2, 1)
  const c1 = 0.4
  const c3 = 0.2
  const c4 = 1.0

  const t2 = t * t
  const t3 = t2 * t

  return (
    3 * (1 - t) * (1 - t) * t * c1 +
    3 * (1 - t) * t2 * c3 +
    t3 * c4
  )
}

// Ease out function
export function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

// Ease in-out function
export function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// Check if device is mobile
export function isMobile(): boolean {
  return window.innerWidth <= 768
}

// Get appropriate scene quality based on device
export function getSceneQuality() {
  const mobile = isMobile()
  return {
    globeSegments: mobile ? 32 : 64,
    starCount: mobile ? 1500 : 3000,
    shadowsEnabled: !mobile,
    antialias: !mobile,
  }
}

// Throttle function for performance
export function throttle<T extends (...args: never[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let lastExecTime = 0

  return function (this: unknown, ...args: Parameters<T>) {
    const currentTime = Date.now()

    if (currentTime - lastExecTime < delay) {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        lastExecTime = currentTime
        func.apply(this, args)
      }, delay)
    } else {
      lastExecTime = currentTime
      func.apply(this, args)
    }
  }
}

// Debounce function
export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function (this: unknown, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
