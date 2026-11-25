import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Linkedin, Twitter, Mail } from "lucide-react";
import { sanitizeHref, sanitizeImageSrc } from "@/lib/utils";
import { usePageSeo } from "../hooks/usePageSeo";
import { getTeam } from "../services/firebase";
import {
  DEFAULT_TEAM,
  isFounderMember,
  normalizeTeamMembers,
} from "../lib/defaults";
import { SpotlightCard } from "../components/motion/SpotlightCard";
import { EASE_OUT_EXPO, TextMaskReveal } from "../components/motion/MotionPrimitives";

export default function Team() {
  usePageSeo({
    title: "Founder & Team",
    description:
      "Meet the Founder and core Team Members of GLOBAL ELITE 1M TEAM (ELITE TEAM 07).",
    path: "/team",
  });

  const [teamMembers, setTeamMembers] = useState<any[]>(
    normalizeTeamMembers(DEFAULT_TEAM)
  );

  useEffect(() => {
    getTeam().then((data) => {
      if (data && data.length > 0) {
        setTeamMembers(normalizeTeamMembers(data));
      }
    });
  }, []);

  const founder = teamMembers.find((m) => isFounderMember(m));
  const members = teamMembers.filter((m) => !isFounderMember(m));
  const founderImg = sanitizeImageSrc(founder?.image);
  const founderLinkedIn = sanitizeHref(founder?.linkedin);
  const founderTwitter = sanitizeHref(founder?.twitter);
  const founderMail = sanitizeHref(founder?.email ? `mailto:${founder.email}` : "");

  return (
    <div className="space-y-14 pb-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          className="text-xs font-semibold uppercase tracking-[0.24em] text-primary"
        >
          GLOBAL ELITE 1M TEAM · ELITE TEAM 07
        </motion.p>
        <h1 className="font-heading text-4xl md:text-6xl font-semibold tracking-tight gold-gradient">
          <TextMaskReveal immediate delay={0.05}>
            Founder & Team
          </TextMaskReveal>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.14, ease: EASE_OUT_EXPO }}
          className="text-base md:text-lg text-zinc-400 leading-relaxed"
        >
          Led by our Founder alongside a unified team of builders executing together across GLOBAL ELITE 1M TEAM.
        </motion.p>
      </div>

      {founder && (
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
        >
          <SpotlightCard active className="p-8 sm:p-10 bg-[#0b0b10]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-start sm:items-center gap-6">
                {founderImg ? (
                  <img
                    src={founderImg}
                    alt={founder.name}
                    loading="lazy"
                    decoding="async"
                    className="w-16 h-16 rounded-2xl border border-primary/40 object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl border border-primary/40 bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="font-heading text-xl font-semibold text-primary tracking-tight">
                      {founder.initials}
                    </span>
                  </div>
                )}
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Founder
                  </p>
                  <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-zinc-50">
                    {founder.name}
                  </h2>
                </div>
              </div>

              <div className="flex-1 max-w-xl space-y-4">
                {founder.bio && (
                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                    {founder.bio}
                  </p>
                )}

                {(founderLinkedIn || founderTwitter || founderMail) && (
                  <div className="flex items-center gap-3 pt-2">
                    {founderLinkedIn && (
                      <a
                        href={founderLinkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${founder.name} LinkedIn`}
                        className="w-11 h-11 rounded-lg border border-white/10 text-zinc-400 hover:text-primary hover:border-primary/40 transition-colors flex items-center justify-center"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {founderTwitter && (
                      <a
                        href={founderTwitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${founder.name} Twitter`}
                        className="w-11 h-11 rounded-lg border border-white/10 text-zinc-400 hover:text-primary hover:border-primary/40 transition-colors flex items-center justify-center"
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                    {founderMail && (
                      <a
                        href={founderMail}
                        aria-label={`Email ${founder.name}`}
                        className="w-11 h-11 rounded-lg border border-white/10 text-zinc-400 hover:text-primary hover:border-primary/40 transition-colors flex items-center justify-center"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </SpotlightCard>
        </motion.article>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {members.map((member, i) => {
          const memberImg = sanitizeImageSrc(member?.image);
          const linkedInHref = sanitizeHref(member?.linkedin);
          const twitterHref = sanitizeHref(member?.twitter);
          const mailHref = sanitizeHref(member?.email ? `mailto:${member.email}` : "");

          return (
            <motion.article
              key={member.id || i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: EASE_OUT_EXPO }}
              className="h-full"
            >
              <SpotlightCard className="p-7 sm:p-8 h-full flex flex-col justify-between gap-6 bg-[#0a0a0e]">
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    {memberImg ? (
                      <img
                        src={memberImg}
                        alt={member.name}
                        loading="lazy"
                        decoding="async"
                        className="w-12 h-12 rounded-xl border border-white/10 object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center shrink-0">
                        <span className="font-heading text-base font-semibold text-zinc-200">
                          {member.initials}
                        </span>
                      </div>
                    )}
                    <span className="font-mono text-xs text-zinc-600 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium text-zinc-500">
                      Team Member
                    </p>
                    <h2 className="font-heading text-2xl font-semibold text-zinc-50">
                      {member.name}
                    </h2>
                  </div>

                  {member.bio && (
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {member.bio}
                    </p>
                  )}
                </div>

                {(linkedInHref || twitterHref || mailHref) && (
                  <div className="flex items-center gap-3 pt-4 border-t border-white/[0.07]">
                    {linkedInHref && (
                      <a
                        href={linkedInHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} LinkedIn`}
                        className="w-11 h-11 rounded-lg border border-white/10 text-zinc-400 hover:text-primary hover:border-primary/40 transition-colors flex items-center justify-center"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {twitterHref && (
                      <a
                        href={twitterHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} Twitter`}
                        className="w-11 h-11 rounded-lg border border-white/10 text-zinc-400 hover:text-primary hover:border-primary/40 transition-colors flex items-center justify-center"
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                    {mailHref && (
                      <a
                        href={mailHref}
                        aria-label={`Email ${member.name}`}
                        className="w-11 h-11 rounded-lg border border-white/10 text-zinc-400 hover:text-primary hover:border-primary/40 transition-colors flex items-center justify-center"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
              </SpotlightCard>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
