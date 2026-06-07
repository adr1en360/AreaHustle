import { motion } from "framer-motion";
import { SlideShell } from "./SlideShell";
import { Database, Percent, BadgeCheck, ArrowRight } from "lucide-react";

const cardZoom3D = {
  hidden: { opacity: 0, scale: 0.15, rotateX: -20, rotateY: -10, z: -400 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    z: 0,
    transition: { duration: 0.85, delay: 0.3 + i * 0.18, ease: [0.22, 1, 0.36, 1] },
  }),
};

const STREAMS = [
  {
    Icon: Database,
    title: "Credit Data API",
    pricing: "Per-query",
    desc: "MFBs and fintechs pay to access Verified Work Data Packages with hustler consent.",
    economics: "~$0.50-2.00 per query",
    priority: "Primary",
    color: "pitch-icon--green",
  },
  {
    Icon: Percent,
    title: "Transaction Fee",
    pricing: "3\u20135%",
    desc: "Commission on completed escrow transactions. Active from day one.",
    economics: "Avg. \u20a6250 per job",
    priority: "Secondary",
    color: "pitch-icon--dark-green",
  },
  {
    Icon: BadgeCheck,
    title: "Premium Badge",
    pricing: "\u20a62,500/mo",
    desc: "Priority matching, verified badge, advanced analytics for hustlers.",
    economics: "~\u20a630K ARR per subscriber",
    priority: "Tertiary",
    color: "pitch-icon--amber",
  },
];

export function SlideBusinessModel() {
  return (
    <SlideShell slideNumber={6} id="business-model">
      <div className="flex flex-col justify-center flex-1" style={{ perspective: 1200 }}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="pitch-label mb-4"
        >
          Business Model
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="pitch-display text-3xl sm:text-5xl md:text-6xl max-w-3xl mb-4"
        >
          Three revenue streams
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="pitch-body text-base max-w-xl mb-12"
        >
          Commission from day one. Data monetization unlocks at scale.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-5" style={{ transformStyle: "preserve-3d" }}>
          {STREAMS.map((s, i) => (
            <motion.div
              key={s.title}
              custom={i}
              variants={cardZoom3D}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.4 }}
              className="pitch-float-card pitch-tilt p-6"
              style={{ transformStyle: "preserve-3d" }}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                boxShadow: "0 16px 48px rgba(5, 150, 105, 0.15)",
                transition: { duration: 0.3 },
              }}
            >
              <div className="flex items-center justify-between mb-5">
                <div className={`pitch-icon ${s.color}`}>
                  <s.Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#ecfdf5] text-[#059669]">
                  {s.priority}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">{s.title}</h3>
              <div className="text-2xl font-bold pitch-accent mb-3">{s.pricing}</div>
              <p className="text-sm text-[#5f6368] mb-3">{s.desc}</p>
              <div className="text-xs font-semibold text-[#047857] bg-[#ecfdf5] rounded-full px-3 py-1 inline-block">
                {s.economics}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}
