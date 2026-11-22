import { Link } from "react-router-dom";
import { Instagram, Linkedin, Mail, Twitter } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useSiteConfig } from "../../context/SiteContext";

export default function Footer() {
  const { config } = useSiteConfig();

  const socialLinks = [
    { href: config.linkedinUrl, icon: Linkedin, label: "LinkedIn" },
    { href: config.twitterUrl, icon: Twitter, label: "X / Twitter" },
    { href: config.instagramUrl, icon: Instagram, label: "Instagram" },
    { href: config.contactEmail ? `mailto:${config.contactEmail}` : "", icon: Mail, label: "Email" },
  ].filter((item) => Boolean(item.href && item.href.trim() !== ""));

  return (
    <footer className="bg-[#09090b] border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 space-y-5">
            <Link to="/" className="inline-flex items-center gap-3">
              <Logo size="md" />
              <div className="flex flex-col leading-tight">
                <span className="font-heading text-xl font-semibold tracking-wider gold-gradient">
                  {config.companyName || "ELITE GROUP"}
                </span>
                <span className="text-xs text-zinc-400">
                  {config.tagline || "Building Excellence"}
                </span>
              </div>
            </Link>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              {config.mission}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3 pt-1">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={item.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    aria-label={item.label}
                    className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-zinc-400 hover:border-primary/50 hover:text-primary transition-colors"
                  >
                    <item.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-300 mb-5">
              Company
            </h4>
            <ul className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
              {[
                { label: "Home", path: "/" },
                { label: "Mission", path: "/mission" },
                { label: "Vision 2030", path: "/vision" },
                { label: "Leadership", path: "/team" },
                { label: "Progress", path: "/dashboard" },
                { label: "Roadmap", path: "/timeline" },
                { label: "Gallery", path: "/gallery" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-zinc-400 hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-300 mb-5">
              Corporate Portal
            </h4>
            <div className="space-y-3 text-sm text-zinc-400">
              {config.contactEmail && (
                <p>
                  <a
                    href={`mailto:${config.contactEmail}`}
                    className="hover:text-primary transition-colors"
                  >
                    {config.contactEmail}
                  </a>
                </p>
              )}
              <p>
                <Link to="/admin" className="text-primary hover:underline font-medium">
                  Executive Admin Portal
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} {config.companyName || "ELITE GROUP"}. All rights reserved.</p>
          <p>Dhaka · Dubai · London · Singapore</p>
        </div>
      </div>
    </footer>
  );
}
