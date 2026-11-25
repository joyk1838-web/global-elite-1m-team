import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { useSiteConfig } from "../../context/SiteContext";
import { useExecutiveChat } from "../../context/ChatContext";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/mission", label: "Mission" },
  { path: "/team", label: "Leadership" },
  { path: "/dashboard", label: "Progress" },
  { path: "/gallery", label: "Gallery" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const { config } = useSiteConfig();
  const { openChat } = useExecutiveChat();

  const brandDisplayName =
    config.companyName && config.companyName !== "ELITE GROUP"
      ? config.companyName
      : "GLOBAL ELITE 1M TEAM";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Lockup */}
        <Link
          to="/"
          className="flex items-center gap-2.5 sm:gap-3 min-w-0 shrink group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-lg py-1"
        >
          <Logo size="sm" className="shrink-0 group-hover:scale-105 transition-transform duration-200" />
          <span className="font-heading text-sm sm:text-base font-semibold tracking-tight text-zinc-50 truncate max-w-[180px] sm:max-w-none">
            {brandDisplayName}
          </span>
        </Link>

        {/* Zone 2: Clean Single-Line Navigation */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-7">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "relative py-1.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-sm",
                  isActive ? "text-zinc-50" : "text-zinc-400 hover:text-zinc-100"
                )}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-primary rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Single Executive Action */}
        <div className="hidden md:flex items-center shrink-0">
          <button
            type="button"
            onClick={() => openChat()}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all whitespace-nowrap shrink-0 border border-white/15 bg-white/[0.03] text-zinc-200 hover:border-primary/50 hover:text-primary cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Ask Strategist
          </button>
        </div>

        {/* Mobile Nav Toggle */}
        <button
          type="button"
          className="md:hidden p-2 text-zinc-400 hover:text-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-[#09090b]/95 backdrop-blur-xl border-b border-white/10"
          >
            <nav aria-label="Mobile Navigation" className="px-4 py-5 flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "min-h-[44px] flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-zinc-300 hover:bg-white/5"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                to="/vision"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "min-h-[44px] flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  pathname === "/vision"
                    ? "bg-primary/10 text-primary"
                    : "text-zinc-300 hover:bg-white/5"
                )}
              >
                Vision 2030
              </Link>
              <Link
                to="/timeline"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "min-h-[44px] flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  pathname === "/timeline"
                    ? "bg-primary/10 text-primary"
                    : "text-zinc-300 hover:bg-white/5"
                )}
              >
                Roadmap
              </Link>
              <div className="h-px bg-white/10 my-2" />
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  openChat();
                }}
                className="min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-primary border border-primary/35 hover:bg-primary/10 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Ask Strategist
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
