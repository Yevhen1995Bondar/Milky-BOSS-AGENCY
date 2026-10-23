import React, { useEffect, useState } from 'react';

export const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(1, Math.max(0, scrollY / totalHeight));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[3px] z-[100] pointer-events-none bg-transparent"
      aria-hidden="true"
      data-testid="scroll-progress-container"
    >
      <div
        data-testid="scroll-progress-bar"
        className="h-full w-full bg-gradient-to-r from-[#9e1325] via-[#c81e32] to-[#ff2a43] shadow-[0_0_10px_rgba(200,30,50,0.7)]"
        style={{
          transform: `scaleX(${scrollProgress})`,
          transformOrigin: '0% 50%',
          willChange: 'transform',
        }}
      />
    </div>
  );
};
