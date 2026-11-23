import { motion } from "framer-motion";
import { Home as HomeIcon, Car, Globe, Heart, Wallet } from "lucide-react";
import { useSiteConfig } from "../context/SiteContext";
import { LOCAL_ASSETS } from "../lib/defaults";
import { SpotlightCard } from "../components/motion/SpotlightCard";
import { EASE_OUT_EXPO, ParallaxFrame, TextMaskReveal } from "../components/motion/MotionPrimitives";

const missions = [
  {
    icon: Heart,
    title: "Family Security",
    desc: "Clearing legacy obligations and establishing lasting financial security for our families.",
    status: "Priority",
  },
  {
    icon: HomeIcon,
    title: "Foundation Assets",
    desc: "Building enduring real estate and family equity that anchors long-term stability.",
    status: "In Progress",
  },
  {
    icon: Car,
    title: "Executive Mobility",
    desc: "Equipping leadership with operational mobility aligned with international enterprise standards.",
    status: "Upcoming",
  },
  {
    icon: Globe,
    title: "Global Brand Authority",
    desc: "Expanding ELITE GROUP from a regional venture into an internationally recognized standard.",
    status: "Long Term",
  },
  {
    icon: Wallet,
    title: "Financial Sovereignty",
    desc: "Structuring compounding assets that sustain independent growth across market cycles.",
    status: "Core Objective",
  },
];

export default function Mission() {
  const { config } = useSiteConfig();

  return (
    <div className="space-y-20 pb-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          className="text-xs font-semibold uppercase tracking-[0.24em] text-primary"
        >
          Purpose & Mandate
        </motion.p>
        <h1 className="font-heading text-4xl md:text-6xl font-semibold tracking-tight gold-gradient">
          <TextMaskReveal immediate delay={0.05}>
            Our Corporate Mission
          </TextMaskReveal>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.14, ease: EASE_OUT_EXPO }}
          className="text-base md:text-lg text-zinc-400 leading-relaxed"
        >
          {config.mission}
        </motion.p>
      </div>

      {/* ELITE TEAM 07 Mandate */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
        className="rounded-3xl border border-white/10 bg-[#111114] p-8 sm:p-12 lg:p-16 space-y-10"
      >
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Strategic Mandate
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold tracking-tight">
            ELITE TEAM 07 Three-Phase Framework
          </h2>
          <p className="text-base text-zinc-400 leading-relaxed">
            Transforming our capital trajectory through disciplined sequencing and compounding enterprise execution.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              phase: "01. Foundation Zero",
              desc: "Eliminating structural liabilities and establishing profitable unit economics.",
            },
            {
              phase: "02. Asset Accumulation",
              desc: "Deploying cashflow into scalable consumer, financial, and lifestyle ventures.",
            },
            {
              phase: "03. Generational Scale",
              desc: "Transitioning into an autonomous, globally diversified holding institution by 2030.",
            },
          ].map((item, idx) => (
            <motion.div
              key={item.phase}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: idx * 0.08, ease: EASE_OUT_EXPO }}
              className="h-full"
            >
              <SpotlightCard className="p-7 bg-black/40 space-y-3 h-full">
                <h3 className="font-semibold text-base text-primary">{item.phase}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Core Pillars Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {missions.map((mission, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 22, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, delay: i * 0.07, ease: EASE_OUT_EXPO }}
            className="h-full"
          >
            <SpotlightCard className="p-7 space-y-4 h-full">
              <div className="flex items-center justify-between">
                <mission.icon className="w-5 h-5 text-primary" />
                <span className="text-xs text-zinc-400 font-medium">{mission.status}</span>
              </div>
              <h3 className="font-heading text-2xl font-semibold text-zinc-100">{mission.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{mission.desc}</p>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>

      {/* Philosophy Split */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
        className="rounded-3xl border border-white/10 bg-[#111114] p-8 sm:p-12 lg:p-16"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Operating Standard
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold">
              Discipline Before Scale
            </h2>
            <div className="space-y-4 text-base text-zinc-400 leading-relaxed">
              <p>
                Sustainable enterprise value is never built on short-term noise. It requires
                consistent operational rigor, clear accountability, and patient capital stewardship.
              </p>
              <p>
                Every milestone reached reflects a shared commitment across our team to build
                institutions that endure for decades.
              </p>
            </div>
            <div className="flex items-center gap-8 pt-4 border-t border-white/10">
              <div>
                <span className="font-mono text-2xl font-semibold gold-text tabular-nums">100%</span>
                <p className="text-xs text-zinc-400 mt-1">Execution Focus</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <span className="font-mono text-2xl font-semibold gold-text tabular-nums">2030</span>
                <p className="text-xs text-zinc-400 mt-1">Horizon Target</p>
              </div>
            </div>
          </div>
          <ParallaxFrame offsetY={14}>
            <div className="relative rounded-2xl overflow-hidden border border-white/10">
              <img
                src={LOCAL_ASSETS.strategyRoom}
                alt="Executive planning session"
                className="w-full aspect-video object-cover"
              />
            </div>
          </ParallaxFrame>
        </div>
      </motion.section>
    </div>
  );
}
