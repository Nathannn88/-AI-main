/** 背景粒子画布 — Canvas 实现的频率粒子效果 */

'use client';

import { useRef, useEffect, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

interface ParticleCanvasProps {
  /** 粒子颜色列表 */
  colors?: string[];
  /** 粒子数量 */
  count?: number;
  /** 是否显示连线 */
  showLines?: boolean;
  className?: string;
}

/** 背景粒子画布，用于 Landing Page 和聊天界面 */
export default function ParticleCanvas({
  colors = ['#00E5A0', '#33EDBA', '#7FF5D5'],
  count = 40,
  showLines = true,
  className = '',
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  // 移动端减少粒子数量，尊重 prefers-reduced-motion
  const effectiveCount = typeof window !== 'undefined'
    ? (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0
      : window.innerWidth < 640 ? Math.min(count, 15) : count)
    : count;

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < effectiveCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    particlesRef.current = particles;
  }, [effectiveCount, colors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 完全跳过动画（prefers-reduced-motion）
    if (effectiveCount === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
      initParticles(canvas.offsetWidth, canvas.offsetHeight);
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;

      // 更新和绘制粒子
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // 边界回绕
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      }

      // 绘制连线
      if (showLines) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = particles[i].color;
              ctx.globalAlpha = 0.05 * (1 - dist / 100);
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      ctx.globalAlpha = 1;
      animFrameRef.current = requestAnimationFrame(draw);
    }

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [initParticles, showLines, effectiveCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full z-particles pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
