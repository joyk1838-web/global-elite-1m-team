import { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  MessageSquare,
  Send,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getBrands, getTeam } from "../services/firebase";
import { Logo } from "@/components/ui/Logo";
import { useSiteConfig } from "../context/SiteContext";
import { useExecutiveChat } from "../context/ChatContext";
import { DEFAULT_BRANDS, DEFAULT_TEAM, LOCAL_ASSETS } from "../lib/defaults";
import { ParticleSculpture, type ParticleShape } from "../components/motion/ParticleSculpture";
import { AnimatedCounter } from "../components/motion/AnimatedCounter";

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

  return (
    <div className="space-y-28 md:space-y-36 pb-16">
      {/* 1. Kinetic Obsidian Hero with Interactive 3D Particle Sphere */}
      <section className="relative min-h-[82vh] flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#070709] px-6 sm:px-10 lg:px-14 py-12 sm:py-16">
        {/* Atmospheric Backdrop + Architectural Grid */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 architectural-grid opacity-70" />
          <div
            className="absolute -inset-1/4 animate-ambient-pan"
            style={{
              background:
                "radial-gradient(circle at 68% 45%, rgba(212, 175, 55, 0.16) 0%, transparent 48%), radial-gradient(circle at 22% 75%, rgba(99, 102, 241, 0.08) 0%, transparent 45%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070709]/40 via-transparent to-[#070709]" />
        </div>

        {/* Interactive 3D Particle Sphere Layer */}
        <div className="relative lg:absolute lg:inset-y-0 lg:right-0 lg:w-[54%] h-[280px] sm:h-[340px] lg:h-full z-10 order-1 lg:order-none">
          <ParticleSculpture shape="sphere" interactive density={560} />
        </div>

        {/* Hero Foreground Editorial Copy */}
        <div className="relative z-20 max-w-2xl space-y-6 pt-4 lg:pt-10 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
            className="flex items-center gap-3.5"
          >
            <Logo size="sm" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-primary">
              {config.heroEyebrow}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE_OUT_EXPO }}
            className="font-heading text-4xl sm:text-6xl lg:text-[4.5rem] font-semibold tracking-tight leading-[1.05] text-zinc-50"
          >
            <span className="gold-gradient">{config.heroTitle}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: EASE_OUT_EXPO }}
            className="text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed"
          >
            {config.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.24, ease: EASE_OUT_EXPO }}
            className="flex flex-wrap items-center gap-4 pt-2 pointer-events-auto"
          >
            <Button
              type="button"
              size="lg"
              onClick={() => openChat()}
              className="h-12 px-7 rounded-full text-sm font-semibold gold-glow hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <MessageSquare className="mr-2 w-4 h-4" />
              Ask AI Strategist
            </Button>

            <Link to="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-7 rounded-full text-sm font-medium border-white/15 hover:border-primary/45 hover:bg-primary/5 cursor-pointer"
              >
                View Progress Dashboard
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Bottom Baseline KPI Strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32, ease: EASE_OUT_EXPO }}
          className="relative z-20 mt-12 pt-8 border-t border-white/10 grid grid-cols-3 gap-6 max-w-2xl"
        >
          <div className="space-y-1">
            <p className="font-mono text-2xl sm:text-3xl font-semibold text-zinc-100">
              <AnimatedCounter value={config.netWorth} prefix="$" suffix="+" />
            </p>
            <p className="text-xs text-zinc-400">Assets Under Mgmt</p>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-2xl sm:text-3xl font-semibold gold-gradient">
              <AnimatedCounter value={config.multiplier} prefix="x" />
            </p>
            <p className="text-xs text-zinc-400">Growth Multiplier</p>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-2xl sm:text-3xl font-semibold text-zinc-100 tabular-nums">
              24/7
            </p>
            <p className="text-xs text-zinc-400">Executive Advisory</p>
          </div>
        </motion.div>
      </section>

      {/* 2. Interactive Morphing Capabilities Section (Video-Inspired 3D Canvas + Deck) */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2.5">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary">
              Operating Architecture
            </p>
            <h2 className="font-heading text-3xl md:text-5xl font-semibold tracking-tight text-zinc-50">
              Our Capabilities
            </h2>
          </div>
          <p className="max-w-md text-sm md:text-base text-zinc-400 leading-relaxed">
            Hover or select any capability below to inspect our execution model and watch the live 3D lattice transform.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Morphing 3D Particle Canvas */}
          <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#0b0b0e] p-6 flex flex-col justify-between min-h-[340px] lg:min-h-[460px] relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-zinc-400 z-10">
              <span className="font-mono text-primary tabular-nums">{activeCap.num}</span>
              <span>{activeCap.category}</span>
            </div>

            <div className="flex-1 min-h-[260px] relative my-2">
              <ParticleSculpture
                shape={activeCap.shape}
                interactive
                density={480}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCap.num}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                className="pt-4 border-t border-white/10 flex items-center justify-between gap-4 z-10"
              >
                <span className="font-heading text-xl font-semibold text-zinc-100">
                  {activeCap.title}
                </span>
                <button
                  type="button"
                  onClick={() => openChat(`Tell me more about ELITE GROUP's ${activeCap.title} capability.`)}
                  className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1 cursor-pointer shrink-0"
                >
                  Ask Strategist
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Interactive Capability Cards */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {CAPABILITIES.map((cap, idx) => {
              const isActive = idx === activeCapIndex;
              return (
                <motion.button
                  key={cap.num}
                  type="button"
                  onMouseEnter={() => setActiveCapIndex(idx)}
                  onFocus={() => setActiveCapIndex(idx)}
                  onClick={() => setActiveCapIndex(idx)}
                  layout
                  transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                  className={`text-left p-6 rounded-2xl border transition-colors flex flex-col justify-between gap-5 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-br from-primary/[0.16] via-[#131318] to-[#0b0b0e] border-primary/50 shadow-[0_12px_36px_-14px_rgba(212,175,55,0.3)]"
                      : "bg-[#111114] border-white/10 hover:border-white/25"
                  }`}
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
                      <h3 className="font-heading text-xl font-semibold text-zinc-100">
                        {cap.title}
                      </h3>
                    </div>
                    <ArrowUpRight
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                        isActive ? "text-primary translate-x-0.5 -translate-y-0.5" : "text-zinc-500"
                      }`}
                    />
                  </div>

                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {cap.summary}
                  </p>

                  <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-zinc-400">
                    {cap.pillars.map((pillar, pIdx) => (
                      <span key={pillar} className="inline-flex items-center gap-2.5">
                        <span className={isActive ? "text-zinc-200" : "text-zinc-400"}>
                          {pillar}
                        </span>
                        {pIdx < cap.pillars.length - 1 && (
                          <span aria-hidden="true" className="text-zinc-600">
                            ·
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Interactive Ventures & Case Studies Preview (Video-Inspired Hover Row Showcase) */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2.5">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary">
              Portfolio Divisions
            </p>
            <h2 className="font-heading text-3xl md:text-5xl font-semibold tracking-tight text-zinc-50">
              Core Ventures
            </h2>
          </div>
          <p className="max-w-md text-sm md:text-base text-zinc-400 leading-relaxed">
            Focused operating companies spanning consumer luxury, structured finance, and tailored apparel.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Interactive Numbered Venture Rows */}
          <div className="lg:col-span-7 divide-y divide-white/10 border-y border-white/10">
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
                  className={`group py-6 px-4 sm:px-5 transition-colors cursor-pointer flex items-center justify-between gap-6 ${
                    isSelected ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-baseline gap-5 sm:gap-7 min-w-0">
                    <span
                      className={`font-mono text-xs tabular-nums shrink-0 transition-colors ${
                        isSelected ? "text-primary" : "text-zinc-500"
                      }`}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 space-y-1">
                      <h3
                        className={`font-heading text-2xl sm:text-3xl font-semibold tracking-tight transition-colors truncate ${
                          isSelected ? "text-zinc-50" : "text-zinc-300 group-hover:text-zinc-100"
                        }`}
                      >
                        {brand.name}
                      </h3>
                      <p className="text-xs text-zinc-400">
                        <span>{brand.tagline}</span>
                        <span aria-hidden="true" className="mx-2 text-zinc-600">
                          ·
                        </span>
                        <span>Active Operating Unit</span>
                      </p>
                    </div>
                  </div>

                  <Link
                    to={brand.link && brand.link !== "#" ? brand.link : "/vision"}
                    aria-label={`Explore ${brand.name}`}
                    className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-white/15 text-zinc-400 group-hover:border-primary/50 group-hover:text-primary"
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Right Live Preview Frame */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeVenture?.id || activeVentureIndex}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                className="rounded-2xl border border-white/10 bg-[#111114] overflow-hidden"
              >
                <div className="aspect-[16/10] relative overflow-hidden bg-zinc-900">
                  <img
                    src={activeVenture?.image || LOCAL_ASSETS.corporateHq}
                    alt={activeVenture?.name || "ELITE GROUP Venture"}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = LOCAL_ASSETS.corporateHq;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                </div>

                <div className="p-7 space-y-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-primary">
                      {activeVenture?.tagline}
                    </p>
                    <h3 className="font-heading text-2xl font-semibold text-zinc-100">
                      {activeVenture?.name}
                    </h3>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {activeVenture?.desc}
                  </p>
                  <div className="pt-2 flex items-center justify-between gap-4 border-t border-white/10">
                    <Link
                      to={
                        activeVenture?.link && activeVenture.link !== "#"
                          ? activeVenture.link
                          : "/vision"
                      }
                      className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-primary hover:underline"
                    >
                      Explore Venture
                      <ArrowRight className="ml-2 w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        openChat(`Give me an executive brief on ${activeVenture?.name}.`)
                      }
                      className="text-xs text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
                    >
                      Ask Strategist
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 4. Curved Horizon Expansion Arc (Inspired by Video 00:22) + Leadership */}
      <section className="space-y-20">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#070709] pt-16 pb-14 px-6 text-center">
          {/* Luminous Curved Horizon Arc */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-44"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 1200 220"
              preserveAspectRatio="none"
              className="w-full h-full"
            >
              <defs>
                <radialGradient id="horizonGlow" cx="50%" cy="100%" r="70%">
                  <stop offset="0%" stopColor="rgba(212, 175, 55, 0.35)" />
                  <stop offset="55%" stopColor="rgba(212, 175, 55, 0.08)" />
                  <stop offset="100%" stopColor="rgba(9, 9, 11, 0)" />
                </radialGradient>
              </defs>
              <path
                d="M -40 195 Q 600 10 1240 195 L 1240 220 L -40 220 Z"
                fill="url(#horizonGlow)"
              />
              <path
                d="M -40 195 Q 600 10 1240 195"
                fill="none"
                stroke="rgba(212, 175, 55, 0.55)"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Global Mandate
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-zinc-50">
              Expanding Across Strategic Corridors
            </h2>
            <p className="text-sm sm:text-base text-zinc-400">
              {config.vision}
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm sm:text-base font-medium text-zinc-200 tracking-wide">
              <span>Dhaka HQ</span>
              <span className="text-primary/60" aria-hidden="true">·</span>
              <span>Dubai</span>
              <span className="text-primary/60" aria-hidden="true">·</span>
              <span>London</span>
              <span className="text-primary/60" aria-hidden="true">·</span>
              <span>Singapore</span>
            </div>
          </div>
        </div>

        {/* Founder & Executive Leadership */}
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
            <div className="space-y-2.5">
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary">
                Executive Board
              </p>
              <h2 className="font-heading text-3xl md:text-5xl font-semibold tracking-tight text-zinc-50">
                Leadership Team
              </h2>
            </div>
            <Link to="/team">
              <Button
                variant="outline"
                className="border-white/15 hover:border-primary/40 hover:bg-primary/5 text-sm rounded-full px-6"
              >
                View Full Leadership
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-7">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: EASE_OUT_EXPO }}
                viewport={{ once: true, amount: 0.15 }}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = LOCAL_ASSETS.strategyRoom;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-7">
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
      </section>

      {/* 5. Interactive Executive Strategist Prompt + Silk Horizon Closing Banner */}
      <section className="space-y-8">
        {/* Direct Interactive Strategist Prompt */}
        <div className="rounded-3xl border border-white/10 bg-[#111114] p-7 sm:p-10 lg:p-12 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-3">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary">
              Executive Intelligence
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-zinc-50">
              Consult the AI Strategist
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-lg">
              Start an interactive briefing on our revenue roadmap, portfolio ventures, or 2030 expansion pillars.
            </p>
          </div>

          <div className="lg:col-span-6 space-y-3">
            <form onSubmit={handleInlineAsk} className="flex items-center gap-2">
              <input
                type="text"
                value={inlinePrompt}
                onChange={(e) => setInlinePrompt(e.target.value)}
                placeholder="Ask about our $1K to $1M plan or divisions..."
                className="flex-1 h-12 px-4 rounded-full bg-black/50 border border-white/15 focus:border-primary/60 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none transition-colors"
              />
              <Button
                type="submit"
                size="lg"
                className="h-12 px-6 rounded-full font-semibold shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4 mr-2" />
                Start Chat
              </Button>
            </form>
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
              <span>Quick topics:</span>
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
        </div>

        {/* Closing Atmospheric Banner + Founder Statement */}
        <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-[#09090d] px-6 sm:px-12 py-16 sm:py-20">
          <div
            className="pointer-events-none absolute -inset-y-12 left-1/4 w-2/3 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-3xl animate-silk-sweep"
            aria-hidden="true"
          />
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <Quote className="w-7 h-7 text-primary/70 mx-auto" />
            <h2 className="font-heading text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-50 leading-tight">
              We turn bold vision into lasting global enterprises.
            </h2>
            <p className="font-heading italic text-lg sm:text-xl text-zinc-300 leading-relaxed">
              "{config.mdBannerQuote}"
            </p>
            <p className="text-xs font-medium tracking-widest uppercase text-primary">
              {config.mdName} · {config.mdRole}
            </p>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
              <Button
                type="button"
                size="lg"
                onClick={() => openChat()}
                className="h-12 px-8 rounded-full font-semibold gold-glow cursor-pointer"
              >
                Launch Strategist Chat
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Link to="/vision">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-7 rounded-full border-white/15 hover:border-primary/45 hover:bg-primary/5 cursor-pointer"
                >
                  Explore Vision 2030
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
