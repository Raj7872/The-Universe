# 🌌 Our Universe — Cinematic Birthday Experience

A fully cinematic, emotional, scroll-driven 3D birthday universe built with Next.js 15, React Three Fiber, and Framer Motion.

## ✨ Features

- **Cinematic camera** — organic floating drift with inertia, parallax mouse influence, fov shifts
- **5 unique planets** — each with memories, atmosphere shaders, orbit particles, planet glow
- **Animated constellations** — progressively drawn heart and name shapes between scenes
- **Chapter narrative system** — story beats revealed through scroll
- **Memory modal** — multi-message cycling, glassmorphism overlay, elegant typography, optional photo/voice-note per planet
- **Shooting stars** — randomly spawned with trail particles
- **Animated nebulae** — breathing, rotating volumetric cloud layers
- **Space dust** — drifting fine particles with sine-wave motion
- **Ambient audio** — rich drone with LFO breathing, reverb convolver, scroll-reactive volume
- **Fireworks finale** — gold particle burst system with a birthday wish button
- **Easter egg stars** — 3 clickable hidden secrets in the universe
- **Journey navigation** — jump straight to any memory, toggle reading/lite mode
- **Smooth scroll** — Lenis with exponential easing
- **Mouse parallax** — multi-layer star field reacts to cursor position
- **Cinematic loader** — cycling phrases, gold progress bar, fading star accents
- **Progress navigation** — dots linking to scene sections
- **Accessible by default** — keyboard/focus-trapped modal, ARIA roles, reduced-motion support, error boundary fallback to a lightweight reading mode

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
│   │   ├── EasterEggStars.tsx  — Clickable hidden stars
│   │   └── SceneBoundary.tsx   — Error boundary, falls back to reading mode
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
│       ├── Loader.tsx          — Loading screen
│       ├── JourneyTools.tsx    — Jump-to-memory nav, reading/lite mode toggles
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

- **Lite mode** (default on) caps the scene to ~1,320 stars, pixel ratio 1, simpler planet spheres, and drops the nebula/firework layers; toggle it off from the journey nav for the full effect (pixel ratio capped at 1.5).
- Star buffers are stable across mouse movement so they never rebuild; the 3D renderer pauses when a memory modal is open or the tab is hidden.
- `useFrame` with smoothed ref values avoids React re-renders.
- **Reading mode** drops the 3D scene entirely in favor of a static gradient background — enabled automatically on `prefers-reduced-motion` or if the scene throws (via `SceneBoundary`), or manually from the loader/journey nav.

## ♿ Accessibility

- Memory modal: focus trap, Escape to close, `role="dialog"`/ARIA labeling, restores focus on close
- Keyboard and touch access to every memory via the journey nav (`JourneyTools.tsx`), independent of scroll position
- Respects `prefers-reduced-motion` — disables animation and switches to reading mode automatically

## 🎨 Personalizing

`src/data/planets.ts` currently ships with generic placeholder copy. Before using this as a real gift, edit that file to:
- Replace the planet titles/messages with real memories
- Set `photoUrl` / `voiceNote` per planet (optional) — drop media in `public/` and reference it as `/your-file.jpg`
- Add a personal signature line in `FinalScene.tsx`

## ✅ Validation

```bash
npm run type-check
npm run build
```

Requires network access to Google Fonts at build time (`next/font/google`).
