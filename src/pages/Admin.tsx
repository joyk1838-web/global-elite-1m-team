import { motion } from "framer-motion";
import {
  Lock,
  Crown,
  LogOut,
  ShieldCheck,
  Edit,
  Plus,
  Trash2,
  Save,
  Database,
  CheckCircle2,
  Circle,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "../context/AuthContext";
import { useSiteConfig } from "../context/SiteContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  updateSiteConfig,
  getBrands,
  deleteBrand,
  getTeam,
  saveTeamMember,
  deleteTeamMember,
  getTimeline,
  deleteTimelineEvent,
  getMilestones,
  saveMilestone,
  deleteMilestone,
  getGrowthData,
  saveGrowthPoint,
  deleteGrowthPoint,
  getGallery,
  saveGalleryItem,
  deleteGalleryItem,
} from "../services/firebase";
import {
  DEFAULT_BRANDS,
  DEFAULT_GALLERY,
  DEFAULT_GROWTH,
  DEFAULT_MILESTONES,
  DEFAULT_SITE_CONFIG,
  DEFAULT_TEAM,
  DEFAULT_TIMELINE,
  SiteConfigData,
} from "../lib/defaults";
import { compressImageToDataUrl } from "../lib/imageUpload";
import { db } from "../lib/firebase";
import { collection, setDoc, doc } from "firebase/firestore";

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  onErrorMsg: (msg: string) => void;
  aspectClass?: string;
}

function ImageField({ label, value, onChange, onErrorMsg, aspectClass = "w-20 h-20" }: ImageFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await compressImageToDataUrl(file, 900, 0.82);
      onChange(dataUrl);
    } catch (err: any) {
      onErrorMsg(err?.message || "Could not process image file.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-zinc-300">{label}</label>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 rounded-xl bg-black/40 border border-white/10">
        <div className={`${aspectClass} rounded-lg overflow-hidden bg-zinc-900 border border-white/10 shrink-0 flex items-center justify-center`}>
          {value ? (
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <ImageIcon className="w-6 h-6 text-zinc-600" />
          )}
        </div>
        <div className="flex-1 w-full space-y-2">
          <Input
            placeholder="Paste image URL (https://...) or upload a photo"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="bg-zinc-900 border-white/10 text-sm"
          />
          <div className="flex items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="border-primary/35 text-primary hover:bg-primary/10 text-xs"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              {uploading ? "Processing..." : "Upload Photo"}
            </Button>
            {value && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => onChange("")}
                className="text-xs text-zinc-400 hover:text-red-400"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const { user, login, logout, isAdmin, loading, error } = useAuth();
  const { config: liveConfig, refreshConfig } = useSiteConfig();

  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [growthPoints, setGrowthPoints] = useState<any[]>([]);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfigData>(DEFAULT_SITE_CONFIG);
  const [statusBanner, setStatusBanner] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [editingBrand, setEditingBrand] = useState<any>(null);
  const [editingTimeline, setEditingTimeline] = useState<any>(null);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [editingMilestone, setEditingMilestone] = useState<any>(null);
  const [editingGrowth, setEditingGrowth] = useState<any>(null);
  const [editingGallery, setEditingGallery] = useState<any>(null);

  const showStatus = (type: "success" | "error", message: string) => {
    setStatusBanner({ type, message });
    setTimeout(() => {
      setStatusBanner((prev) => (prev?.message === message ? null : prev));
    }, 5000);
  };

  const refreshAllData = async () => {
    const [bData, tData, tlData, mData, gData, galData] = await Promise.all([
      getBrands(),
      getTeam(),
      getTimeline(),
      getMilestones(),
      getGrowthData(),
      getGallery(),
    ]);
    setBrands(bData || []);
    setTeamMembers(tData || []);
    setTimeline(tlData || []);
    setMilestones(mData || []);
    setGrowthPoints(gData || []);
    setGalleryItems(galData || []);
    await refreshConfig();
  };

  useEffect(() => {
    setSiteConfig(liveConfig);
  }, [liveConfig]);

  useEffect(() => {
    if (isAdmin) {
      refreshAllData();
    }
  }, [isAdmin]);

  // Seed Default Corporate Content to Firestore
  const seedData = async () => {
    if (!isAdmin) return;
    setSaving(true);
    try {
      await updateSiteConfig({ ...DEFAULT_SITE_CONFIG });

      for (const b of DEFAULT_BRANDS) {
        await setDoc(doc(db, "brands", b.id), b);
      }
      for (const t of DEFAULT_TEAM) {
        await setDoc(doc(db, "team", t.id), t);
      }
      for (const ev of DEFAULT_TIMELINE) {
        await setDoc(doc(db, "timeline", ev.id), ev);
      }
      for (const ms of DEFAULT_MILESTONES) {
        await setDoc(doc(db, "milestones", ms.id), ms);
      }
      for (const g of DEFAULT_GROWTH) {
        await setDoc(doc(db, "growth", g.id), g);
      }
      for (const gal of DEFAULT_GALLERY) {
        await setDoc(doc(db, "gallery", gal.id), gal);
      }

      await refreshAllData();
      showStatus("success", "All default corporate content published to database.");
    } catch (e) {
      console.error(e);
      showStatus("error", "Could not populate database. Please check permissions.");
    } finally {
      setSaving(false);
    }
  };

  const saveGeneralConfig = async () => {
    setSaving(true);
    try {
      await updateSiteConfig({ ...siteConfig });
      await refreshConfig();
      showStatus("success", "Company identity, hero, MD profile, and metrics saved.");
    } catch (e) {
      console.error(e);
      showStatus("error", "Failed to save company settings.");
    } finally {
      setSaving(false);
    }
  };

  const saveMember = async (member: any) => {
    if (!member.name?.trim() || !member.role?.trim() || !member.image?.trim()) {
      showStatus("error", "Name, role, and profile picture are required.");
      return;
    }
    setSaving(true);
    try {
      const id = member.id || doc(collection(db, "team")).id;
      const badgesArray = Array.isArray(member.badges)
        ? member.badges
        : String(member.badgesText || "")
            .split(",")
            .map((b: string) => b.trim())
            .filter(Boolean);

      await saveTeamMember(id, {
        name: member.name.trim(),
        role: member.role.trim(),
        bio: member.bio || "",
        image: member.image.trim(),
        initials: member.initials || member.name.slice(0, 2).toUpperCase(),
        badges: badgesArray,
        email: member.email || "",
        linkedin: member.linkedin || "",
        twitter: member.twitter || "",
        order: Number(member.order) || 1,
      });
      showStatus("success", `Saved profile for ${member.name}.`);
      setEditingMember(null);
      setTeamMembers((await getTeam()) || []);
    } catch (e) {
      console.error(e);
      showStatus("error", "Failed to save team member.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    setSaving(true);
    try {
      await deleteTeamMember(id);
      showStatus("success", "Team member removed.");
      setTeamMembers((await getTeam()) || []);
    } catch (e) {
      console.error(e);
      showStatus("error", "Failed to remove team member.");
    } finally {
      setSaving(false);
    }
  };

  const saveBrand = async (brand: any) => {
    if (!brand.name?.trim() || !brand.image?.trim()) {
      showStatus("error", "Brand name and image are required.");
      return;
    }
    setSaving(true);
    try {
      const brandId = brand.id || doc(collection(db, "brands")).id;
      await setDoc(
        doc(db, "brands", brandId),
        {
          name: brand.name.trim(),
          tagline: brand.tagline || "",
          image: brand.image.trim(),
          link: brand.link || "/vision",
          desc: brand.desc || "",
          order: Number(brand.order) || 1,
        },
        { merge: true }
      );
      showStatus("success", "Venture updated successfully.");
      setEditingBrand(null);
      setBrands((await getBrands()) || []);
    } catch (e) {
      console.error(e);
      showStatus("error", "Failed to save venture.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBrand = async (id: string) => {
    setSaving(true);
    try {
      await deleteBrand(id);
      showStatus("success", "Venture removed.");
      setBrands((await getBrands()) || []);
    } catch (e) {
      console.error(e);
      showStatus("error", "Failed to delete venture.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMilestone = async (ms: any) => {
    if (!ms.title?.trim()) {
      showStatus("error", "Milestone title is required.");
      return;
    }
    setSaving(true);
    try {
      const id = ms.id || doc(collection(db, "milestones")).id;
      await saveMilestone(id, {
        title: ms.title.trim(),
        description: ms.description || "",
        date: ms.date || "",
        completed: Boolean(ms.completed),
        order: Number(ms.order) || 1,
      });
      showStatus("success", "Milestone saved.");
      setEditingMilestone(null);
      setMilestones((await getMilestones()) || []);
    } catch (e) {
      console.error(e);
      showStatus("error", "Failed to save milestone.");
    } finally {
      setSaving(false);
    }
  };

  const toggleMilestoneStatus = async (ms: any) => {
    setSaving(true);
    try {
      await saveMilestone(ms.id, {
        ...ms,
        completed: !ms.completed,
        order: Number(ms.order) || 1,
      });
      showStatus("success", `Updated "${ms.title}".`);
      setMilestones((await getMilestones()) || []);
    } catch (e) {
      console.error(e);
      showStatus("error", "Failed to update milestone.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    setSaving(true);
    try {
      await deleteMilestone(id);
      showStatus("success", "Milestone deleted.");
      setMilestones((await getMilestones()) || []);
    } catch (e) {
      console.error(e);
      showStatus("error", "Failed to delete milestone.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGrowth = async (pt: any) => {
    if (!pt.month?.trim()) {
      showStatus("error", "Month label is required.");
      return;
    }
    setSaving(true);
    try {
      const id = pt.id || doc(collection(db, "growth")).id;
      await saveGrowthPoint(id, {
        month: pt.month.trim(),
        amount: Number(pt.amount) || 0,
        order: Number(pt.order) || 1,
      });
      showStatus("success", "Revenue entry saved.");
      setEditingGrowth(null);
      setGrowthPoints((await getGrowthData()) || []);
    } catch (e) {
      console.error(e);
      showStatus("error", "Failed to save revenue entry.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGrowth = async (id: string) => {
    setSaving(true);
    try {
      await deleteGrowthPoint(id);
      showStatus("success", "Revenue entry removed.");
      setGrowthPoints((await getGrowthData()) || []);
    } catch (e) {
      console.error(e);
      showStatus("error", "Failed to delete revenue entry.");
    } finally {
      setSaving(false);
    }
  };

  const saveTimeline = async (ev: any) => {
    if (!ev.year?.trim() || !ev.title?.trim()) {
      showStatus("error", "Year and title are required.");
      return;
    }
    setSaving(true);
    try {
      const id = ev.id || doc(collection(db, "timeline")).id;
      await setDoc(
        doc(db, "timeline", id),
        {
          year: ev.year.trim(),
          title: ev.title.trim(),
          desc: ev.desc || "",
          icon: ev.icon || "Milestone",
          status: ev.status || "upcoming",
          order: Number(ev.order) || 1,
        },
        { merge: true }
      );
      showStatus("success", "Roadmap milestone updated.");
      setEditingTimeline(null);
      setTimeline((await getTimeline()) || []);
    } catch (e) {
      console.error(e);
      showStatus("error", "Failed to save roadmap milestone.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTimeline = async (id: string) => {
    setSaving(true);
    try {
      await deleteTimelineEvent(id);
      showStatus("success", "Roadmap item deleted.");
      setTimeline((await getTimeline()) || []);
    } catch (e) {
      console.error(e);
      showStatus("error", "Failed to delete roadmap item.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGallery = async (item: any) => {
    if (!item.title?.trim() || !item.url?.trim()) {
      showStatus("error", "Title and image are required.");
      return;
    }
    setSaving(true);
    try {
      const id = item.id || doc(collection(db, "gallery")).id;
      await saveGalleryItem(id, {
        title: item.title.trim(),
        category: item.category?.trim() || "Corporate",
        url: item.url.trim(),
        uploadedAt: item.uploadedAt || new Date().toISOString(),
      });
      showStatus("success", "Gallery item saved.");
      setEditingGallery(null);
      setGalleryItems((await getGallery()) || []);
    } catch (e) {
      console.error(e);
      showStatus("error", "Failed to save gallery item.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    setSaving(true);
    try {
      await deleteGalleryItem(id);
      showStatus("success", "Gallery photo deleted.");
      setGalleryItems((await getGallery()) || []);
    } catch (e) {
      console.error(e);
      showStatus("error", "Failed to delete gallery photo.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Crown className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[68vh] flex items-center justify-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full surface-card p-10 rounded-2xl text-center space-y-6"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto border border-primary/30">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="font-heading text-3xl font-semibold gold-gradient">Executive Portal</h1>
            <p className="text-zinc-400 text-sm">
              Sign in with your authorized administrator account to manage website content.
            </p>
          </div>
          <Button
            onClick={login}
            size="lg"
            className="w-full h-12 font-semibold gold-glow"
          >
            Sign in with Google
          </Button>
          {error && (
            <p className="text-red-400 text-xs font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              {error}
            </p>
          )}
        </motion.div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[68vh] flex items-center justify-center">
        <div className="text-center space-y-5 max-w-md surface-card p-10 rounded-2xl">
          <ShieldCheck className="w-14 h-14 text-red-400 mx-auto" />
          <h2 className="font-heading text-3xl font-semibold">Access Restricted</h2>
          <p className="text-sm text-zinc-400">
            Signed in as <span className="text-primary font-medium">{user.email}</span>.
            Administrator authorization is required to modify company content.
          </p>
          <Button variant="outline" onClick={logout} className="border-white/15">
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {statusBanner && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-sm font-medium ${
            statusBanner.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-red-500/10 border-red-500/30 text-red-300"
          }`}
        >
          <span>{statusBanner.message}</span>
          <button
            onClick={() => setStatusBanner(null)}
            className="text-xs font-semibold px-2 py-1 hover:opacity-75"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Content Management
          </p>
          <h1 className="font-heading text-3xl md:text-4xl font-semibold gold-gradient mt-1">
            Admin Control Center
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Signed in as {user.email}. Edit company identity, team profiles, photos, ventures, and metrics.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={seedData} disabled={saving} className="border-primary/35 text-primary hover:bg-primary/10 gap-2 text-xs">
            <Database className="w-4 h-4" />
            Load Default Content
          </Button>
          <Button variant="ghost" onClick={logout} className="text-zinc-400 hover:text-red-400 gap-2 text-xs">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-[#111114] border border-white/10 p-1 h-auto flex-wrap mb-8">
          <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-black px-5 py-2 rounded-md font-semibold text-xs">
            Company & Hero
          </TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:bg-primary data-[state=active]:text-black px-5 py-2 rounded-md font-semibold text-xs">
            Team Profiles
          </TabsTrigger>
          <TabsTrigger value="brands" className="data-[state=active]:bg-primary data-[state=active]:text-black px-5 py-2 rounded-md font-semibold text-xs">
            Ventures
          </TabsTrigger>
          <TabsTrigger value="progress" className="data-[state=active]:bg-primary data-[state=active]:text-black px-5 py-2 rounded-md font-semibold text-xs">
            Financials & Milestones
          </TabsTrigger>
          <TabsTrigger value="timeline" className="data-[state=active]:bg-primary data-[state=active]:text-black px-5 py-2 rounded-md font-semibold text-xs">
            Roadmap
          </TabsTrigger>
          <TabsTrigger value="gallery" className="data-[state=active]:bg-primary data-[state=active]:text-black px-5 py-2 rounded-md font-semibold text-xs">
            Gallery
          </TabsTrigger>
        </TabsList>

        {/* 1. Company & Hero Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card className="surface-card border-white/10">
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Company Identity & Hero Section</CardTitle>
              <CardDescription className="text-zinc-400">
                Updates the Navbar, Hero banner, Founder spotlight, and Footer across the entire site.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Company Name</label>
                  <Input
                    value={siteConfig.companyName}
                    onChange={(e) => setSiteConfig({ ...siteConfig, companyName: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Tagline</label>
                  <Input
                    value={siteConfig.tagline}
                    onChange={(e) => setSiteConfig({ ...siteConfig, tagline: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Hero Eyebrow Label</label>
                  <Input
                    value={siteConfig.heroEyebrow}
                    onChange={(e) => setSiteConfig({ ...siteConfig, heroEyebrow: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Hero Headline</label>
                  <Input
                    value={siteConfig.heroTitle}
                    onChange={(e) => setSiteConfig({ ...siteConfig, heroTitle: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Hero Subtitle</label>
                <Textarea
                  value={siteConfig.heroSubtitle}
                  onChange={(e) => setSiteConfig({ ...siteConfig, heroSubtitle: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Mission Statement</label>
                  <Textarea
                    value={siteConfig.mission}
                    onChange={(e) => setSiteConfig({ ...siteConfig, mission: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Vision Statement</label>
                  <Textarea
                    value={siteConfig.vision}
                    onChange={(e) => setSiteConfig({ ...siteConfig, vision: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-4">
                <h4 className="font-semibold text-sm text-primary">Managing Director Spotlight</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">MD Name</label>
                    <Input
                      value={siteConfig.mdName}
                      onChange={(e) => setSiteConfig({ ...siteConfig, mdName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">MD Title</label>
                    <Input
                      value={siteConfig.mdRole}
                      onChange={(e) => setSiteConfig({ ...siteConfig, mdRole: e.target.value })}
                    />
                  </div>
                </div>
                <ImageField
                  label="MD Portrait Picture"
                  value={siteConfig.mdImage}
                  onChange={(val) => setSiteConfig({ ...siteConfig, mdImage: val })}
                  onErrorMsg={(msg) => showStatus("error", msg)}
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">Portrait Caption Quote</label>
                    <Input
                      value={siteConfig.mdQuote}
                      onChange={(e) => setSiteConfig({ ...siteConfig, mdQuote: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">Executive Statement Quote</label>
                    <Input
                      value={siteConfig.mdBannerQuote}
                      onChange={(e) => setSiteConfig({ ...siteConfig, mdBannerQuote: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-4">
                <h4 className="font-semibold text-sm text-primary">Dashboard Metrics & Contact</h4>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">Total Revenue ($)</label>
                    <Input
                      value={siteConfig.totalRevenue}
                      onChange={(e) => setSiteConfig({ ...siteConfig, totalRevenue: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">Net Worth ($)</label>
                    <Input
                      value={siteConfig.netWorth}
                      onChange={(e) => setSiteConfig({ ...siteConfig, netWorth: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">Valuation Target ($)</label>
                    <Input
                      value={siteConfig.valuationTarget}
                      onChange={(e) => setSiteConfig({ ...siteConfig, valuationTarget: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">Growth Multiplier</label>
                    <Input
                      value={siteConfig.multiplier}
                      onChange={(e) => setSiteConfig({ ...siteConfig, multiplier: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">Mission Phase</label>
                    <Input
                      value={siteConfig.status}
                      onChange={(e) => setSiteConfig({ ...siteConfig, status: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">Planned Units</label>
                    <Input
                      value={siteConfig.activeUnits}
                      onChange={(e) => setSiteConfig({ ...siteConfig, activeUnits: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">Contact Email</label>
                    <Input
                      value={siteConfig.contactEmail}
                      onChange={(e) => setSiteConfig({ ...siteConfig, contactEmail: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">Company LinkedIn URL</label>
                    <Input
                      placeholder="https://linkedin.com/company/..."
                      value={siteConfig.linkedinUrl}
                      onChange={(e) => setSiteConfig({ ...siteConfig, linkedinUrl: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">X / Twitter URL</label>
                    <Input
                      placeholder="https://x.com/..."
                      value={siteConfig.twitterUrl}
                      onChange={(e) => setSiteConfig({ ...siteConfig, twitterUrl: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">Instagram URL</label>
                    <Input
                      placeholder="https://instagram.com/..."
                      value={siteConfig.instagramUrl}
                      onChange={(e) => setSiteConfig({ ...siteConfig, instagramUrl: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <Button className="gold-glow w-full h-11 font-semibold" onClick={saveGeneralConfig} disabled={saving}>
                <Save className="w-4 h-4 mr-2" /> Save Company Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. Team Profiles Tab */}
        <TabsContent value="team" className="space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h3 className="font-heading text-2xl font-semibold">Team Member Profiles & Pictures</h3>
              <p className="text-sm text-zinc-400">Add, edit, upload portraits, or reorder leadership profiles.</p>
            </div>
            <Button
              size="sm"
              className="gold-glow"
              onClick={() =>
                setEditingMember({
                  name: "",
                  role: "",
                  bio: "",
                  image: "",
                  initials: "",
                  badgesText: "Leadership",
                  email: "",
                  linkedin: "",
                  twitter: "",
                  order: teamMembers.length + 1,
                })
              }
            >
              <Plus className="w-4 h-4 mr-2" /> Add Team Member
            </Button>
          </div>

          {editingMember && (
            <Card className="surface-card border-primary/35">
              <CardHeader>
                <CardTitle className="font-heading text-xl">
                  {editingMember.id ? `Edit ${editingMember.name}` : "New Team Member"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageField
                  label="Profile Picture"
                  value={editingMember.image || ""}
                  onChange={(val) => setEditingMember({ ...editingMember, image: val })}
                  onErrorMsg={(msg) => showStatus("error", msg)}
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">Full Name</label>
                    <Input
                      placeholder="Full Name"
                      value={editingMember.name}
                      onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">Role / Title</label>
                    <Input
                      placeholder="e.g. Managing Director"
                      value={editingMember.role}
                      onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">Focus Areas (comma-separated)</label>
                    <Input
                      placeholder="Strategy, Operations"
                      value={
                        editingMember.badgesText !== undefined
                          ? editingMember.badgesText
                          : (editingMember.badges || []).join(", ")
                      }
                      onChange={(e) =>
                        setEditingMember({ ...editingMember, badgesText: e.target.value, badges: undefined })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">Display Order</label>
                    <Input
                      type="number"
                      value={editingMember.order}
                      onChange={(e) => setEditingMember({ ...editingMember, order: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">Email (optional)</label>
                    <Input
                      placeholder="name@elitegroup.global"
                      value={editingMember.email || ""}
                      onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">LinkedIn URL (optional)</label>
                    <Input
                      placeholder="https://linkedin.com/in/..."
                      value={editingMember.linkedin || ""}
                      onChange={(e) => setEditingMember({ ...editingMember, linkedin: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Biography</label>
                  <Textarea
                    placeholder="Short executive bio..."
                    value={editingMember.bio || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  />
                </div>
                <div className="flex gap-3">
                  <Button className="gold-glow flex-1" onClick={() => saveMember(editingMember)} disabled={saving}>
                    Save Profile
                  </Button>
                  <Button variant="ghost" onClick={() => setEditingMember(null)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {teamMembers.length === 0 ? (
            <div className="p-10 rounded-2xl border border-dashed border-white/15 text-center space-y-4">
              <p className="text-sm text-zinc-400">No custom team profiles stored in the database yet.</p>
              <Button variant="outline" onClick={seedData} disabled={saving} className="border-primary/35 text-primary">
                Load Default Team Profiles to Edit
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {teamMembers.map((member) => (
                <Card key={member.id} className="surface-card border-white/10">
                  <CardContent className="p-5 flex items-center gap-5">
                    <img
                      src={member.image}
                      className="w-16 h-16 rounded-xl object-cover border border-white/15 shrink-0"
                      alt={member.name}
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-zinc-100 truncate">{member.name}</p>
                      <p className="text-xs text-primary truncate">{member.role}</p>
                      <p className="text-xs text-zinc-500 mt-1 truncate">{member.bio}</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-zinc-400 hover:text-primary"
                        onClick={() => setEditingMember(member)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-zinc-400 hover:text-red-400"
                        onClick={() => handleDeleteMember(member.id)}
                        disabled={saving}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* 3. Ventures / Brands Tab */}
        <TabsContent value="brands" className="space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h3 className="font-heading text-2xl font-semibold">Core Ventures</h3>
              <p className="text-sm text-zinc-400">Manage operating brands displayed on the homepage.</p>
            </div>
            <Button
              size="sm"
              className="gold-glow"
              onClick={() =>
                setEditingBrand({
                  name: "",
                  tagline: "",
                  image: "",
                  link: "/vision",
                  desc: "",
                  order: brands.length + 1,
                })
              }
            >
              <Plus className="w-4 h-4 mr-2" /> Add Venture
            </Button>
          </div>

          {editingBrand && (
            <Card className="surface-card border-primary/35">
              <CardHeader>
                <CardTitle className="font-heading text-xl">
                  {editingBrand.id ? "Edit Venture" : "New Venture"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageField
                  label="Venture Cover Image"
                  value={editingBrand.image || ""}
                  onChange={(val) => setEditingBrand({ ...editingBrand, image: val })}
                  onErrorMsg={(msg) => showStatus("error", msg)}
                  aspectClass="w-28 h-20"
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Brand Name"
                    value={editingBrand.name}
                    onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                  />
                  <Input
                    placeholder="Category / Tagline"
                    value={editingBrand.tagline}
                    onChange={(e) => setEditingBrand({ ...editingBrand, tagline: e.target.value })}
                  />
                  <Input
                    placeholder="Destination Route (e.g. /vision)"
                    value={editingBrand.link || ""}
                    onChange={(e) => setEditingBrand({ ...editingBrand, link: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Order"
                    value={editingBrand.order}
                    onChange={(e) => setEditingBrand({ ...editingBrand, order: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <Textarea
                  placeholder="Description"
                  value={editingBrand.desc}
                  onChange={(e) => setEditingBrand({ ...editingBrand, desc: e.target.value })}
                />
                <div className="flex gap-3">
                  <Button className="gold-glow flex-1" onClick={() => saveBrand(editingBrand)} disabled={saving}>
                    Save Venture
                  </Button>
                  <Button variant="ghost" onClick={() => setEditingBrand(null)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-3 gap-6">
            {brands.map((brand) => (
              <Card key={brand.id} className="surface-card border-white/10 overflow-hidden">
                <img
                  src={brand.image}
                  className="w-full h-36 object-cover"
                  alt={brand.name}
                  referrerPolicy="no-referrer"
                />
                <CardContent className="p-5 space-y-2">
                  <p className="text-xs text-primary font-medium">{brand.tagline}</p>
                  <p className="font-heading text-xl font-semibold">{brand.name}</p>
                  <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-zinc-400 hover:text-primary"
                      onClick={() => setEditingBrand(brand)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-zinc-400 hover:text-red-400"
                      onClick={() => handleDeleteBrand(brand.id)}
                      disabled={saving}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 4. Financials & Milestones Tab */}
        <TabsContent value="progress" className="space-y-10">
          {/* Revenue Growth Points */}
          <div className="space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h3 className="font-heading text-2xl font-semibold">Monthly Revenue Chart</h3>
                <p className="text-sm text-zinc-400">Edit monthly data points displayed on the Progress Dashboard.</p>
              </div>
              <Button
                size="sm"
                className="gold-glow"
                onClick={() =>
                  setEditingGrowth({ month: "", amount: 0, order: growthPoints.length + 1 })
                }
              >
                <Plus className="w-4 h-4 mr-2" /> Add Month
              </Button>
            </div>

            {editingGrowth && (
              <Card className="surface-card border-primary/35">
                <CardContent className="p-6 space-y-4">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Input
                      placeholder="Month (e.g. Aug)"
                      value={editingGrowth.month}
                      onChange={(e) => setEditingGrowth({ ...editingGrowth, month: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Revenue ($)"
                      value={editingGrowth.amount}
                      onChange={(e) => setEditingGrowth({ ...editingGrowth, amount: parseFloat(e.target.value) || 0 })}
                    />
                    <Input
                      type="number"
                      placeholder="Order"
                      value={editingGrowth.order}
                      onChange={(e) => setEditingGrowth({ ...editingGrowth, order: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button className="gold-glow flex-1" onClick={() => handleSaveGrowth(editingGrowth)} disabled={saving}>
                      Save Entry
                    </Button>
                    <Button variant="ghost" onClick={() => setEditingGrowth(null)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {growthPoints.map((pt) => (
                <Card key={pt.id} className="surface-card border-white/10">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-400">{pt.month}</p>
                      <p className="font-mono text-lg font-semibold text-primary tabular-nums">${pt.amount}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingGrowth(pt)}>
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400" onClick={() => handleDeleteGrowth(pt.id)} disabled={saving}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className="space-y-4 pt-6 border-t border-white/10">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h3 className="font-heading text-2xl font-semibold">Operational Milestones</h3>
                <p className="text-sm text-zinc-400">Click any milestone to toggle completion status.</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-primary/35 text-primary"
                onClick={() =>
                  setEditingMilestone({
                    title: "",
                    description: "",
                    date: "",
                    completed: false,
                    order: milestones.length + 1,
                  })
                }
              >
                <Plus className="w-4 h-4 mr-2" /> Add Milestone
              </Button>
            </div>

            {editingMilestone && (
              <Card className="surface-card border-primary/35">
                <CardContent className="p-6 space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <Input
                      placeholder="Milestone Title"
                      value={editingMilestone.title}
                      onChange={(e) => setEditingMilestone({ ...editingMilestone, title: e.target.value })}
                    />
                    <Input
                      placeholder="Date (e.g. Q4 2026)"
                      value={editingMilestone.date}
                      onChange={(e) => setEditingMilestone({ ...editingMilestone, date: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Order"
                      value={editingMilestone.order}
                      onChange={(e) => setEditingMilestone({ ...editingMilestone, order: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <Textarea
                    placeholder="Description"
                    value={editingMilestone.description}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, description: e.target.value })}
                  />
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingMilestone.completed)}
                      onChange={(e) => setEditingMilestone({ ...editingMilestone, completed: e.target.checked })}
                    />
                    <span>Completed</span>
                  </label>
                  <div className="flex gap-3">
                    <Button className="gold-glow flex-1" onClick={() => handleSaveMilestone(editingMilestone)} disabled={saving}>
                      Save Milestone
                    </Button>
                    <Button variant="ghost" onClick={() => setEditingMilestone(null)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {milestones.map((ms) => (
                <Card key={ms.id} className="surface-card border-white/10">
                  <CardContent className="p-5 flex items-center justify-between gap-4">
                    <button
                      onClick={() => toggleMilestoneStatus(ms)}
                      className="flex items-center gap-3.5 text-left flex-1 group"
                      disabled={saving}
                    >
                      {ms.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-zinc-500 group-hover:text-primary shrink-0" />
                      )}
                      <div>
                        <p className="font-semibold text-sm">{ms.title}</p>
                        <p className="text-xs text-zinc-400">{ms.description}</p>
                        {ms.date && <p className="text-[11px] font-mono text-primary mt-0.5">{ms.date}</p>}
                      </div>
                    </button>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setEditingMilestone(ms)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-red-400" onClick={() => handleDeleteMilestone(ms.id)} disabled={saving}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* 5. Roadmap Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h3 className="font-heading text-2xl font-semibold">Corporate Roadmap</h3>
              <p className="text-sm text-zinc-400">Manage multi-year phases displayed on the Timeline page.</p>
            </div>
            <Button
              size="sm"
              className="gold-glow"
              onClick={() =>
                setEditingTimeline({
                  year: "",
                  title: "",
                  desc: "",
                  status: "upcoming",
                  icon: "Milestone",
                  order: timeline.length + 1,
                })
              }
            >
              <Plus className="w-4 h-4 mr-2" /> Add Phase
            </Button>
          </div>

          {editingTimeline && (
            <Card className="surface-card border-primary/35">
              <CardHeader>
                <CardTitle className="font-heading text-xl">
                  {editingTimeline.id ? "Edit Phase" : "New Roadmap Phase"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Year (e.g. 2027)"
                    value={editingTimeline.year}
                    onChange={(e) => setEditingTimeline({ ...editingTimeline, year: e.target.value })}
                  />
                  <Input
                    placeholder="Phase Title"
                    value={editingTimeline.title}
                    onChange={(e) => setEditingTimeline({ ...editingTimeline, title: e.target.value })}
                  />
                  <Input
                    placeholder="Icon (Rocket, Shield, Milestone, Flag, Crown)"
                    value={editingTimeline.icon}
                    onChange={(e) => setEditingTimeline({ ...editingTimeline, icon: e.target.value })}
                  />
                  <select
                    className="flex h-10 w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
                    value={editingTimeline.status}
                    onChange={(e) => setEditingTimeline({ ...editingTimeline, status: e.target.value })}
                  >
                    <option value="completed">Completed</option>
                    <option value="current">Current</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>
                <Textarea
                  placeholder="Description"
                  value={editingTimeline.desc}
                  onChange={(e) => setEditingTimeline({ ...editingTimeline, desc: e.target.value })}
                />
                <div className="flex gap-3">
                  <Button className="gold-glow flex-1" onClick={() => saveTimeline(editingTimeline)} disabled={saving}>
                    Save Phase
                  </Button>
                  <Button variant="ghost" onClick={() => setEditingTimeline(null)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-5">
            {timeline
              .slice()
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((ev) => (
                <Card key={ev.id} className="surface-card border-white/10">
                  <CardContent className="p-5 flex justify-between items-center gap-4">
                    <div>
                      <span className="font-mono text-xs font-semibold text-primary">{ev.year}</span>
                      <h4 className="font-semibold text-base mt-0.5">{ev.title}</h4>
                      <p className="text-xs text-zinc-400 capitalize mt-0.5">{ev.status}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <Button size="icon" variant="ghost" onClick={() => setEditingTimeline(ev)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-400"
                        onClick={() => handleDeleteTimeline(ev.id)}
                        disabled={saving}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* 6. Gallery Tab */}
        <TabsContent value="gallery" className="space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h3 className="font-heading text-2xl font-semibold">Corporate Gallery</h3>
              <p className="text-sm text-zinc-400">Upload or update photos displayed in the visual archive.</p>
            </div>
            <Button
              size="sm"
              className="gold-glow"
              onClick={() =>
                setEditingGallery({
                  title: "",
                  category: "Leadership",
                  url: "",
                })
              }
            >
              <Plus className="w-4 h-4 mr-2" /> Add Photo
            </Button>
          </div>

          {editingGallery && (
            <Card className="surface-card border-primary/35">
              <CardHeader>
                <CardTitle className="font-heading text-xl">
                  {editingGallery.id ? "Edit Gallery Photo" : "Add Gallery Photo"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageField
                  label="Gallery Photo"
                  value={editingGallery.url || ""}
                  onChange={(val) => setEditingGallery({ ...editingGallery, url: val })}
                  onErrorMsg={(msg) => showStatus("error", msg)}
                  aspectClass="w-28 h-20"
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Photo Title"
                    value={editingGallery.title}
                    onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                  />
                  <Input
                    placeholder="Category (e.g. Leadership, Ventures, Headquarters)"
                    value={editingGallery.category}
                    onChange={(e) => setEditingGallery({ ...editingGallery, category: e.target.value })}
                  />
                </div>
                <div className="flex gap-3">
                  <Button className="gold-glow flex-1" onClick={() => handleSaveGallery(editingGallery)} disabled={saving}>
                    Save Photo
                  </Button>
                  <Button variant="ghost" onClick={() => setEditingGallery(null)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <Card key={item.id} className="surface-card border-white/10 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                  referrerPolicy="no-referrer"
                />
                <CardContent className="p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-primary font-medium">{item.category}</p>
                    <p className="font-semibold text-sm truncate">{item.title}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingGallery(item)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-red-400"
                      onClick={() => handleDeleteGallery(item.id)}
                      disabled={saving}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
