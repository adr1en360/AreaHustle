import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { SlideShell } from "./SlideShell";

/* ── Kinetic text cycling for closing impact ── */
const CYCLE_WORDS = ["Your Area.", "Your Hustle.", "Your Proof."];

function KineticClosing() {
  const [idx, setIdx] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const swept = useRef(false);

  useEffect(() => {
    if (!inView || swept.current) return;
    swept.current = true;
    const step = (i: number) => {
      setIdx(i);
      if (i < CYCLE_WORDS.length - 1) {
        setTimeout(() => step(i + 1), 350);
      }
    };
    step(0);
  }, [inView]);

  useEffect(() => {
    if (!inView) {
      swept.current = false;
      setIdx(-1);
    }
  }, [inView]);

  return (
    <div ref={ref} className="pitch-display text-5xl sm:text-7xl md:text-8xl lg:text-[8rem] leading-[0.95]">
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


export function SlideClosing() {
  return (
    <SlideShell slideNumber={10} id="closing">
      <div className="flex flex-col items-center justify-center flex-1 text-center" style={{ perspective: 1400 }}>
        <KineticClosing />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="pitch-body text-lg sm:text-xl max-w-lg mt-10"
        >
          The financial identity layer for Africa's informal economy.
        </motion.p>
      </div>
    </SlideShell>
  );
}
