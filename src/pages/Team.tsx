import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Linkedin, Twitter, Mail } from "lucide-react";
import { getTeam } from "../services/firebase";
import { DEFAULT_TEAM, LOCAL_ASSETS } from "../lib/defaults";

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Team() {
  const [teamMembers, setTeamMembers] = useState<any[]>(DEFAULT_TEAM);

  useEffect(() => {
    getTeam().then((data) => {
      if (data && data.length > 0) setTeamMembers(data);
    });
  }, []);

  return (
    <div className="space-y-16 pb-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
          Executive Leadership
        </p>
        <h1 className="font-heading text-4xl md:text-6xl font-semibold tracking-tight gold-gradient">
          Leadership & Governance
        </h1>
        <p className="text-base md:text-lg text-zinc-400 leading-relaxed">
          The executive team directing corporate strategy, operational precision, and global expansion.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member, i) => (
          <motion.article
            key={member.id || i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, delay: i * 0.08, ease: EASE_OUT_EXPO }}
            className="group rounded-2xl surface-card overflow-hidden flex flex-col"
          >
            <div className="aspect-[4/4] relative overflow-hidden bg-zinc-900">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = LOCAL_ASSETS.strategyRoom;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-6 right-6">
                <p className="text-xs font-medium text-primary tracking-wide">
                  {member.role}
                </p>
                <h2 className="font-heading text-2xl font-semibold text-white mt-0.5">
                  {member.name}
                </h2>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                {Array.isArray(member.badges) && member.badges.length > 0 && (
                  <p className="text-xs text-zinc-400 font-medium">
                    {member.badges.join(" · ")}
                  </p>
                )}
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {member.bio}
                </p>
              </div>

              {(member.linkedin || member.twitter || member.email) && (
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
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
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
