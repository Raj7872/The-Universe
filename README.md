# 🌌 Our Universe — Cinematic Birthday Experience

A fully cinematic, emotional, scroll-driven 3D birthday universe built with Next.js 15, React Three Fiber, GSAP, and Framer Motion.

## ✨ Features

- **Cinematic camera** — organic floating drift with inertia, parallax mouse influence, fov shifts
- **5 unique planets** — each with memories, atmosphere shaders, orbit particles, planet glow
- **Animated constellations** — progressively drawn heart and name shapes between scenes
- **Chapter narrative system** — story beats revealed through scroll
- **Memory modal** — multi-message cycling, glassmorphism overlay, elegant typography
- **Shooting stars** — randomly spawned with trail particles
- **Animated nebulae** — breathing, rotating volumetric cloud layers
- **Space dust** — drifting fine particles with sine-wave motion
- **Ambient audio** — rich drone with LFO breathing, reverb convolver, scroll-reactive volume
- **Fireworks finale** — gold particle burst system in final birthday scene
- **Easter egg stars** — 3 clickable hidden secrets in the universe
- **Custom cursor** — ring + dot with planet hover expansion
- **Smooth scroll** — Lenis with exponential easing
- **Mouse parallax** — multi-layer star field reacts to cursor position
- **Cinematic loader** — cycling phrases, gold progress bar, fading star accents
- **Progress navigation** — dots linking to scene sections
- **Fully responsive** — mobile cursor fallback, coarse pointer detection

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Structure

```
src/
├── app/
│   ├── layout.tsx         — Root layout, fonts, metadata
│   ├── page.tsx           — Main page, hook composition
│   └── globals.css        — Global styles, grain, vignette
├── components/
│   ├── scene/             — Three.js scene components
│   │   ├── UniverseScene.tsx   — Canvas + lights + fog
│   │   ├── CameraController.tsx — Cinematic camera system
│   │   ├── StarField.tsx       — Multi-layer shader stars
│   │   ├── ShootingStars.tsx   — Dynamic shooting stars
│   │   ├── Nebulae.tsx         — Animated nebula clouds
│   │   └── EasterEggStars.tsx  — Clickable hidden stars
│   ├── planets/
│   │   └── Planet.tsx          — Full planet with atmosphere
│   ├── constellation/
│   │   └── ConstellationOverlay.tsx — Canvas constellation animator
│   ├── modals/
│   │   └── MemoryModal.tsx     — Glassmorphism memory reveal
│   ├── overlays/
│   │   ├── OpeningOverlay.tsx  — Title hero
│   │   ├── ChapterLabels.tsx   — Story chapter reveals
│   │   ├── PlanetLabel.tsx     — Planet hover tooltip
│   │   └── FinalScene.tsx      — Birthday finale + fireworks
│   └── ui/
│       ├── CustomCursor.tsx    — Ring/dot cursor
│       ├── Loader.tsx          — Loading screen
│       └── UIChrome.tsx        — Nav dots, audio, hints, toasts
├── data/
│   └── planets.ts         — All planet, camera, chapter data
├── hooks/
│   ├── useLenis.ts         — Smooth scroll
│   ├── useAmbientAudio.ts  — WebAudio drone with reverb
│   └── useMouseParallax.ts — Global mouse tracking
├── lib/
│   ├── store.ts            — Zustand global state
│   └── camera.ts           — Path interpolation utilities
└── types/
    └── index.ts            — All TypeScript types
```

## 🎨 Customization

Edit `src/data/planets.ts` to:
- Change planet names, colors, and messages
- Adjust camera path waypoints
- Modify chapter titles and trigger points
- Add more easter eggs
- Change constellation patterns

## 🎛️ Performance

- Mobile: coarse pointer detection disables custom cursor
- Star count scales with device; adjust `count` in `UniverseScene.tsx`
- DPR capped at 2 for retina without performance cost
- `useFrame` with smoothed ref values avoids React re-renders


## Updated experience

- Light mode defaults to 1,320 stars, pixel ratio 1, simpler spheres, and no nebula/firework layers. Disable it in Your universe for richer effects, capped at pixel ratio 1.5.
- Stable star buffers avoid rebuilding during mouse movement. Native scrolling removes a continuous animation loop. The 3D renderer pauses behind memory dialogs and in hidden tabs.
- Your universe provides keyboard and touch access to every memory and tracks opened planets during this visit.
- Reading mode releases the 3D scene; reduced-motion preferences and scene errors select it automatically. It is also available from the loader.
- Notes have previous/next controls, Escape dismissal, focus containment/restoration and mobile scrolling. Optional photoUrl and voiceNote fields in src/data/planets.ts now render in the dialog; put media in public and use paths such as /birthday-photo.jpg.
- The finale has a symbolic wish button and replay; no wish data is collected.

Personalize src/data/planets.ts before sharing: some original notes still contain general project-themed prose. Real memories and a personal signature in FinalScene.tsx will make the gift more meaningful.

Validation: npm run type-check and npm run build. The existing next/font/google setup requires Google Fonts access during builds. Compare browser memory in a production build at the same viewport and pixel ratio; these configured reductions are not measured memory savings.
