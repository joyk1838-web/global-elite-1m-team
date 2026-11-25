import eliteFunderImg from "../assets/images/elite_funder_capital_1795355125511.jpg";
import corporateHqImg from "../assets/images/corporate_hq_architecture_1795355124288.jpg";
import strategyRoomImg from "../assets/images/executive_strategy_room_1795355124159.jpg";
import globalNetworkImg from "../assets/images/global_network_horizon_1795355124395.jpg";

export const LOCAL_ASSETS = {
  eliteFunder: eliteFunderImg,
  corporateHq: corporateHqImg,
  strategyRoom: strategyRoomImg,
  globalNetwork: globalNetworkImg,
};

export interface SiteConfigData {
  companyName: string;
  tagline: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  mission: string;
  vision: string;
  mdName: string;
  mdRole: string;
  mdImage: string;
  mdQuote: string;
  mdBannerQuote: string;
  totalRevenue: string;
  netWorth: string;
  multiplier: string;
  status: string;
  activeUnits: string;
  valuationTarget: string;
  contactEmail: string;
  linkedinUrl: string;
  twitterUrl: string;
  instagramUrl: string;
}

export const DEFAULT_SITE_CONFIG: SiteConfigData = {
  companyName: "ELITE GROUP",
  tagline: "Building Excellence",
  heroEyebrow: "ELITE TEAM 07 · The $1M Horizon",
  heroTitle: "Building Excellence",
  heroSubtitle:
    "From $1K to $1M and beyond. Engineering a disciplined portfolio of high-conviction ventures built for financial sovereignty and global scale.",
  mission: "Scale from $1K to $1M and achieve enduring financial freedom.",
  vision: "A borderless portfolio of category-leading enterprises by 2030.",
  mdName: "MD Joy Hossen",
  mdRole: "Founder",
  mdImage: "",
  mdQuote: "Vision without execution is merely an ambition.",
  mdBannerQuote:
    "We are not simply building a company; we are building an enduring institution where financial independence is the baseline and global impact is the standard.",
  totalRevenue: "7,200",
  netWorth: "12,450",
  multiplier: "4.2",
  status: "Foundation",
  activeUnits: "15",
  valuationTarget: "1,000,000",
  contactEmail: "contact@elitegroup.global",
  linkedinUrl: "",
  twitterUrl: "",
  instagramUrl: "",
};

export const DEFAULT_BRANDS = [
  {
    id: "brand-1",
    name: "Elite Soft Drink",
    tagline: "Consumer Beverage",
    image: "https://lh3.googleusercontent.com/d/1zd5W3ODQ-8wdU8zn_ABNn8CR7a-6BTgz",
    link: "/vision",
    desc: "Ultra-premium formulation crafted for peak clarity, refined taste, and modern lifestyle positioning.",
    order: 1,
  },
  {
    id: "brand-2",
    name: "Elite Funder",
    tagline: "Capital & Advisory",
    image: eliteFunderImg,
    link: "/dashboard",
    desc: "Disciplined capital allocation, structured business funding, and long-term wealth architecture.",
    order: 2,
  },
  {
    id: "brand-3",
    name: "Elite Fashion",
    tagline: "Bespoke Apparel",
    image: "https://lh3.googleusercontent.com/d/1J1UaPpZ95un_go-wFGAQ8sMiUMUsdIDZ",
    link: "/gallery",
    desc: "Tailored executive craftsmanship designed for discerning leaders across global markets.",
    order: 3,
  },
];

export const DEFAULT_TEAM = [
  {
    id: "joy",
    name: "MD Joy Hossen",
    role: "Founder",
    bio: "Founder of ELITE GROUP, directing long-term vision, capital discipline, and ecosystem growth.",
    image: "",
    badges: [] as string[],
    initials: "JH",
    email: "",
    linkedin: "",
    twitter: "",
    order: 1,
  },
  {
    id: "tarif",
    name: "MD Tarif Hossain",
    role: "Team Member",
    bio: "Core member of ELITE TEAM 07 contributing to disciplined execution across group projects.",
    image: "",
    badges: [] as string[],
    initials: "TH",
    email: "",
    linkedin: "",
    twitter: "",
    order: 2,
  },
  {
    id: "asif",
    name: "MD ASIF HOSSAIN",
    role: "Team Member",
    bio: "Core member of ELITE TEAM 07 contributing to digital systems and project delivery.",
    image: "",
    badges: [] as string[],
    initials: "AH",
    email: "",
    linkedin: "",
    twitter: "",
    order: 3,
  },
  {
    id: "anisur",
    name: "ANISUR RAHMAN",
    role: "Team Member",
    bio: "Core member of ELITE TEAM 07 contributing to planning, coordination, and active series growth.",
    image: "",
    badges: [] as string[],
    initials: "AR",
    email: "",
    linkedin: "",
    twitter: "",
    order: 4,
  },
  {
    id: "babu",
    name: "BABU",
    role: "Team Member",
    bio: "Core member of ELITE TEAM 07 contributing to collaborative execution and momentum.",
    image: "",
    badges: [] as string[],
    initials: "BB",
    email: "",
    linkedin: "",
    twitter: "",
    order: 5,
  },
];

export function isFounderMember(member: any): boolean {
  if (!member) return false;
  if (member.id === "joy") return true;
  const role = String(member.role || "").trim().toLowerCase();
  return role === "founder" || role === "funder";
}

export function getMemberInitials(member: any): string {
  if (member?.initials && String(member.initials).trim()) {
    return String(member.initials).trim().slice(0, 2).toUpperCase();
  }
  const parts = String(member?.name || "")
    .trim()
    .split(/\s+/)
    .filter((w) => w && w.toUpperCase() !== "MD");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return "EG";
}

export function normalizeTeamMembers(members: any[]): any[] {
  return (members || []).map((member) => {
    const founder = isFounderMember(member);
    return {
      ...member,
      role: founder ? "Founder" : "Team Member",
      badges: [],
      image: typeof member?.image === "string" ? member.image : "",
      initials: getMemberInitials(member),
    };
  });
}

export const DEFAULT_MILESTONES = [
  {
    id: "ms1",
    title: "Corporate Foundation",
    description: "Official governance structure and brand architecture established.",
    date: "Jan 2025",
    completed: true,
    order: 1,
  },
  {
    id: "ms2",
    title: "Initial $1K Revenue",
    description: "Validated unit economics and closed inaugural commercial revenue.",
    date: "Feb 2025",
    completed: true,
    order: 2,
  },
  {
    id: "ms3",
    title: "Executive Core Assembly",
    description: "Founding leadership appointed across strategy, operations, and technology.",
    date: "Mar 2025",
    completed: true,
    order: 3,
  },
  {
    id: "ms4",
    title: "$10K Foundation",
    description: "Stabilizing recurring capital inflows and multi-venture cashflow.",
    date: "Sep 2025",
    completed: false,
    order: 4,
  },
  {
    id: "ms5",
    title: "Global Expansion",
    description: "Establishing international commercial distribution and presence.",
    date: "2027",
    completed: false,
    order: 5,
  },
];

export const DEFAULT_GROWTH = [
  { id: "g1", month: "Jan", amount: 1200, order: 1 },
  { id: "g2", month: "Feb", amount: 2100, order: 2 },
  { id: "g3", month: "Mar", amount: 1800, order: 3 },
  { id: "g4", month: "Apr", amount: 3500, order: 4 },
  { id: "g5", month: "May", amount: 4200, order: 5 },
  { id: "g6", month: "Jun", amount: 5800, order: 6 },
  { id: "g7", month: "Jul", amount: 7200, order: 7 },
];

export const DEFAULT_TIMELINE = [
  {
    id: "ev1",
    year: "2025",
    title: "The Ignition",
    desc: "ELITE GROUP launched with a clear mandate: build financial sovereignty and enduring enterprise value.",
    icon: "Rocket",
    status: "completed",
    order: 1,
  },
  {
    id: "ev2",
    year: "2026",
    title: "Systems & Governance",
    desc: "Standardizing internal operations, scalable technology infrastructure, and capital discipline.",
    icon: "Shield",
    status: "current",
    order: 2,
  },
  {
    id: "ev3",
    year: "2027",
    title: "Multi-Venture Synergy",
    desc: "Scaling flagship consumer and financial divisions while expanding executive capabilities.",
    icon: "Milestone",
    status: "upcoming",
    order: 3,
  },
  {
    id: "ev4",
    year: "2028",
    title: "International Footprint",
    desc: "Opening strategic commercial corridors across Dhaka, Dubai, London, and Singapore.",
    icon: "Flag",
    status: "upcoming",
    order: 4,
  },
  {
    id: "ev5",
    year: "2030",
    title: "The $1M Milestone",
    desc: "Achieving seven-figure enterprise scale and sustained global market presence.",
    icon: "Crown",
    status: "upcoming",
    order: 5,
  },
];

export const SERIES_ONE_ASSETS = [
  {
    id: "series-1-challenge",
    label: "01. $600 → $5K Challenge",
    title: "নিয়ম মেনেই কি সম্ভব? $600 → $5K চ্যালেঞ্জ সিরিজ",
    subtitle: "Rule-based capital growth from $600 starting equity to a $5,000 target.",
    url: "/assets/aistudio/IMG_8920_ff6da8e6.png",
  },
  {
    id: "series-1-education",
    label: "02. Trading Education",
    title: "সহজ বাংলায় ট্রেডিং শিক্ষা — লাইভ চ্যালেঞ্জ: $600 → $5K",
    subtitle: "Risk Management · Trading Psychology · Professional Mindset",
    url: "/assets/aistudio/IMG_9147_c7b2e618.png",
  },
];

export const DEFAULT_GALLERY = [
  {
    id: "gal-s1-1",
    url: "/assets/aistudio/IMG_8920_ff6da8e6.png",
    title: "Series 01 — $600 → $5K চ্যালেঞ্জ সিরিজ",
    category: "Series 01",
    uploadedAt: "2026-11-22T15:00:00.000Z",
  },
  {
    id: "gal-s1-2",
    url: "/assets/aistudio/IMG_9147_c7b2e618.png",
    title: "Series 01 — সহজ বাংলায় ট্রেডিং শিক্ষা ($600 → $5K)",
    category: "Series 01",
    uploadedAt: "2026-11-22T15:01:00.000Z",
  },
  {
    id: "gal1",
    url: corporateHqImg,
    title: "Corporate Headquarters Architecture",
    category: "Headquarters",
    uploadedAt: "2026-01-15T10:00:00.000Z",
  },
  {
    id: "gal2",
    url: strategyRoomImg,
    title: "Executive Strategy Summit",
    category: "Leadership",
    uploadedAt: "2026-02-10T10:00:00.000Z",
  },
  {
    id: "gal6",
    url: "https://lh3.googleusercontent.com/d/1zd5W3ODQ-8wdU8zn_ABNn8CR7a-6BTgz",
    title: "Elite Soft Drink — Flagship Consumer Venture",
    category: "Ventures",
    uploadedAt: "2026-03-01T10:00:00.000Z",
  },
  {
    id: "gal7",
    url: eliteFunderImg,
    title: "Elite Funder — Capital & Advisory Boardroom",
    category: "Ventures",
    uploadedAt: "2026-03-10T10:00:00.000Z",
  },
  {
    id: "gal8",
    url: "https://lh3.googleusercontent.com/d/1J1UaPpZ95un_go-wFGAQ8sMiUMUsdIDZ",
    title: "Elite Fashion — Bespoke Executive Collection",
    category: "Ventures",
    uploadedAt: "2026-03-15T10:00:00.000Z",
  },
];
