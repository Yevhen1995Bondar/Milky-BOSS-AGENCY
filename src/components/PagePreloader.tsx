import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MilkyBossLogo } from './MilkyBossLogo';
import { useLanguage } from '../context/LanguageContext';

interface PagePreloaderProps {
  onComplete: () => void;
}

export const PagePreloader: React.FC<PagePreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const { dict } = useLanguage();

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1400; // 1.4 seconds total loading time

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(100, Math.floor((elapsed / duration) * 100));

      // Ease-out curve simulation
      const easedProgress = Math.min(
        100,
        Math.floor(100 * (1 - Math.pow(1 - rawProgress / 100, 2.5)))
      );

      setProgress(easedProgress);

      if (elapsed >= duration) {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          setIsDone(true);
          setTimeout(() => {
            onComplete();
          }, 600); // Wait for exit animation
        }, 150);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Optional quick skip on click for accessibility / power users
  const handleSkip = () => {
    setProgress(100);
    setIsDone(true);
    setTimeout(onComplete, 200);
  };

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          onClick={handleSkip}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#090a0f] text-white select-none cursor-pointer"
          aria-live="polite"
          role="status"
        >
          {/* Subtle ambient ruby glow behind logo */}
          <div className="absolute w-[420px] h-[420px] bg-[#c81e32]/15 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center">
            {/* Logo with gentle pulse & entrance */}
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8"
            >
              <MilkyBossLogo size="lg" />
            </motion.div>

            {/* Horizontal Progress Bar Container */}
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden p-0.5 relative backdrop-blur-sm border border-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-[#c81e32] via-[#ff3852] to-[#ff758c] rounded-full shadow-[0_0_12px_rgba(200,30,50,0.7)]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.1 }}
              />
            </div>

            {/* Progress Metrics & Status Text */}
            <div className="mt-4 w-full flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c81e32] animate-ping" />
                <span className="text-zinc-300">
                  {progress < 100 ? dict.preloader.loading : dict.preloader.ready}
                </span>
              </span>
              <span className="font-semibold text-white tracking-wider">
                {progress}%
              </span>
            </div>

            {/* Location & Tagline kicker */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-6 text-[11px] tracking-wider uppercase text-zinc-400 font-medium"
            >
              {dict.preloader.subtitle}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
