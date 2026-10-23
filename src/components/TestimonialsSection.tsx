import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CLIENT_TESTIMONIALS } from '../data/content';
import { ChevronLeft, ChevronRight, Star, Quote, Pause, Play, TrendingUp } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<number>(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = CLIENT_TESTIMONIALS.length;

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const goToSlide = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, total, currentIndex]);

  const current = CLIENT_TESTIMONIALS[currentIndex];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    }),
  };

  return (
    <section
      id="testimonials"
      className="py-24 bg-[#090a0f] border-t border-white/10 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background ambient lighting */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#c81e32]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#c81e32]">
            Kundenstimmen &amp; Erfolgsberichte
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mt-2 tracking-tight">
            Was Kölner Unternehmer sagen.
          </h2>
          <p className="text-zinc-400 mt-3 text-base">
            Echte Erfahrungen unserer Partner aus den Bereichen E-Commerce, Social Media Marketing und CRM-Automatisierung.
          </p>
        </div>

        {/* Testimonial Slider Card */}
        <div className="mt-12 relative">
          <div className="rounded-2xl border border-white/10 bg-[#11141c]/95 backdrop-blur-xl p-8 sm:p-12 shadow-2xl relative min-h-[340px] flex flex-col justify-between">
            {/* Top decorative quote icon & rating stars */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#c81e32]/15 text-[#c81e32] flex items-center justify-center">
                  <Quote className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(current.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              {/* Metric tag */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{current.metric}</span>
              </div>
            </div>

            {/* Animated Quote Area */}
            <div className="py-6 flex-1 flex items-center">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current.id}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full space-y-4"
                >
                  <p className="text-lg sm:text-xl md:text-2xl font-medium text-zinc-100 leading-relaxed font-display">
                    &bdquo;{current.quote}&ldquo;
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-white/5">
                    <div>
                      <div className="text-base font-bold text-white font-display">
                        {current.author}
                      </div>
                      <div className="text-xs text-zinc-400">
                        {current.role} · <span className="text-zinc-200">{current.company}</span>
                      </div>
                    </div>

                    <div className="text-xs font-mono text-[#c81e32] font-semibold bg-[#c81e32]/10 px-2.5 py-1 rounded-md self-start sm:self-auto">
                      {current.service}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Bottom Navigation Bar */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              {/* Pagination Dots */}
              <div className="flex items-center gap-2">
                {CLIENT_TESTIMONIALS.map((t, idx) => (
                  <button
                    key={t.id}
                    onClick={() => goToSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      currentIndex === idx
                        ? 'w-7 bg-[#c81e32]'
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Gehe zu Referenz ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next & Pause Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer mr-1"
                  aria-label={isPaused ? 'Auto-Play starten' : 'Auto-Play pausieren'}
                  title={isPaused ? 'Auto-Play starten' : 'Auto-Play pausieren'}
                >
                  {isPaused ? <Play className="w-4 h-4 text-[#c81e32]" /> : <Pause className="w-4 h-4" />}
                </button>

                <button
                  onClick={prevSlide}
                  className="p-2 text-zinc-300 hover:text-white rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Vorherige Referenz"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={nextSlide}
                  className="p-2 text-zinc-300 hover:text-white rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Nächste Referenz"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
