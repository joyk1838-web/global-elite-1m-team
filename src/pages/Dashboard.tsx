import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Target,
  CreditCard,
  Landmark,
  CheckCircle2,
  Circle,
  ArrowUpRight,
  ShieldAlert,
  Activity,
} from "lucide-react";
import { sanitizeImageSrc } from "@/lib/utils";
import { usePageSeo } from "../hooks/usePageSeo";
import {
  getGrowthData,
  getMilestones,
  getTrades,
  type TradeRecord,
} from "../services/firebase";
import { useSiteConfig } from "../context/SiteContext";
import { useExecutiveChat } from "../context/ChatContext";
import {
  DEFAULT_GROWTH,
  DEFAULT_MILESTONES,
  LOCAL_ASSETS,
  SERIES_ONE_ASSETS,
} from "../lib/defaults";
import { AnimatedCounter } from "../components/motion/AnimatedCounter";
import { SpotlightCard } from "../components/motion/SpotlightCard";
import {
  EASE_OUT_EXPO,
  MiniSparkline,
  RadialProgressRing,
  SCROLL_VIEWPORT,
  TextMaskReveal,
} from "../components/motion/MotionPrimitives";

type TimeframeOption = "all" | "6m" | "3m";
type ChartMode = "monthly" | "cumulative" | "bars";
type MilestoneFilter = "all" | "completed" | "upcoming";

interface RevenuePoint {
  name: string;
  amount: number;
  cumulative: number;
  deltaPct: number | null;
}

const SCALING_TIERS = [
  { phase: "01. Start", target: 1000, note: "Initial validation" },
  { phase: "02. Foundation", target: 10000, note: "Operating base" },
  { phase: "03. Growth", target: 100000, note: "Multi-venture scale" },
  { phase: "04. Expansion", target: 500000, note: "Regional corridors" },
  { phase: "05. Target", target: 1000000, note: "2030 $1M objective" },
];

function CustomChartTooltip({
  active,
  payload,
  label,
  chartMode,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: RevenuePoint }>;
  label?: string;
  chartMode: ChartMode;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0];
  const val = Number(item.value || 0);
  const delta = item.payload?.deltaPct;

  return (
    <div className="rounded-xl border border-primary/35 bg-[#0d0d12]/95 backdrop-blur-md px-4 py-3 shadow-2xl space-y-1">
      <p className="text-xs font-medium text-zinc-400">
        {label} · {chartMode === "cumulative" ? "Cumulative Equity" : "Period Revenue"}
      </p>
      <p className="font-mono text-lg font-semibold text-zinc-50 tabular-nums">
        ${val.toLocaleString("en-US")}
      </p>
      {delta !== null && chartMode !== "cumulative" && (
        <p
          className={`font-mono text-xs tabular-nums ${
            delta >= 0 ? "text-primary" : "text-rose-400"
          }`}
        >
          {delta >= 0 ? "+" : ""}
          {delta.toFixed(1)}% vs prior period
        </p>
      )}
    </div>
  );
}

export default function Dashboard() {
  usePageSeo({
    title: "Progress & Performance Dashboard",
    description:
      "Transparent capital progression, live reported snapshot, historical monthly performance, and trading risk disclosure for GLOBAL ELITE 1M TEAM.",
    path: "/dashboard",
  });

  const { config } = useSiteConfig();
  const { openChat } = useExecutiveChat();

  const [rawRevenue, setRawRevenue] = useState<Array<{ name: string; amount: number }>>(
    DEFAULT_GROWTH.map((g) => ({ name: g.month, amount: Number(g.amount) || 0 }))
  );
  const [milestones, setMilestones] = useState<any[]>(DEFAULT_MILESTONES);
  const [trades, setTrades] = useState<TradeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [timeframe, setTimeframe] = useState<TimeframeOption>("all");
  const [chartMode, setChartMode] = useState<ChartMode>("monthly");
  const [milestoneFilter, setMilestoneFilter] = useState<MilestoneFilter>("all");
  const [activeSeriesSlide, setActiveSeriesSlide] = useState(0);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        const [gData, mData, tData] = await Promise.all([
          getGrowthData(),
          getMilestones(),
          getTrades(),
        ]);
        if (!active) return;
        if (gData && gData.length > 0) {
          setRawRevenue(
            gData.map((d: any) => ({
              name: String(d.month || ""),
              amount: Number(d.amount) || 0,
            }))
          );
        }
        if (mData && mData.length > 0) {
          setMilestones(mData);
        }
        if (tData && tData.length > 0) {
          setTrades(tData);
        }
      } catch (e) {
        console.warn("Using default progress metrics", e);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      active = false;
    };
  }, []);

  const enrichedSeries = useMemo<RevenuePoint[]>(() => {
    let running = 0;
    const full = rawRevenue.map((pt, idx) => {
      running += pt.amount;
      const prev = idx > 0 ? rawRevenue[idx - 1].amount : 0;
      const deltaPct = idx > 0 && prev > 0 ? ((pt.amount - prev) / prev) * 100 : null;
      return {
        name: pt.name,
        amount: pt.amount,
        cumulative: running,
        deltaPct,
      };
    });

    if (timeframe === "6m") return full.slice(-6);
    if (timeframe === "3m") return full.slice(-3);
    return full;
  }, [rawRevenue, timeframe]);

  const numericNetWorth =
    parseFloat(String(config.netWorth || "12450").replace(/,/g, "")) || 12450;
  const numericTarget =
    parseFloat(String(config.valuationTarget || "1000000").replace(/,/g, "")) || 1000000;
  const overallProgressPct = Math.min(100, Math.max(0.1, (numericNetWorth / numericTarget) * 100));

  const nextTier =
    SCALING_TIERS.find((t) => numericNetWorth < t.target) ||
    SCALING_TIERS[SCALING_TIERS.length - 1];
  const nextTierPct = Math.min(100, Math.round((numericNetWorth / nextTier.target) * 100));
  const amountToNextTier = Math.max(0, nextTier.target - numericNetWorth);

  const latestPoint = enrichedSeries[enrichedSeries.length - 1];
  const latestDeltaStr =
    latestPoint?.deltaPct !== null && latestPoint?.deltaPct !== undefined
      ? `${latestPoint.deltaPct >= 0 ? "+" : ""}${latestPoint.deltaPct.toFixed(1)}% latest period`
      : "Cumulative reported";

  const filteredMilestones = useMemo(() => {
    if (milestoneFilter === "completed") return milestones.filter((m) => Boolean(m.completed));
    if (milestoneFilter === "upcoming") return milestones.filter((m) => !m.completed);
    return milestones;
  }, [milestones, milestoneFilter]);

  const completedCount = milestones.filter((m) => Boolean(m.completed)).length;
  const chartDataKey = chartMode === "cumulative" ? "cumulative" : "amount";

  const ledgerStats = useMemo(() => {
    const ordered = [...trades].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    let startingBalance: number | null = null;
    let runningBalance = 0;
    let totalDeposits = 0;
    let totalWithdrawals = 0;
    let totalPnl = 0;
    let totalTrades = 0;
    let winningTrades = 0;
    let losingTrades = 0;
    let peakBalance = 0;
    let maxDrawdownDollar = 0;
    let maxDrawdownPct = 0;

    for (const entry of ordered) {
      if (entry.entryType === "deposit") {
        const amt = Number(entry.amount ?? entry.pnl ?? 0);
        if (startingBalance === null) startingBalance = amt;
        totalDeposits += amt;
        runningBalance += amt;
      } else if (entry.entryType === "withdrawal") {
        const amt = Number(entry.amount ?? entry.pnl ?? 0);
        totalWithdrawals += amt;
        runningBalance -= amt;
      } else {
        const pnl = Number(entry.pnl ?? 0);
        totalTrades += 1;
        if (pnl > 0) winningTrades += 1;
        else if (pnl < 0) losingTrades += 1;
        totalPnl += pnl;
        runningBalance += pnl;
      }

      if (runningBalance > peakBalance) {
        peakBalance = runningBalance;
      }
      if (peakBalance > 0) {
        const ddDollar = Math.max(0, peakBalance - runningBalance);
        const ddPct = (ddDollar / peakBalance) * 100;
        if (ddDollar > maxDrawdownDollar) maxDrawdownDollar = ddDollar;
        if (ddPct > maxDrawdownPct) maxDrawdownPct = ddPct;
      }
    }

    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : null;

    return {
      hasRecords: ordered.length > 0,
      ordered,
      startingBalance,
      currentBalance: runningBalance,
      totalPnl,
      totalTrades,
      winningTrades,
      losingTrades,
      winRate,
      totalDeposits,
      totalWithdrawals,
      maxDrawdownDollar,
      maxDrawdownPct,
    };
  }, [trades]);

  const formatUsd = (val: number) =>
    `${val < 0 ? "-" : ""}$${Math.abs(val).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="space-y-10 pb-20">
      {/* Header + Working Timeframe Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
        <div className="space-y-2.5 max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
            Live Reported Snapshot & Historical Series · {config.status || "Foundation"} Phase
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-semibold tracking-tight gold-gradient">
            <TextMaskReveal immediate delay={0.04}>
              Progress Dashboard
            </TextMaskReveal>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Distinguishing live reported enterprise equity from historical monthly revenue records and verified ledger performance toward our $
            {config.valuationTarget || "1,000,000"} objective.
          </p>
        </div>

        {/* Interactive Timeframe Control */}
        <div
          className="inline-flex items-center gap-1 p-1 rounded-xl border border-white/10 bg-[#0b0b0f] self-start lg:self-auto"
          role="tablist"
          aria-label="Chart timeframe filter"
        >
          {(
            [
              { id: "all", label: "All Periods" },
              { id: "6m", label: "Last 6 Months" },
              { id: "3m", label: "Last 3 Months" },
            ] as const
          ).map((tab) => {
            const isSelected = timeframe === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setTimeframe(tab.id)}
                className={`relative px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isSelected ? "text-zinc-950" : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="dash-timeframe-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-lg bg-primary"
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Analytics Bento: Valuation Radial Ring (5 cols) + 2x2 KPI Grid (7 cols) */}
      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
          className="lg:col-span-5 h-full"
        >
          <SpotlightCard active className="p-7 sm:p-8 h-full flex flex-col justify-between gap-7">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                  2030 North Star
                </p>
                <h2 className="font-heading text-2xl font-semibold text-zinc-50">
                  Valuation Trajectory
                </h2>
              </div>
              <span className="font-mono text-xs text-zinc-400 tabular-nums">
                Target ${numericTarget.toLocaleString("en-US")}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-7 py-2">
              <RadialProgressRing
                percent={Math.max(4, overallProgressPct)}
                size={156}
                strokeWidth={10}
                label={`${overallProgressPct.toFixed(2)}%`}
                sublabel="of $1M goal"
              />

              <div className="flex-1 w-full space-y-4">
                <div className="space-y-1">
                  <p className="text-xs text-zinc-400">Current Verified Equity</p>
                  <p className="font-mono text-3xl font-semibold text-zinc-50 tabular-nums">
                    <AnimatedCounter value={config.netWorth || "12,450"} prefix="$" />
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-white/[0.08]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Next Tier: {nextTier.phase}</span>
                    <span className="font-mono text-primary tabular-nums">{nextTierPct}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/[0.08] overflow-hidden">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
                      style={{ width: `${nextTierPct}%` }}
                      className="h-full origin-left rounded-full bg-gradient-to-r from-primary/70 via-primary to-[#f3df9b]"
                    />
                  </div>
                  <p className="font-mono text-[11px] text-zinc-500 tabular-nums">
                    ${amountToNextTier.toLocaleString("en-US")} remaining to $
                    {nextTier.target.toLocaleString("en-US")}
                  </p>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </motion.div>

        {/* 2x2 KPI Cards with Live Animated Sparklines */}
        <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
          {[
            {
              label: "Total Revenue",
              raw: config.totalRevenue || "7,200",
              prefix: "$",
              note: latestDeltaStr,
              icon: CreditCard,
              sparkValues: enrichedSeries.map((d) => d.amount),
              highlight: true,
            },
            {
              label: "Verified Net Worth",
              raw: config.netWorth || "12,450",
              prefix: "$",
              note: "Accumulated capital base",
              icon: Landmark,
              sparkValues: enrichedSeries.map((d) => d.cumulative),
              highlight: false,
            },
            {
              label: "Growth Multiplier",
              raw: config.multiplier || "4.2",
              prefix: "x",
              note: "Compounding period velocity",
              icon: TrendingUp,
              sparkValues: null,
              highlight: false,
            },
            {
              label: "Series 01 Objective",
              raw: "$600 → $5K",
              prefix: "",
              note: "8.3x Rule-based challenge",
              icon: Target,
              isText: true,
              sparkValues: null,
              highlight: false,
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.06 + i * 0.06, ease: EASE_OUT_EXPO }}
              className="h-full"
            >
              <SpotlightCard
                active={stat.highlight}
                className="p-6 h-full flex flex-col justify-between gap-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-zinc-400">{stat.label}</span>
                  <stat.icon className="w-4 h-4 text-primary shrink-0" />
                </div>

                <div className="space-y-1">
                  <p className="font-mono text-2xl sm:text-3xl font-semibold text-zinc-50 tabular-nums">
                    {stat.isText ? (
                      stat.raw
                    ) : (
                      <AnimatedCounter value={stat.raw} prefix={stat.prefix} />
                    )}
                  </p>
                  <p className="text-xs text-zinc-500">{stat.note}</p>
                </div>

                {stat.sparkValues ? (
                  <div className="pt-1">
                    <MiniSparkline values={stat.sparkValues} />
                  </div>
                ) : (
                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <span className="text-zinc-500">
                      {stat.isText ? "Live Execution" : "Status"}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        openChat(
                          stat.isText
                            ? "Brief me on our Series 01 $600 to $5K challenge metrics."
                            : "Analyze our current growth multiplier and revenue trajectory."
                        )
                      }
                      className="inline-flex items-center gap-1 text-primary hover:underline cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Briefing
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Revenue Visualization with Mode Switcher & Skeleton Loading */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={SCROLL_VIEWPORT}
        transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
      >
        <SpotlightCard tilt={false} className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.07] pb-5">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="font-heading text-2xl font-semibold text-zinc-50">
                  Historical Monthly Performance
                </h2>
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 border border-white/10 rounded-md px-2 py-0.5">
                  Historical Series
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400">
                Chronological historical revenue periods recorded in the organization series
              </p>
            </div>

            <div
              className="inline-flex items-center gap-1 p-1 rounded-xl border border-white/10 bg-[#07070a] self-start sm:self-auto"
              role="tablist"
              aria-label="Chart visualization mode"
            >
              {(
                [
                  { id: "monthly", label: "Monthly" },
                  { id: "cumulative", label: "Cumulative" },
                  { id: "bars", label: "Comparison" },
                ] as const
              ).map((mode) => {
                const isActive = chartMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setChartMode(mode.id)}
                    className={`relative px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      isActive ? "text-zinc-950" : "text-zinc-400 hover:text-zinc-100"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="dash-chart-mode"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-0 rounded-lg bg-primary"
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative z-10">{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {isLoading ? (
            <div className="h-[340px] w-full rounded-xl bg-white/[0.03] animate-pulse" />
          ) : enrichedSeries.length === 0 ? (
            <div className="h-[340px] flex flex-col items-center justify-center text-center gap-3">
              <p className="text-sm text-zinc-400">No revenue records available for this window.</p>
              <button
                type="button"
                onClick={() => setTimeframe("all")}
                className="px-4 py-2 rounded-lg bg-primary text-zinc-950 text-xs font-semibold cursor-pointer"
              >
                Show All Periods
              </button>
            </div>
          ) : (
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartMode === "bars" ? (
                  <BarChart data={enrichedSeries}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="rgba(255,255,255,0.06)"
                    />
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
                      cursor={{ fill: "rgba(226, 190, 83, 0.06)" }}
                      content={<CustomChartTooltip chartMode={chartMode} />}
                    />
                    <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={52}>
                      {enrichedSeries.map((_, index) => (
                        <Cell
                          key={`bar-${index}`}
                          fill={index === enrichedSeries.length - 1 ? "#f3df9b" : "#e2be53"}
                          fillOpacity={0.35 + ((index + 1) / enrichedSeries.length) * 0.65}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                ) : (
                  <AreaChart data={enrichedSeries}>
                    <defs>
                      <linearGradient id="dashGoldArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e2be53" stopOpacity={0.32} />
                        <stop offset="95%" stopColor="#e2be53" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="rgba(255,255,255,0.06)"
                    />
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
                      tickFormatter={(value) => `$${value.toLocaleString("en-US")}`}
                    />
                    <Tooltip content={<CustomChartTooltip chartMode={chartMode} />} />
                    <Area
                      type="monotone"
                      dataKey={chartDataKey}
                      stroke="#e2be53"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#dashGoldArea)"
                      activeDot={{
                        r: 5,
                        fill: "#f3df9b",
                        stroke: "#050507",
                        strokeWidth: 2,
                      }}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          )}
        </SpotlightCard>
      </motion.div>

      {/* Series 01 Active Project Showcase ($600 -> $5K) */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={SCROLL_VIEWPORT}
        transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
      >
        <SpotlightCard active tilt={false} className="overflow-hidden">
          <div className="grid lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-5 p-7 sm:p-9 flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                  Series 01 · Active Challenge
                </p>
                <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-zinc-50 leading-snug">
                  $600 → $5K Live Trading Project
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  সহজ বাংলায় ট্রেডিং শিক্ষা — নিয়ম মেনে $600 থেকে $5,000 লক্ষ্যে রিস্ক ম্যানেজমেন্ট, ট্রেডিং সাইকোলজি এবং প্রফেশনাল মাইন্ডসেট ভিত্তিক প্রজেক্ট।
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 py-4 border-y border-white/[0.08]">
                  <div>
                    <p className="font-mono text-xl font-semibold text-zinc-100 tabular-nums">
                      $600
                    </p>
                    <p className="text-[11px] text-zinc-500">শুরু · Start</p>
                  </div>
                  <div>
                    <p className="font-mono text-xl font-semibold text-primary tabular-nums">
                      $5,000
                    </p>
                    <p className="text-[11px] text-zinc-500">লক্ষ্য · Target</p>
                  </div>
                  <div>
                    <p className="font-mono text-xl font-semibold text-zinc-100 tabular-nums">
                      8.3x
                    </p>
                    <p className="text-[11px] text-zinc-500">Multiplier</p>
                  </div>
                </div>

                {/* Interactive Slide Selector */}
                <div className="flex flex-wrap gap-2">
                  {SERIES_ONE_ASSETS.map((item, idx) => {
                    const active = idx === activeSeriesSlide;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveSeriesSlide(idx)}
                        className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
                          active
                            ? "border-primary/60 bg-primary/15 text-primary"
                            : "border-white/10 bg-white/[0.02] text-zinc-400 hover:text-zinc-100"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#060609] border-t lg:border-t-0 lg:border-l border-white/[0.08] p-5 sm:p-7 flex items-center justify-center">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={SERIES_ONE_ASSETS[activeSeriesSlide]?.id}
                    src={sanitizeImageSrc(SERIES_ONE_ASSETS[activeSeriesSlide]?.url, LOCAL_ASSETS.corporateHq)}
                    alt={SERIES_ONE_ASSETS[activeSeriesSlide]?.title}
                    loading="lazy"
                    decoding="async"
                    initial={{ opacity: 0, scale: 1.03, filter: "blur(5px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.99, filter: "blur(4px)" }}
                    transition={{ duration: 0.38, ease: EASE_OUT_EXPO }}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = LOCAL_ASSETS.corporateHq;
                    }}
                  />
                </AnimatePresence>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </motion.div>

      {/* Trading Performance & Transparency Section (Calculated strictly from real Firestore trades records) */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={SCROLL_VIEWPORT}
        transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
      >
        <SpotlightCard tilt={false} className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.07] pb-5">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <Activity className="w-5 h-5 text-primary shrink-0" />
                <h2 className="font-heading text-2xl font-semibold text-zinc-50">
                  Trading Performance & Transparency
                </h2>
                <span className="text-[11px] font-mono uppercase tracking-wider text-primary border border-primary/30 rounded-md px-2 py-0.5">
                  {ledgerStats.hasRecords ? "Live Verified Ledger" : "Awaiting Trade Entries"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400">
                All metrics below are calculated directly from verified ledger records in the database — zero simulated returns.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              {
                label: "Starting Balance",
                value: ledgerStats.startingBalance !== null ? formatUsd(ledgerStats.startingBalance) : "Not Yet Recorded",
              },
              {
                label: "Current Balance",
                value: ledgerStats.hasRecords ? formatUsd(ledgerStats.currentBalance) : "Not Yet Recorded",
              },
              {
                label: "Total Profit / Loss",
                value: ledgerStats.hasRecords ? formatUsd(ledgerStats.totalPnl) : "Not Yet Recorded",
              },
              {
                label: "Total Trades",
                value: ledgerStats.hasRecords ? String(ledgerStats.totalTrades) : "0",
              },
              {
                label: "Win Rate",
                value: ledgerStats.winRate !== null ? `${ledgerStats.winRate.toFixed(1)}%` : "Not Yet Recorded",
              },
              {
                label: "Winning Trades",
                value: ledgerStats.hasRecords ? String(ledgerStats.winningTrades) : "0",
              },
              {
                label: "Losing Trades",
                value: ledgerStats.hasRecords ? String(ledgerStats.losingTrades) : "0",
              },
              {
                label: "Deposits",
                value: ledgerStats.hasRecords ? formatUsd(ledgerStats.totalDeposits) : "$0",
              },
              {
                label: "Withdrawals",
                value: ledgerStats.hasRecords ? formatUsd(ledgerStats.totalWithdrawals) : "$0",
              },
              {
                label: "Maximum Drawdown",
                value: ledgerStats.hasRecords
                  ? `${formatUsd(ledgerStats.maxDrawdownDollar)} (${ledgerStats.maxDrawdownPct.toFixed(1)}%)`
                  : "Not Yet Recorded",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/[0.07] bg-[#07070a] p-4 space-y-1.5"
              >
                <p className="text-[11px] font-medium text-zinc-500">{item.label}</p>
                <p className="font-mono text-sm sm:text-base font-semibold text-zinc-100 tabular-nums break-words">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {ledgerStats.hasRecords ? (
            <div className="overflow-x-auto border border-white/[0.07] rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.03] text-zinc-400 border-b border-white/[0.07]">
                  <tr>
                    <th className="py-3 px-4 font-medium">Date</th>
                    <th className="py-3 px-4 font-medium">Type</th>
                    <th className="py-3 px-4 font-medium">Instrument / Ref</th>
                    <th className="py-3 px-4 font-medium text-right">Amount / P&L</th>
                    <th className="py-3 px-4 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {ledgerStats.ordered.map((entry) => {
                    const value = entry.entryType === "trade" ? Number(entry.pnl ?? 0) : Number(entry.amount ?? 0);
                    return (
                      <tr key={entry.id} className="hover:bg-white/[0.02]">
                        <td className="py-2.5 px-4 font-mono text-zinc-300 whitespace-nowrap">{entry.date}</td>
                        <td className="py-2.5 px-4 capitalize text-zinc-400">{entry.entryType}</td>
                        <td className="py-2.5 px-4 text-zinc-200">{entry.symbol || "—"}</td>
                        <td
                          className={`py-2.5 px-4 font-mono text-right tabular-nums ${
                            entry.entryType === "withdrawal"
                              ? "text-amber-300"
                              : value >= 0
                              ? "text-emerald-400"
                              : "text-rose-400"
                          }`}
                        >
                          {entry.entryType === "withdrawal" ? `-${formatUsd(value)}` : formatUsd(value)}
                        </td>
                        <td className="py-2.5 px-4 text-zinc-400">{entry.notes || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 bg-[#07070a]/70 px-5 py-4 text-xs text-zinc-400 leading-relaxed">
              No individual trade or deposit ledger entries have been published yet. Historical monthly progress records remain shown above, and verified trade-by-trade telemetry will calculate automatically as soon as live entries are recorded.
            </div>
          )}

          {/* Explicit Risk Disclaimer */}
          <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-4 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs text-zinc-300 leading-relaxed">
              <span className="font-semibold text-zinc-100">Risk Disclaimer:</span> Trading involves substantial financial risk. Past performance does not guarantee future results. Visitors should make independent financial decisions.
            </p>
          </div>
        </SpotlightCard>
      </motion.div>

      {/* Bottom Split: Capital Scaling Ladder (7 cols) + Key Milestones Tracker (5 cols) */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={SCROLL_VIEWPORT}
          transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
          className="lg:col-span-7"
        >
          <SpotlightCard tilt={false} className="p-6 sm:p-8 space-y-6">
            <div className="space-y-1 border-b border-white/[0.07] pb-5">
              <h2 className="font-heading text-2xl font-semibold text-zinc-50">
                Capital Scaling Ladder
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                Stage-by-stage target progression from foundation to $1,000,000 valuation
              </p>
            </div>

            <div className="space-y-5">
              {SCALING_TIERS.map((tier, idx) => {
                const achieved = Math.min(tier.target, numericNetWorth);
                const pct = Math.min(100, Math.round((achieved / tier.target) * 100));
                const isDone = pct >= 100;

                return (
                  <div key={tier.phase} className="space-y-2">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div className="flex items-baseline gap-2.5">
                        <span className="text-sm font-semibold text-zinc-100">{tier.phase}</span>
                        <span className="text-xs text-zinc-500">· {tier.note}</span>
                      </div>
                      <div className="font-mono text-xs tabular-nums flex items-center gap-3">
                        <span className="text-zinc-400">
                          ${achieved.toLocaleString("en-US")} / $
                          {tier.target.toLocaleString("en-US")}
                        </span>
                        <span className={isDone ? "text-primary font-semibold" : "text-zinc-300"}>
                          {pct}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={SCROLL_VIEWPORT}
                        transition={{
                          duration: 0.95,
                          delay: idx * 0.08,
                          ease: EASE_OUT_EXPO,
                        }}
                        style={{ width: `${Math.max(2, pct)}%` }}
                        className={`h-full origin-left rounded-full ${
                          isDone
                            ? "bg-primary"
                            : "bg-gradient-to-r from-primary/80 to-[#f3df9b]"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </SpotlightCard>
        </motion.div>

        {/* Key Milestones Tracker with Filter */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={SCROLL_VIEWPORT}
          transition={{ duration: 0.65, delay: 0.08, ease: EASE_OUT_EXPO }}
          className="lg:col-span-5"
        >
          <SpotlightCard tilt={false} className="p-6 sm:p-8 space-y-6">
            <div className="space-y-4 border-b border-white/[0.07] pb-5">
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <h2 className="font-heading text-2xl font-semibold text-zinc-50">
                    Key Milestones
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Verified checkpoints toward $1M scale
                  </p>
                </div>
                <span className="font-mono text-xs text-primary tabular-nums shrink-0">
                  {completedCount}/{milestones.length} Done
                </span>
              </div>

              <div className="inline-flex items-center gap-1 p-1 rounded-xl border border-white/10 bg-[#07070a]">
                {(
                  [
                    { id: "all", label: "All" },
                    { id: "completed", label: "Completed" },
                    { id: "upcoming", label: "Upcoming" },
                  ] as const
                ).map((f) => {
                  const active = milestoneFilter === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setMilestoneFilter(f.id)}
                      className={`relative px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                        active ? "text-zinc-950" : "text-zinc-400 hover:text-zinc-100"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="dash-ms-filter"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          className="absolute inset-0 rounded-lg bg-primary"
                          aria-hidden="true"
                        />
                      )}
                      <span className="relative z-10">{f.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {filteredMilestones.length === 0 ? (
              <div className="py-10 text-center space-y-3">
                <p className="text-sm text-zinc-400">No milestones match this filter.</p>
                <button
                  type="button"
                  onClick={() => setMilestoneFilter("all")}
                  className="px-3.5 py-1.5 rounded-lg border border-white/15 text-xs font-medium text-zinc-200 hover:border-primary/50 hover:text-primary cursor-pointer"
                >
                  Show All
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredMilestones.map((ms, i) => (
                  <motion.div
                    key={ms.id || i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.04, ease: EASE_OUT_EXPO }}
                    className="flex gap-3.5 group"
                  >
                    <div className="relative pt-0.5 shrink-0">
                      {ms.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      ) : (
                        <Circle className="w-5 h-5 text-zinc-600" />
                      )}
                      {i !== filteredMilestones.length - 1 && (
                        <div className="absolute top-6 left-2.5 w-px h-10 bg-white/10" />
                      )}
                    </div>
                    <div className="space-y-1 pb-3">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <h3
                          className={`text-sm font-semibold leading-none ${
                            ms.completed ? "text-zinc-100" : "text-zinc-400"
                          }`}
                        >
                          {ms.title}
                        </h3>
                        {ms.date && (
                          <span className="text-[11px] font-mono text-primary/80 tabular-nums">
                            · {ms.date}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">{ms.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </SpotlightCard>
        </motion.div>
      </div>
    </div>
  );
}
