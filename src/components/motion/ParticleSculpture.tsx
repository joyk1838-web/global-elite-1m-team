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

function generateTargetPoints(shape: ParticleShape, count: number): Point3D[] {
  const points: Point3D[] = [];

  if (shape === "sphere") {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * i;
      const jitter = 0.94 + ((i * 17) % 13) * 0.01;
      points.push({
        x: Math.cos(theta) * radiusAtY * jitter,
        y: y * jitter,
        z: Math.sin(theta) * radiusAtY * jitter,
      });
    }
    return points;
  }

  if (shape === "cube") {
    const side = Math.ceil(Math.cbrt(count));
    const edgesPerAxis = Math.floor(count / 12);
    // Crisp cube edges + sparse interior volume for depth
    for (let i = 0; i < count; i++) {
      if (i < edgesPerAxis * 12) {
        const edgeIdx = Math.floor(i / edgesPerAxis);
        const t = ((i % edgesPerAxis) / Math.max(1, edgesPerAxis - 1)) * 1.4 - 0.7;
        const signs = [
          [-0.7, -0.7],
          [-0.7, 0.7],
          [0.7, -0.7],
          [0.7, 0.7],
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
        points.push({ x: ix * 1.1, y: iy * 1.1, z: iz * 1.1 });
      }
    }
    return points;
  }

  if (shape === "chart") {
    // 4 ascending 3D bars + rising trajectory arc
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
          z: (side < 0 ? wing * 0.16 : 0),
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
    // 3 sculpted octahedron / luxury crown facets
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

  // "constellation": double orbital gyro rings + core nucleus
  for (let i = 0; i < count; i++) {
    const bucket = i % 10;
    if (bucket < 3) {
      // Inner core sphere
      const phi = Math.acos(1 - 2 * ((i + 0.5) / count));
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 0.34;
      points.push({
        x: Math.sin(phi) * Math.cos(theta) * r,
        y: Math.cos(phi) * r,
        z: Math.sin(phi) * Math.sin(theta) * r,
      });
    } else if (bucket < 6) {
      // Tilted ring 1
      const a = (i / count) * Math.PI * 2 * 5;
      const r = 0.82 + ((i * 7) % 5) * 0.015;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r * 0.42;
      const z = Math.sin(a) * r * 0.82;
      points.push({ x, y, z });
    } else {
      // Counter-tilted ring 2
      const a = (i / count) * Math.PI * 2 * 5;
      const r = 0.88 + ((i * 11) % 5) * 0.015;
      const x = Math.cos(a) * r * 0.75;
      const y = Math.sin(a) * r * 0.78;
      const z = Math.cos(a) * r * 0.52;
      points.push({ x, y, z });
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
  const targetPointsRef = useRef<Point3D[]>(generateTargetPoints(shape, density));
  const currentPointsRef = useRef<Point3D[]>(
    generateTargetPoints(shape, density).map((p) => ({ ...p }))
  );
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  useEffect(() => {
    shapeRef.current = shape;
    targetPointsRef.current = generateTargetPoints(shape, density);
  }, [shape, density]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrameId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let angleY = 0;
    let angleX = 0.18;

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
      pointerRef.current = {
        x: ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1,
        y: ((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1,
        active: true,
      };
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };

    if (interactive) {
      canvas.addEventListener("pointermove", handlePointerMove);
      canvas.addEventListener("pointerleave", handlePointerLeave);
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const current = currentPointsRef.current;
      const target = targetPointsRef.current;
      const pointer = pointerRef.current;

      if (!prefersReducedMotion) {
        angleY += 0.0042;
        const targetTiltX = pointer.active ? pointer.y * 0.35 + 0.14 : 0.16;
        angleX += (targetTiltX - angleX) * 0.05;
      }

      const rotY = angleY + (pointer.active && !prefersReducedMotion ? pointer.x * 0.42 : 0);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      const scale = Math.min(width, height) * 0.36;
      const cx = width * 0.5;
      const cy = height * 0.5;
      const perspective = 3.2;

      // Ambient gold radial core glow behind sculpture
      const glow = ctx.createRadialGradient(cx, cy, 4, cx, cy, scale * 1.45);
      glow.addColorStop(0, "rgba(212, 175, 55, 0.16)");
      glow.addColorStop(0.5, "rgba(212, 175, 55, 0.05)");
      glow.addColorStop(1, "rgba(9, 9, 11, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      const projected: Array<{
        sx: number;
        sy: number;
        z: number;
        size: number;
        alpha: number;
        warmth: number;
      }> = [];

      for (let i = 0; i < current.length; i++) {
        const p = current[i];
        const t = target[i] || target[0];

        // Smooth morph interpolation
        const lerpSpeed = prefersReducedMotion ? 1 : 0.085;
        p.x += (t.x - p.x) * lerpSpeed;
        p.y += (t.y - p.y) * lerpSpeed;
        p.z += (t.z - p.z) * lerpSpeed;

        // 3D rotation
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        const depthFactor = perspective / Math.max(0.8, perspective - z2);
        let sx = cx + x1 * scale * depthFactor;
        let sy = cy + y2 * scale * depthFactor;

        // Subtle interactive cursor displacement
        if (pointer.active && interactive && !prefersReducedMotion) {
          const px = cx + pointer.x * (width * 0.5);
          const py = cy + pointer.y * (height * 0.5);
          const dx = sx - px;
          const dy = sy - py;
          const dist = Math.hypot(dx, dy);
          const maxRadius = 90;
          if (dist < maxRadius && dist > 0.01) {
            const push = ((maxRadius - dist) / maxRadius) * 16;
            sx += (dx / dist) * push;
            sy += (dy / dist) * push;
          }
        }

        const normalizedDepth = Math.max(0, Math.min(1, (z2 + 1.1) / 2.2));
        projected.push({
          sx,
          sy,
          z: z2,
          size: 0.9 + normalizedDepth * 1.85,
          alpha: 0.18 + normalizedDepth * 0.78,
          warmth: (i % 5 === 0 ? 1 : normalizedDepth),
        });
      }

      // Depth-sort back to front for authentic 3D shimmer
      projected.sort((a, b) => a.z - b.z);

      for (let i = 0; i < projected.length; i++) {
        const pt = projected[i];
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, pt.size, 0, Math.PI * 2);
        if (pt.warmth > 0.62) {
          ctx.fillStyle = `rgba(243, 222, 151, ${pt.alpha.toFixed(3)})`;
        } else if (pt.warmth > 0.35) {
          ctx.fillStyle = `rgba(212, 175, 55, ${(pt.alpha * 0.9).toFixed(3)})`;
        } else {
          ctx.fillStyle = `rgba(228, 228, 231, ${(pt.alpha * 0.65).toFixed(3)})`;
        }
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (interactive) {
        canvas.removeEventListener("pointermove", handlePointerMove);
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
