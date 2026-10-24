import React from 'react';
import { motion } from 'motion/react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`relative inline-flex items-center p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md ${className}`}
      role="group"
      aria-label="Language selection"
    >
      <Globe className="w-3.5 h-3.5 text-zinc-400 ml-1.5 mr-1 shrink-0" aria-hidden="true" />
      
      <button
        onClick={() => setLanguage('de')}
        className={`relative z-10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors ${
          language === 'de' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
        }`}
        aria-pressed={language === 'de'}
        aria-label="Deutsch"
      >
        {language === 'de' && (
          <motion.div
            layoutId="langActivePill"
            className="absolute inset-0 bg-[#c81e32] rounded-full shadow-[0_0_10px_rgba(200,30,50,0.5)] -z-10"
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
          />
        )}
        DE
      </button>

      <button
        onClick={() => setLanguage('en')}
        className={`relative z-10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors ${
          language === 'en' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
        }`}
        aria-pressed={language === 'en'}
        aria-label="English"
      >
        {language === 'en' && (
          <motion.div
            layoutId="langActivePill"
            className="absolute inset-0 bg-[#c81e32] rounded-full shadow-[0_0_10px_rgba(200,30,50,0.5)] -z-10"
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
          />
        )}
        EN
      </button>
    </div>
  );
};
