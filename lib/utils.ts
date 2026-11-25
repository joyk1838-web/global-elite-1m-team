import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Validates anchor/navigation URLs so untrusted javascript: or data: schemes cannot execute.
 */
export function sanitizeHref(rawUrl: string | undefined | null, fallback = ""): string {
  const trimmed = String(rawUrl ?? "").trim();
  if (!trimmed) return fallback;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  if (/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(trimmed)) return trimmed;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return parsed.toString();
    }
  } catch {
    return fallback;
  }
  return fallback;
}

/**
 * Validates image src values, permitting https/http URLs, local asset paths, and base64 raster data URLs.
 */
export function sanitizeImageSrc(rawUrl: string | undefined | null, fallback = ""): string {
  const trimmed = String(rawUrl ?? "").trim();
  if (!trimmed) return fallback;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  if (/^data:image\/(jpeg|jpg|png|webp|gif);base64,[a-zA-Z0-9+/=]+$/i.test(trimmed)) {
    return trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return parsed.toString();
    }
  } catch {
    return fallback;
  }
  return fallback;
}
