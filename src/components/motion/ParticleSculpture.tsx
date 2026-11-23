import { useEffect, useRef } from "react";

export type ParticleShape =
  | "sphere"
  | "cube"
  | "chart"
  | "helix"
  | "diamonds"
  | "constellation";

interface ParticleSculptureProps {
  shape?: ParticleShape;
  className?: string;
  interactive?: boolean;
  density?: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface SimParticle extends Point3D {
  vx: number;
  vy: number;
  vz: number;
  phase: number;
}

function generateTargetPoints(shape: ParticleShape, count: number): Point3D[] {
  const points: Point3D[] = [];

  if (shape === "sphere") {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / Math.max(1, count - 1)) * 2;
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * i;
      const shell = i % 7 === 0 ? 0.62 : 0.94 + ((i * 17) % 13) * 0.01;
      points.push({
        x: Math.cos(theta) * radiusAtY * shell,
        y: y * shell,
        z: Math.sin(theta) * radiusAtY * shell,
      });
    }
    return points;
  }

  if (shape === "cube") {
    const side = Math.ceil(Math.cbrt(count));
    const edgesPerAxis = Math.floor(count / 12);
    for (let i = 0; i < count; i++) {
      if (i < edgesPerAxis * 12) {
        const edgeIdx = Math.floor(i / edgesPerAxis);
        const t = ((i % edgesPerAxis) / Math.max(1, edgesPerAxis - 1)) * 1.42 - 0.71;
        const signs = [
          [-0.71, -0.71],
          [-0.71, 0.71],
          [0.71, -0.71],
          [0.71, 0.71],
        ];
        const axis = edgeIdx % 3;
        const pair = signs[Math.floor(edgeIdx / 3) % 4];
        if (axis === 0) points.push({ x: t, y: pair[0], z: pair[1] });
        else if (axis === 1) points.push({ x: pair[0], y: t, z: pair[1] });
        else points.push({ x: pair[0], y: pair[1], z: t });
      } else {
        const k = i - edgesPerAxis * 12;
        const ix = (k % side) / Math.max(1, side - 1) - 0.5;
        const iy = (Math.floor(k / side) % side) / Math.max(1, side - 1) - 0.5;
        const iz = (Math.floor(k / (side * side)) % side) / Math.max(1, side - 1) - 0.5;
        points.push({ x: ix * 1.12, y: iy * 1.12, z: iz * 1.12 });
      }
    }
    return points;
  }

  if (shape === "chart") {
    const bars = [
      { cx: -0.66, h: 0.45 },
      { cx: -0.22, h: 0.75 },
      { cx: 0.22, h: 1.05 },
      { cx: 0.66, h: 1.45 },
    ];
    const arrowCount = Math.floor(count * 0.22);
    const barCount = count - arrowCount;

    for (let i = 0; i < barCount; i++) {
      const b = bars[i % bars.length];
      const local = Math.floor(i / bars.length);
      const u = ((local * 37) % 100) / 100;
      const v = ((local * 73) % 100) / 100;
      const w = ((local * 53) % 100) / 100;
      points.push({
        x: b.cx + (u - 0.5) * 0.24,
        y: 0.75 - v * b.h,
        z: (w - 0.5) * 0.24,
      });
    }

    for (let i = 0; i < arrowCount; i++) {
      const t = i / Math.max(1, arrowCount - 1);
      if (t < 0.78) {
        const p = t / 0.78;
        points.push({
          x: -0.78 + p * 1.56,
          y: 0.22 - Math.pow(p, 1.35) * 1.08,
          z: Math.sin(p * Math.PI) * 0.14,
        });
      } else {
        const wing = (t - 0.78) / 0.22;
        const side = i % 2 === 0 ? 1 : -1;
        points.push({
          x: 0.78 - wing * 0.24,
          y: -0.86 + (side > 0 ? wing * 0.22 : 0.02),
          z: side < 0 ? wing * 0.16 : 0,
        });
      }
    }
    return points;
  }

  if (shape === "helix") {
    for (let i = 0; i < count; i++) {
      const isRung = i % 5 === 0;
      const t = (i / count) * Math.PI * 4.5 - Math.PI * 2.25;
      const y = ((i / count) * 2 - 1) * 0.92;
      if (isRung) {
        const lerp = ((i * 19) % 10) / 10 - 0.5;
        points.push({
          x: Math.cos(t) * lerp * 0.96,
          y,
          z: Math.sin(t) * lerp * 0.96,
        });
      } else {
        const strand = i % 2 === 0 ? 0 : Math.PI;
        const r = 0.48 + ((i * 11) % 7) * 0.015;
        points.push({
          x: Math.cos(t + strand) * r,
          y,
          z: Math.sin(t + strand) * r,
        });
      }
    }
    return points;
  }

  if (shape === "diamonds") {
    const centers = [
      { cx: 0, cy: -0.1, cz: 0, s: 0.68 },
      { cx: -0.62, cy: 0.34, cz: 0.22, s: 0.34 },
      { cx: 0.62, cy: 0.3, cz: -0.2, s: 0.36 },
    ];
    for (let i = 0; i < count; i++) {
      const c = i < count * 0.56 ? centers[0] : i < count * 0.78 ? centers[1] : centers[2];
      const u = (((i * 29) % 100) / 100) * 2 - 1;
      const angle = ((i * 137.5) % 360) * (Math.PI / 180);
      const ring = (1 - Math.abs(u)) * c.s;
      const facet = 0.88 + ((i * 13) % 5) * 0.04;
      points.push({
        x: c.cx + Math.cos(angle) * ring * facet,
        y: c.cy + u * c.s * 1.15,
        z: c.cz + Math.sin(angle) * ring * facet,
      });
    }
    return points;
  }

  for (let i = 0; i < count; i++) {
    const bucket = i % 10;
    if (bucket < 3) {
      const phi = Math.acos(1 - 2 * ((i + 0.5) / count));
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 0.34;
      points.push({
        x: Math.sin(phi) * Math.cos(theta) * r,
        y: Math.cos(phi) * r,
        z: Math.sin(phi) * Math.sin(theta) * r,
      });
    } else if (bucket < 6) {
      const a = (i / count) * Math.PI * 2 * 5;
      const r = 0.82 + ((i * 7) % 5) * 0.015;
      points.push({
        x: Math.cos(a) * r,
        y: Math.sin(a) * r * 0.42,
        z: Math.sin(a) * r * 0.82,
      });
    } else {
      const a = (i / count) * Math.PI * 2 * 5;
      const r = 0.88 + ((i * 11) % 5) * 0.015;
      points.push({
        x: Math.cos(a) * r * 0.75,
        y: Math.sin(a) * r * 0.78,
        z: Math.cos(a) * r * 0.52,
      });
    }
  }
  return points;
}

export function ParticleSculpture({
  shape = "sphere",
  className = "",
  interactive = true,
  density = 520,
}: ParticleSculptureProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shapeRef = useRef<ParticleShape>(shape);
  const swirlImpulseRef = useRef<number>(0);
  const rippleRef = useRef<number>(0);
  const targetPointsRef = useRef<Point3D[]>(generateTargetPoints(shape, density));
  const currentPointsRef = useRef<SimParticle[]>(
    generateTargetPoints(shape, density).map((p, idx) => ({
      ...p,
      vx: 0,
      vy: 0,
      vz: 0,
      phase: idx * 0.17,
    }))
  );
  const pointerRef = useRef<{
    x: number;
    y: number;
    smoothX: number;
    smoothY: number;
    vx: number;
    vy: number;
    active: boolean;
  }>({
    x: 0,
    y: 0,
    smoothX: 0,
    smoothY: 0,
    vx: 0,
    vy: 0,
    active: false,
  });

  useEffect(() => {
    if (shapeRef.current !== shape) {
      swirlImpulseRef.current = 1;
      rippleRef.current = 0.05;
    }
    shapeRef.current = shape;
    const nextTargets = generateTargetPoints(shape, density);
    targetPointsRef.current = nextTargets;

    if (currentPointsRef.current.length !== nextTargets.length) {
      currentPointsRef.current = nextTargets.map((p, idx) => ({
        ...p,
        vx: 0,
        vy: 0,
        vz: 0,
        phase: idx * 0.17,
      }));
    }
  }, [shape, density]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrameId = 0;
    let isVisible = true;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let angleY = 0;
    let angleX = 0.18;
    let time = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const handlePointerMove = (e: PointerEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
      const ny = ((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1;
      pointerRef.current.vx = nx - pointerRef.current.x;
      pointerRef.current.vy = ny - pointerRef.current.y;
      pointerRef.current.x = nx;
      pointerRef.current.y = ny;
      pointerRef.current.active = true;
    };

    const handlePointerDown = () => {
      if (!interactive || prefersReducedMotion) return;
      swirlImpulseRef.current = Math.min(1.4, swirlImpulseRef.current + 0.9);
      rippleRef.current = 0.04;
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
      pointerRef.current.vx = 0;
      pointerRef.current.vy = 0;
    };

    if (interactive) {
      canvas.addEventListener("pointermove", handlePointerMove);
      canvas.addEventListener("pointerdown", handlePointerDown);
      canvas.addEventListener("pointerleave", handlePointerLeave);
    }

    const drawGimbalRing = (
      cx: number,
      cy: number,
      radius: number,
      tiltX: number,
      tiltZ: number,
      arcAngle: number,
      alpha: number
    ) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(tiltZ);
      ctx.scale(1, Math.max(0.18, Math.abs(Math.sin(tiltX))));

      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(226, 190, 83, ${alpha.toFixed(3)})`;
      ctx.lineWidth = 0.85;
      ctx.stroke();

      // Traveling luminous comet arc along the gimbal ring
      ctx.beginPath();
      ctx.arc(0, 0, radius, arcAngle, arcAngle + 0.75);
      ctx.strokeStyle = `rgba(243, 223, 155, ${(alpha * 3.2).toFixed(3)})`;
      ctx.lineWidth = 1.6;
      ctx.lineCap = "round";
      ctx.stroke();

      ctx.restore();
    };

    const render = () => {
      if (!isVisible && !prefersReducedMotion) {
        animationFrameId = 0;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const current = currentPointsRef.current;
      const target = targetPointsRef.current;
      const pointer = pointerRef.current;

      if (!prefersReducedMotion) {
        time += 0.016;
        const swirlBoost = swirlImpulseRef.current * 0.024;
        swirlImpulseRef.current *= 0.94;
        if (swirlImpulseRef.current < 0.005) swirlImpulseRef.current = 0;

        if (rippleRef.current > 0) {
          rippleRef.current += 0.026;
          if (rippleRef.current > 1.35) rippleRef.current = 0;
        }

        // Smooth spring-like interpolation of pointer coords
        const targetPX = pointer.active ? pointer.x : 0;
        const targetPY = pointer.active ? pointer.y : 0;
        pointer.smoothX += (targetPX - pointer.smoothX) * 0.1;
        pointer.smoothY += (targetPY - pointer.smoothY) * 0.1;

        angleY += 0.0045 + swirlBoost;
        const targetTiltX = pointer.active
          ? pointer.smoothY * 0.36 + 0.14
          : 0.16 + Math.sin(time * 0.45) * 0.055;
        angleX += (targetTiltX - angleX) * 0.06;

        pointer.vx *= 0.86;
        pointer.vy *= 0.86;
      }

      const rotY = angleY + (!prefersReducedMotion ? pointer.smoothX * 0.46 : 0);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      const scale = Math.min(width, height) * 0.365;
      const cx = width * 0.5;
      const cy = height * 0.5;
      const perspective = 3.2;

      // Multi-layered volumetric gold/slate atmospheric core glow
      const pulse = prefersReducedMotion ? 1 : 1 + Math.sin(time * 1.1) * 0.04;
      const glow = ctx.createRadialGradient(cx, cy, 4, cx, cy, scale * 1.65 * pulse);
      glow.addColorStop(0, "rgba(226, 190, 83, 0.19)");
      glow.addColorStop(0.36, "rgba(226, 190, 83, 0.065)");
      glow.addColorStop(0.7, "rgba(148, 163, 184, 0.03)");
      glow.addColorStop(1, "rgba(5, 5, 7, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      // Dual counter-rotating precision gyroscopic gimbal rings with traveling light arcs
      if (density >= 280) {
        drawGimbalRing(
          cx,
          cy,
          scale * 1.24,
          0.36 + Math.sin(time * 0.25) * 0.06,
          -0.2 + Math.sin(time * 0.2) * 0.06,
          time * 0.65,
          0.11
        );
        drawGimbalRing(
          cx,
          cy,
          scale * 1.38,
          0.26 + Math.cos(time * 0.22) * 0.05,
          0.32 + Math.cos(time * 0.18) * 0.05,
          -time * 0.42 + 1.8,
          0.075
        );
      }

      // Expanding tactile shockwave ring on click or shape morph
      if (rippleRef.current > 0 && !prefersReducedMotion) {
        const rp = rippleRef.current;
        const rippleAlpha = Math.max(0, (1 - rp / 1.35) * 0.42);
        ctx.beginPath();
        ctx.arc(cx, cy, scale * (0.35 + rp * 1.15), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(243, 223, 155, ${rippleAlpha.toFixed(3)})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      const projected: Array<{
        sx: number;
        sy: number;
        z: number;
        size: number;
        alpha: number;
        warmth: number;
        idx: number;
      }> = [];

      const swirl = swirlImpulseRef.current;
      const ripple = rippleRef.current;

      for (let i = 0; i < current.length; i++) {
        const p = current[i];
        const t = target[i] || target[0];

        if (prefersReducedMotion) {
          p.x = t.x;
          p.y = t.y;
          p.z = t.z;
        } else {
          // Spring-damped target attraction + subtle swirl impulse during shape transitions
          const stiffness = 0.068;
          const damping = 0.79;
          const ax = (t.x - p.x) * stiffness - p.z * swirl * 0.042;
          const ay = (t.y - p.y) * stiffness;
          const az = (t.z - p.z) * stiffness + p.x * swirl * 0.042;

          p.vx = (p.vx + ax) * damping;
          p.vy = (p.vy + ay) * damping;
          p.vz = (p.vz + az) * damping;

          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;
        }

        // Harmonic breathing + shockwave radial ripple
        const distFromOrigin = Math.hypot(p.x, p.y, p.z) || 0.001;
        const waveBoost =
          ripple > 0 && !prefersReducedMotion
            ? Math.exp(-Math.pow((distFromOrigin - ripple) * 3.8, 2)) * 0.14
            : 0;
        const breathe = prefersReducedMotion
          ? 0
          : Math.sin(time * 1.45 + p.phase) * 0.013 + waveBoost;

        const bx = p.x * (1 + breathe);
        const by = p.y * (1 + breathe);
        const bz = p.z * (1 + breathe);

        // 3D rotation
        const x1 = bx * cosY - bz * sinY;
        const z1 = bz * cosY + bx * sinY;
        const y2 = by * cosX - z1 * sinX;
        const z2 = z1 * cosX + by * sinX;

        const depthFactor = perspective / Math.max(0.8, perspective - z2);
        let sx = cx + x1 * scale * depthFactor;
        let sy = cy + y2 * scale * depthFactor;

        // Interactive cursor force-field wave
        if (pointer.active && interactive && !prefersReducedMotion) {
          const px = cx + pointer.smoothX * (width * 0.5);
          const py = cy + pointer.smoothY * (height * 0.5);
          const dx = sx - px;
          const dy = sy - py;
          const dist = Math.hypot(dx, dy);
          const maxRadius = 118;
          if (dist < maxRadius && dist > 0.01) {
            const factor = (maxRadius - dist) / maxRadius;
            const push = factor * factor * 26;
            sx += (dx / dist) * push + pointer.vx * 16 * factor;
            sy += (dy / dist) * push + pointer.vy * 16 * factor;
          }
        }

        const normalizedDepth = Math.max(0, Math.min(1, (z2 + 1.1) / 2.2));
        projected.push({
          sx,
          sy,
          z: z2,
          size: 0.8 + normalizedDepth * 1.95 + waveBoost * 4.5,
          alpha: Math.min(1, 0.14 + normalizedDepth * 0.84 + waveBoost * 1.2),
          warmth: i % 4 === 0 ? 1 : normalizedDepth,
          idx: i,
        });
      }

      // Fast O(N) constellation filaments linking select foreground nodes
      if (density >= 280) {
        const threshold = scale * 0.36;
        const thresholdSq = threshold * threshold;
        ctx.lineWidth = 0.65;
        const step = Math.max(2, Math.floor(projected.length / 115));
        for (let i = 0; i < projected.length; i += step) {
          const a = projected[i];
          if (a.z < -0.1) continue;
          for (let offset = 1; offset <= 3; offset++) {
            const j = (i + offset * 7) % projected.length;
            const b = projected[j];
            if (b.z < -0.1) continue;
            const dx = a.sx - b.sx;
            const dy = a.sy - b.sy;
            const distSq = dx * dx + dy * dy;
            if (distSq < thresholdSq) {
              const lineAlpha =
                (1 - Math.sqrt(distSq) / threshold) * 0.24 * Math.min(a.alpha, b.alpha);
              ctx.strokeStyle = `rgba(226, 190, 83, ${lineAlpha.toFixed(3)})`;
              ctx.beginPath();
              ctx.moveTo(a.sx, a.sy);
              ctx.lineTo(b.sx, b.sy);
              ctx.stroke();
            }
          }
        }
      }

      // Depth-sort back to front for authentic 3D shimmer
      projected.sort((a, b) => a.z - b.z);

      for (let i = 0; i < projected.length; i++) {
        const pt = projected[i];

        // Soft bokeh halo + white specular glint on prominent front-layer golden nodes
        if (pt.z > 0.58 && pt.idx % 10 === 0) {
          ctx.beginPath();
          ctx.arc(pt.sx, pt.sy, pt.size * 3.1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(226, 190, 83, ${(pt.alpha * 0.14).toFixed(3)})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, pt.size, 0, Math.PI * 2);
        if (pt.warmth > 0.68) {
          ctx.fillStyle = `rgba(252, 247, 229, ${pt.alpha.toFixed(3)})`;
        } else if (pt.warmth > 0.38) {
          ctx.fillStyle = `rgba(226, 190, 83, ${(pt.alpha * 0.94).toFixed(3)})`;
        } else {
          ctx.fillStyle = `rgba(212, 212, 216, ${(pt.alpha * 0.55).toFixed(3)})`;
        }
        ctx.fill();
      }

      if (!prefersReducedMotion && isVisible) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry?.isIntersecting ?? true;
        if (isVisible && !animationFrameId && !prefersReducedMotion) {
          animationFrameId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.02 }
    );
    observer.observe(canvas);

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      resizeObserver.disconnect();
      if (interactive) {
        canvas.removeEventListener("pointermove", handlePointerMove);
        canvas.removeEventListener("pointerdown", handlePointerDown);
        canvas.removeEventListener("pointerleave", handlePointerLeave);
      }
    };
  }, [interactive, density]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full block ${interactive ? "cursor-crosshair" : "pointer-events-none"} ${className}`}
      aria-hidden="true"
    />
  );
}
