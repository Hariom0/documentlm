"use client";

import React, { JSX, useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
}

export default function ParticleBackground(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef<boolean>(true);
  const particlesRef = useRef<Particle[]>([]);
  const lastTRef = useRef<number>(performance.now());
  const resizeScheduledRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) return;

    let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d", {
      alpha: true,
    });
    if (!ctx) return;

    const MAX_DPR = 2;
    const COUNT = 50;

    let width = 0;
    let height = 0;
    let DPR = Math.max(1, Math.min(MAX_DPR, window.devicePixelRatio || 1));

    function resizeImmediate() {
      DPR = Math.max(1, Math.min(MAX_DPR, window.devicePixelRatio || 1));
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = Math.floor(width * DPR);
      canvas!.height = Math.floor(height * DPR);
      canvas!.style.width = width + "px";
      canvas!.style.height = height + "px";
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function initParticles() {
      const particles: Particle[] = [];
      for (let i = 0; i < COUNT; i++) {
        const z = 0.2 + Math.random() * 0.8;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z,
          vx: (Math.random() - 0.5) * 0.3 * z,
          vy: (Math.random() - 0.5) * 0.3 * z,
          size: 1.5 + Math.random() * 2.5 * z,
          hue: 200 + Math.random() * 60,
        });
      }
      particlesRef.current = particles;
    }

    function scheduleResize() {
      if (resizeScheduledRef.current) return;
      resizeScheduledRef.current = true;
      requestAnimationFrame(() => {
        resizeScheduledRef.current = false;
        resizeImmediate();
        initParticles();
      });
    }

    function onVisibilityChange() {
      runningRef.current = document.visibilityState === "visible";
    }

    document.addEventListener("visibilitychange", onVisibilityChange, {
      passive: true,
    });
    window.addEventListener("resize", scheduleResize, { passive: true });

    resizeImmediate();
    initParticles();
    lastTRef.current = performance.now();

    function frame(t: number) {
      if (!runningRef.current) {
        lastTRef.current = t;
        rafRef.current = requestAnimationFrame(frame);
        return;
      }

      const dt = Math.min(40, t - lastTRef.current);
      lastTRef.current = t;

      ctx && ctx.clearRect(0, 0, width, height);

      if (ctx) {
        const g = ctx.createLinearGradient(0, 0, width, height);
        g.addColorStop(0, "rgba(250,250,255,0.03)");
        g.addColorStop(1, "rgba(240,245,255,0.03)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);

        const scrollFactor = (window.scrollY / Math.max(1, height)) * 0.2;

        for (const p of particlesRef.current) {
          p.x += p.vx * (dt / 16) * (1 + (p.z - 0.2));
          p.y += p.vy * (dt / 16) * (1 + (p.z - 0.2));

          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;

          const drawX = p.x + (p.z - 0.6) * 40 * scrollFactor;
          const drawY = p.y + (p.z - 0.6) * 40 * scrollFactor;

          ctx.beginPath();
          const alpha = 0.5 * p.z;
          ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${alpha})`;
          ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${alpha * 0.25})`;
          ctx.arc(drawX, drawY, p.size * 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", scheduleResize);
      particlesRef.current = [];
      ctx = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="doclm-particles"
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        opacity: 0.85,
        transition: "opacity 300ms",
      }}
    />
  );
}
