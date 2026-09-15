import type { CameraWaypoint } from '@/types';

// Smooth easing functions
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeInOutQuart(t: number): number {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

export function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function remapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  ease: (t: number) => number = (t) => t
): number {
  const t = clamp((value - inMin) / (inMax - inMin), 0, 1);
  return lerp(outMin, outMax, ease(t));
}

export function interpolateCameraPath(
  path: CameraWaypoint[],
  progress: number
): { pos: [number, number, number]; rot: [number, number, number]; fov: number } {
  const p = clamp(progress, 0, 1);

  let from = path[0];
  let to = path[path.length - 1];

  for (let i = 0; i < path.length - 1; i++) {
    if (p >= path[i].scroll && p <= path[i + 1].scroll) {
      from = path[i];
      to = path[i + 1];
      break;
    }
  }

  const range = to.scroll - from.scroll;
  const rawT = range === 0 ? 0 : (p - from.scroll) / range;
  const t = easeInOutCubic(clamp(rawT, 0, 1));

  const fromFov = from.fov ?? 60;
  const toFov = to.fov ?? 60;

  return {
    pos: [
      lerp(from.pos[0], to.pos[0], t),
      lerp(from.pos[1], to.pos[1], t),
      lerp(from.pos[2], to.pos[2], t),
    ],
    rot: [
      lerp(from.rot[0], to.rot[0], t),
      lerp(from.rot[1], to.rot[1], t),
      lerp(from.rot[2], to.rot[2], t),
    ],
    fov: lerp(fromFov, toFov, t),
  };
}
