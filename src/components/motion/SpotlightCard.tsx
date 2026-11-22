import { useRef, useState, type MouseEvent, type ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  active?: boolean;
  onMouseEnter?: () => void;
  onFocus?: () => void;
  onClick?: () => void;
}

export function SpotlightCard({
  children,
  className = "",
  active = false,
  onMouseEnter,
  onFocus,
  onClick,
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState({ x: 50, y: 50, hovered: false });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      hovered: true,
    });
  };

  const handleMouseLeave = () => {
    setCoords((prev) => ({ ...prev, hovered: false }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setCoords((prev) => ({ ...prev, hovered: true }));
        onMouseEnter?.();
      }}
      onMouseLeave={handleMouseLeave}
      onFocus={onFocus}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border transition-colors duration-300 ${
        active
          ? "border-primary/45 bg-[#0f0f15]"
          : "border-white/[0.08] bg-[#0b0b0f] hover:border-white/20"
      } ${className}`}
    >
      {/* Dynamic Cursor Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: coords.hovered || active ? 1 : 0,
          background: coords.hovered
            ? `radial-gradient(320px circle at ${coords.x}px ${coords.y}px, rgba(226, 190, 83, 0.14), transparent 70%)`
            : "radial-gradient(360px circle at 50% 0%, rgba(226, 190, 83, 0.11), transparent 72%)",
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
