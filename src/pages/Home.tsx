import { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  MessageSquare,
  Send,
  Quote,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getBrands, getTeam } from "../services/firebase";
import { Logo } from "@/components/ui/Logo";
import { useSiteConfig } from "../context/SiteContext";
import { useExecutiveChat } from "../context/ChatContext";
import { DEFAULT_BRANDS, DEFAULT_TEAM, LOCAL_ASSETS } from "../lib/defaults";
import { ParticleSculpture, type ParticleShape } from "../components/motion/ParticleSculpture";
import { AnimatedCounter } from "../components/motion/AnimatedCounter";
import { SpotlightCard } from "../components/motion/SpotlightCard";

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface CapabilityItem {
  num: string;
  title: string;
  category: string;
  shape: ParticleShape;
  summary: string;
  pillars: string[];
}

const CAPABILITIES: CapabilityItem[] = [
  {
    num: "01",
    title: "Corporate Strategy",
    category: "Capital Architecture · Governance",
    shape: "sphere",
    summary:
      "Structuring disciplined capital allocation, holding governance, and long-horizon compounding across our operating units.",
    pillars: ["Capital Allocation", "Governance", "Venture Structuring"],
  },
  {
    num: "02",
    title: "Digital Infrastructure",
    category: "Engineering · Automation",
    shape: "cube",
    summary:
      "Building resilient cloud platforms, real-time analytics dashboards, and operational automation pipelines that scale globally.",
    pillars: ["Cloud Systems", "Data Pipelines", "Executive Tooling"],
  },
  {
    num: "03",
    title: "Revenue Scaling",
    category: "Commercial Growth · $1K to $1M",
    shape: "chart",
    summary:
      "Validating unit economics, expanding recurring revenue streams, and compounding portfolio equity toward the $1M milestone.",
    pillars: ["Unit Economics", "Distribution", "Compounding Growth"],
  },
  {
    num: "04",
    title: "Consumer Luxury",
    category: "Beverage · Formulation",
    shape: "helix",
    summary:
      "Crafting flagship consumer brands led by Elite Soft Drink with uncompromising formulation standards and modern brand positioning.",
    pillars: ["Product Craft", "Supply Chain", "Retail Presence"],
  },
  {
    num: "05",
    title: "Bespoke Fashion",
    category: "Apparel · Tailoring",
    shape: "diamonds",
    summary:
      "Designing tailored executive collections under Elite Fashion built for discerning leaders across international markets.",
    pillars: ["Material Sourcing", "Atelier Craft", "Global Lookbooks"],
  },
  {
    num: "06",
    title: "Executive Intelligence",
    category: "Advisory · AI Strategy",
    shape: "constellation",
    summary:
      "Equipping leadership with real-time strategic synthesis, scenario modeling, and 24/7 operational decision support.",
    pillars: ["Scenario Planning", "KPI Telemetry", "Advisory Chat"],
  },
];

export default function Home() {
  const { config } = useSiteConfig();
  const { openChat } = useExecutiveChat();
  const [brands, setBrands] = useState<any[]>(DEFAULT_BRANDS);
  const [teamMembers, setTeamMembers] = useState<any[]>(DEFAULT_TEAM);
  const [activeCapIndex, setActiveCapIndex] = useState(0);
  const [activeVentureIndex, setActiveVentureIndex] = useState(0);
  const [inlinePrompt, setInlinePrompt] = useState("");

  useEffect(() => {
    getBrands().then((data) => {
      if (data && data.length > 0) setBrands(data);
    });
    getTeam().then((data) => {
      if (data && data.length > 0) setTeamMembers(data.slice(0, 3));
    });
  }, []);

  const activeCap = CAPABILITIES[activeCapIndex] || CAPABILITIES[0];
  const activeVenture = brands[activeVentureIndex] || brands[0] || DEFAULT_BRANDS[0];

  const handleInlineAsk = (e: FormEvent) => {
    e.preventDefault();
    if (!inlinePrompt.trim()) {
      openChat();
      return;
    }
    const query = inlinePrompt.trim();
    setInlinePrompt("");
    openChat(query);
  };

  // Split multi-word hero title cleanly for crisp 2026 contrast without losing Admin edits
  const titleWords = (config.heroTitle || "Building Excellence").trim().split(/\s+/);
  const leadWords = titleWords.length > 1 ? titleWords.slice(0, -1).join(" ") : "";
  const accentWord = titleWords.length > 1 ? titleWords[titleWords.length - 1] : titleWords[0];

  return (
    <div className="w-full overflow-x-clip">
      {/* 1. Full-Bleed 2026 Obsidian Hero */}
      <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between bg-[#050507] overflow-hidden">
        {/* Masked Architectural Grid & Atmospheric Light */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute inset-0 architectural-grid opacity-80"
            style={{
              maskImage: "radial-gradient(ellipse 75% 70% at 55% 42%, #000 20%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 75% 70% at 55% 42%, #000 20%, transparent 100%)",
            }}
          />
          <div
            className="absolute -inset-1/4 animate-ambient-pan"
            style={{
              background:
                "radial-gradient(circle at 68% 42%, rgba(226, 190, 83, 0.14) 0%, transparent 45%), radial-gradient(circle at 22% 24%, rgba(148, 163, 184, 0.06) 0%, transparent 42%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050507] to-transparent" />
        </div>

        {/* Interactive 3D Particle Sphere Stage */}
        <div className="relative lg:absolute lg:inset-y-0 lg:right-0 lg:w-[56%] h-[300px] sm:h-[380px] lg:h-full z-10">
          <ParticleSculpture shape="sphere" interactive density={600} />
        </div>

        {/* Main Container */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 lg:pt-24 pb-10 flex-1 flex flex-col justify-between pointer-events-none">
          <div className="max-w-2xl space-y-7">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
              className="flex items-center gap-3.5"
            >
              <Logo size="sm" />
              <span className="text-xs font-medium tracking-[0.18em] uppercase text-zinc-400">
                {config.heroEyebrow}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.06, ease: EASE_OUT_EXPO }}
              className="font-heading text-5xl sm:text-7xl lg:text-[5.25rem] font-semibold tracking-[-0.035em] leading-[1.02] text-zinc-50"
            >
              {leadWords && <span className="block text-zinc-50">{leadWords}</span>}
              <span className="block gold-gradient">{accentWord}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.14, ease: EASE_OUT_EXPO }}
              className="text-base sm:text-lg text-zinc-400 max-w-lg leading-relaxed"
            >
              {config.heroSubtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22, ease: EASE_OUT_EXPO }}
              className="flex flex-wrap items-center gap-5 pt-2 pointer-events-auto"
            >
              <button
                type="button"
                onClick={() => openChat()}
                className="inline-flex items-center gap-2.5 h-12 px-7 rounded-full bg-zinc-50 text-zinc-950 hover:bg-primary hover:text-zinc-950 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                Ask AI Strategist
              </button>

              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-full border border-white/15 bg-white/[0.02] hover:border-primary/45 hover:text-primary text-sm font-medium text-zinc-200 transition-colors"
              >
                Progress Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* Hairline Bottom Metrics Rail */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3, ease: EASE_OUT_EXPO }}
            className="mt-14 pt-8 border-t border-white/[0.08] flex flex-wrap items-end justify-between gap-8"
          >
            <div className="grid grid-cols-3 gap-8 sm:gap-14">
              <div className="space-y-1">
                <p className="font-mono text-2xl sm:text-3xl font-medium text-zinc-50">
                  <AnimatedCounter value={config.netWorth} prefix="$" suffix="+" />
                </p>
                <p className="text-xs text-zinc-500">Assets Under Mgmt</p>
              </div>
              <div className="space-y-1">
                <p className="font-mono text-2xl sm:text-3xl font-medium text-primary">
                  <AnimatedCounter value={config.multiplier} prefix="x" />
                </p>
                <p className="text-xs text-zinc-500">Growth Multiplier</p>
              </div>
              <div className="space-y-1">
                <p className="font-mono text-2xl sm:text-3xl font-medium text-zinc-50 tabular-nums">
                  24/7
                </p>
                <p className="text-xs text-zinc-500">Executive Advisory</p>
              </div>
            </div>

            <p className="hidden md:block text-xs text-zinc-500 tracking-wide">
              ELITE GROUP · Global Trajectory
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Morphing 3D Capabilities Showcase */}
      <section className="border-t border-white/[0.07] py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary">
                Operating Architecture
              </p>
              <h2 className="font-heading text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-50">
                Engineered for compounding scale
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base text-zinc-400 leading-relaxed">
              Select or hover any discipline below to inspect our execution pillars and watch the interactive lattice morph.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Sticky Void 3D Morphing Canvas */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              <div className="h-[320px] sm:h-[380px] lg:h-[420px] relative">
                <ParticleSculpture shape={activeCap.shape} interactive density={500} />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCap.num}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                  className="pt-5 border-t border-white/[0.08] flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-xs text-zinc-500">{activeCap.category}</p>
                    <p className="font-heading text-xl font-semibold text-zinc-100 mt-0.5">
                      {activeCap.num}. {activeCap.title}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      openChat(`Explain ELITE GROUP's ${activeCap.title} framework.`)
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline cursor-pointer shrink-0"
                  >
                    Ask Strategist
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Interactive Cursor-Spotlight Grid */}
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
              {CAPABILITIES.map((cap, idx) => {
                const isActive = idx === activeCapIndex;
                return (
                  <div key={cap.num} className="h-full">
                    <SpotlightCard
                      active={isActive}
                      onMouseEnter={() => setActiveCapIndex(idx)}
                      onFocus={() => setActiveCapIndex(idx)}
                      className="h-full"
                    >
                    <button
                      type="button"
                      onClick={() => setActiveCapIndex(idx)}
                      className="w-full h-full text-left p-6 flex flex-col justify-between gap-5 cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <span
                            className={`font-mono text-xs tabular-nums ${
                              isActive ? "text-primary" : "text-zinc-500"
                            }`}
                          >
                            {cap.num}
                          </span>
                          <h3 className="font-heading text-lg font-semibold text-zinc-100">
                            {cap.title}
                          </h3>
                        </div>
                        <ArrowUpRight
                          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                            isActive
                              ? "text-primary translate-x-0.5 -translate-y-0.5"
                              : "text-zinc-600"
                          }`}
                        />
                      </div>

                      <p className="text-sm text-zinc-400 leading-relaxed">
                        {cap.summary}
                      </p>

                      <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500">
                        {cap.pillars.map((pillar, pIdx) => (
                          <span key={pillar} className="inline-flex items-center gap-2">
                            <span className={isActive ? "text-zinc-300" : "text-zinc-500"}>
                              {pillar}
                            </span>
                            {pIdx < cap.pillars.length - 1 && (
                              <span aria-hidden="true" className="text-zinc-700">
                                ·
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </button>
                  </SpotlightCard>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Full-Bleed Ventures Index & Live Hover Visual */}
      <section className="border-t border-white/[0.07] py-24 sm:py-32 bg-[#07070a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary">
                Portfolio Divisions
              </p>
              <h2 className="font-heading text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-50">
                Core Ventures
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base text-zinc-400 leading-relaxed">
              Category-focused businesses spanning ultra-premium consumer beverages, structured finance, and tailored apparel.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Numbered Editorial Venture List */}
            <div className="lg:col-span-7 divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {brands.map((brand, idx) => {
                const isSelected = idx === activeVentureIndex;
                return (
                  <div
                    key={brand.id || idx}
                    onMouseEnter={() => setActiveVentureIndex(idx)}
                    onClick={() => setActiveVentureIndex(idx)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveVentureIndex(idx);
                      }
                    }}
                    className={`group py-7 px-3 sm:px-5 transition-colors cursor-pointer flex items-center justify-between gap-6 ${
                      isSelected ? "bg-white/[0.03]" : "hover:bg-white/[0.015]"
                    }`}
                  >
                    <div className="flex items-baseline gap-6 sm:gap-8 min-w-0">
                      <span
                        className={`font-mono text-xs tabular-nums shrink-0 transition-colors ${
                          isSelected ? "text-primary" : "text-zinc-600"
                        }`}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 space-y-1">
                        <h3
                          className={`font-heading text-2xl sm:text-3xl font-semibold tracking-tight transition-colors truncate ${
                            isSelected
                              ? "text-zinc-50"
                              : "text-zinc-400 group-hover:text-zinc-100"
                          }`}
                        >
                          {brand.name}
                        </h3>
                        <p className="text-xs text-zinc-500">
                          <span>{brand.tagline}</span>
                          <span aria-hidden="true" className="mx-2 text-zinc-700">
                            ·
                          </span>
                          <span>Operating Division</span>
                        </p>
                      </div>
                    </div>

                    <Link
                      to={brand.link && brand.link !== "#" ? brand.link : "/vision"}
                      aria-label={`Explore ${brand.name}`}
                      onClick={(e) => e.stopPropagation()}
                      className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition-all duration-200 ${
                        isSelected
                          ? "border-primary bg-primary text-zinc-950 scale-105"
                          : "border-white/15 text-zinc-500 group-hover:border-white/35 group-hover:text-zinc-100"
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Sticky Preview Frame */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeVenture?.id || activeVentureIndex}
                  initial={{ opacity: 0, y: 10, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.985 }}
                  transition={{ duration: 0.32, ease: EASE_OUT_EXPO }}
                  className="rounded-2xl border border-white/[0.08] bg-[#0b0b0f] overflow-hidden"
                >
                  <div className="aspect-[16/10] relative overflow-hidden bg-zinc-950">
                    <img
                      src={activeVenture?.image || LOCAL_ASSETS.corporateHq}
                      alt={activeVenture?.name || "ELITE GROUP Venture"}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = LOCAL_ASSETS.corporateHq;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-black/15 to-transparent" />
                  </div>

                  <div className="p-7 space-y-4">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-primary">
                        {activeVenture?.tagline}
                      </p>
                      <h3 className="font-heading text-2xl font-semibold text-zinc-50">
                        {activeVenture?.name}
                      </h3>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {activeVenture?.desc}
                    </p>
                    <div className="pt-3 border-t border-white/[0.07] flex items-center justify-between gap-4">
                      <Link
                        to={
                          activeVenture?.link && activeVenture.link !== "#"
                            ? activeVenture.link
                            : "/vision"
                        }
                        className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-zinc-100 hover:text-primary transition-colors"
                      >
                        Explore Division
                        <ArrowRight className="ml-2 w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          openChat(`Give me an executive brief on ${activeVenture?.name}.`)
                        }
                        className="text-xs text-zinc-400 hover:text-primary transition-colors cursor-pointer"
                      >
                        Ask Strategist
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Full-Bleed Luminous Curved Horizon & Executive Leadership */}
      <section className="relative border-t border-white/[0.07] pt-24 pb-24 sm:pb-32 overflow-hidden">
        {/* Full-Width Curved Horizon Rim */}
        <div
          className="pointer-events-none max-w-6xl mx-auto px-4 relative"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1200 160"
            preserveAspectRatio="none"
            className="w-full h-24 sm:h-36"
          >
            <defs>
              <radialGradient id="horizonRimGlow" cx="50%" cy="100%" r="65%">
                <stop offset="0%" stopColor="rgba(226, 190, 83, 0.28)" />
                <stop offset="60%" stopColor="rgba(226, 190, 83, 0.06)" />
                <stop offset="100%" stopColor="rgba(5, 5, 7, 0)" />
              </radialGradient>
            </defs>
            <path
              d="M 0 150 Q 600 8 1200 150 L 1200 160 L 0 160 Z"
              fill="url(#horizonRimGlow)"
            />
            <path
              d="M 0 150 Q 600 8 1200 150"
              fill="none"
              stroke="rgba(226, 190, 83, 0.45)"
              strokeWidth="1.25"
            />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          <div className="max-w-3xl mx-auto text-center space-y-5 -mt-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Global Mandate
            </p>
            <h2 className="font-heading text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-50">
              Expanding Across Strategic Corridors
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              {config.vision}
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm font-medium text-zinc-300">
              <span>Dhaka HQ</span>
              <span className="text-primary/60" aria-hidden="true">·</span>
              <span>Dubai</span>
              <span className="text-primary/60" aria-hidden="true">·</span>
              <span>London</span>
              <span className="text-primary/60" aria-hidden="true">·</span>
              <span>Singapore</span>
            </div>
          </div>

          {/* Executive Leadership Board */}
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
              <div className="space-y-2.5">
                <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary">
                  Executive Board
                </p>
                <h2 className="font-heading text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-50">
                  Leadership Team
                </h2>
              </div>
              <Link
                to="/team"
                className="inline-flex items-center gap-2 h-10 px-5 rounded-full border border-white/15 hover:border-primary/45 hover:text-primary text-xs font-medium text-zinc-200 transition-colors self-start md:self-auto"
              >
                View Full Leadership
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {teamMembers.map((member, i) => (
                <motion.div
                  key={member.id || i}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: i * 0.08, ease: EASE_OUT_EXPO }}
                  viewport={{ once: true, amount: 0.15 }}
                  className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0c10]"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-[1.04]"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = LOCAL_ASSETS.strategyRoom;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent flex flex-col justify-end p-7">
                    <p className="text-primary text-xs font-medium tracking-wide mb-1">
                      {member.role}
                    </p>
                    <h3 className="font-heading text-2xl font-semibold text-white">
                      {member.name}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. 2026 Executive Command Bar + Silk Horizon Closing Banner */}
      <section className="border-t border-white/[0.07] bg-[#07070a] py-24 sm:py-32 relative overflow-hidden">
        <div
          className="pointer-events-none absolute -inset-y-16 left-1/4 w-2/3 bg-gradient-to-r from-transparent via-primary/[0.12] to-transparent blur-3xl animate-silk-sweep"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Interactive Strategist Command Palette Bar */}
          <div className="rounded-2xl border border-white/[0.09] bg-[#0c0c12]/90 backdrop-blur-xl p-6 sm:p-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-xs font-medium tracking-[0.18em] uppercase text-primary">
                  Executive Intelligence
                </p>
                <h2 className="font-heading text-2xl font-semibold text-zinc-50 mt-1">
                  Consult the AI Strategist
                </h2>
              </div>
              <p className="text-xs text-zinc-500">Real-time portfolio & roadmap synthesis</p>
            </div>

            <form onSubmit={handleInlineAsk} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                value={inlinePrompt}
                onChange={(e) => setInlinePrompt(e.target.value)}
                placeholder="Ask about our $1K to $1M scaling strategy, divisions, or 2030 targets..."
                className="flex-1 h-12 px-5 rounded-full bg-black/50 border border-white/15 focus:border-primary/60 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-zinc-50 text-zinc-950 hover:bg-primary text-sm font-semibold transition-colors shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Start Briefing
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-500">
              <span>Quick briefings:</span>
              {["$1M Roadmap", "Elite Soft Drink", "Leadership Board"].map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => openChat(`Brief me on ${topic}`)}
                  className="text-zinc-300 hover:text-primary underline underline-offset-4 cursor-pointer transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Closing Editorial Quote & Final Action */}
          <div className="text-center space-y-6 pt-4">
            <Quote className="w-6 h-6 text-primary/70 mx-auto" />
            <h2 className="font-heading text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-50 leading-tight">
              We turn bold vision into lasting global enterprises.
            </h2>
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              "{config.mdBannerQuote}"
            </p>
            <p className="text-xs font-medium tracking-widest uppercase text-primary">
              {config.mdName} · {config.mdRole}
            </p>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => openChat()}
                className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-primary text-zinc-950 hover:brightness-110 text-sm font-semibold transition-all cursor-pointer"
              >
                Launch Strategist Chat
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                to="/vision"
                className="inline-flex items-center gap-2 h-12 px-7 rounded-full border border-white/15 hover:border-primary/45 hover:text-primary text-sm font-medium text-zinc-200 transition-colors"
              >
                Explore Vision 2030
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
