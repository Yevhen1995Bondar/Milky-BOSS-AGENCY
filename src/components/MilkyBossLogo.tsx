import React from 'react';

export interface MilkyBossLogoProps {
  className?: string;
  variant?: 'full' | 'horizontal' | 'stacked' | 'mark' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

export const MilkyBossLogo: React.FC<MilkyBossLogoProps> = ({
  className = '',
  variant = 'horizontal',
  size = 'md',
  showTagline = true,
}) => {
  const emblemSizeMap = {
    sm: 'h-8 sm:h-9',
    md: 'h-9 sm:h-10 md:h-11',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24',
  };

  const textSizes = {
    sm: { title: 'text-base sm:text-lg', badge: 'text-[9px]' },
    md: { title: 'text-lg sm:text-xl md:text-2xl', badge: 'text-[10px]' },
    lg: { title: 'text-2xl sm:text-3xl', badge: 'text-xs' },
    xl: { title: 'text-4xl sm:text-5xl', badge: 'text-sm' },
  };

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center shrink-0 ${className}`}>
        <img
          src="/assets/milkyboss-dog-icon-squircle.png"
          alt="Milky BOSS Agency"
          className={`${emblemSizeMap[size]} w-auto object-contain rounded-2xl drop-shadow-[0_4px_16px_rgba(200,30,50,0.35)] transition-transform duration-300 hover:scale-105`}
          loading="eager"
        />
      </div>
    );
  }

  if (variant === 'mark') {
    return (
      <div className={`inline-flex items-center shrink-0 ${className}`}>
        <img
          src="/assets/milkyboss-dog-emblem-transparent.png"
          alt="Milky BOSS Chihuahua Emblem"
          className={`${emblemSizeMap[size]} w-auto object-contain drop-shadow-[0_2px_14px_rgba(200,30,50,0.5)] transition-transform duration-300 hover:scale-105`}
          loading="eager"
        />
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`inline-flex flex-col items-center justify-center text-center shrink-0 ${className}`}>
        <div className="relative mb-3 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#c81e32]/25 blur-2xl rounded-full scale-110" />
          <img
            src="/assets/milkyboss-dog-emblem-transparent.png"
            alt="Milky BOSS Emblem"
            className={`${size === 'lg' ? 'h-24 sm:h-28' : 'h-16 sm:h-20'} w-auto object-contain relative z-10 drop-shadow-[0_6px_28px_rgba(200,30,50,0.7)]`}
            loading="eager"
          />
        </div>
        <div className="flex items-baseline gap-2 leading-none">
          <span className="font-display font-black tracking-tight text-white text-2xl sm:text-3xl bg-gradient-to-b from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
            Milky
          </span>
          <span className="font-display font-black tracking-tight text-white text-2xl sm:text-3xl">
            BOSS
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="h-px w-6 bg-gradient-to-r from-transparent to-[#c81e32]" />
          <span className="text-[11px] tracking-[0.28em] font-mono font-bold uppercase text-[#c81e32] leading-none">
            AGENCY
          </span>
          <span className="h-px w-6 bg-gradient-to-l from-transparent to-[#c81e32]" />
        </div>
      </div>
    );
  }

  // Horizontal lockup (Default / Full)
  return (
    <div className={`inline-flex items-center gap-3 shrink-0 select-none group ${className}`}>
      {/* 3D Chihuahua Mascot Emblem with Ambient Ruby Glow */}
      <div className="relative flex items-center justify-center shrink-0">
        <div className="absolute -inset-1 bg-[#c81e32]/25 blur-md rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
        <img
          src="/assets/milkyboss-dog-emblem-transparent.png"
          alt="Milky BOSS"
          className={`${emblemSizeMap[size]} w-auto object-contain drop-shadow-[0_2px_14px_rgba(200,30,50,0.5)] transition-transform duration-300 group-hover:scale-105 relative z-10`}
          loading="eager"
        />
      </div>

      {/* Razor-Sharp Chrome & Ruby Typography matching the new 3D logo */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline gap-1.5 leading-none">
          <span className={`font-display font-black tracking-tight text-white ${textSizes[size].title} bg-gradient-to-b from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent`}>
            Milky
          </span>
          <span className={`font-display font-black tracking-tight text-white ${textSizes[size].title}`}>
            BOSS
          </span>
        </div>
        {showTagline && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`font-mono font-bold tracking-[0.24em] uppercase text-[#c81e32] ${textSizes[size].badge} leading-none`}>
              AGENCY
            </span>
            <span className="w-1 h-1 rounded-full bg-[#c81e32]" />
            <span className="text-[9px] tracking-wider font-mono text-zinc-400 uppercase leading-none hidden sm:inline">
              Digital &amp; E-Com
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
