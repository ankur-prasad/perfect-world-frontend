# Perfect World E-Commerce Development Guide

## Project Overview

A stunning e-commerce website redesign featuring an innovative 3D interactive globe navigation system with charitable mission focus.

## Current Status

### ✅ Completed (Phase 1-2)

- **Project Setup**
  - ✅ Vite + React + TypeScript configuration
  - ✅ Tailwind CSS styling system
  - ✅ All required dependencies installed
  - ✅ Folder structure created

- **Core Infrastructure**
  - ✅ React Router setup with all routes
  - ✅ Context providers (Cart, Navigation)
  - ✅ TypeScript types for projects and Shopify
  - ✅ Project data structure with 6 charitable projects
  - ✅ Utility functions for animations and Shopify API

- **3D Globe System**
  - ✅ Globe component with procedural texture
  - ✅ Satellite markers positioned by lat/long
  - ✅ Thread connections from satellites to globe
  - ✅ Mouse parallax effect
  - ✅ Auto-rotation animation
  - ✅ Hover effects and labels
  - ✅ Starfield background
  - ✅ Click-to-navigate functionality

- **Pages**
  - ✅ Home page with 3D scene integration
  - ✅ Project pages with Mission/Shop toggle
  - ✅ About Us page
  - ✅ Transparency page
  - ✅ Shop page

- **Layout Components**
  - ✅ Header with back button and cart
  - ✅ Navigation (corner positioning with scroll animations)
  - ✅ Footer with links and newsletter
  - ✅ Responsive menu overlay

## Current Development Server

The app is running at: **http://localhost:5173/**

## What's Working

1. **Interactive 3D Globe**
   - Rotating Earth with procedural texture
   - 6 satellite markers representing projects
   - Mouse parallax for interactive feel
   - Click satellites to navigate to project pages

2. **Full Page Navigation**
   - All routes configured and working
   - Smooth transitions between pages
   - Context-based state management

3. **Responsive Layout**
   - Header, navigation, and footer components
   - Mobile-friendly menu system

## Next Steps (Phase 3-4)

### Immediate Priorities

1. **Enhanced 3D Visuals**
   - [ ] Add real Earth texture (download high-res texture and add to `/public/assets/textures/`)
   - [ ] Improve globe shader with normal and specular maps
   - [ ] Add cloud layer
   - [ ] Better atmosphere glow effect

2. **Scroll Animations**
   - [ ] Implement GSAP scroll-triggered logo shrink/move animation
   - [ ] Smooth navigation repositioning on scroll
   - [ ] Parallax scroll effects for content sections

3. **Zoom Transitions**
   - [ ] Implement cinematic zoom animation from globe to project page
   - [ ] Reverse zoom animation when returning home
   - [ ] Camera position interpolation
   - [ ] Fade out satellites during transition

4. **Project Page Enhancements**
   - [ ] Build project carousel for navigating between projects
   - [ ] Add real project images
   - [ ] Smooth Mission/Shop toggle animations

5. **Shopify Integration**
   - [ ] Set up Shopify store and get API credentials
   - [ ] Create collections for each project
   - [ ] Build ProductCard component
   - [ ] Build Cart drawer component
   - [ ] Implement add-to-cart functionality
   - [ ] Connect checkout flow

6. **Polish & Optimization**
   - [ ] Add loading states
   - [ ] Optimize 3D performance
   - [ ] Add error boundaries
   - [ ] Improve mobile experience
   - [ ] Add FAQ accordion
   - [ ] Content refinement

## How to Continue Development

### 1. Start the Dev Server
```bash
npm run dev
```
Visit http://localhost:5173/

### 2. Project Structure
```
src/
├── components/
│   ├── 3D/              # Three.js components
│   │   ├── Globe.tsx    # Main globe
│   │   ├── Satellite.tsx # Project markers
│   │   ├── Stars.tsx    # Background
│   │   └── Scene.tsx    # Main 3D scene
│   └── Layout/          # UI components
│       ├── Header.tsx
│       ├── Navigation.tsx
│       └── Footer.tsx
├── pages/               # Route pages
├── contexts/            # React contexts
├── utils/               # Helper functions
├── data/                # Project data
└── types/               # TypeScript types
```

### 3. Adding Earth Textures

To get a realistic Earth:

1. Download high-resolution Earth textures:
   - Color map (diffuse): 4K-8K resolution
   - Normal map (for surface detail)
   - Specular map (for ocean reflections)
   - Sources: NASA Visible Earth, textures.com, or polyhaven.com

2. Add to `/public/assets/textures/`:
   ```
   public/
   └── assets/
       └── textures/
           ├── earth_color.jpg
           ├── earth_normal.jpg
           └── earth_specular.jpg
   ```

3. Update Globe.tsx to load textures:
   ```typescript
   const colorMap = useLoader(TextureLoader, '/assets/textures/earth_color.jpg')
   const normalMap = useLoader(TextureLoader, '/assets/textures/earth_normal.jpg')
   const specularMap = useLoader(TextureLoader, '/assets/textures/earth_specular.jpg')
   ```

### 4. Setting up Shopify

1. Create a Shopify store (if not already created)
2. Get Storefront API access token:
   - Shopify Admin → Apps → Develop apps
   - Create custom app with Storefront API access
   - Copy the Storefront Access Token

3. Create `.env` file (copy from `.env.example`):
   ```bash
   VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   VITE_SHOPIFY_STOREFRONT_TOKEN=your-token-here
   ```

4. Create 6 collections matching project slugs:
   - `secore-international`
   - `care-in-action`
   - `mental-health-initiative`
   - `plant-for-the-planet`
   - `water-pollution`
   - `elephant-endangerment`

### 5. Implementing Scroll Animations

Use GSAP ScrollTrigger in Home.tsx:
```typescript
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// In component:
useEffect(() => {
  gsap.to('.logo', {
    scrollTrigger: {
      start: 'top top',
      end: 'top -100px',
      scrub: true,
    },
    scale: 0.6,
    y: -50,
  })
}, [])
```

## Design Specifications Reference

All design specs are in `/Users/ankur/Downloads/perfect-world-design-spec_2.md`

Key specs:
- Globe rotation: 60 seconds per full rotation
- Zoom animation: 2000ms duration
- Parallax strength: 0.02
- Satellite hover scale: 1.1
- Logo scroll threshold: 100px

## Technologies Used

- **Frontend**: React 19.2, TypeScript 5.9
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **Animation**: Framer Motion, GSAP
- **Styling**: Tailwind CSS 4
- **Routing**: React Router v7
- **State**: Zustand, Context API
- **E-commerce**: Shopify Storefront API
- **Build**: Vite 7

## Performance Targets

- First Contentful Paint: < 1.8s
- Largest Contentful Paint: < 2.5s
- 60 FPS animations
- Initial bundle: < 200KB (gzipped)

## Development Tips

1. **3D Performance**: Monitor FPS in dev tools. Reduce poly count on mobile.
2. **Hot Reload**: Vite provides instant hot module replacement
3. **Type Safety**: Let TypeScript guide you - check for type errors
4. **Component Testing**: Test components individually before integration
5. **Browser DevTools**: Use React DevTools and Three.js inspector

## Common Issues & Solutions

### 3D Scene Not Rendering
- Check browser console for WebGL errors
- Ensure Canvas component is properly wrapped
- Verify camera position and scene lighting

### Slow Performance
- Reduce star count for mobile
- Lower globe segment count
- Disable shadows on low-end devices
- Use texture compression

### Shopify API Errors
- Verify .env credentials
- Check CORS settings in Shopify admin
- Ensure Storefront API is enabled
- Verify collection handles match exactly

## Testing Checklist

- [ ] Globe renders and rotates
- [ ] Satellites are clickable
- [ ] Navigation between pages works
- [ ] Responsive on mobile (test 375px width)
- [ ] Cart functionality (when implemented)
- [ ] All links work
- [ ] Performance is 60fps

## Deployment Preparation

When ready to deploy:

1. Build for production: `npm run build`
2. Test build: `npm run preview`
3. Deploy to Vercel/Netlify/other host
4. Set environment variables in hosting platform
5. Test on production URL

## Questions or Issues?

Refer to:
- Design spec: `/Users/ankur/Downloads/perfect-world-design-spec_2.md`
- Three.js docs: https://threejs.org/docs/
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber
- Shopify Storefront API: https://shopify.dev/api/storefront

---

**Current Phase**: Foundation & 3D Implementation Complete ✅
**Next Phase**: Enhanced Animations & Shopify Integration
**Timeline**: Following 14-week development plan from design spec
