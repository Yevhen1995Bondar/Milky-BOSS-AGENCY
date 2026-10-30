import React, { useEffect, useRef } from 'react';

export const ScrollProgressBar: React.FC = () => {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0 && barRef.current) {
        const progress = Math.min(1, Math.max(0, scrollY / totalHeight));
        barRef.current.style.transform = `scaleX(${progress})`;
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[3px] z-[100] pointer-events-none bg-transparent"
      aria-hidden="true"
      data-testid="scroll-progress-container"
    >
      <div
        ref={barRef}
        data-testid="scroll-progress-bar"
        className="h-full w-full bg-gradient-to-r from-[#9e1325] via-[#c81e32] to-[#ff2a43] shadow-[0_0_10px_rgba(200,30,50,0.7)]"
        style={{
          transform: 'scaleX(0)',
          transformOrigin: '0% 50%',
          willChange: 'transform',
        }}
      />
    </div>
  );
};

