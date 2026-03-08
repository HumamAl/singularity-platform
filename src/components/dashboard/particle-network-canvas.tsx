"use client";

import { useEffect, useRef, useCallback } from "react";

// ── Types ────────────────────────────────────────────────────────────────────
interface Particle {
  x: number;
  y: number;
  z: number;         // 0 (far) to 1 (near)
  vx: number;
  vy: number;
  vz: number;
  baseSize: number;
  hue: number;       // 185 = teal, 295 = violet
  phase: number;     // for pulse oscillation
  phaseSpeed: number;
}

interface Props {
  particleCount?: number;
  interactive?: boolean;
  className?: string;
}

// ── Constants ────────────────────────────────────────────────────────────────
const CONNECTION_DISTANCE = 120;
const MOUSE_INFLUENCE_RADIUS = 160;
const MOUSE_FORCE = 0.3;
const CENTER_GRAVITY = 0.0003;
const DAMPING = 0.997;
const DRIFT_SPEED = 0.15;

// Teal: oklch(0.62 0.18 185) ≈ rgb(0, 158, 166) → #009ea6
// Violet: oklch(0.55 0.20 295) ≈ rgb(128, 80, 210) → #8050d2
const TEAL = { r: 0, g: 158, b: 166 };
const VIOLET = { r: 128, g: 80, b: 210 };

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// ── Component ────────────────────────────────────────────────────────────────
export function ParticleNetworkCanvas({
  particleCount = 200,
  interactive = true,
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const frameRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });

  // ── Initialize particles ──────────────────────────────────────────────────
  const initParticles = useCallback(
    (w: number, h: number) => {
      const particles: Particle[] = [];
      const centerX = w / 2;
      const centerY = h / 2;

      for (let i = 0; i < particleCount; i++) {
        // Bias toward center for "singularity cluster" effect
        const isCentralCluster = i < particleCount * 0.3;
        const spread = isCentralCluster ? 0.25 : 0.85;
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * Math.min(w, h) * spread * 0.5;

        particles.push({
          x: centerX + Math.cos(angle) * dist,
          y: centerY + Math.sin(angle) * dist,
          z: Math.random(),
          vx: (Math.random() - 0.5) * DRIFT_SPEED,
          vy: (Math.random() - 0.5) * DRIFT_SPEED,
          vz: (Math.random() - 0.5) * 0.001,
          baseSize: isCentralCluster
            ? 1.2 + Math.random() * 1.8
            : 0.6 + Math.random() * 1.4,
          hue: Math.random() < 0.2 ? 295 : 185, // 20% violet, 80% teal
          phase: Math.random() * Math.PI * 2,
          phaseSpeed: 0.005 + Math.random() * 0.015,
        });
      }

      particlesRef.current = particles;
    },
    [particleCount]
  );

  // ── Animation loop ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // ── Resize handling ──────────────────────────────────────────────────────
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w: rect.width, h: rect.height };

      if (particlesRef.current.length === 0) {
        initParticles(rect.width, rect.height);
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    // ── Mouse tracking ───────────────────────────────────────────────────────
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // ── Draw loop ────────────────────────────────────────────────────────────
    let time = 0;

    const draw = () => {
      const { w, h } = sizeRef.current;
      if (w === 0 || h === 0) {
        frameRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, w, h);
      time++;

      const particles = particlesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const centerX = w / 2;
      const centerY = h / 2;

      // ── Update particles ───────────────────────────────────────────────────
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Gentle orbital drift around center
        const dx = centerX - p.x;
        const dy = centerY - p.y;
        const distToCenter = Math.sqrt(dx * dx + dy * dy);

        // Gravity toward center (very weak)
        p.vx += dx * CENTER_GRAVITY;
        p.vy += dy * CENTER_GRAVITY;

        // Tangential orbit (perpendicular to center vector)
        if (distToCenter > 1) {
          const orbitStrength = 0.02 / (1 + distToCenter * 0.005);
          p.vx += (-dy / distToCenter) * orbitStrength;
          p.vy += (dx / distToCenter) * orbitStrength;
        }

        // Mouse interaction — gentle repulsion
        if (interactive) {
          const mdx = p.x - mx;
          const mdy = p.y - my;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < MOUSE_INFLUENCE_RADIUS && mDist > 1) {
            const force =
              (MOUSE_FORCE * (1 - mDist / MOUSE_INFLUENCE_RADIUS)) / mDist;
            p.vx += mdx * force;
            p.vy += mdy * force;
          }
        }

        // Damping
        p.vx *= DAMPING;
        p.vy *= DAMPING;

        // Position update
        p.x += p.vx;
        p.y += p.vy;

        // Z oscillation (depth drift)
        p.z += p.vz;
        if (p.z > 1 || p.z < 0) p.vz *= -1;
        p.z = Math.max(0, Math.min(1, p.z));

        // Wrap edges with margin
        const margin = 40;
        if (p.x < -margin) p.x = w + margin;
        if (p.x > w + margin) p.x = -margin;
        if (p.y < -margin) p.y = h + margin;
        if (p.y > h + margin) p.y = -margin;

        // Phase update for pulse
        p.phase += p.phaseSpeed;
      }

      // ── Draw connections ───────────────────────────────────────────────────
      // Only check nearby particles using a grid-based approach for performance
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;

          // Quick distance check (skip sqrt when possible)
          if (
            Math.abs(dx) > CONNECTION_DISTANCE ||
            Math.abs(dy) > CONNECTION_DISTANCE
          )
            continue;

          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > CONNECTION_DISTANCE) continue;

          const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
          const avgZ = (a.z + b.z) / 2;
          const depthAlpha = 0.3 + avgZ * 0.7;

          // Color: mostly teal, blend to violet if either particle is violet
          const isMixed = a.hue !== b.hue;
          const color = isMixed
            ? `rgba(${Math.round(lerp(TEAL.r, VIOLET.r, 0.5))}, ${Math.round(lerp(TEAL.g, VIOLET.g, 0.5))}, ${Math.round(lerp(TEAL.b, VIOLET.b, 0.5))}, ${opacity * depthAlpha})`
            : a.hue === 295
              ? `rgba(${VIOLET.r}, ${VIOLET.g}, ${VIOLET.b}, ${opacity * depthAlpha})`
              : `rgba(${TEAL.r}, ${TEAL.g}, ${TEAL.b}, ${opacity * depthAlpha})`;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = color;
          ctx.lineWidth = 0.5 + avgZ * 0.5;
          ctx.stroke();
        }
      }

      // ── Draw particles ─────────────────────────────────────────────────────
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Depth-based size (farther = smaller)
        const size = p.baseSize * (0.4 + p.z * 0.8);

        // Pulse effect
        const pulse = 0.6 + Math.sin(p.phase) * 0.4;

        // Depth-based opacity
        const depthAlpha = 0.2 + p.z * 0.8;
        const alpha = depthAlpha * pulse;

        const color =
          p.hue === 295
            ? { r: VIOLET.r, g: VIOLET.g, b: VIOLET.b }
            : { r: TEAL.r, g: TEAL.g, b: TEAL.b };

        // Glow layer (larger, more transparent)
        if (size > 1 && p.z > 0.3) {
          const glowSize = size * 3;
          const gradient = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            glowSize
          );
          gradient.addColorStop(
            0,
            `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.3})`
          );
          gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    // ── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameRef.current);
      observer.disconnect();
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [interactive, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: interactive ? "auto" : "none",
      }}
    />
  );
}
