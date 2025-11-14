# Perfect World - Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Start the Development Server
```bash
npm run dev
```
Open http://localhost:5173/ in your browser

### 2. What You'll See

**Home Page** - Interactive 3D globe with 6 satellites
- Click any satellite to navigate to that project's page
- Mouse movement creates parallax effect
- Globe auto-rotates smoothly

**Project Pages** - Detailed information about each cause
- Toggle between Mission and Shop views
- Learn about the charity partner
- See impact metrics

**About/Transparency/Shop** - Additional pages with content

## 🎨 Current Features

### ✅ Working Now
- Interactive 3D globe with realistic rendering
- 6 satellite markers (clickable)
- Smooth mouse parallax effect
- Auto-rotating globe with starfield background
- Full page navigation (Home, Projects, About, Transparency, Shop)
- Responsive layout
- Cart context (ready for Shopify integration)

### 🔧 To Be Implemented
- Real Earth textures (high-res images needed)
- Cinematic zoom transitions
- Scroll-triggered animations
- Shopify product integration
- Project carousel
- Cart drawer functionality

## 📁 Key Files to Know

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main app with routing |
| `src/pages/Home.tsx` | Landing page with 3D scene |
| `src/components/3D/Scene.tsx` | Main 3D scene setup |
| `src/components/3D/Globe.tsx` | Earth globe component |
| `src/components/3D/Satellite.tsx` | Project markers |
| `src/data/projects.ts` | All project data (edit here!) |
| `src/utils/constants.ts` | Configuration values |

## 🎯 Next Development Steps

1. **Add Real Textures**
   - Download Earth texture from NASA/Polyhaven
   - Place in `public/assets/textures/`
   - Update Globe.tsx to load texture

2. **Setup Shopify**
   - Create `.env` file from `.env.example`
   - Add your Shopify credentials
   - Create 6 collections matching project slugs

3. **Add Animations**
   - Implement zoom transitions with GSAP
   - Add scroll-triggered logo animations
   - Build project carousel

## 🐛 Troubleshooting

**Globe not showing?**
- Check browser console for WebGL errors
- Try refreshing the page
- Make sure you're using a modern browser

**Performance issues?**
- Reduce star count in `utils/constants.ts`
- Lower globe segments for mobile devices
- Check system GPU acceleration is enabled

**Type errors?**
- Run `npm run build` to see all type errors
- TypeScript will help you catch issues early

## 📚 Learn More

- Design Spec: See `perfect-world-design-spec_2.md`
- Development Guide: See `DEVELOPMENT.md`
- Three.js Docs: https://threejs.org/
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber

## 💡 Pro Tips

1. **Use React DevTools** - Install the browser extension to inspect component state
2. **Check Performance** - Open DevTools Performance tab and record while interacting
3. **Mobile Testing** - Use DevTools device mode to test responsive design
4. **Hot Reload** - Save files and see changes instantly (Vite magic!)

## 🎉 What's Awesome About This Build

- **Modern Stack**: React 19, TypeScript, Vite 7
- **Stunning 3D**: Three.js with React Three Fiber
- **Smooth Animations**: Framer Motion + GSAP
- **Type Safe**: Full TypeScript coverage
- **Fast**: Vite provides instant feedback
- **Scalable**: Well-organized component structure

---

**Need help?** Check DEVELOPMENT.md for detailed guidance!
