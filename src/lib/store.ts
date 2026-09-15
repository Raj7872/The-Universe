import { create } from 'zustand';
import type { PlanetData } from '@/types';

interface UniverseStore {
  // Scroll progress 0–1
  scrollProgress: number;
  setScrollProgress: (p: number) => void;

  // Active planet (modal open)
  activePlanet: PlanetData | null;
  openPlanet:   (planet: PlanetData) => void;
  closePlanet:  () => void;

  // Hovered planet id
  hoveredPlanet: string | null;
  setHoveredPlanet: (id: string | null) => void;

  // Audio
  audioEnabled: boolean;
  toggleAudio:  () => void;
  masterVolume: number;
  setMasterVolume: (v: number) => void;

  // Loading gate
  isLoaded:  boolean;
  setLoaded: () => void;

  // Easter egg toast
  foundEasterEggMessage: string | null;
  findEasterEgg:        (id: string, message: string) => void;
  clearEasterEggMessage: () => void;

  // Mouse (normalized -1..1)
  mouseNorm: { x: number; y: number };
  setMouseNorm: (x: number, y: number) => void;
}

export const useUniverseStore = create<UniverseStore>((set) => ({
  scrollProgress:    0,
  setScrollProgress: (p) => set({ scrollProgress: p }),

  activePlanet: null,
  openPlanet:   (planet) => set({ activePlanet: planet }),
  closePlanet:  ()       => set({ activePlanet: null }),

  hoveredPlanet:    null,
  setHoveredPlanet: (id) => set({ hoveredPlanet: id }),

  audioEnabled: false,
  toggleAudio:  () => set((s) => ({ audioEnabled: !s.audioEnabled })),
  masterVolume: 0.6,
  setMasterVolume: (v) => set({ masterVolume: v }),

  isLoaded:  false,
  setLoaded: () => set({ isLoaded: true }),

  foundEasterEggMessage: null,
  findEasterEgg: (_id, message) => set({ foundEasterEggMessage: message }),
  clearEasterEggMessage: () => set({ foundEasterEggMessage: null }),

  mouseNorm:    { x: 0, y: 0 },
  setMouseNorm: (x, y) => set({ mouseNorm: { x, y } }),
}));
