'use client';

import { useEffect, useRef } from 'react';
import { useUniverseStore } from '@/lib/store';
import { CONSTELLATIONS } from '@/data/planets';

export function ConstellationOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const animRef = useRef<number>(0);
  const lineProgressRef = useRef<number[]>(CONSTELLATIONS.map(() => 0));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function draw() {
      if (!canvas || !ctx) return;
      const { scrollProgress } = useUniverseStore.getState();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      CONSTELLATIONS.forEach((def, di) => {
        const visible = scrollProgress >= def.showAt && scrollProgress <= def.hideAt;

        if (visible) {
          const fadeIn  = Math.min((scrollProgress - def.showAt) / 0.05, 1);
          const fadeOut = Math.min((def.hideAt - scrollProgress) / 0.04, 1);
          const globalAlpha = Math.min(fadeIn, fadeOut);

          // Advance line draw progress
          lineProgressRef.current[di] = Math.min(lineProgressRef.current[di] + 0.008, 1);
          const lp = lineProgressRef.current[di];

          const pts = def.points.map((p) => ({
            x: p.x * canvas.width,
            y: p.y * canvas.height,
          }));

          // Draw lines progressively
          const totalLines = def.lines.length;
          def.lines.forEach((line, li) => {
            const lineReveal = Math.max(0, Math.min(1, lp * totalLines - li));
            if (lineReveal <= 0) return;

            const from = pts[line.from];
            const to   = pts[line.to];
            const ex = from.x + (to.x - from.x) * lineReveal;
            const ey = from.y + (to.y - from.y) * lineReveal;

            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(ex, ey);
            ctx.strokeStyle = `rgba(201,168,76,${globalAlpha * 0.35})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          });

          // Draw star points
          pts.forEach((pt, pi) => {
            const ptReveal = Math.min(1, lp * def.points.length * 1.2 - pi);
            if (ptReveal <= 0) return;

            // Glow
            const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 6);
            grad.addColorStop(0, `rgba(245,240,232,${globalAlpha * ptReveal * 0.9})`);
            grad.addColorStop(1, 'rgba(245,240,232,0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
            ctx.fill();

            // Core dot
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(245,240,232,${globalAlpha * ptReveal})`;
            ctx.fill();
          });

          // Label
          if (def.label && lp > 0.9) {
            ctx.font = '100 11px "Jost", sans-serif';
            ctx.letterSpacing = '4px';
            ctx.fillStyle = `rgba(201,168,76,${globalAlpha * (lp - 0.9) * 10})`;
            ctx.textAlign = 'center';
            const centerX = pts.reduce((s, p) => s + p.x, 0) / pts.length;
            const centerY = Math.max(...pts.map((p) => p.y)) + 30;
            ctx.fillText(def.label, centerX, centerY);
          }
        } else {
          // Reset progress when out of view
          lineProgressRef.current[di] = 0;
        }
      });

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 6 }}
    />
  );
}
