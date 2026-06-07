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
    initials: "OA",
    name: "Oke Adrien",
    role: "AI Engineer & Founder",
    focus: "AI matching pipeline, Gemini orchestration, system architecture",
    Icon: Cpu,
    bg: "#ecfdf5",
    accent: "#059669",
  },
  {
    initials: "ME",
    name: "Makanjuola Emmanuel",
    role: "Software Engineer",
    focus: "FastAPI backend, MongoDB database design, secure endpoints",
    Icon: Server,
    bg: "#d1fae5",
    accent: "#047857",
  },
  {
    initials: "JO",
    name: "Joshua Onyeka",
    role: "Software Engineer",
    focus: "React application layout, TanStack routers, responsive UI flow",
    Icon: Code2,
    bg: "#fef7e0",
    accent: "#d97706",
  },
  {
    initials: "IC",
    name: "Ituma Chidi",
    role: "Software Engineer",
    focus: "Voice SDK integration, escrow pipeline, Paystack webhooks",
    Icon: Palette,
    bg: "#f3e8fd",
    accent: "#9334e6",
  },
];

export function SlideTeam() {
  return (
    <SlideShell slideNumber={7} id="team">
      <div className="flex flex-col items-center justify-center flex-1" style={{ perspective: 1200 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="pitch-label mb-4"
        >
          Team
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 40, rotateX: -10 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="pitch-display text-3xl sm:text-5xl md:text-6xl max-w-3xl text-center mb-4"
        >
          Why <span className="pitch-accent">us</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="pitch-body text-base text-center max-w-xl mb-12"
        >
          Full-stack team. We own every layer — backend, frontend, AI pipeline,
          and product. End-to-end.
        </motion.p>

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
