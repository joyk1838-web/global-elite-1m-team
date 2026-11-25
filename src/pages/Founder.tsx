import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Linkedin, Mail, Quote, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { sanitizeHref, sanitizeImageSrc } from "@/lib/utils";
import { usePageSeo } from "../hooks/usePageSeo";
import { useSiteConfig } from "../context/SiteContext";
import { getTeam } from "../services/firebase";
import {
  DEFAULT_TEAM,
  LOCAL_ASSETS,
  isFounderMember,
  normalizeTeamMembers,
} from "../lib/defaults";
import { SpotlightCard } from "../components/motion/SpotlightCard";
import { EASE_OUT_EXPO, TextMaskReveal } from "../components/motion/MotionPrimitives";

export default function Founder() {
  const { config } = useSiteConfig();
  const [founder, setFounder] = useState<any>(() =>
    normalizeTeamMembers(DEFAULT_TEAM).find((m) => isFounderMember(m))
  );

  useEffect(() => {
    getTeam().then((data) => {
      if (data && data.length > 0) {
        const normalized = normalizeTeamMembers(data);
        const found = normalized.find((m) => isFounderMember(m));
        if (found) setFounder(found);
      }
    });
  }, []);

  const founderName = founder?.name || config.mdName || "MD JOY HOSSEN";
  const founderPortrait = sanitizeImageSrc(
    founder?.image || config.mdImage,
    LOCAL_ASSETS.founderPortrait
  );
  const founderBio =
    founder?.bio ||
    "Founder of GLOBAL ELITE 1M TEAM (ELITE GROUP), directing long-term vision, capital discipline, and ecosystem growth.";
  const linkedInHref = sanitizeHref(founder?.linkedin || config.linkedinUrl);
  const twitterHref = sanitizeHref(founder?.twitter || config.twitterUrl);
  const emailHref = sanitizeHref(
    founder?.email
      ? `mailto:${founder.email}`
      : config.contactEmail
      ? `mailto:${config.contactEmail}`
      : ""
  );

  const sameAs = [linkedInHref, twitterHref].filter(Boolean);

  usePageSeo({
    title: `${founderName} — Founder | GLOBAL ELITE 1M TEAM`,
    description: `${founderName} is the Founder of GLOBAL ELITE 1M TEAM (ELITE GROUP), leading disciplined capital growth, Series 01 trading education, and 2030 venture expansion.`,
    path: "/md-joy-hossen",
    image: founderPortrait,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      url: "https://global-elite-1m-team.vercel.app/md-joy-hossen",
      mainEntity: {
        "@type": "Person",
        "@id": "https://global-elite-1m-team.vercel.app/#founder",
        name: founderName,
        alternateName: ["MD Joy Hossen", "Joy Hossen"],
        jobTitle: "Founder",
        image: `https://global-elite-1m-team.vercel.app${
          founderPortrait.startsWith("/") ? founderPortrait : `/${founderPortrait}`
        }`,
        description: founderBio,
        worksFor: {
          "@type": "Organization",
          name: "GLOBAL ELITE 1M TEAM",
          alternateName: "ELITE GROUP",
          url: "https://global-elite-1m-team.vercel.app/",
        },
        ...(sameAs.length > 0 ? { sameAs } : {}),
      },
    },
  });

  return (
    <article className="space-y-14 pb-20">
      <header className="max-w-5xl mx-auto">
        <SpotlightCard active className="p-7 sm:p-11 bg-[#0b0b10]">
          <div className="grid md:grid-cols-12 gap-8 sm:gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
              className="md:col-span-5"
            >
              <div className="aspect-[4/4.5] rounded-2xl overflow-hidden border border-primary/40 bg-[#050507]">
                <img
                  src={founderPortrait}
                  alt={`${founderName} — Founder of GLOBAL ELITE 1M TEAM`}
                  decoding="async"
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>

            <div className="md:col-span-7 space-y-6">
              <div className="space-y-2.5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  Founder · GLOBAL ELITE 1M TEAM
                </p>
                <h1 className="font-heading text-4xl sm:text-5xl font-semibold tracking-tight gold-gradient">
                  <TextMaskReveal immediate delay={0.05}>
                    {founderName}
                  </TextMaskReveal>
                </h1>
                <p className="text-xs font-medium tracking-[0.18em] uppercase text-zinc-400">
                  ONE TEAM. ONE VISION. ONE GOAL.
                </p>
              </div>

              <p className="text-base text-zinc-300 leading-relaxed">{founderBio}</p>

              <blockquote className="rounded-xl border border-white/[0.08] bg-[#07070a] p-5 space-y-2">
                <Quote className="w-4 h-4 text-primary/75" aria-hidden="true" />
                <p className="text-sm sm:text-base text-zinc-200 leading-relaxed">
                  "{config.mdBannerQuote}"
                </p>
                <footer className="text-xs font-medium text-primary">
                  {founderName} · Founder
                </footer>
              </blockquote>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/team"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-primary text-zinc-950 hover:brightness-110 text-xs sm:text-sm font-semibold transition-all"
                >
                  View Leadership & Team
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-white/15 hover:border-primary/45 hover:text-primary text-xs sm:text-sm font-medium text-zinc-200 transition-colors"
                >
                  Progress Dashboard
                </Link>
                {linkedInHref && (
                  <a
                    href={linkedInHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${founderName} LinkedIn`}
                    className="w-11 h-11 rounded-full border border-white/15 text-zinc-300 hover:text-primary hover:border-primary/45 flex items-center justify-center transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {twitterHref && (
                  <a
                    href={twitterHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${founderName} X / Twitter`}
                    className="w-11 h-11 rounded-full border border-white/15 text-zinc-300 hover:text-primary hover:border-primary/45 flex items-center justify-center transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {emailHref && (
                  <a
                    href={emailHref}
                    aria-label={`Email ${founderName}`}
                    className="w-11 h-11 rounded-full border border-white/15 text-zinc-300 hover:text-primary hover:border-primary/45 flex items-center justify-center transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </SpotlightCard>
      </header>
    </article>
  );
}
