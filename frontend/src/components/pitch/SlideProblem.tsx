import { motion } from "framer-motion";
import { SlideShell } from "./SlideShell";
import { Users, Landmark, TrendingDown } from "lucide-react";

/* ── 3D card entrance ── */
const cardZoom = {
  hidden: { opacity: 0, scale: 0.4, y: 40, rotateX: -10 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.7, delay: 0.8 + i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ── Massive number counter ── */
const numberReveal = {
  hidden: { opacity: 0, scale: 0.5, y: 60 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 },
  },
};

export function SlideProblem() {
  return (
    <SlideShell slideNumber={1} id="problem">
      <div className="flex flex-col justify-center flex-1" style={{ perspective: 1000 }}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="pitch-label mb-6"
        >
          The Problem
        </motion.div>

        {/* Massive stat — zooms in with spring */}
        <motion.div
          variants={numberReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
          className="mb-6"
        >
          <span className="pitch-stat text-8xl sm:text-9xl md:text-[12rem]">65%</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="pitch-body text-xl sm:text-2xl max-w-2xl mb-10"
        >
          of Lagos's working population is informal — people like{" "}
          <span className="text-[#1a1a1a] font-semibold">Emeka the hustler</span>, who washes cars on Monday, fixes generators on Wednesday, runs errands on Friday, and earns differently every week.
          <br />
          <span className="text-base text-[#5f6368] mt-2 block">
            No fixed income. No payslip. No employer. No credit. Banks have no formula for Emeka.
          </span>
        </motion.p>

        {/* 3D zoom-in data cards */}
        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl" style={{ perspective: 800 }}>
          {[
            { Icon: Users, stat: "5.58M", desc: "Informal workers in Lagos", color: "pitch-icon--green" },
            { Icon: Landmark, stat: "₦130T", desc: "National MSME credit gap", color: "pitch-icon--red" },
            { Icon: TrendingDown, stat: "90%", desc: "Earn <₦500k/mo — the survival trap", color: "pitch-icon--amber" },
          ].map(({ Icon, stat, desc, color }, i) => (
            <motion.div
              key={stat}
              custom={i}
              variants={cardZoom}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.4 }}
              className="pitch-layer-card pitch-tilt"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className={`pitch-icon ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-lg font-bold text-[#1a1a1a]">{stat}</div>
                <div className="text-xs text-[#5f6368]">{desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 1.4 }}
          className="text-xs text-[#9aa0a6] mt-8"
        >
          Sources: Lagos State Economic Monitor 2026, NBS Labour Force Survey 2024, Moody's 2026
        </motion.p>
      </div>
    </SlideShell>
  );
}
