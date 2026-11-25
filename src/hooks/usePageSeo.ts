import { useEffect } from "react";

const SITE_ORIGIN = "https://global-elite-1m-team.vercel.app";
const BRAND_NAME = "GLOBAL ELITE 1M TEAM";
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/assets/aistudio/IMG_8702_c83b4115.png`;

export interface PageSeoOptions {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  image?: string;
  jsonLd?: Record<string, unknown>;
}

function toAbsoluteUrl(src: string | undefined): string {
  if (!src) return DEFAULT_OG_IMAGE;
  if (/^https?:\/\//i.test(src)) return src;
  return `${SITE_ORIGIN}${src.startsWith("/") ? src : `/${src}`}`;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

export function usePageSeo({
  title,
  description,
  path,
  noindex = false,
  image,
  jsonLd,
}: PageSeoOptions) {
  const jsonLdSerialized = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const canonicalUrl = `${SITE_ORIGIN}${cleanPath === "/" ? "/" : cleanPath}`;
    const fullTitle = title.includes(BRAND_NAME) ? title : `${title} | ${BRAND_NAME}`;
    const resolvedImage = toAbsoluteUrl(image);

    document.title = fullTitle;
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    upsertCanonical(canonicalUrl);

    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:site_name", BRAND_NAME);
    upsertMeta("property", "og:image", resolvedImage);

    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", resolvedImage);

    const existingScript = document.head.querySelector('script[data-route-jsonld="true"]');
    if (jsonLdSerialized) {
      const script = existingScript || document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      script.setAttribute("data-route-jsonld", "true");
      script.textContent = jsonLdSerialized;
      if (!existingScript) {
        document.head.appendChild(script);
      }
    } else if (existingScript) {
      existingScript.remove();
    }

    return () => {
      const routeScript = document.head.querySelector('script[data-route-jsonld="true"]');
      if (routeScript) routeScript.remove();
    };
  }, [title, description, path, noindex, image, jsonLdSerialized]);
}
