import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { TrendingUp, Target, CreditCard, Landmark, CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getGrowthData, getMilestones } from "../services/firebase";
import { useSiteConfig } from "../context/SiteContext";
import { DEFAULT_GROWTH, DEFAULT_MILESTONES, SERIES_ONE_ASSETS } from "../lib/defaults";

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const PHASE_BENCHMARKS = [
  { phase: "Start", target: 1000, current: 1000 },
  { phase: "Foundation", target: 10000, current: 8500 },
  { phase: "Growth", target: 100000, current: 0 },
  { phase: "Expansion", target: 500000, current: 0 },
  { phase: "Target", target: 1000000, current: 0 },
];

export default function Dashboard() {
  const { config } = useSiteConfig();
  const [revenueData, setRevenueData] = useState<any[]>(
    DEFAULT_GROWTH.map((g) => ({ name: g.month, amount: g.amount }))
  );
  const [milestones, setMilestones] = useState<any[]>(DEFAULT_MILESTONES);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gData, mData] = await Promise.all([getGrowthData(), getMilestones()]);
        if (gData && gData.length > 0) {
          setRevenueData(gData.map((d: any) => ({ name: d.month, amount: d.amount })));
        }
        if (mData && mData.length > 0) {
          setMilestones(mData);
        }
      } catch (e) {
        console.warn("Using default progress metrics", e);
      }
    };
    fetchData();
  }, []);

  const numericNetWorth = parseFloat(String(config.netWorth || "12450").replace(/,/g, "")) || 12450;
  const phaseBenchmarks = PHASE_BENCHMARKS.map((item, idx) => {
    if (idx === 1) {
      return { ...item, current: Math.min(item.target, numericNetWorth) };
    }
    return item;
  });

  return (
    <div className="space-y-12 pb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-8">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            Performance Overview
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight gold-gradient">
            Progress Dashboard
          </h1>
          <p className="text-sm md:text-base text-zinc-400">
            Tracking operational growth and milestones toward the ${config.valuationTarget || "1,000,000"} objective.
          </p>
        </div>
        <p className="text-xs font-medium text-zinc-400">
          Current Stage: <span className="text-primary font-semibold">{config.status}</span>
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Total Revenue", value: `$${config.totalRevenue}`, note: "Cumulative reported", icon: CreditCard },
          { label: "Net Worth", value: `$${config.netWorth}`, note: "Verified capital base", icon: Landmark },
          { label: "Growth Multiplier", value: `x${config.multiplier}`, note: "Period expansion rate", icon: TrendingUp },
          { label: "Mission Phase", value: config.status, note: "2030 roadmap status", icon: Target },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.06, ease: EASE_OUT_EXPO }}
          >
            <Card className="surface-card border-white/10">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-400">{stat.label}</span>
                  <stat.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-mono text-2xl md:text-3xl font-semibold text-zinc-100 tabular-nums">
                    {stat.value}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">{stat.note}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Series 01 Active Project Banner ($600 -> $5K) */}
      <Card className="surface-card border-white/10 overflow-hidden">
        <div className="grid lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 p-6 sm:p-8 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Series 01 · Active Challenge
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-zinc-100">
              $600 → $5K Live Trading Project
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              সহজ বাংলায় ট্রেডিং শিক্ষা — নিয়ম মেনে $600 থেকে $5,000 লক্ষ্যে রিস্ক ম্যানেজমেন্ট, ট্রেডিং সাইকোলজি এবং প্রফেশনাল মাইন্ডসেট ভিত্তিক প্রজেক্ট।
            </p>
            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/10">
              <div>
                <p className="font-mono text-xl font-semibold text-zinc-100 tabular-nums">$600</p>
                <p className="text-[11px] text-zinc-500">Start</p>
              </div>
              <div>
                <p className="font-mono text-xl font-semibold text-primary tabular-nums">$5,000</p>
                <p className="text-[11px] text-zinc-500">Target</p>
              </div>
              <div>
                <p className="font-mono text-xl font-semibold text-zinc-100 tabular-nums">8.3x</p>
                <p className="text-[11px] text-zinc-500">Multiplier</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-3 p-4 sm:p-6 bg-black/30">
            {SERIES_ONE_ASSETS.map((item) => (
              <div
                key={item.id}
                className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-black"
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Chart */}
        <Card className="lg:col-span-2 surface-card border-white/10">
          <CardHeader>
            <CardTitle className="font-heading text-2xl font-semibold">Monthly Revenue Growth</CardTitle>
            <CardDescription className="text-zinc-400">
              Chronological revenue progression managed via the Admin Portal
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[360px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4af37" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="name"
                  stroke="#71717a"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#71717a"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111114",
                    border: "1px solid rgba(212,175,55,0.35)",
                    borderRadius: "10px",
                    fontSize: "12px",
                  }}
                  itemStyle={{ color: "#d4af37" }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#d4af37"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Active Milestones */}
        <Card className="surface-card border-white/10">
          <CardHeader>
            <CardTitle className="font-heading text-2xl font-semibold">Key Milestones</CardTitle>
            <CardDescription className="text-zinc-400">
              Verified checkpoints toward $1M scale
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {milestones.map((ms, i) => (
                <div key={ms.id || i} className="flex gap-3.5 group">
                  <div className="relative pt-0.5">
                    {ms.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    ) : (
                      <Circle className="w-5 h-5 text-zinc-600" />
                    )}
                    {i !== milestones.length - 1 && (
                      <div className="absolute top-6 left-2.5 w-px h-10 bg-white/10" />
                    )}
                  </div>
                  <div className="space-y-1 pb-4">
                    <h4 className={`text-sm font-semibold leading-none ${ms.completed ? "text-zinc-100" : "text-zinc-400"}`}>
                      {ms.title}
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">{ms.description}</p>
                    {ms.date && (
                      <p className="text-[11px] font-mono text-primary/80">{ms.date}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Phase Capital Roadmap */}
      <Card className="surface-card border-white/10">
        <CardHeader>
          <CardTitle className="font-heading text-2xl font-semibold">Capital Scaling Benchmarks</CardTitle>
          <CardDescription className="text-zinc-400">
            Stage-by-stage target progression from foundation to $1M valuation
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={phaseBenchmarks}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="phase" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                cursor={{ fill: "rgba(212, 175, 55, 0.05)" }}
                contentStyle={{
                  backgroundColor: "#111114",
                  border: "1px solid rgba(212,175,55,0.35)",
                  borderRadius: "10px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="target" name="Target" radius={[6, 6, 0, 0]}>
                {phaseBenchmarks.map((_, index) => (
                  <Cell key={`target-${index}`} fill="#d4af37" opacity={0.25} />
                ))}
              </Bar>
              <Bar dataKey="current" name="Current" radius={[6, 6, 0, 0]}>
                {phaseBenchmarks.map((_, index) => (
                  <Cell key={`current-${index}`} fill="#d4af37" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
        <div className="px-6 pb-6 flex justify-center gap-8 text-xs font-medium text-zinc-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-sm" />
            <span>Current Achieved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary/25 rounded-sm" />
            <span>Phase Target</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
