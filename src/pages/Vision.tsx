import { motion } from "framer-motion";
import { Layers, Zap, Trophy } from "lucide-react";
import { useSiteConfig } from "../context/SiteContext";
import { LOCAL_ASSETS } from "../lib/defaults";
import { usePageSeo } from "../hooks/usePageSeo";
import { AnimatedCounter } from "../components/motion/AnimatedCounter";
import { SpotlightCard } from "../components/motion/SpotlightCard";
import { EASE_OUT_EXPO, ParallaxFrame, TextMaskReveal } from "../components/motion/MotionPrimitives";

export default function Vision() {
  usePageSeo({
    title: "Vision 2030",
    description:
      "Long-term 2030 valuation target, ecosystem divisions, and global expansion corridors of GLOBAL ELITE 1M TEAM.",
    path: "/vision",
  });
  const { config } = useSiteConfig();

  const numericNetWorth = parseFloat(String(config.netWorth || "12450").replace(/,/g, "")) || 12450;
  const numericTarget = parseFloat(String(config.valuationTarget || "1000000").replace(/,/g, "")) || 1000000;
  const progressPct = Math.min(100, Math.max(4, Math.round((numericNetWorth / numericTarget) * 100)));

  return (
    <div className="space-y-20 pb-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          className="text-xs font-semibold uppercase tracking-[0.24em] text-primary"
        >
          Long-Term Horizon
        </motion.p>
        <h1 className="font-heading text-4xl md:text-6xl font-semibold tracking-tight gold-gradient">
          <TextMaskReveal immediate delay={0.05}>
            Vision 2030
          </TextMaskReveal>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.14, ease: EASE_OUT_EXPO }}
          className="text-base md:text-lg text-zinc-400 leading-relaxed"
        >
          {config.vision}
        </motion.p>
      </div>

      {/* Valuation Target */}
      <motion.section
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
        className="max-w-4xl mx-auto"
      >
        <SpotlightCard active className="p-10 sm:p-14 text-center space-y-7 bg-[#0b0b10]">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Primary Capital Milestone
          </p>
          <h2 className="font-mono text-5xl sm:text-7xl font-semibold tracking-tight gold-gradient tabular-nums">
            <AnimatedCounter value={config.valuationTarget || "1,000,000"} prefix="$" durationMs={1350} />
          </h2>
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">
            2030 Enterprise Valuation Target
          </p>
          <div className="max-w-xl mx-auto space-y-3">
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.35, ease: EASE_OUT_EXPO }}
                style={{ width: `${progressPct}%` }}
                className="h-full bg-gradient-to-r from-primary/80 via-primary to-[#f3df9b] origin-left rounded-full"
              />
            </div>
            <div className="flex justify-between text-xs text-zinc-400 font-mono tabular-nums">
              <span>Current Phase: {config.status}</span>
              <span>{progressPct}% Trajectory</span>
            </div>
          </div>
        </SpotlightCard>
      </motion.section>

      {/* Ecosystem */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Holding Structure
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold">
            The Elite Ecosystem
          </h2>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-zinc-400">
            Interconnected divisions sharing leadership governance, brand equity, and capital allocation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-7">
          {[
            {
              title: "Elite Academy",
              desc: "Developing executive capability and operational leadership for scaling new verticals.",
              icon: Trophy,
            },
            {
              title: "Digital Forge",
              desc: "Engineering proprietary software platforms, automation systems, and digital infrastructure.",
              icon: Layers,
            },
            {
              title: "Opus Capital",
              desc: "Strategic capital placement and structured funding across high-conviction enterprises.",
              icon: Zap,
            },
          ].map((eco, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.09, ease: EASE_OUT_EXPO }}
              className="h-full"
            >
              <SpotlightCard className="p-8 space-y-4 h-full">
                <eco.icon className="w-6 h-6 text-primary" />
                <h3 className="font-heading text-2xl font-semibold text-zinc-100">{eco.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{eco.desc}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Global Corridors */}
      <ParallaxFrame offsetY={18}>
        <motion.section
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111114] min-h-[340px] flex items-center"
        >
          <img
            src={LOCAL_ASSETS.globalNetwork}
            alt="Global expansion corridors"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/85 to-[#09090b]/60" />
          <div className="relative z-10 p-10 sm:p-16 max-w-3xl space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              International Presence
            </p>
            <h2 className="font-heading text-3xl md:text-5xl font-semibold text-white">
              Borderless Commercial Corridors
            </h2>
            <p className="text-base text-zinc-300 leading-relaxed">
              Positioning ELITE GROUP ventures across strategic global commercial hubs through 2030.
            </p>
            <p className="text-xs font-mono tracking-[0.22em] text-primary uppercase">
              Dhaka · Dubai · New York · London · Singapore
            </p>
          </div>
        </motion.section>
      </ParallaxFrame>
    </div>
  );
}
