import { motion } from "framer-motion";
import { SlideShell } from "./SlideShell";
import { MapPin, TrendingDown, Users, ShieldCheck, Database } from "lucide-react";

const metricZoom = {
  hidden: { opacity: 0, scale: 0.2, rotateX: -15, z: -300 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    rotateX: 0,
    z: 0,
    transition: { duration: 0.7, delay: 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const TRACTION_POINTS = [
  {
    Icon: TrendingDown,
    stat: "₦130T",
    subtitle: "The Cost of the Gap",
    label: "National MSME credit gap. Every informal worker like Emeka is locked out of this capital.",
    color: "pitch-icon--red",
  },
  {
    Icon: MapPin,
    stat: "Lagos",
    subtitle: "Pilot Market",
    label: "5th-largest economy in Africa if it were a country. Our beachhead: Lekki-Ajah corridor, starting in gated estates.",
    color: "pitch-icon--green",
  },
  {
    Icon: Users,
    stat: "5.58M",
    subtitle: "Target Workers",
    label: "Informal workers in Lagos in technical and domestic services — our initial category focus.",
    color: "pitch-icon--blue",
  },
  {
    Icon: ShieldCheck,
    stat: "Live",
    subtitle: "First-Step Systemic Impact",
    label: "First voice-native trust and escrow verification pipeline in the Lagos informal market, matching intent in under 2 seconds.",
    color: "pitch-icon--violet",
  },
];

export function SlideTraction() {
  return (
    <SlideShell slideNumber={5} id="traction">
      <div className="flex flex-col justify-center flex-1" style={{ perspective: 1200 }}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="pitch-label mb-4"
        >
          Traction & Impact
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="pitch-display text-3xl sm:text-5xl md:text-5xl max-w-4xl mb-4"
        >
          The problem is real. <span className="pitch-accent">So is the solution.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="pitch-body text-base max-w-2xl mb-10"
        >
          Pre-revenue, functional product — targeting the core financial friction of Lagos's informal market.
        </motion.p>

        <div className="grid sm:grid-cols-2 gap-6" style={{ transformStyle: "preserve-3d" }}>
          {TRACTION_POINTS.map((m, i) => (
            <motion.div
              key={m.subtitle}
              custom={i}
              variants={metricZoom}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              className="pitch-float-card pitch-tilt p-6 flex gap-5 items-start"
              style={{ transformStyle: "preserve-3d" }}
              whileHover={{
                scale: 1.03,
                rotateY: 2,
                boxShadow: "0 12px 40px rgba(5, 150, 105, 0.12)",
                transition: { duration: 0.3 },
              }}
            >
              <div className={`pitch-icon ${m.color} flex-shrink-0`}>
                <m.Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold pitch-accent">{m.stat}</span>
                  <span className="text-xs font-semibold text-[#80868b] tracking-wide uppercase">{m.subtitle}</span>
                </div>
                <p className="text-sm text-[#5f6368] leading-relaxed">{m.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}
