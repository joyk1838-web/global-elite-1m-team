import { motion, useScroll, useSpring } from "framer-motion";
import { Milestone, Flag, Rocket, Shield, Crown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getTimeline } from "../services/firebase";
import { DEFAULT_TIMELINE } from "../lib/defaults";
import { SpotlightCard } from "../components/motion/SpotlightCard";
import { EASE_OUT_EXPO, TextMaskReveal } from "../components/motion/MotionPrimitives";

const iconMap: Record<string, any> = {
  Rocket,
  Shield,
  Milestone,
  Flag,
  Crown,
};

export default function Timeline() {
  const [events, setEvents] = useState<any[]>(DEFAULT_TIMELINE);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 80%"],
  });
  const spineScaleY = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    getTimeline().then((data) => {
      if (data && data.length > 0) setEvents(data);
    });
  }, []);

  return (
    <div className="space-y-16 pb-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          className="text-xs font-semibold uppercase tracking-[0.24em] text-primary"
        >
          Strategic Chronology
        </motion.p>
        <h1 className="font-heading text-4xl md:text-6xl font-semibold tracking-tight gold-gradient">
          <TextMaskReveal immediate delay={0.05}>
            Corporate Roadmap
          </TextMaskReveal>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.14, ease: EASE_OUT_EXPO }}
          className="text-base md:text-lg text-zinc-400 leading-relaxed"
        >
          Mapping our foundational execution and multi-year trajectory toward global market leadership.
        </motion.p>
      </div>

      <div ref={timelineRef} className="relative max-w-4xl mx-auto">
        {/* Static Track */}
        <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-white/10" />
        {/* Scroll-Driven Luminous Gold Spine */}
        <motion.div
          style={{ scaleY: spineScaleY }}
          className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-primary to-primary/20 origin-top pointer-events-none"
        />

        <div className="space-y-10">
          {events.map((event, i) => {
            const Icon = iconMap[event.icon] || Milestone;
            const isActive = event.status === "current";
            const isCompleted = event.status === "completed";
            const isEven = i % 2 === 0;

            return (
              <div
                key={event.id || i}
                className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 ${
                  isEven ? "md:flex-row-reverse" : ""
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 24, x: isEven ? 24 : -24 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.65, delay: 0.05, ease: EASE_OUT_EXPO }}
                  className="pl-16 md:pl-0 w-full md:w-[45%]"
                >
                  <SpotlightCard active={isActive} className="p-7 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-semibold text-primary tabular-nums">{event.year}</span>
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
                  </SpotlightCard>
                </motion.div>

                {/* Kinetic Timeline Node */}
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ type: "spring", stiffness: 320, damping: 20, delay: 0.08 }}
                  className="absolute left-6 md:static md:w-[10%] -translate-x-1/2 md:translate-x-0 flex justify-center z-10 top-7"
                >
                  <div className="relative flex items-center justify-center">
                    {isActive && (
                      <motion.span
                        animate={{ scale: [1, 1.85, 1], opacity: [0.55, 0, 0.55] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-6 h-6 rounded-full bg-primary/35 pointer-events-none"
                        aria-hidden="true"
                      />
                    )}
                    <div
                      className={`w-4 h-4 rounded-full border-2 bg-[#09090b] relative z-10 ${
                        isActive || isCompleted ? "border-primary bg-primary/30" : "border-zinc-700"
                      }`}
                    />
                  </div>
                </motion.div>

                <div className="hidden md:block md:w-[45%]" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
