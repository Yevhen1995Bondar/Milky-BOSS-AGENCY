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
    sm: 'h-8 sm:h-9 w-auto',
    md: 'h-9 sm:h-10 md:h-11 w-auto',
    lg: 'h-14 sm:h-16 w-auto',
    xl: 'h-20 sm:h-24 w-auto',
  };

  const textSizes = {
    sm: { title: 'text-base sm:text-lg', badge: 'text-[9px]' },
    md: { title: 'text-lg sm:text-xl md:text-2xl', badge: 'text-[10px]' },
    lg: { title: 'text-2xl sm:text-3xl', badge: 'text-xs' },
    xl: { title: 'text-4xl sm:text-5xl', badge: 'text-sm' },
  };

  // Responsive modern picture element for high-performance LCP (<15 KiB AVIF vs >140 KiB PNG)
  const renderResponsiveEmblem = (customClass: string) => (
    <picture className="inline-flex items-center shrink-0">
      <source
        type="image/avif"
        srcSet="/assets/milkyboss-emblem-1x.avif 1x, /assets/milkyboss-emblem-2x.avif 2x"
      />
      <source
        type="image/webp"
        srcSet="/assets/milkyboss-emblem-1x.webp 1x, /assets/milkyboss-emblem-2x.webp 2x"
      />
      <img
        src="/assets/milkyboss-emblem-1x.webp"
        alt="Milky BOSS Agency Emblem"
        width="307"
        height="168"
        fetchPriority="high"
        loading="eager"
        decoding="async"
        className={`${customClass} object-contain`}
      />
    </picture>
  );

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center shrink-0 ${className}`}>
        <img
          src="/assets/milkyboss-dog-icon-squircle.png"
          alt="Milky BOSS Agency"
          width="128"
          height="128"
          loading="eager"
          decoding="async"
          className={`${emblemSizeMap[size]} object-contain rounded-2xl drop-shadow-[0_4px_16px_rgba(200,30,50,0.35)] transition-transform duration-300 hover:scale-105`}
        />
      </div>
    );
  }

  if (variant === 'mark') {
    return (
      <div className={`inline-flex items-center shrink-0 ${className}`}>
        {renderResponsiveEmblem(
          `${emblemSizeMap[size]} drop-shadow-[0_2px_14px_rgba(200,30,50,0.5)] transition-transform duration-300 hover:scale-105`
        )}
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`inline-flex flex-col items-center justify-center text-center shrink-0 ${className}`}>
        <div className="relative mb-3 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#c81e32]/25 blur-2xl rounded-full scale-110" />
          <div className="relative z-10">
            {renderResponsiveEmblem(
              `${size === 'lg' ? 'h-24 sm:h-28' : 'h-16 sm:h-20'} w-auto drop-shadow-[0_6px_28px_rgba(200,30,50,0.7)]`
            )}
          </div>
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
        <div className="relative z-10">
          {renderResponsiveEmblem(
            `${emblemSizeMap[size]} drop-shadow-[0_2px_14px_rgba(200,30,50,0.5)] transition-transform duration-300 group-hover:scale-105`
          )}
        </div>
      </div>

      {/* Razor-Sharp Chrome & Ruby Typography matching the 3D logo */}
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

