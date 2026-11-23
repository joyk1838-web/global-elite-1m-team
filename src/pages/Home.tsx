import { useState, useEffect, useRef, type FormEvent } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
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
import {
  DEFAULT_BRANDS,
  DEFAULT_TEAM,
  LOCAL_ASSETS,
  SERIES_ONE_ASSETS,
  isFounderMember,
  normalizeTeamMembers,
} from "../lib/defaults";
import { ParticleSculpture, type ParticleShape } from "../components/motion/ParticleSculpture";
import { AnimatedCounter } from "../components/motion/AnimatedCounter";
import { SpotlightCard } from "../components/motion/SpotlightCard";
import {
  EASE_OUT_EXPO,
  SCROLL_VIEWPORT,
  TextMaskReveal,
  WordStaggerReveal,
  KineticMarquee,
  MagneticWrap,
  ParallaxFrame,
} from "../components/motion/MotionPrimitives";

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE_OUT_EXPO },
  },
};

const scaleRevealItem = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
};

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
  const [activeSeriesIndex, setActiveSeriesIndex] = useState(0);
  const [inlinePrompt, setInlinePrompt] = useState("");

  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const smoothHeroProgress = useSpring(heroScrollProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });
  const heroSphereY = useTransform(smoothHeroProgress, [0, 1], [0, 84]);
  const heroSphereScale = useTransform(smoothHeroProgress, [0, 1], [1, 1.07]);
  const heroSphereOpacity = useTransform(smoothHeroProgress, [0, 0.85], [1, 0.22]);

  useEffect(() => {
    getBrands().then((data) => {
      if (data && data.length > 0) setBrands(data);
    });
    getTeam().then((data) => {
      if (data && data.length > 0) {
        setTeamMembers(normalizeTeamMembers(data));
      } else {
        setTeamMembers(normalizeTeamMembers(DEFAULT_TEAM));
      }
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
      <section
        ref={heroRef}
        className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between bg-[#050507] overflow-hidden"
      >
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

        {/* Interactive 3D Particle Sphere Stage with spring-damped scroll parallax */}
        <motion.div
          style={{ y: heroSphereY, scale: heroSphereScale, opacity: heroSphereOpacity }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
          className="relative lg:absolute lg:inset-y-0 lg:right-0 lg:w-[56%] h-[300px] sm:h-[380px] lg:h-full z-10"
        >
          <ParticleSculpture shape="sphere" interactive density={640} />
        </motion.div>

        {/* Main Container */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 lg:pt-24 pb-10 flex-1 flex flex-col justify-between pointer-events-none">
          <div className="max-w-2xl space-y-7">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
              className="flex items-center gap-3.5"
            >
              <Logo size="sm" />
              <span className="text-xs font-medium tracking-[0.18em] uppercase text-zinc-400">
                {config.heroEyebrow}
              </span>
            </motion.div>

            <h1 className="font-heading text-5xl sm:text-7xl lg:text-[5.25rem] font-semibold tracking-[-0.035em] leading-[1.04] text-zinc-50">
              {leadWords && (
                <TextMaskReveal immediate delay={0.05} className="text-zinc-50">
                  {leadWords}
                </TextMaskReveal>
              )}
              <TextMaskReveal immediate delay={0.14} className="gold-gradient">
                {accentWord}
              </TextMaskReveal>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.22, ease: EASE_OUT_EXPO }}
              className="text-base sm:text-lg text-zinc-400 max-w-lg leading-relaxed"
            >
              {config.heroSubtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.3, ease: EASE_OUT_EXPO }}
              className="flex flex-wrap items-center gap-5 pt-2 pointer-events-auto"
            >
              <MagneticWrap>
                <button
                  type="button"
                  onClick={() => openChat()}
                  className="inline-flex items-center gap-2.5 h-12 px-7 rounded-full bg-zinc-50 text-zinc-950 hover:bg-primary hover:text-zinc-950 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  Ask AI Strategist
                </button>
              </MagneticWrap>

              <MagneticWrap strength={0.16}>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 h-12 px-6 rounded-full border border-white/15 bg-white/[0.02] hover:border-primary/45 hover:text-primary text-sm font-medium text-zinc-200 transition-colors"
                >
                  Progress Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </MagneticWrap>
            </motion.div>
          </div>

          {/* Hairline Bottom Metrics Rail */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32, ease: EASE_OUT_EXPO }}
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

      {/* Kinetic Portfolio & Mandate Marquee */}
      <KineticMarquee
        items={[
          "ELITE TEAM 07",
          "Series 01 · $600 → $5K",
          "Elite Soft Drink",
          "Elite Funder",
          "Elite Fashion",
          "2030 Horizon · $1M Target",
          "Dhaka · Dubai · London · Singapore",
        ]}
      />

      {/* 2. Featured First Series: $600 -> $5K Live Trading & Education Project */}
      <section className="border-t border-white/[0.07] py-24 sm:py-32 bg-[#07070a] relative overflow-hidden">
        <div
          className="pointer-events-none absolute -top-24 right-0 w-[420px] h-[420px] rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, rgba(163, 230, 53, 0.35), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={SCROLL_VIEWPORT}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <motion.div variants={fadeUpItem} className="space-y-3">
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary">
                First Series · Active Project
              </p>
              <h2 className="font-heading text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-50">
                <WordStaggerReveal text="$600 → $5K Live Challenge Series" />
              </h2>
            </motion.div>
            <motion.p
              variants={fadeUpItem}
              className="max-w-md text-sm sm:text-base text-zinc-400 leading-relaxed"
            >
              সহজ বাংলায় ট্রেডিং শিক্ষা এবং নিয়ম মেনে $600 থেকে $5,000 ক্যাপিটাল গ্রোথের লাইভ প্রজেক্ট।
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Series Specification & Targets */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={SCROLL_VIEWPORT}
              className="lg:col-span-5 space-y-7"
            >
              <motion.div variants={fadeUpItem} className="space-y-3">
                <h3 className="font-heading text-2xl sm:text-3xl font-semibold text-zinc-100 leading-snug">
                  {SERIES_ONE_ASSETS[activeSeriesIndex]?.title}
                </h3>
                <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                  Our inaugural live execution series documenting disciplined capital growth from $600 to $5,000 through strict risk management, trading psychology, and a professional mindset.
                </p>
              </motion.div>

              <motion.div
                variants={fadeUpItem}
                className="space-y-5 py-6 border-y border-white/[0.08]"
              >
                <div className="grid grid-cols-3 gap-5">
                  <div className="space-y-1">
                    <p className="font-mono text-2xl sm:text-3xl font-medium text-zinc-50 tabular-nums">
                      $600
                    </p>
                    <p className="text-xs text-zinc-500">শুরু · Start</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-mono text-2xl sm:text-3xl font-medium text-primary tabular-nums">
                      $5,000
                    </p>
                    <p className="text-xs text-zinc-500">লক্ষ্য · Target</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-mono text-2xl sm:text-3xl font-medium text-zinc-50 tabular-nums">
                      8.3x
                    </p>
                    <p className="text-xs text-zinc-500">Growth Goal</p>
                  </div>
                </div>

                {/* Animated Series Trajectory Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400 tabular-nums">
                    <span>Challenge Velocity</span>
                    <span className="text-primary">$600 → $5,000</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/[0.07] overflow-hidden">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={SCROLL_VIEWPORT}
                      transition={{ duration: 1.25, delay: 0.15, ease: EASE_OUT_EXPO }}
                      className="h-full w-full origin-left rounded-full bg-gradient-to-r from-lime-400/70 via-primary to-[#f3df9b]"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUpItem}
                className="text-xs sm:text-sm text-zinc-300 flex flex-wrap items-center gap-x-2.5 gap-y-1"
              >
                <span>রিস্ক ম্যানেজমেন্ট</span>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span>ট্রেডিং সাইকোলজি</span>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span>প্রফেশনাল মাইন্ডসেট</span>
              </motion.div>

              <motion.div variants={fadeUpItem} className="flex flex-wrap items-center gap-4 pt-1">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-zinc-50 text-zinc-950 hover:bg-primary text-xs sm:text-sm font-semibold transition-colors"
                >
                  Track Progress
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    openChat(
                      "Tell me about our First Series $600 to $5K Challenge Project and its risk management principles."
                    )
                  }
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-full border border-white/15 hover:border-primary/45 hover:text-primary text-xs sm:text-sm font-medium text-zinc-200 transition-colors cursor-pointer"
                >
                  Ask AI Strategist
                </button>
              </motion.div>
            </motion.div>

            {/* Right Interactive 16:9 Visual Switcher Stage */}
            <ParallaxFrame offsetY={20} className="lg:col-span-7">
              <motion.div
                variants={scaleRevealItem}
                initial="hidden"
                whileInView="visible"
                viewport={SCROLL_VIEWPORT}
                className="space-y-4"
              >
                <SpotlightCard active className="p-2 bg-[#0b0b0f]">
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={SERIES_ONE_ASSETS[activeSeriesIndex]?.id}
                        src={SERIES_ONE_ASSETS[activeSeriesIndex]?.url}
                        alt={SERIES_ONE_ASSETS[activeSeriesIndex]?.title}
                        initial={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.985, filter: "blur(4px)" }}
                        transition={{ duration: 0.42, ease: EASE_OUT_EXPO }}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = LOCAL_ASSETS.corporateHq;
                        }}
                      />
                    </AnimatePresence>
                  </div>
                </SpotlightCard>

                <div className="grid grid-cols-2 gap-4">
                  {SERIES_ONE_ASSETS.map((item, idx) => {
                    const isCurrent = idx === activeSeriesIndex;
                    return (
                      <motion.button
                        key={item.id}
                        type="button"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={SCROLL_VIEWPORT}
                        transition={{ duration: 0.5, delay: 0.1 + idx * 0.08, ease: EASE_OUT_EXPO }}
                        onClick={() => setActiveSeriesIndex(idx)}
                        className={`relative group text-left rounded-xl border p-2.5 transition-colors cursor-pointer flex items-center gap-3.5 overflow-hidden ${
                          isCurrent
                            ? "border-primary/50 bg-[#121218]"
                            : "border-white/[0.08] bg-[#0b0b0f] hover:border-white/20"
                        }`}
                      >
                        {isCurrent && (
                          <motion.span
                            layoutId="series-active-indicator"
                            transition={{ type: "spring", stiffness: 360, damping: 32 }}
                            className="absolute inset-x-3 bottom-0 h-[2px] bg-primary rounded-full"
                            aria-hidden="true"
                          />
                        )}
                        <div className="w-20 sm:w-24 aspect-video rounded-lg overflow-hidden bg-black shrink-0">
                          <img
                            src={item.url}
                            alt={item.label}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = LOCAL_ASSETS.corporateHq;
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-semibold truncate ${isCurrent ? "text-primary" : "text-zinc-200"}`}>
                            {item.label}
                          </p>
                          <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                            {item.subtitle}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </ParallaxFrame>
          </div>
        </div>
      </section>

      {/* 3. Morphing 3D Capabilities Showcase */}
      <section className="border-t border-white/[0.07] py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={SCROLL_VIEWPORT}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <motion.div variants={fadeUpItem} className="space-y-3">
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary">
                Operating Architecture
              </p>
              <h2 className="font-heading text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-50">
                Engineered for compounding scale
              </h2>
            </motion.div>
            <motion.p
              variants={fadeUpItem}
              className="max-w-md text-sm sm:text-base text-zinc-400 leading-relaxed"
            >
              Select or hover any discipline below to inspect our execution pillars and watch the interactive lattice morph.
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Sticky Void 3D Morphing Canvas */}
            <motion.div
              variants={scaleRevealItem}
              initial="hidden"
              whileInView="visible"
              viewport={SCROLL_VIEWPORT}
              className="lg:col-span-5 lg:sticky lg:top-24 space-y-6"
            >
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
            </motion.div>

            {/* Right Interactive Cursor-Spotlight Grid */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={SCROLL_VIEWPORT}
              className="lg:col-span-7 grid sm:grid-cols-2 gap-4"
            >
              {CAPABILITIES.map((cap, idx) => {
                const isActive = idx === activeCapIndex;
                return (
                  <motion.div key={cap.num} variants={fadeUpItem} className="h-full relative">
                    <SpotlightCard
                      active={isActive}
                      onMouseEnter={() => setActiveCapIndex(idx)}
                      onFocus={() => setActiveCapIndex(idx)}
                      className="h-full"
                    >
                      {isActive && (
                        <motion.span
                          layoutId="cap-active-indicator"
                          transition={{ type: "spring", stiffness: 360, damping: 32 }}
                          className="absolute top-0 inset-x-6 h-[2px] bg-primary rounded-full pointer-events-none"
                          aria-hidden="true"
                        />
                      )}
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
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Full-Bleed Ventures Index & Live Hover Visual */}
      <section className="border-t border-white/[0.07] py-24 sm:py-32 bg-[#07070a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={SCROLL_VIEWPORT}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <motion.div variants={fadeUpItem} className="space-y-3">
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary">
                Portfolio Divisions
              </p>
              <h2 className="font-heading text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-50">
                Core Ventures
              </h2>
            </motion.div>
            <motion.p
              variants={fadeUpItem}
              className="max-w-md text-sm sm:text-base text-zinc-400 leading-relaxed"
            >
              Category-focused businesses spanning ultra-premium consumer beverages, structured finance, and tailored apparel.
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Numbered Editorial Venture List */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={SCROLL_VIEWPORT}
              className="lg:col-span-7 divide-y divide-white/[0.08] border-y border-white/[0.08]"
            >
              {brands.map((brand, idx) => {
                const isSelected = idx === activeVentureIndex;
                return (
                  <motion.div
                    key={brand.id || idx}
                    variants={fadeUpItem}
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
                    className="relative group py-7 px-3 sm:px-5 transition-colors cursor-pointer flex items-center justify-between gap-6"
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="venture-active-bg"
                        transition={{ type: "spring", stiffness: 320, damping: 32 }}
                        className="absolute inset-0 bg-white/[0.035] pointer-events-none"
                        aria-hidden="true"
                      />
                    )}
                    <div className="relative z-10 flex items-baseline gap-6 sm:gap-8 min-w-0">
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
                      className={`relative z-10 w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition-all duration-200 ${
                        isSelected
                          ? "border-primary bg-primary text-zinc-950 scale-105"
                          : "border-white/15 text-zinc-500 group-hover:border-white/35 group-hover:text-zinc-100"
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Sticky Preview Frame */}
            <motion.div
              variants={scaleRevealItem}
              initial="hidden"
              whileInView="visible"
              viewport={SCROLL_VIEWPORT}
              className="lg:col-span-5 lg:sticky lg:top-24"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeVenture?.id || activeVentureIndex}
                  initial={{ opacity: 0, y: 12, scale: 0.98, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, scale: 0.985, filter: "blur(4px)" }}
                  transition={{ duration: 0.36, ease: EASE_OUT_EXPO }}
                  className="rounded-2xl border border-white/[0.08] bg-[#0b0b0f] overflow-hidden"
                >
                  <div className="aspect-[16/10] relative overflow-hidden bg-zinc-950">
                    <motion.img
                      src={activeVenture?.image || LOCAL_ASSETS.corporateHq}
                      alt={activeVenture?.name || "ELITE GROUP Venture"}
                      initial={{ scale: 1.07 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.4, ease: EASE_OUT_EXPO }}
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Full-Bleed Luminous Curved Horizon & Executive Leadership */}
      <section className="relative border-t border-white/[0.07] pt-24 pb-24 sm:pb-32 overflow-hidden">
        {/* Full-Width Curved Horizon Rim with Draw-On Path Reveal */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.92 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={SCROLL_VIEWPORT}
          transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
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
            <motion.path
              d="M 0 150 Q 600 8 1200 150 L 1200 160 L 0 160 Z"
              fill="url(#horizonRimGlow)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={SCROLL_VIEWPORT}
              transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
            />
            <motion.path
              d="M 0 150 Q 600 8 1200 150"
              fill="none"
              stroke="rgba(226, 190, 83, 0.5)"
              strokeWidth="1.25"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={SCROLL_VIEWPORT}
              transition={{ duration: 1.25, ease: EASE_OUT_EXPO }}
            />
          </svg>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={SCROLL_VIEWPORT}
            className="max-w-3xl mx-auto text-center space-y-5 -mt-4"
          >
            <motion.p
              variants={fadeUpItem}
              className="text-xs font-medium uppercase tracking-[0.2em] text-primary"
            >
              Global Mandate
            </motion.p>
            <motion.h2
              variants={fadeUpItem}
              className="font-heading text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-50"
            >
              Expanding Across Strategic Corridors
            </motion.h2>
            <motion.p
              variants={fadeUpItem}
              className="text-sm sm:text-base text-zinc-400 leading-relaxed"
            >
              {config.vision}
            </motion.p>
            <motion.div
              variants={fadeUpItem}
              className="pt-2 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm font-medium text-zinc-300"
            >
              <span>Dhaka HQ</span>
              <span className="text-primary/60" aria-hidden="true">·</span>
              <span>Dubai</span>
              <span className="text-primary/60" aria-hidden="true">·</span>
              <span>London</span>
              <span className="text-primary/60" aria-hidden="true">·</span>
              <span>Singapore</span>
            </motion.div>
          </motion.div>

          {/* Founder & Team Board */}
          <div className="space-y-12">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={SCROLL_VIEWPORT}
              className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8"
            >
              <motion.div variants={fadeUpItem} className="space-y-2.5">
                <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary">
                  ELITE TEAM 07
                </p>
                <h2 className="font-heading text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-50">
                  Founder & Team
                </h2>
              </motion.div>
              <motion.div variants={fadeUpItem}>
                <Link
                  to="/team"
                  className="inline-flex items-center gap-2 h-10 px-5 rounded-full border border-white/15 hover:border-primary/45 hover:text-primary text-xs font-medium text-zinc-200 transition-colors self-start md:self-auto"
                >
                  View Full Team
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            </motion.div>

            {(() => {
              const founder = teamMembers.find((m) => isFounderMember(m));
              const members = teamMembers.filter((m) => !isFounderMember(m));
              return (
                <div className="space-y-6">
                  {founder && (
                    <motion.div
                      initial={{ opacity: 0, y: 24, scale: 0.98 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
                      viewport={SCROLL_VIEWPORT}
                    >
                      <SpotlightCard active className="p-7 sm:p-9 bg-[#0b0b10]">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex items-start sm:items-center gap-5">
                            <div className="w-14 h-14 rounded-xl border border-primary/40 bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="font-heading text-lg font-semibold text-primary tracking-tight">
                                {founder.initials}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs font-medium tracking-[0.18em] uppercase text-primary">
                                Founder
                              </p>
                              <h3 className="font-heading text-2xl sm:text-3xl font-semibold text-zinc-50">
                                {founder.name}
                              </h3>
                            </div>
                          </div>
                          {founder.bio && (
                            <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
                              {founder.bio}
                            </p>
                          )}
                        </div>
                      </SpotlightCard>
                    </motion.div>
                  )}

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {members.map((member, i) => (
                      <motion.div
                        key={member.id || i}
                        initial={{ opacity: 0, y: 24, scale: 0.97 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.6, delay: i * 0.08, ease: EASE_OUT_EXPO }}
                        viewport={SCROLL_VIEWPORT}
                        className="h-full"
                      >
                        <SpotlightCard className="p-6 h-full flex flex-col justify-between gap-6 bg-[#0a0a0e]">
                          <div className="flex items-center justify-between gap-3">
                            <div className="w-11 h-11 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center">
                              <span className="font-heading text-sm font-semibold text-zinc-200">
                                {member.initials}
                              </span>
                            </div>
                            <span className="font-mono text-xs text-zinc-600 tabular-nums">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <p className="text-xs font-medium text-zinc-500">
                              Team Member
                            </p>
                            <h3 className="font-heading text-xl font-semibold text-zinc-50 leading-snug">
                              {member.name}
                            </h3>
                          </div>
                        </SpotlightCard>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* 6. 2026 Executive Command Bar + Silk Horizon Closing Banner */}
      <section className="border-t border-white/[0.07] bg-[#07070a] py-24 sm:py-32 relative overflow-hidden">
        <div
          className="pointer-events-none absolute -inset-y-16 left-1/4 w-2/3 bg-gradient-to-r from-transparent via-primary/[0.12] to-transparent blur-3xl animate-silk-sweep"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Interactive Strategist Command Palette Bar */}
          <motion.div
            variants={scaleRevealItem}
            initial="hidden"
            whileInView="visible"
            viewport={SCROLL_VIEWPORT}
            className="rounded-2xl border border-white/[0.09] bg-[#0c0c12]/90 backdrop-blur-xl p-6 sm:p-8 space-y-5"
          >
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
                placeholder="Ask about our $600 to $5K challenge, divisions, or 2030 targets..."
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
              {["$600 → $5K Series", "$1M Roadmap", "Elite Soft Drink", "Leadership Board"].map((topic) => (
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
          </motion.div>

          {/* Closing Editorial Quote & Final Action */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={SCROLL_VIEWPORT}
            className="text-center space-y-6 pt-4"
          >
            <motion.div variants={fadeUpItem}>
              <Quote className="w-6 h-6 text-primary/70 mx-auto" />
            </motion.div>
            <motion.h2
              variants={fadeUpItem}
              className="font-heading text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-50 leading-tight"
            >
              We turn bold vision into lasting global enterprises.
            </motion.h2>
            <motion.p
              variants={fadeUpItem}
              className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto"
            >
              "{config.mdBannerQuote}"
            </motion.p>
            <motion.p
              variants={fadeUpItem}
              className="text-xs font-medium tracking-widest uppercase text-primary"
            >
              {config.mdName} · Founder
            </motion.p>
            <motion.div
              variants={fadeUpItem}
              className="pt-3 flex flex-wrap items-center justify-center gap-4"
            >
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
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
