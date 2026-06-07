import { motion } from "framer-motion";
import { SlideShell } from "./SlideShell";
import { Cpu, Code2, Palette, Server } from "lucide-react";

const teamCardZoom = {
  hidden: { opacity: 0, scale: 0.1, rotateY: -20, rotateX: 10, z: -500 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    rotateY: 0,
    rotateX: 0,
    z: 0,
    transition: { duration: 0.9, delay: 0.4 + i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
};

const TEAM = [
  {
    initials: "AD",
    name: "Adrien",
    role: "AI Engineer & Founder",
    focus: "AI/ML pipeline, Gemini integration, system architecture",
    Icon: Cpu,
    bg: "#ecfdf5",
    accent: "#059669",
  },
  {
    initials: "DV",
    name: "Developer 1",
    role: "Full-Stack Engineer",
    focus: "FastAPI backend, MongoDB, API design, auth",
    Icon: Server,
    bg: "#d1fae5",
    accent: "#047857",
  },
  {
    initials: "DV",
    name: "Developer 2",
    role: "Frontend Engineer",
    focus: "React, TanStack Router, responsive UI, PWA",
    Icon: Code2,
    bg: "#fef7e0",
    accent: "#d97706",
  },
  {
    initials: "DV",
    name: "Developer 3",
    role: "Product Engineer",
    focus: "Voice integration, Aethex SDK, Paystack flows",
    Icon: Palette,
    bg: "#f3e8fd",
    accent: "#9334e6",
  },
];

export function SlideRoadmap() {
  return (
    <SlideShell slideNumber={10} id="roadmap">
      <div className="flex flex-col items-center justify-center flex-1" style={{ perspective: 1200 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="pitch-label mb-4"
        >
          The Team
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 40, rotateX: -10 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="pitch-display text-3xl sm:text-5xl md:text-6xl max-w-3xl text-center mb-4"
        >
          Built to <span className="pitch-accent">ship fast</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="pitch-body text-base text-center max-w-xl mb-12"
        >
          End-to-end — backend, frontend, AI pipeline, and design — delivered in 72 hours.
        </motion.p>

        {/* 3D zoom-from-nothing team cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl" style={{ transformStyle: "preserve-3d" }}>
          {TEAM.map((t, i) => (
            <motion.div
              key={t.name + t.role}
              custom={i}
              variants={teamCardZoom}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              className="pitch-float-card pitch-tilt p-6 text-center"
              style={{ transformStyle: "preserve-3d" }}
              whileHover={{
                scale: 1.06,
                rotateY: 8,
                rotateX: -3,
                boxShadow: "0 16px 48px rgba(5, 150, 105, 0.15)",
                transition: { duration: 0.35 },
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4"
                style={{ background: t.bg, color: t.accent }}
              >
                {t.initials}
              </div>
              <h3 className="text-base font-bold text-[#1a1a1a] mb-0.5">{t.name}</h3>
              <p className="text-sm font-medium pitch-accent mb-3">{t.role}</p>
              <div
                className="pitch-icon mx-auto mb-2"
                style={{ background: t.bg, color: t.accent }}
              >
                <t.Icon className="w-4 h-4" />
              </div>
              <p className="text-xs text-[#5f6368]">{t.focus}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}
