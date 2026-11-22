import { motion } from "framer-motion";
import { Milestone, Flag, Rocket, Shield, Crown } from "lucide-react";
import { useState, useEffect } from "react";
import { getTimeline } from "../services/firebase";
import { DEFAULT_TIMELINE } from "../lib/defaults";

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const iconMap: Record<string, any> = {
  Rocket,
  Shield,
  Milestone,
  Flag,
  Crown,
};

export default function Timeline() {
  const [events, setEvents] = useState<any[]>(DEFAULT_TIMELINE);

  useEffect(() => {
    getTimeline().then((data) => {
      if (data && data.length > 0) setEvents(data);
    });
  }, []);

  return (
    <div className="space-y-16 pb-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
          Strategic Chronology
        </p>
        <h1 className="font-heading text-4xl md:text-6xl font-semibold tracking-tight gold-gradient">
          Corporate Roadmap
        </h1>
        <p className="text-base md:text-lg text-zinc-400 leading-relaxed">
          Mapping our foundational execution and multi-year trajectory toward global market leadership.
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-white/10" />

        <div className="space-y-10">
          {events.map((event, i) => {
            const Icon = iconMap[event.icon] || Milestone;
            const isActive = event.status === "current";
            const isCompleted = event.status === "completed";

            return (
              <div
                key={event.id || i}
                className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 ${
                  i % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: EASE_OUT_EXPO }}
                  className="pl-16 md:pl-0 w-full md:w-[45%]"
                >
                  <div
                    className={`p-7 rounded-2xl surface-card space-y-3 ${
                      isActive ? "border-primary/50" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-semibold text-primary">{event.year}</span>
                      <span className="capitalize text-zinc-400 font-medium">
                        {isActive ? "Current Phase" : event.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${isActive || isCompleted ? "text-primary" : "text-zinc-500"}`} />
                      <h3 className="font-heading text-2xl font-semibold text-zinc-100">
                        {event.title}
                      </h3>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {event.desc}
                    </p>
                  </div>
                </motion.div>

                {/* Timeline Node */}
                <div className="absolute left-6 md:static md:w-[10%] -translate-x-1/2 md:translate-x-0 flex justify-center z-10 top-7">
                  <div
                    className={`w-4 h-4 rounded-full border-2 bg-[#09090b] ${
                      isActive || isCompleted ? "border-primary bg-primary/30" : "border-zinc-700"
                    }`}
                  />
                </div>

                <div className="hidden md:block md:w-[45%]" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
