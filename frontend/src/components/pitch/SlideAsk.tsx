import { motion } from "framer-motion";
import { SlideShell } from "./SlideShell";
import { Code2, Users, Handshake, Scale } from "lucide-react";

const barReveal = {
  hidden: { opacity: 0, x: -40 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay: 0.5 + i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const ALLOCATION = [
  { Icon: Code2, label: "Engineering & Product", pct: 45, color: "#059669" },
  { Icon: Users, label: "Lagos Market Launch", pct: 25, color: "#10b981" },
  { Icon: Handshake, label: "MFI Data Partnerships", pct: 20, color: "#d97706" },
  { Icon: Scale, label: "Operations & Legal", pct: 10, color: "#ea4335" },
];

export function SlideAsk() {
  return (
    <SlideShell slideNumber={9} id="ask">
      <div className="flex flex-col items-center justify-center text-center flex-1" style={{ perspective: 1000 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="pitch-label mb-4"
        >
          The Ask
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.2, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="mb-4"
        >
          <span className="pitch-stat text-8xl sm:text-9xl md:text-[11rem]">$50K</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pitch-display text-2xl sm:text-3xl max-w-xl mb-2"
        >
          Pre-seed. Equity.
        </motion.h2>

        {/* 3 concrete milestones */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid sm:grid-cols-3 gap-4 w-full max-w-2xl mb-10 text-left"
        >
          <div className="pitch-float-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#059669] mb-1">Product</p>
            <p className="text-sm font-semibold text-[#1a1a1a]">Voice AI in 3 dialects</p>
            <p className="text-xs text-[#5f6368] mt-1">Yoruba, Igbo, Hausa</p>
          </div>
          <div className="pitch-float-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#059669] mb-1">Growth</p>
            <p className="text-sm font-semibold text-[#1a1a1a]">500 Active Hustlers</p>
            <p className="text-xs text-[#5f6368] mt-1">Lekki / Ajah / Sangotedo Corridor</p>
          </div>
          <div className="pitch-float-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#059669] mb-1">Partnership</p>
            <p className="text-sm font-semibold text-[#1a1a1a]">1 Tier-2 MFB Pilot</p>
            <p className="text-xs text-[#5f6368] mt-1">CRC-aligned data underwriting deal</p>
          </div>
        </motion.div>

        <div className="w-full max-w-xl text-left">
          {ALLOCATION.map((a, i) => (
            <motion.div
              key={a.label}
              custom={i}
              variants={barReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.4 }}
              className="mb-5"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <a.Icon className="w-4 h-4" style={{ color: a.color }} />
                  <span className="text-sm font-medium text-[#3c4043]">{a.label}</span>
                </div>
                <span className="text-sm font-bold" style={{ color: a.color }}>{a.pct}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-[#f1f3f4] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: a.color }}
                  initial={{ width: "0%" }}
                  whileInView={{ width: `${a.pct}%` }}
                  viewport={{ once: false, amount: 0.8 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.7 + i * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}
