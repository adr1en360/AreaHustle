import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";

import "@/components/pitch/pitch-styles.css";

import { SlideHook } from "@/components/pitch/SlideHook";
import { SlideProblem } from "@/components/pitch/SlideProblem";
import { SlideSolution } from "@/components/pitch/SlideSolution";
import { SlideMarket } from "@/components/pitch/SlideMarket";
import { SlideTraction } from "@/components/pitch/SlideTraction";
import { SlideBusinessModel } from "@/components/pitch/SlideBusinessModel";
import { SlideTeam } from "@/components/pitch/SlideTeam";
import { SlideCompetition } from "@/components/pitch/SlideCompetition";
import { SlideAsk } from "@/components/pitch/SlideAsk";
import { SlideClosing } from "@/components/pitch/SlideClosing";

export const Route = createFileRoute("/pitch")({
  head: () => ({
    meta: [
      { title: "AreaHustle — Investor Pitch" },
      {
        name: "description",
        content:
          "AreaHustle: Voice-first gig marketplace & Financial Passport for Africa's informal economy.",
      },
    ],
  }),
  component: PitchDeck,
});

const TOTAL_SLIDES = 10;

const SLIDE_IDS = [
  "problem",
  "hook",
  "solution",
  "market",
  "traction",
  "business-model",
  "team",
  "competition",
  "ask",
  "closing",
];

function PitchDeck() {
  const runnerRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showHint, setShowHint] = useState(true);

  // Track active slide via IntersectionObserver
  useEffect(() => {
    const runner = runnerRef.current;
    if (!runner) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = SLIDE_IDS.indexOf(entry.target.id);
            if (idx !== -1) setActiveSlide(idx);
          }
        });
      },
      { root: runner, threshold: 0.5 }
    );

    SLIDE_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Hide scroll hint after first scroll
  useEffect(() => {
    const runner = runnerRef.current;
    if (!runner) return;

    const onScroll = () => {
      if (runner.scrollTop > 80) setShowHint(false);
    };
    runner.addEventListener("scroll", onScroll, { passive: true });
    return () => runner.removeEventListener("scroll", onScroll);
  }, []);

  // Keyboard navigation
  const scrollToSlide = useCallback((idx: number) => {
    const el = document.getElementById(SLIDE_IDS[idx]);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        const next = Math.min(activeSlide + 1, TOTAL_SLIDES - 1);
        scrollToSlide(next);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = Math.max(activeSlide - 1, 0);
        scrollToSlide(prev);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeSlide, scrollToSlide]);

  return (
    <div ref={runnerRef} className="pitch-runner">
      {/* Progress dots */}
      <nav className="pitch-progress" aria-label="Slide navigation">
        {SLIDE_IDS.map((id, i) => (
          <button
            key={id}
            onClick={() => scrollToSlide(i)}
            className={`pitch-progress__dot ${i === activeSlide ? "pitch-progress__dot--active" : ""}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </nav>

      {/* Scroll hint (fades after first scroll) */}
      <div
        className="pitch-key-hint"
        style={{ opacity: showHint ? 1 : 0 }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Scroll or press ↓</span>
      </div>

      {/* ─── YPIT FRAMEWORK: 10 SLIDES ─── */}
      <SlideProblem />
      <SlideHook />
      <SlideSolution />
      <SlideMarket />
      <SlideTraction />
      <SlideBusinessModel />
      <SlideTeam />
      <SlideCompetition />
      <SlideAsk />
      <SlideClosing />
    </div>
  );
}
