import React from 'react';

interface MilkyBossLogoProps {
  className?: string;
  variant?: 'full' | 'mark';
  size?: 'sm' | 'md' | 'lg';
}

export const MilkyBossLogo: React.FC<MilkyBossLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
}) => {
  const sizeMap = {
    sm: { icon: 26, height: 26, text: 'text-sm', badge: 'text-[9px]' },
    md: { icon: 34, height: 34, text: 'text-lg', badge: 'text-[10px]' },
    lg: { icon: 44, height: 44, text: 'text-xl', badge: 'text-xs' },
  };

  const currentSize = sizeMap[size];

  // Precision vector diamond emblem with carbon and ruby red facets
  const Emblem = (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: currentSize.icon, height: currentSize.icon }}
    >
      <svg
        viewBox="0 0 64 64"
        className="w-full h-full drop-shadow-[0_2px_12px_rgba(200,30,50,0.35)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="mbCarbon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2c3242" />
            <stop offset="50%" stopColor="#171a23" />
            <stop offset="100%" stopColor="#0b0d13" />
          </linearGradient>

          <linearGradient id="mbCrimson" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff3852" />
            <stop offset="50%" stopColor="#c81e32" />
            <stop offset="100%" stopColor="#8d1121" />
          </linearGradient>
        </defs>

        {/* Ambient back glow */}
        <rect
          x="18"
          y="18"
          width="28"
          height="28"
          rx="4"
          transform="rotate(45 32 32)"
          fill="#c81e32"
          opacity="0.3"
        />

        {/* Left Carbon facet */}
        <path
          d="M 32 8 L 8 32 L 32 56 Z"
          fill="url(#mbCarbon)"
          stroke="#3d4457"
          strokeWidth="1"
        />

        {/* Right Crimson facet */}
        <path
          d="M 32 8 L 56 32 L 32 56 Z"
          fill="url(#mbCrimson)"
          stroke="#ff4a62"
          strokeWidth="1"
        />

        {/* Dynamic Stylized ribbon dividing facets */}
        <path
          d="M 37 16 C 33 16 26.5 19 26.5 25 C 26.5 32 37.5 33 37.5 40 C 37.5 46.5 31 50 25.5 49"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Inner specular gloss line */}
        <path
          d="M 36.5 18 C 33.5 18 28.5 20.5 28.5 25"
          stroke="#ffffff"
          strokeWidth="1.75"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
      </svg>
    </div>
  );

  if (variant === 'mark') {
    return <div className={`inline-flex items-center ${className}`}>{Emblem}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {Emblem}
      <div className="flex items-baseline gap-1.5 leading-none">
        <span className={`font-light tracking-tight text-zinc-100 font-display ${currentSize.text}`}>
          Milky
        </span>
        <span className={`font-black tracking-tight text-white font-display ${currentSize.text}`}>
          BOSS
        </span>
        <span className={`font-mono font-semibold tracking-wider text-[#c81e32] uppercase ${currentSize.badge}`}>
          Agency
        </span>
      </div>
    </div>
  );
};
