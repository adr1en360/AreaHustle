import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const slideVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

interface SlideShellProps {
  slideNumber: number;
  totalSlides?: number;
  children: ReactNode;
  className?: string;
  id?: string;
}

export function SlideShell({
  slideNumber,
  totalSlides = 10,
  children,
  className = "",
  id,
}: SlideShellProps) {
  return (
    <section
      id={id ?? `slide-${slideNumber}`}
      className={`pitch-slide ${className}`}
    >
      <motion.div
        variants={slideVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        className="pitch-stage"
      >
        {children}
        <div className="pitch-slide-number">
          {String(slideNumber).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
        </div>
      </motion.div>
    </section>
  );
}
