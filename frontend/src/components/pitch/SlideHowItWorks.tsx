import { motion } from "framer-motion";
import { SlideShell } from "./SlideShell";
import { Mic, Brain, UserCheck, ArrowRight } from "lucide-react";

const cardZoom3D = {
  hidden: { opacity: 0, scale: 0.2, rotateY: -25, z: -300 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    rotateY: 0,
    z: 0,
    transition: { duration: 0.8, delay: 0.3 + i * 0.2, ease: [0.22, 1, 0.36, 1] },
  }),
};

const STEPS = [
  {
    Icon: Mic,
    title: "Speak",
    desc: "Customer taps mic, describes the job in natural language",
    tech: "Aethex Voice",
    color: "pitch-icon--violet",
  },
  {
    Icon: Brain,
    title: "Extract",
    desc: "AI structures intent into category, location, and budget",
    tech: "Gemini Flash",
    color: "pitch-icon--green",
  },
  {
    Icon: UserCheck,
    title: "Match",
    desc: "Ranked hustlers receive AI voice calls, first to accept wins",
    tech: "Queue + Timeout",
    color: "pitch-icon--dark-green",
  },
];

export function SlideHowItWorks() {
  return (
    <SlideShell slideNumber={4} id="how-it-works">
      <div className="flex flex-col justify-center flex-1" style={{ perspective: 1200 }}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="pitch-label mb-4"
        >
          How It Works
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="pitch-display text-3xl sm:text-5xl md:text-6xl max-w-3xl mb-14"
        >
          Voice to verified job
          <br />in <span className="pitch-accent">under 60 seconds</span>
        </motion.h2>

        {/* 3D perspective flow cards */}
        <div className="flex flex-col md:flex-row items-stretch gap-4" style={{ transformStyle: "preserve-3d" }}>
          {STEPS.map((s, i) => (
            <div key={s.title} className="flex items-center gap-4 flex-1">
              <motion.div
                custom={i}
                variants={cardZoom3D}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.4 }}
                className="pitch-float-card pitch-tilt p-6 flex-1"
                style={{ transformStyle: "preserve-3d" }}
                whileHover={{
                  scale: 1.04,
                  rotateY: 3,
                  boxShadow: "0 12px 40px rgba(5, 150, 105, 0.12)",
                  transition: { duration: 0.3 },
                }}
              >
                <div className={`pitch-icon ${s.color} mb-4`}>
                  <s.Icon className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-[#9aa0a6] uppercase tracking-wider mb-1">
                  Step {i + 1}
                </div>
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">{s.title}</h3>
                <p className="text-sm text-[#5f6368] mb-3">{s.desc}</p>
                <span className="inline-block text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#ecfdf5] text-[#059669]">
                  {s.tech}
                </span>
              </motion.div>
              {i < STEPS.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.4 }}
                  transition={{ duration: 0.4, delay: 0.6 + i * 0.2 }}
                  className="hidden md:block flex-shrink-0"
                >
                  <ArrowRight className="w-5 h-5 text-[#a7f3d0]" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}
