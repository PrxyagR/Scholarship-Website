'use client';

import { useEffect, useRef } from 'react';

interface Leaf {
  x: number;
  y: number;
  size: number;
  vy: number;
  vx: number;
  swayAngle: number;
  swaySpeed: number;
  swayRadius: number;
  rot: number;
  rotSpeed: number;
  flipAngle: number;
  flipSpeed: number;
  color: string;
  opacity: number;
}

const LEAF_COLORS = [
  '#C23321', // Canadian Maple Red
  '#D94E34', // Warm Scarlet
  '#E67E22', // Amber Orange
  '#B45309', // Autumn Gold
  '#9B2C1B', // Deep Wine Maple
  '#D97706', // Golden Ochre
];

function drawCurvedMapleLeaf(
  ctx: CanvasRenderingContext2D,
  s: number,
  color: string,
  opacity: number,
) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.beginPath();

  // Botanical-inspired smooth Canadian maple leaf
  ctx.moveTo(0, -s); // Central apex

  // Right upper lobe
  ctx.quadraticCurveTo(s * 0.15, -s * 0.75, s * 0.28, -s * 0.65);
  ctx.lineTo(s * 0.45, -s * 0.7);
  ctx.quadraticCurveTo(s * 0.38, -s * 0.48, s * 0.42, -s * 0.42);

  // Right middle lobe
  ctx.lineTo(s * 0.78, -s * 0.3);
  ctx.quadraticCurveTo(s * 0.58, -s * 0.15, s * 0.54, -s * 0.08);

  // Right lower lobe
  ctx.lineTo(s * 0.68, s * 0.12);
  ctx.quadraticCurveTo(s * 0.42, s * 0.18, s * 0.38, s * 0.28);
  ctx.lineTo(s * 0.42, s * 0.42);
  ctx.quadraticCurveTo(s * 0.22, s * 0.42, s * 0.14, s * 0.58);

  // Stem
  ctx.lineTo(s * 0.04, s * 0.95);
  ctx.lineTo(-s * 0.04, s * 0.95);
  ctx.lineTo(-s * 0.14, s * 0.58);

  // Left lower lobe
  ctx.quadraticCurveTo(-s * 0.22, s * 0.42, -s * 0.42, s * 0.42);
  ctx.lineTo(-s * 0.38, s * 0.28);
  ctx.quadraticCurveTo(-s * 0.42, s * 0.18, -s * 0.68, s * 0.12);

  // Left middle lobe
  ctx.quadraticCurveTo(-s * 0.54, -s * 0.08, -s * 0.58, -s * 0.15);
  ctx.lineTo(-s * 0.78, -s * 0.3);
  ctx.quadraticCurveTo(-s * 0.42, -s * 0.42, -s * 0.38, -s * 0.48);

  // Left upper lobe
  ctx.lineTo(-s * 0.45, -s * 0.7);
  ctx.quadraticCurveTo(-s * 0.28, -s * 0.65, -s * 0.15, -s * 0.75);

  ctx.closePath();
  ctx.fill();

  // Subtle central spine vein
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = Math.max(0.75, s * 0.04);
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.65);
  ctx.lineTo(0, s * 0.75);
  ctx.stroke();

  ctx.restore();
}

export function MapleLeafCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect reduced-motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let isVisible = true;
    let width = 0;
    let height = 0;

    const mouse = { x: -9999, y: -9999 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Tasteful leaf count
    const count = Math.min(18, Math.max(10, Math.floor(width / 95)));

    const createLeaf = (initialRandomY = false): Leaf => ({
      x: Math.random() * (width + 60) - 30,
      y: initialRandomY ? Math.random() * height : -25 - Math.random() * 30,
      size: 11 + Math.random() * 9, // 11-20px
      vy: 0.45 + Math.random() * 0.65,
      vx: (Math.random() - 0.5) * 0.25,
      swayAngle: Math.random() * Math.PI * 2,
      swaySpeed: 0.012 + Math.random() * 0.016,
      swayRadius: 0.6 + Math.random() * 1.0,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.015,
      flipAngle: Math.random() * Math.PI * 2,
      flipSpeed: 0.015 + Math.random() * 0.02,
      color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
      opacity: 0.12 + Math.random() * 0.15, // 0.12 to 0.27 soft atmospheric
    });

    const leaves: Leaf[] = Array.from({ length: count }, () => createLeaf(true));

    // Pause when out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    observer.observe(canvas);

    let lastTime = performance.now();

    const render = (time: number) => {
      animId = requestAnimationFrame(render);
      if (!isVisible) return;

      const dt = Math.min((time - lastTime) / 16.667, 2.5);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < leaves.length; i++) {
        const leaf = leaves[i];

        // Physics updates
        leaf.swayAngle += leaf.swaySpeed * dt;
        leaf.rot += leaf.rotSpeed * dt;
        leaf.flipAngle += leaf.flipSpeed * dt;

        leaf.y += leaf.vy * dt;
        leaf.x += (leaf.vx + Math.sin(leaf.swayAngle) * leaf.swayRadius) * dt;

        // Subtle cursor deflection
        if (mouse.x > -500) {
          const dx = leaf.x - mouse.x;
          const dy = leaf.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          const pushRadius = 90;
          if (dist < pushRadius && dist > 0) {
            const force = (1 - dist / pushRadius) * 1.5 * dt;
            leaf.x += (dx / dist) * force;
            leaf.y += (dy / dist) * force * 0.5;
          }
        }

        // Reset if past bottom
        if (leaf.y > height + 30 || leaf.x > width + 60) {
          leaves[i] = createLeaf(false);
        }

        // Render leaf with 3D flip & 2D rotation
        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.rot);
        ctx.scale(Math.cos(leaf.flipAngle), 1);

        drawCurvedMapleLeaf(ctx, leaf.size, leaf.color, leaf.opacity);
        ctx.restore();
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="maple-canvas-container" aria-hidden="true">
      <canvas ref={canvasRef} className="maple-canvas" />
    </div>
  );
}
