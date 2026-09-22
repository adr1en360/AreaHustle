import { useEffect, useRef, type ReactNode } from "react";

const revealTargets = "section, article, aside, main [class*='grid'] > div, main [class*='grid'] > a";

export function PageMotion({ children }: { children: ReactNode }) {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = Array.from(page.querySelectorAll<HTMLElement>(revealTargets)).filter(
      (element, index, elements) => elements.indexOf(element) === index && !element.closest("footer"),
    );

    targets.forEach((element, index) => {
      element.classList.add("scroll-reveal");
      element.style.setProperty("--reveal-delay", `${Math.min(index * 45, 280)}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    targets.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={pageRef} className="page-motion-root">
      {children}
    </div>
  );
}
