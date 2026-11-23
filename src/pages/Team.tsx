import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Linkedin, Twitter, Mail } from "lucide-react";
import { getTeam } from "../services/firebase";
import {
  DEFAULT_TEAM,
  isFounderMember,
  normalizeTeamMembers,
} from "../lib/defaults";
import { SpotlightCard } from "../components/motion/SpotlightCard";

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Team() {
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

  return (
    <div className="space-y-14 pb-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
          ELITE TEAM 07
        </p>
        <h1 className="font-heading text-4xl md:text-6xl font-semibold tracking-tight gold-gradient">
          Founder & Team
        </h1>
        <p className="text-base md:text-lg text-zinc-400 leading-relaxed">
          Led by our Founder alongside a unified team of builders executing together across ELITE GROUP.
        </p>
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
                <div className="w-16 h-16 rounded-2xl border border-primary/40 bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-heading text-xl font-semibold text-primary tracking-tight">
                    {founder.initials}
                  </span>
                </div>
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

                {(founder.linkedin || founder.twitter || founder.email) && (
                  <div className="flex items-center gap-3 pt-2">
                    {founder.linkedin && (
                      <a
                        href={founder.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${founder.name} LinkedIn`}
                        className="p-2 rounded-lg border border-white/10 text-zinc-400 hover:text-primary hover:border-primary/40 transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {founder.twitter && (
                      <a
                        href={founder.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${founder.name} Twitter`}
                        className="p-2 rounded-lg border border-white/10 text-zinc-400 hover:text-primary hover:border-primary/40 transition-colors"
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                    {founder.email && (
                      <a
                        href={`mailto:${founder.email}`}
                        aria-label={`Email ${founder.name}`}
                        className="p-2 rounded-lg border border-white/10 text-zinc-400 hover:text-primary hover:border-primary/40 transition-colors"
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
        {members.map((member, i) => (
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
                  <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center shrink-0">
                    <span className="font-heading text-base font-semibold text-zinc-200">
                      {member.initials}
                    </span>
                  </div>
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

              {(member.linkedin || member.twitter || member.email) && (
                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.07]">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} LinkedIn`}
                      className="p-2 rounded-lg border border-white/10 text-zinc-400 hover:text-primary hover:border-primary/40 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {member.twitter && (
                    <a
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} Twitter`}
                      className="p-2 rounded-lg border border-white/10 text-zinc-400 hover:text-primary hover:border-primary/40 transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      aria-label={`Email ${member.name}`}
                      className="p-2 rounded-lg border border-white/10 text-zinc-400 hover:text-primary hover:border-primary/40 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
            </SpotlightCard>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
