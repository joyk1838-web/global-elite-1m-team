import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: string | number;
  prefix?: string;
  suffix?: string;
  className?: string;
  durationMs?: number;
}

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  className = "",
  durationMs = 1100,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [display, setDisplay] = useState<string>(String(value));

  useEffect(() => {
    const rawStr = String(value).trim();
    const numeric = Number(rawStr.replace(/[^0-9.]/g, ""));
    if (!inView || Number.isNaN(numeric) || numeric === 0) {
      setDisplay(rawStr);
      return;
    }

    const hasComma = rawStr.includes(",");
    const decimals = rawStr.includes(".") ? (rawStr.split(".")[1]?.replace(/[^0-9]/g, "").length || 0) : 0;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setDisplay(rawStr);
      return;
    }

    const startTime = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / durationMs);
      // Expo ease out
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = numeric * eased;

      const formatted =
        decimals > 0
          ? currentVal.toFixed(decimals)
          : Math.round(currentVal).toString();

      if (hasComma) {
        const parts = formatted.split(".");
        parts[0] = Number(parts[0]).toLocaleString("en-US");
        setDisplay(parts.join("."));
      } else {
        setDisplay(formatted);
      }

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        setDisplay(rawStr);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [value, inView, durationMs]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
