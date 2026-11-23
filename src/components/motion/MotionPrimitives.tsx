import { useRef, useId, type MouseEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";

export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const SCROLL_VIEWPORT = { once: true, amount: 0.12 } as const;

interface TextMaskRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  immediate?: boolean;
}

export function TextMaskReveal({
  children,
  className = "",
  delay = 0,
  immediate = false,
}: TextMaskRevealProps) {
  if (immediate) {
    return (
      <span className={`block overflow-hidden ${className}`}>
        <motion.span
          className="block"
          initial={{ y: "105%", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.82, delay, ease: EASE_OUT_EXPO }}
        >
          {children}
        </motion.span>
      </span>
    );
  }

  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "105%", opacity: 0, filter: "blur(5px)" }}
        whileInView={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
        viewport={SCROLL_VIEWPORT}
        transition={{ duration: 0.78, delay, ease: EASE_OUT_EXPO }}
      >
        {children}
      </motion.span>
    </span>
  );
}

interface WordStaggerRevealProps {
  text: string;
  className?: string;
  delay?: number;
  immediate?: boolean;
}

export function WordStaggerReveal({
  text,
  className = "",
  delay = 0,
  immediate = false,
}: WordStaggerRevealProps) {
  const words = text.trim().split(/\s+/);

  return (
    <span className={`inline-flex flex-wrap gap-x-[0.28em] ${className}`}>
      {words.map((word, idx) => (
        <span key={`${word}-${idx}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0 }}
            {...(immediate
              ? { animate: { y: "0%", opacity: 1 } }
              : { whileInView: { y: "0%", opacity: 1 }, viewport: SCROLL_VIEWPORT })}
            transition={{
              duration: 0.72,
              delay: delay + idx * 0.055,
              ease: EASE_OUT_EXPO,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

interface MagneticWrapProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticWrap({
  children,
  className = "",
  strength = 0.22,
}: MagneticWrapProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 320, damping: 24, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 320, damping: 24, mass: 0.5 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    rawX.set(dx * strength);
    rawY.set(dy * strength);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

interface ParallaxFrameProps {
  children: ReactNode;
  className?: string;
  offsetY?: number;
}

export function ParallaxFrame({
  children,
  className = "",
  offsetY = 26,
}: ParallaxFrameProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 30,
    restDelta: 0.001,
  });
  const y = useTransform(smoothProgress, [0, 1], [offsetY, -offsetY]);

  return (
    <div ref={containerRef} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

interface RadialProgressRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
}

export function RadialProgressRing({
  percent,
  size = 168,
  strokeWidth = 10,
  label,
  sublabel,
}: RadialProgressRingProps) {
  const gradId = useId();
  const clamped = Math.max(0, Math.min(100, percent));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3df9b" />
            <stop offset="55%" stopColor="#e2be53" />
            <stop offset="100%" stopColor="#b88e25" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: targetOffset }}
          transition={{ duration: 1.35, ease: EASE_OUT_EXPO }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3">
        {label && (
          <span className="font-mono text-2xl font-semibold text-zinc-50 tabular-nums">
            {label}
          </span>
        )}
        {sublabel && (
          <span className="text-[11px] font-medium text-zinc-400 mt-0.5">{sublabel}</span>
        )}
      </div>
    </div>
  );
}

interface MiniSparklineProps {
  values: number[];
  className?: string;
}

export function MiniSparkline({ values, className = "" }: MiniSparklineProps) {
  const gradId = useId();
  const safeValues = values.length >= 2 ? values : [1, 2];
  const min = Math.min(...safeValues);
  const max = Math.max(...safeValues);
  const range = Math.max(1, max - min);
  const width = 120;
  const height = 36;
  const padY = 4;

  const points = safeValues.map((v, i) => {
    const x = (i / (safeValues.length - 1)) * width;
    const y = height - padY - ((v - min) / range) * (height - padY * 2);
    return { x, y };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;
  const last = points[points.length - 1];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={`w-full h-9 overflow-visible ${className}`}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2be53" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#e2be53" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={areaPath}
        fill={`url(#${gradId})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.2 }}
      />
      <motion.path
        d={linePath}
        fill="none"
        stroke="#e2be53"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0.4 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.15, ease: EASE_OUT_EXPO }}
      />
      <motion.circle
        cx={last.x}
        cy={last.y}
        r="2.8"
        fill="#f3df9b"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.85, duration: 0.35 }}
      />
    </svg>
  );
}

interface KineticMarqueeProps {
  items: string[];
  className?: string;
}

export function KineticMarquee({ items, className = "" }: KineticMarqueeProps) {
  const repeated = [...items, ...items];

  return (
    <div
      className={`group/marquee relative overflow-hidden border-y border-white/[0.06] bg-[#060609] py-4 select-none ${className}`}
      style={{
        maskImage: "linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%)",
      }}
    >
      <div className="flex w-max animate-marquee items-center gap-8">
        {repeated.map((label, idx) => (
          <div key={`${label}-${idx}`} className="flex items-center gap-8 shrink-0">
            <span className="font-heading text-xs sm:text-sm font-medium tracking-[0.2em] uppercase text-zinc-400 whitespace-nowrap">
              {label}
            </span>
            <span className="text-primary/50 text-xs" aria-hidden="true">
              ◆
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
