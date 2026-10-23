import React from 'react';

export const Marquee: React.FC = () => {
  const items = [
    'SHOPIFY EXPERTE',
    'GOOGLE AI STUDIO WORKFLOWS',
    'HIGH-CONVERTING LANDINGPAGES',
    'GOOGLE & INSTAGRAM ADS',
    'CRM-AUTOMATISIERUNG',
    'HUBSPOT & KLAVIYO SYNC',
    'KMU WEBSITES KÖLN',
    'PERFORMANCE FIRST (<1.2s)',
  ];

  return (
    <div className="w-full py-4 border-y border-white/10 bg-[#0c0e15] overflow-hidden select-none">
      <div className="flex w-max animate-marquee space-x-10 text-xs font-semibold tracking-widest text-zinc-400 uppercase">
        {/* Render twice for seamless infinite loop */}
        {[...items, ...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center space-x-8">
            <span className="hover:text-white transition-colors">{text}</span>
            <span className="text-[#c81e32]">◆</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};
