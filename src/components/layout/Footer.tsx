import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Linkedin, Mail, Twitter, ArrowUpRight } from "lucide-react";
import { sanitizeHref } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { useSiteConfig } from "../../context/SiteContext";

function useExecutiveClock() {
  const [timeStr, setTimeStr] = useState(() =>
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      setTimeStr(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  return timeStr;
}

export default function Footer() {
  const { config } = useSiteConfig();
  const liveClock = useExecutiveClock();
  const brandDisplayName =
    config.companyName && config.companyName !== "ELITE GROUP"
      ? config.companyName
      : "GLOBAL ELITE 1M TEAM";

  const safeMailto = sanitizeHref(
    config.contactEmail ? `mailto:${config.contactEmail.trim()}` : "",
    ""
  );

  const socialLinks = [
    { href: sanitizeHref(config.linkedinUrl), icon: Linkedin, label: "LinkedIn" },
    { href: sanitizeHref(config.twitterUrl), icon: Twitter, label: "X / Twitter" },
    { href: sanitizeHref(config.instagramUrl), icon: Instagram, label: "Instagram" },
    { href: safeMailto, icon: Mail, label: "Email" },
  ].filter((item) => Boolean(item.href));

  return (
    <footer className="bg-[#050507] border-t border-white/[0.07] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Brand + Live Executive Clock Column */}
          <div className="lg:col-span-5 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3">
              <Logo size="md" />
              <div className="flex flex-col leading-tight">
                <span className="font-heading text-lg font-semibold tracking-tight text-zinc-50">
                  {brandDisplayName}
                </span>
                <span className="text-xs text-zinc-400">
                  {config.tagline || "One Team. One Vision. One Goal."}
                </span>
              </div>
            </Link>

            {safeMailto && (
              <div>
                <a
                  href={safeMailto}
                  className="text-base sm:text-xl font-medium text-zinc-100 hover:text-primary transition-colors inline-flex items-center gap-1.5 break-all"
                >
                  {config.contactEmail}
                  <ArrowUpRight className="w-4 h-4 text-primary shrink-0" />
                </a>
              </div>
            )}

            <div className="pt-2 space-y-1.5">
              <p className="text-xs text-zinc-500">
                Dhaka Headquarters · Serving Globally
              </p>
              <p className="font-mono text-3xl sm:text-4xl font-medium tracking-tight text-zinc-100 tabular-nums">
                {liveClock}
              </p>
            </div>

            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3 pt-1">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={item.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    aria-label={item.label}
                    className="w-11 h-11 rounded-lg border border-white/10 flex items-center justify-center text-zinc-400 hover:border-primary/50 hover:text-primary transition-colors"
                  >
                    <item.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Directory Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 pt-1">
            <div className="space-y-4">
              <h4 className="text-xs font-medium text-zinc-500">Navigation</h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  { label: "Home", path: "/" },
                  { label: "Mission", path: "/mission" },
                  { label: "Vision 2030", path: "/vision" },
                  { label: "Leadership", path: "/team" },
                ].map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-zinc-300 hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-medium text-zinc-500">Operations</h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  { label: "Progress Dashboard", path: "/dashboard" },
                  { label: "Strategic Roadmap", path: "/timeline" },
                  { label: "Visual Gallery", path: "/gallery" },
                ].map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-zinc-300 hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1 space-y-4">
              <h4 className="text-xs font-medium text-zinc-500">Core Values</h4>
              <div className="space-y-2.5 text-sm">
                <p className="text-zinc-300 text-xs font-medium tracking-wide">
                  DISCIPLINE · CONSISTENCY · TRANSPARENCY · GROWTH
                </p>
                <p className="text-zinc-400 leading-relaxed text-xs">
                  {config.mission}
                </p>
                <Link
                  to="/vision"
                  className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium"
                >
                  Explore Vision 2030
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 space-y-4">
          <p className="text-[11px] text-zinc-500 leading-relaxed max-w-4xl">
            Risk Disclaimer: Trading involves substantial financial risk. Past performance does not guarantee future results. Visitors should make independent financial decisions.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-zinc-500">
            <p>© {new Date().getFullYear()} {brandDisplayName}. All rights reserved.</p>
            <p>Dhaka · Dubai · London · Singapore</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
