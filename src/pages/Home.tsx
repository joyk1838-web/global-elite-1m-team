import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Target, ShieldCheck, Gem, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getBrands, getTeam } from "../services/firebase";
import { Logo } from "@/components/ui/Logo";
import { useSiteConfig } from "../context/SiteContext";
import { DEFAULT_BRANDS, DEFAULT_TEAM, LOCAL_ASSETS } from "../lib/defaults";

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Home() {
  const { config } = useSiteConfig();
  const [brands, setBrands] = useState<any[]>(DEFAULT_BRANDS);
  const [teamMembers, setTeamMembers] = useState<any[]>(DEFAULT_TEAM);

  useEffect(() => {
    getBrands().then((data) => {
      if (data && data.length > 0) setBrands(data);
    });
    getTeam().then((data) => {
      if (data && data.length > 0) setTeamMembers(data.slice(0, 3));
    });
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        ease: EASE_OUT_EXPO,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: EASE_OUT_EXPO },
    },
  };

  return (
    <div className="space-y-24 md:space-y-32 pb-16">
      {/* Hero Section */}
      <section className="relative min-h-[78vh] flex items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0e] px-6 py-20">
        {/* Subtle Animated Architectural Backdrop */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -inset-1/4 animate-ambient-pan"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(212, 175, 55, 0.16) 0%, transparent 45%), radial-gradient(circle at 75% 70%, rgba(212, 175, 55, 0.10) 0%, transparent 50%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-[#09090b]/40" />
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 text-center space-y-7 max-w-3xl mx-auto"
        >
          <motion.div variants={item} className="flex justify-center">
            <Logo size="lg" />
          </motion.div>

          <motion.p
            variants={item}
            className="text-xs font-semibold uppercase tracking-[0.28em] text-primary"
          >
            {config.heroEyebrow}
          </motion.p>

          <motion.h1
            variants={item}
            className="font-heading text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.08]"
          >
            <span className="gold-gradient">{config.heroTitle}</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-lg md:text-xl text-zinc-400 font-normal max-w-2xl mx-auto leading-relaxed"
          >
            {config.heroSubtitle}
          </motion.p>

          <motion.div
            variants={item}
            className="flex flex-wrap items-center justify-center gap-4 pt-3"
          >
            <Link to="/dashboard">
              <Button
                size="lg"
                className="h-12 px-8 text-sm font-semibold gold-glow hover:scale-[1.02] transition-transform"
              >
                View Progress Dashboard
                <TrendingUp className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/vision">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-7 text-sm font-medium border-white/15 hover:border-primary/40 hover:bg-primary/5"
              >
                Vision 2030
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Founder & Core Principles Section */}
      <section className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
          className="lg:col-span-5 relative group"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111114]">
            <img
              src={config.mdImage || DEFAULT_TEAM[0].image}
              alt={config.mdName}
              className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = LOCAL_ASSETS.strategyRoom;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-7 space-y-2">
              <p className="font-heading italic text-lg text-zinc-200 leading-snug">
                "{config.mdQuote}"
              </p>
              <div className="pt-2 border-t border-white/15 flex items-baseline justify-between gap-4">
                <span className="font-semibold text-base text-white">{config.mdName}</span>
                <span className="text-xs text-primary font-medium">{config.mdRole}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE_OUT_EXPO }}
          className="lg:col-span-7 space-y-8"
        >
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Corporate Philosophy
            </p>
            <h2 className="font-heading text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
              An institution built on disciplined execution
            </h2>
            <p className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-2xl">
              {config.mission}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { icon: Target, title: "Precision", desc: "Every capital allocation and strategic initiative is measured for durable compounding." },
              { icon: ShieldCheck, title: "Governance", desc: "Built on structural accountability, transparency, and long-term trust." },
              { icon: TrendingUp, title: "Scalability", desc: "Operating frameworks architected for cross-border expansion through 2030." },
              { icon: Gem, title: "Excellence", desc: "Uncompromising standards across product craft, talent, and execution." },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-xl surface-card space-y-2.5"
              >
                <feature.icon className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-base text-zinc-100">{feature.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Core Ventures / Brands Section */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Portfolio
            </p>
            <h2 className="font-heading text-3xl md:text-5xl font-semibold tracking-tight">
              Core Ventures
            </h2>
          </div>
          <p className="max-w-md text-sm md:text-base text-zinc-400 leading-relaxed">
            Diverse operating divisions across consumer luxury, structured finance, and bespoke apparel.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-7">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: EASE_OUT_EXPO }}
              viewport={{ once: true, amount: 0.15 }}
              className="group rounded-2xl surface-card overflow-hidden flex flex-col"
            >
              <div className="aspect-[16/10] relative overflow-hidden bg-zinc-900">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = LOCAL_ASSETS.corporateHq;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>
              <div className="p-7 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-primary tracking-wide">
                    {brand.tagline}
                  </p>
                  <h3 className="font-heading text-2xl font-semibold tracking-tight text-zinc-100">
                    {brand.name}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed pt-1">
                    {brand.desc}
                  </p>
                </div>
                <Link
                  to={brand.link && brand.link !== "#" ? brand.link : "/vision"}
                  className="inline-flex items-center text-primary text-xs font-semibold uppercase tracking-widest group/link pt-2"
                >
                  Explore Venture
                  <ArrowRight className="ml-2 w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Executive Leadership Teaser */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Executive Board
            </p>
            <h2 className="font-heading text-3xl md:text-5xl font-semibold tracking-tight">
              Leadership Team
            </h2>
          </div>
          <Link to="/team">
            <Button variant="outline" className="border-white/15 hover:border-primary/40 hover:bg-primary/5 text-sm">
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
      </section>

      {/* Performance Snapshot */}
      <section className="rounded-3xl border border-white/10 bg-[#111114] p-8 sm:p-12 lg:p-16 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Financial Trajectory
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold tracking-tight">
              Growth & Capital Metrics
            </h2>
          </div>
          <Link to="/timeline">
            <Button variant="outline" className="border-primary/35 text-primary hover:bg-primary/10 text-sm">
              View Strategic Roadmap
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Assets Under Mgmt", value: `$${config.netWorth}+` },
            { label: "Growth Multiplier", value: `x${config.multiplier}` },
            { label: "Operating Brands", value: `${brands.length}` },
            { label: "Planned Units", value: config.activeUnits || "15" },
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <p className="text-xs text-zinc-400 font-medium">{stat.label}</p>
              <p className="font-mono text-3xl md:text-4xl font-semibold gold-gradient tabular-nums">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Executive Statement */}
      <section className="text-center py-14 px-6 rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/[0.06] to-transparent">
        <div className="max-w-3xl mx-auto space-y-6">
          <Quote className="w-8 h-8 text-primary/60 mx-auto" />
          <blockquote className="font-heading italic text-2xl md:text-3xl leading-relaxed text-zinc-100">
            "{config.mdBannerQuote}"
          </blockquote>
          <div className="pt-2 space-y-1">
            <p className="text-sm font-semibold tracking-widest uppercase gold-text">
              {config.mdName}
            </p>
            <p className="text-xs text-zinc-400">{config.mdRole}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
