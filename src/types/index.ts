// ─── Core Planet Types ────────────────────────────────────────────────────────

export interface PlanetMemory {
  planetLabel: string;
  title: string;
  message: string;
  date: string;
  photoUrl?: string;
  voiceNote?: string;
  secondaryMessages?: string[];
}

export interface PlanetTheme {
  primary: string;
  secondary: string;
  emissive: string;
  atmosphere: string;
  particle: string;
  ringColor?: string;
  lightColor?: string;
  lightIntensity?: number;
}

export interface PlanetData {
  id: string;
  name: string;
  subtitle: string;
  size: number;
  position: [number, number, number];
  rings?: boolean;
  theme: PlanetTheme;
  memory: PlanetMemory;
  scrollReveal: number;
  hasEasterEgg?: boolean;
  easterEggMessage?: string;
}

export interface CameraWaypoint {
  pos: [number, number, number];
  rot: [number, number, number];
  scroll: number;
  fov?: number;
}

export interface ChapterData {
  id: string;
  num: string;
  title: string;
  body: string;
  showAt: number;
  hideAt: number;
}

export interface ConstellationPoint {
  x: number;
  y: number;
}

export interface ConstellationLine {
  from: number;
  to: number;
}

export interface ConstellationDef {
  id: string;
  points: ConstellationPoint[];
  lines: ConstellationLine[];
  label?: string;
  showAt: number;
  hideAt: number;
}

export interface EasterEgg {
  id: string;
  position: [number, number, number];
  message: string;
  found: boolean;
}
