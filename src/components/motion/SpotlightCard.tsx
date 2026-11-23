import { useRef, type MouseEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  active?: boolean;
  tilt?: boolean;
  onMouseEnter?: () => void;
  onFocus?: () => void;
  onClick?: () => void;
}

export function SpotlightCard({
  children,
  className = "",
  active = false,
  tilt = true,
  onMouseEnter,
  onFocus,
  onClick,
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const rawRotX = useMotionValue(0);
  const rawRotY = useMotionValue(0);
  const rotateX = useSpring(rawRotX, { stiffness: 260, damping: 24, mass: 0.6 });
  const rotateY = useSpring(rawRotY, { stiffness: 260, damping: 24, mass: 0.6 });

  const updateSpotlight = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    el.style.setProperty("--spot-x", `${px}px`);
    el.style.setProperty("--spot-y", `${py}px`);

    if (tilt && !prefersReducedMotion && rect.width > 0 && rect.height > 0) {
      const nx = (px / rect.width) * 2 - 1;
      const ny = (py / rect.height) * 2 - 1;
      rawRotY.set(nx * 2.2);
      rawRotX.set(-ny * 2.2);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={updateSpotlight}
      onMouseEnter={(e) => {
        updateSpotlight(e);
        cardRef.current?.style.setProperty("--spot-opacity", "1");
        onMouseEnter?.();
      }}
      onMouseLeave={() => {
        cardRef.current?.style.setProperty("--spot-opacity", "0");
        rawRotX.set(0);
        rawRotY.set(0);
      }}
      onFocus={onFocus}
      onClick={onClick}
      style={{
        ["--spot-x" as string]: "50%",
        ["--spot-y" as string]: "0%",
        ["--spot-opacity" as string]: "0",
        rotateX: tilt && !prefersReducedMotion ? rotateX : 0,
        rotateY: tilt && !prefersReducedMotion ? rotateY : 0,
        transformPerspective: 1000,
      }}
      className={`group/spot relative overflow-hidden rounded-2xl border transition-[border-color,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        active
          ? "border-primary/45 bg-[#0f0f15]"
          : "border-white/[0.08] bg-[#0b0b0f] hover:border-white/20"
      } ${className}`}
    >
      {/* Dynamic 120fps CSS-var Interior Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: active ? "max(0.65, var(--spot-opacity))" : "var(--spot-opacity)",
          background:
            "radial-gradient(360px circle at var(--spot-x) var(--spot-y), rgba(226, 190, 83, 0.14), transparent 72%)",
        }}
        aria-hidden="true"
      />

      {/* Precision Razor Border Rim Illumination */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl p-px transition-opacity duration-300"
        style={{
          opacity: active ? "max(0.7, var(--spot-opacity))" : "var(--spot-opacity)",
          background:
            "radial-gradient(240px circle at var(--spot-x) var(--spot-y), rgba(226, 190, 83, 0.54), transparent 70%)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}
