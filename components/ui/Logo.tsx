import { Crown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const [error, setError] = useState(false);

  const sizes = {
    sm: "w-10 h-10 p-1 rounded-lg",
    md: "w-12 h-12 p-1 rounded-xl",
    lg: "w-28 h-28 p-2 rounded-2xl"
  };

  const iconSizes = {
    sm: 20,
    md: 24,
    lg: 48
  };

  return (
    <div className={cn(
      "flex items-center justify-center gold-border gold-glow overflow-hidden transition-all duration-500",
      error ? "bg-primary" : "bg-white",
      sizes[size],
      className
    )}>
      {!error ? (
        <img
          src="/assets/aistudio/IMG_8702_c83b4115.png"
          alt="ELITE 1M Official Logo"
          className="w-full h-full object-contain"
          onError={() => setError(true)}
        />
      ) : (
        <Crown size={iconSizes[size]} className="text-black animate-pulse" />
      )}
    </div>
  );
}
