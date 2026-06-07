import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { SlideShell } from "./SlideShell";
import { Globe, Target, Crosshair } from "lucide-react";

/* ── Animated counter ── */
function AnimatedStat({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [shown, setShown] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(eased * value * 100) / 100);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value]);

  return (
    <motion.span
      onViewportEnter={() => setInView(true)}
      onViewportLeave={() => { setInView(false); setShown(0); }}
      viewport={{ amount: 0.6 }}
      className="pitch-stat"
    >
      {prefix}{Number.isInteger(value) ? Math.round(shown).toLocaleString() : shown.toFixed(2)}{suffix}
    </motion.span>
  );
}

const tamCard = {
  hidden: { opacity: 0, scale: 0.3, rotateY: -15, z: -200 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    rotateY: 0,
    z: 0,
    transition: { duration: 0.8, delay: 0.3 + i * 0.2, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function SlideMarket() {
  return (
    <SlideShell slideNumber={4} id="market">
      <div className="flex flex-col justify-center flex-1" style={{ perspective: 1000 }}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="pitch-label mb-4"
        >
          Market
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="pitch-display text-3xl sm:text-5xl md:text-6xl max-w-3xl mb-14"
        >
          TAM / SAM / <span className="pitch-accent">SOM</span> — Lagos
        </motion.h2>

        {/* TAM / SAM / SOM cards */}
        <div className="grid md:grid-cols-3 gap-6" style={{ transformStyle: "preserve-3d" }}>
          {/* TAM */}
          <motion.div
            custom={0}
            variants={tamCard}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.4 }}
            className="pitch-float-card pitch-tilt p-6"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="pitch-icon pitch-icon--green mb-4">
              <Globe className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#059669] mb-1">TAM</div>
            <h3 className="font-semibold text-base text-[#1a1a1a] mb-2">Total Addressable Market</h3>
            <div className="text-4xl sm:text-5xl mb-3">
              <AnimatedStat value={2.2} prefix="$" suffix="B" />
            </div>
            <p className="text-sm text-[#5f6368] leading-relaxed">
              The total value of Lagos's gig economy (2026). Lagos alone is the 5th-largest economy in Africa.
            </p>
            <p className="text-xs text-[#9aa0a6] mt-4 font-mono">Lagos Economic Monitor, 2026</p>
          </motion.div>

          {/* SAM */}
          <motion.div
            custom={1}
            variants={tamCard}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.4 }}
            className="pitch-float-card pitch-tilt p-6"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="pitch-icon pitch-icon--dark-green mb-4">
              <Target className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#059669] mb-1">SAM</div>
            <h3 className="font-semibold text-base text-[#1a1a1a] mb-2">Serviceable Addressable Market</h3>
            <div className="text-4xl sm:text-5xl mb-3">
              <AnimatedStat value={640} prefix="$" suffix="M" />
            </div>
            <p className="text-sm text-[#5f6368] leading-relaxed">
              Lagos informal workers in technical/domestic services — generators, cleaning, plumbing — reachable by smartphone.
            </p>
            <p className="text-xs text-[#9aa0a6] mt-4 font-mono">NBS Survey, 2024</p>
          </motion.div>

          {/* SOM */}
          <motion.div
            custom={2}
            variants={tamCard}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.4 }}
            className="pitch-float-card pitch-tilt p-6 border-2"
            style={{ transformStyle: "preserve-3d", borderColor: "#059669" }}
          >
            <div className="pitch-icon pitch-icon--green mb-4">
              <Crosshair className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#059669] mb-1">SOM</div>
            <h3 className="font-semibold text-base text-[#1a1a1a] mb-2">Serviceable Obtainable Market</h3>
            <div className="text-4xl sm:text-5xl mb-3">
              <AnimatedStat value={1.2} prefix="$" suffix="M" />
            </div>
            <p className="text-sm text-[#5f6368] leading-relaxed">
              5,000 active hustlers in Lekki-Ajah + Magodo-Gbagada. ~12,000 monthly jobs at avg ₦5,000. We start where trust gaps and willingness to pay are highest.
            </p>
            <p className="text-xs text-[#059669] font-semibold mt-4 font-mono">Target: Post-Funding Launch</p>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="pitch-body text-sm max-w-3xl mt-8"
        >
          Credit data revenue sits on top: {"₦"}130T MSME credit gap means every lender is
          actively seeking alternative data under the Credit Reporting Act of 2017.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="text-xs text-[#9aa0a6] mt-3 font-mono"
        >
          * Metrics calculated at a projected 2026 exchange rate of ₦1,500 = $1 USD.
        </motion.p>
      </div>
    </SlideShell>
  );
}
