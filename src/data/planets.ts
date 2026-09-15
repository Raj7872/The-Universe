import type { PlanetData, CameraWaypoint, ChapterData, ConstellationDef, EasterEgg } from '@/types';

// ─── PLANETS ─────────────────────────────────────────────────────────────────

export const PLANETS: PlanetData[] = [
  {
    id: 'aurora',
    name: 'Aurora',
    subtitle: 'Where It All Began',
    size: 1.9,
    position: [-4, 0.5, -9],
    rings: true,
    scrollReveal: 0.2,
    theme: {
      primary: '#7ba7d4',
      secondary: '#a0c4e8',
      emissive: '#2a4a7a',
      atmosphere: '#4a80c0',
      particle: '#9fc0e8',
      ringColor: '#6a96c4',
      lightColor: '#60a0ff',
      lightIntensity: 1.2,
    },
    memory: {
      planetLabel: 'Aurora · The First Light',
      title: 'Where the Story Begins',
      message: 'Every great journey has a first spark — a moment before which nothing was set in motion, and after which everything was. This planet marks that beginning: the quiet instant a small idea started becoming something real.',
      date: 'The very beginning',
      secondaryMessages: [
        'The first light is always the hardest to notice, and the easiest to look back on.',
        'Everything that followed grew from this one point.',
      ],
    },
  },
  {
    id: 'solenne',
    name: 'Solenne',
    subtitle: 'The Golden Hours',
    size: 1.5,
    position: [5.5, -1.2, -18],
    rings: false,
    scrollReveal: 0.35,
    theme: {
      primary: '#d4a574',
      secondary: '#e8c090',
      emissive: '#7a4a20',
      atmosphere: '#c08040',
      particle: '#e0b880',
      lightColor: '#ffb060',
      lightIntensity: 1.4,
    },
    memory: {
      planetLabel: 'Solenne · The Warm Days',
      title: 'Golden Hours',
      message: 'Some stretches of time resist being ordinary, no matter how plainly they started. An afternoon of sunlight through leaves, a conversation that wandered nowhere in particular — and somehow contained everything worth keeping.',
      date: 'Somewhere in summer',
      secondaryMessages: [
        'Time moves differently on days like that.',
        'The warmth of them tends to stay.',
      ],
    },
  },
  {
    id: 'lumiere',
    name: 'Lumière',
    subtitle: 'What You Cannot See',
    size: 2.3,
    position: [-6, 1.8, -28],
    rings: true,
    scrollReveal: 0.5,
    theme: {
      primary: '#e0d090',
      secondary: '#f0e4b0',
      emissive: '#907020',
      atmosphere: '#d0a830',
      particle: '#f0d870',
      ringColor: '#c8a050',
      lightColor: '#ffe080',
      lightIntensity: 1.8,
    },
    memory: {
      planetLabel: 'Lumière · The Bright Ones',
      title: 'The Things That Stay Hidden',
      message: "Not everything worth noticing announces itself. Some of the best work happens quietly, off to the side, easy to miss unless you're looking for it — a detail in the code, a small kindness, a thing that just works without asking for credit.",
      date: 'Always there, easy to miss',
      secondaryMessages: [
        'The quiet things are often the ones holding everything else up.',
        'Some light doesn\'t need to be switched on. It just is.',
      ],
    },
    hasEasterEgg: true,
    easterEggMessage: '✦ You found the hidden light. It was always there.',
  },
  {
    id: 'seraph',
    name: 'Seraph',
    subtitle: 'The Dreamers\' Planet',
    size: 1.7,
    position: [3.5, -2, -40],
    rings: false,
    scrollReveal: 0.65,
    theme: {
      primary: '#b0a0d8',
      secondary: '#ccc0f0',
      emissive: '#502090',
      atmosphere: '#8060c0',
      particle: '#d0c0ff',
      lightColor: '#a080ff',
      lightIntensity: 1.3,
    },
    memory: {
      planetLabel: 'Seraph · The Dreamers',
      title: 'What Ideas Become',
      message: "Every finished thing began as someone's rough idea, sketched out when it was still just a maybe. This planet is for the ones still in progress — the projects, plans, and half-built things quietly on their way to becoming real.",
      date: 'Still coming together',
      secondaryMessages: [
        'A future worth having is rarely an accident.',
        'It is something built, quietly, one step at a time.',
      ],
    },
  },
  {
    id: 'haven',
    name: 'Haven',
    subtitle: 'The Heart of Everything',
    size: 2.6,
    position: [0, 0, -54],
    rings: true,
    scrollReveal: 0.8,
    theme: {
      primary: '#d08080',
      secondary: '#e8a0a0',
      emissive: '#802020',
      atmosphere: '#c04040',
      particle: '#f0c0c0',
      ringColor: '#b86060',
      lightColor: '#ff8060',
      lightIntensity: 2.0,
    },
    memory: {
      planetLabel: 'Haven · The Heart',
      title: 'The Center of It All',
      message: "Every project needs a core it keeps returning to — the reason it started, the thing that makes the rest of it worth building. This planet sits at the center of the journey: not the biggest stop, but the one everything else orbits.",
      date: 'The whole way through',
      secondaryMessages: [
        'A strong center makes everything around it steadier.',
        'The best work tends to circle back to what matters most.',
      ],
    },
  },
];

// ─── CAMERA PATH ──────────────────────────────────────────────────────────────

export const CAMERA_PATH: CameraWaypoint[] = [
  { pos: [0, 0, 12],    rot: [0, 0, 0],      scroll: 0,    fov: 60 },
  { pos: [0, 0.5, 2],   rot: [0, 0, 0],      scroll: 0.1,  fov: 58 },
  { pos: [-2, 0.8, -5], rot: [0, 0.08, 0],   scroll: 0.22, fov: 56 },
  { pos: [3, -0.5, -13],rot: [0, -0.12, 0],  scroll: 0.37, fov: 55 },
  { pos: [-3, 1.5, -23],rot: [0.04, 0.1, 0], scroll: 0.51, fov: 54 },
  { pos: [2, -1, -36],  rot: [0, -0.08, 0],  scroll: 0.64, fov: 56 },
  { pos: [0, 0.5, -50], rot: [0, 0, 0],      scroll: 0.82, fov: 58 },
  { pos: [0, 0, -58],   rot: [0, 0, 0],      scroll: 1.0,  fov: 60 },
];

// ─── CHAPTERS ─────────────────────────────────────────────────────────────────

export const CHAPTERS: ChapterData[] = [
  { id: 'ch1', num: 'Chapter I',   title: 'Where It All Began',     body: 'The first coordinates of you',      showAt: 0.17, hideAt: 0.30 },
  { id: 'ch2', num: 'Chapter II',  title: 'The Quiet Moments',      body: 'Galaxies of ordinary magic',        showAt: 0.42, hideAt: 0.56 },
  { id: 'ch3', num: 'Chapter III', title: 'Light That Travels Far',  body: 'Some things reach across distance', showAt: 0.62, hideAt: 0.73 },
];

// ─── CONSTELLATIONS ───────────────────────────────────────────────────────────

export const CONSTELLATIONS: ConstellationDef[] = [
  {
    id: 'heart',
    showAt: 0.52,
    hideAt: 0.62,
    label: '',
    points: [
      { x: 0.5, y: 0.38 },
      { x: 0.38, y: 0.30 },
      { x: 0.28, y: 0.35 },
      { x: 0.28, y: 0.45 },
      { x: 0.5, y: 0.62 },
      { x: 0.72, y: 0.45 },
      { x: 0.72, y: 0.35 },
      { x: 0.62, y: 0.30 },
    ],
    lines: [
      { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 },
      { from: 3, to: 4 }, { from: 4, to: 5 }, { from: 5, to: 6 },
      { from: 6, to: 7 }, { from: 7, to: 0 },
    ],
  },
  {
    id: 'name',
    showAt: 0.73,
    hideAt: 0.84,
    label: 'YOU',
    points: [
      { x: 0.3, y: 0.42 }, { x: 0.38, y: 0.38 }, { x: 0.46, y: 0.42 },
      { x: 0.38, y: 0.56 }, { x: 0.55, y: 0.38 }, { x: 0.55, y: 0.56 },
      { x: 0.62, y: 0.38 }, { x: 0.7, y: 0.47 }, { x: 0.62, y: 0.56 },
    ],
    lines: [
      { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 1, to: 3 },
      { from: 4, to: 5 }, { from: 6, to: 7 }, { from: 7, to: 8 }, { from: 6, to: 8 },
    ],
  },
];

// ─── EASTER EGGS ─────────────────────────────────────────────────────────────

export const EASTER_EGGS: EasterEgg[] = [
  { id: 'ee1', position: [8, 3, -12],  message: '✦ First secret: You were always the main character.',  found: false },
  { id: 'ee2', position: [-9, -2, -30], message: '✦ Second secret: This whole universe was made for you.', found: false },
  { id: 'ee3', position: [7, 4, -44],  message: '✦ Final secret: The stars spell your name tonight.',      found: false },
];
