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
  mdRole: "Founder & Managing Director",
  mdImage: "https://lh3.googleusercontent.com/d/17EAsoYWww3QDowMyBdis6uBaVAWnBEaG",
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
    role: "Founder & Managing Director",
    bio: "Directs corporate strategy, capital allocation, and multi-venture expansion across the ELITE GROUP ecosystem.",
    image: "https://lh3.googleusercontent.com/d/17EAsoYWww3QDowMyBdis6uBaVAWnBEaG",
    badges: ["Founder", "Corporate Strategy"],
    initials: "JH",
    email: "",
    linkedin: "",
    twitter: "",
    order: 1,
  },
  {
    id: "tarif",
    name: "MD Tarif Hossain",
    role: "Co-Founder & Operations Lead",
    bio: "Leads operational execution, supply discipline, and systems governance across every business unit.",
    image: "https://lh3.googleusercontent.com/d/11wUM19yxC7UrVODSItly9XdoMhRKR46u",
    badges: ["Co-Founder", "Operations"],
    initials: "TH",
    email: "",
    linkedin: "",
    twitter: "",
    order: 2,
  },
  {
    id: "asif",
    name: "MD ASIF HOSSAIN",
    role: "Technology Director",
    bio: "Architects the digital infrastructure, automation pipelines, and technical foundations powering global scale.",
    image: "https://lh3.googleusercontent.com/d/1Ja11gJERdSAHC9SbTSZKe_5MMPoqvKKg",
    badges: ["Technology", "Architecture"],
    initials: "AH",
    email: "",
    linkedin: "",
    twitter: "",
    order: 3,
  },
];

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

export const DEFAULT_GALLERY = [
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
    id: "gal3",
    url: "https://lh3.googleusercontent.com/d/17EAsoYWww3QDowMyBdis6uBaVAWnBEaG",
    title: "MD Joy Hossen — Managing Director",
    category: "Leadership",
    uploadedAt: "2026-02-14T10:00:00.000Z",
  },
  {
    id: "gal4",
    url: "https://lh3.googleusercontent.com/d/11wUM19yxC7UrVODSItly9XdoMhRKR46u",
    title: "MD Tarif Hossain — Operations Lead",
    category: "Leadership",
    uploadedAt: "2026-02-15T10:00:00.000Z",
  },
  {
    id: "gal5",
    url: "https://lh3.googleusercontent.com/d/1Ja11gJERdSAHC9SbTSZKe_5MMPoqvKKg",
    title: "MD ASIF HOSSAIN — Technology Director",
    category: "Leadership",
    uploadedAt: "2026-02-16T10:00:00.000Z",
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
