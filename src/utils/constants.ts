// Animation constants
export const ANIMATION = {
  GLOBE_ROTATION_SPEED: 0.00025, // radians per frame (reduced by 75% from original)
  GLOBE_ROTATION_DURATION: 60000, // 60 seconds per full rotation
  STARS_ROTATION_DURATION: 90000, // 90 seconds per full rotation
  PARALLAX_STRENGTH: 0.02,
  PARALLAX_RANGE: 5, // degrees
  PARALLAX_RESPONSE_TIME: 0.3, // seconds

  ZOOM_DURATION: 2000, // milliseconds
  ZOOM_EASING: 'cubic-bezier(0.4, 0, 0.2, 1)',

  RETURN_DURATION: 1500, // milliseconds

  LOGO_SCROLL_THRESHOLD: 100, // pixels
  LOGO_ANIMATION_DURATION: 600, // milliseconds

  PAGE_TRANSITION_DURATION: 400, // milliseconds

  HOVER_SCALE: 1.1,
  HOVER_DURATION: 200, // milliseconds

  SATELLITE_HOVER_SCALE: 1.1,
}

// 3D Scene constants
export const SCENE = {
  CAMERA_POSITION: { x: 0, y: 0.6, z: 5 },
  CAMERA_ZOOM_POSITION: { x: 0, y: 0.6, z: 2 },
  GLOBE_SEGMENTS: 64, // For desktop, reduce for mobile
  GLOBE_MOBILE_SEGMENTS: 32,
  STAR_COUNT: 1875,
  STAR_COUNT_MOBILE: 1000,
}

// Spacing system (8px base unit)
export const SPACING = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
  '4xl': '6rem', // 96px
  '5xl': '8rem', // 128px
}

// Breakpoints
export const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
  desktop: 1440,
}

// Performance targets
export const PERFORMANCE = {
  TARGET_FPS: 60,
  MAX_BUNDLE_SIZE: 200, // KB (gzipped)
  MAX_TOTAL_JS: 800, // KB (with code splitting)
}

// Shopify configuration (to be set in .env)
export const SHOPIFY = {
  STOREFRONT_API_TOKEN: import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
  STORE_DOMAIN: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || '',
  STOREFRONT_API_VERSION: '2024-01', // Using 2024-01 which was working in commit ff26413
  CUSTOMER_ACCOUNT_API: {
    CLIENT_ID: import.meta.env.VITE_SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID || '',
    URL: import.meta.env.VITE_SHOPIFY_CUSTOMER_ACCOUNT_API_URL || 'https://shopify.com/authentication/86211101009',
    get AUTH_URL() { return `${this.URL}/oauth/authorize` },
    get TOKEN_URL() { return `${this.URL}/oauth/token` },
    get LOGOUT_URL() { return `${this.URL}/logout` },
  }
}

