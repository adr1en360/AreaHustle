import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { SlideShell } from "./SlideShell";
import { Mic, Shield, CreditCard } from "lucide-react";

/* ── Kinetic text cycling (I/O "Freedom to ___" style) ── */
const CYCLE_WORDS = ["Your Area.", "Your Hustle.", "Your Proof."];

function KineticHeadline() {
  const [idx, setIdx] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const swept = useRef(false);

  useEffect(() => {
    if (!inView || swept.current) return;
    swept.current = true;
    // Sweep: 0 → 1 → 2, each 350ms apart, stop at end
    const step = (i: number) => {
      setIdx(i);
      if (i < CYCLE_WORDS.length - 1) {
        setTimeout(() => step(i + 1), 350);
      }
    };
    step(0);
  }, [inView]);

  // Reset when slide leaves view so re-entry sweeps again
  useEffect(() => {
    if (!inView) {
      swept.current = false;
      setIdx(-1);
    }
  }, [inView]);

  return (
    <div ref={ref} className="pitch-display text-6xl sm:text-7xl md:text-8xl lg:text-[8.5rem] leading-[0.95]">
      {CYCLE_WORDS.map((word, i) => (
        <motion.div
          key={word}
          initial={{ opacity: 0.08, y: 0, rotateX: 0, scale: 1 }}
          animate={
            i < idx
              ? { opacity: 0.2, y: 0, rotateX: 0, scale: 1, color: "#9aa0a6" }
              : i === idx
                ? { opacity: 1, y: 0, rotateX: 0, scale: 1, color: i === 2 ? "#059669" : "#1a1a1a" }
                : { opacity: 0.08, y: 0, rotateX: 0, scale: 1, color: "#9aa0a6" }
          }
          transition={{
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ transformOrigin: "left bottom" }}
        >
          {word}
        </motion.div>
      ))}
    </div>
  );
}

/* ── 3D zoom-in cards ── */
const zoomIn = {
  hidden: { opacity: 0, scale: 0.3, rotateY: -15, z: -200 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    rotateY: 0,
    z: 0,
    transition: {
      duration: 0.7,
      delay: 1.8 + i * 0.15,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const PILLARS = [
  { Icon: Mic, label: "Voice-First", color: "pitch-icon--violet" },
  { Icon: Shield, label: "Escrow-Secured", color: "pitch-icon--green" },
  { Icon: CreditCard, label: "Credit-Ready", color: "pitch-icon--amber" },
];

export function SlideHook() {
  return (
    <SlideShell slideNumber={2} id="hook">
      <div className="flex flex-col items-center justify-center text-center flex-1" style={{ perspective: 1000 }}>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="pitch-body text-lg sm:text-xl max-w-xl mb-10"
        >
          The voice-first gig marketplace that turns
          everyday work into a verified financial identity.
        </motion.p>

        <KineticHeadline />

        {/* 3D zoom-in pillar cards */}
        <div className="flex flex-wrap justify-center gap-4 mt-14" style={{ perspective: 800 }}>
          {PILLARS.map(({ Icon, label, color }, i) => (
            <motion.div
              key={label}
              custom={i}
              variants={zoomIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.4 }}
              className="pitch-float-card pitch-tilt px-5 py-4 flex items-center gap-3"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className={`pitch-icon ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-[#3c4043]">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}
