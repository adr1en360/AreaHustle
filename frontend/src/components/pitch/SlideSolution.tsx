import { motion } from "framer-motion";
import { SlideShell } from "./SlideShell";
import { Mic, Brain, UserCheck, ArrowRight } from "lucide-react";

const wordReveal = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const wordItem = {
  hidden: { opacity: 0, y: 40, rotateX: -20 },
  visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const cardZoom3D = {
  hidden: { opacity: 0, scale: 0.2, rotateY: -25, z: -300 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    rotateY: 0,
    z: 0,
    transition: { duration: 0.8, delay: 0.8 + i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
};

const STEPS = [
  { Icon: Mic, title: "Speak", desc: "Customer taps mic, describes the job in plain Yoruba or English", color: "pitch-icon--violet" },
  { Icon: Brain, title: "Extract", desc: "AI structures intent, location, budget — under 2 seconds", color: "pitch-icon--green" },
  { Icon: UserCheck, title: "Match", desc: "Ranked hustlers get AI voice calls. First to say yes, wins the job.", color: "pitch-icon--dark-green" },
];

export function SlideSolution() {
  return (
    <SlideShell slideNumber={3} id="solution">
      <div className="flex flex-col justify-center flex-1" style={{ perspective: 1200 }}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="pitch-label mb-6"
        >
          Solution
        </motion.div>

        {/* Word-by-word main statement */}
        <motion.h2
          variants={wordReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
          className="pitch-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl flex flex-wrap gap-x-3 gap-y-1 mb-6"
          style={{ perspective: 600 }}
        >
          {"A voice-first gig marketplace".split(" ").map((w, i) => (
            <motion.span key={i} variants={wordItem} className="inline-block">{w}</motion.span>
          ))}
          <br className="w-full" />
          {"that builds".split(" ").map((w, i) => (
            <motion.span key={`b${i}`} variants={wordItem} className="inline-block">{w}</motion.span>
          ))}
          <motion.span variants={wordItem} className="inline-block pitch-accent">credit&nbsp;identity.</motion.span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="pitch-body text-base sm:text-lg max-w-2xl mb-6"
        >
          Every job Emeka completes — a car wash, a generator repair, an errand — generates verified work data: income, reliability,
          consistency. Stacked over time, that data becomes the credit profile he was never able to build.
        </motion.p>

        {/* "We don't lend" callout */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="pitch-float-card px-6 py-4 inline-flex items-center gap-3 mb-10 self-start"
        >
          <span className="text-base font-bold text-[#1a1a1a]">We don&rsquo;t lend.</span>
          <span className="text-base font-bold pitch-accent">We prove you&rsquo;re lendable.</span>
        </motion.div>

        {/* How it works — 3 step cards */}
        <div className="flex flex-col md:flex-row items-stretch gap-4" style={{ transformStyle: "preserve-3d" }}>
          {STEPS.map((s, i) => (
            <div key={s.title} className="flex items-center gap-4 flex-1">
              <motion.div
                custom={i}
                variants={cardZoom3D}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                className="pitch-float-card pitch-tilt p-5 flex-1"
                style={{ transformStyle: "preserve-3d" }}
                whileHover={{
                  scale: 1.04,
                  rotateY: 3,
                  boxShadow: "0 12px 40px rgba(5, 150, 105, 0.12)",
                  transition: { duration: 0.3 },
                }}
              >
                <div className={`pitch-icon ${s.color} mb-3`}>
                  <s.Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">{s.title}</h3>
                <p className="text-sm text-[#5f6368]">{s.desc}</p>
              </motion.div>
              {i < STEPS.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.4 }}
                  transition={{ duration: 0.4, delay: 1 + i * 0.2 }}
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
