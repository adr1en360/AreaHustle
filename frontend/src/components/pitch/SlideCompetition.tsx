import { motion } from "framer-motion";
import { SlideShell } from "./SlideShell";
import { MapPin, Mic, Database, ShieldCheck, Zap } from "lucide-react";

/* ── Positioning card zoom ── */
const cardZoom = {
  hidden: { opacity: 0, scale: 0.2, rotateY: -20, z: -400 },
  visible: (i: number) => ({
    opacity: 1, scale: 1, rotateY: 0, z: 0,
    transition: { duration: 0.8, delay: 0.4 + i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* AreaHustle's three unique capabilities with context */
const OUR_MOAT = [
  {
    Icon: Mic,
    title: "Voice-Native Posting",
    desc: "Customer speaks in plain Yoruba or English. No form. No typing. The only platform built for low-literacy, data-cost-sensitive users.",
    unique: true,
    color: "pitch-icon--violet",
  },
  {
    Icon: Zap,
    title: "AI Voice Matching",
    desc: "Ranked hustlers receive direct AI voice calls. First to say yes wins the job instantly — resolving race conditions that text notifications cannot.",
    unique: true,
    color: "pitch-icon--green",
  },
  {
    Icon: Database,
    title: "Credit Data as the Product",
    desc: "Every completed job generates a CRC-aligned Verified Work Data Package. Competitors end at the transaction. We treat it as input to a financial identity.",
    unique: true,
    color: "pitch-icon--blue",
  },
];

/* What competitors DO have for honest context */
const WHAT_THEY_HAVE = [
  { name: "Wrkman", note: "Artisan verification + escrow account. No voice. No credit data." },
  { name: "Gotwork", note: "NIN verification + Paystack wallet. No AI matching. No credit data." },
  { name: "Tuse / CitiTasker", note: "General task listing. No escrow. No voice. No financial identity." },
];

export function SlideCompetition() {
  return (
    <SlideShell slideNumber={8} id="competition">
      <div className="flex flex-col justify-center flex-1" style={{ perspective: 800 }}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="pitch-label mb-4"
        >
          Competition
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="pitch-display text-3xl sm:text-5xl md:text-5xl max-w-4xl mb-3"
        >
          They match jobs. <span className="pitch-accent">We build identities.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="pitch-body text-sm max-w-2xl mb-8"
        >
          Wrkman and Gotwork do escrow well. We give them credit for that. But no competitor has voice-native matching or generates creditworthiness data — that is our category.
        </motion.p>

        {/* Our 3 unique moats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8" style={{ transformStyle: "preserve-3d" }}>
          {OUR_MOAT.map((m, i) => (
            <motion.div
              key={m.title}
              custom={i}
              variants={cardZoom}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              className="pitch-float-card pitch-tilt p-5 border-t-2"
              style={{ transformStyle: "preserve-3d", borderTopColor: "#059669" }}
              whileHover={{
                scale: 1.03, rotateY: 3,
                boxShadow: "0 12px 40px rgba(5, 150, 105, 0.12)",
                transition: { duration: 0.3 },
              }}
            >
              <div className={`pitch-icon ${m.color} mb-3`}>
                <m.Icon className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#1a1a1a] mb-2">{m.title}</h3>
              <p className="text-xs text-[#5f6368] leading-relaxed">{m.desc}</p>
              <div className="mt-3 inline-flex items-center gap-1">
                <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-[#059669]">Only AreaHustle</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Honest competitor snapshot */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="flex flex-wrap gap-3"
        >
          {WHAT_THEY_HAVE.map((c) => (
            <div
              key={c.name}
              className="pitch-layer-card text-xs text-[#5f6368] flex-1 min-w-[180px]"
            >
              <div>
                <span className="font-bold text-[#3c4043] block mb-0.5">{c.name}</span>
                {c.note}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </SlideShell>
  );
}
