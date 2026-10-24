import React, { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { MilkyBossLogo } from './MilkyBossLogo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  onOpenContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenContact }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { dict } = useLanguage();

  const navLinks = [
    { label: dict.nav.services, href: '#services' },
    { label: dict.nav.projects, href: '#projects' },
    { label: dict.nav.pricing, href: '#pricing' },
    { label: dict.nav.crm_ai, href: '#automation' },
    { label: dict.nav.faq, href: '#faq' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#090a0f]/90 border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Milky BOSS Agency Wordmark & Emblem */}
        <a href="#" className="flex items-center shrink-0 group" aria-label="Milky BOSS Agency Home">
          <MilkyBossLogo size="md" className="group-hover:opacity-90 transition-opacity" />
        </a>

        {/* Zone 2: Concise nav links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-zinc-300">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-white transition-colors relative py-1 hover:underline underline-offset-8 decoration-[#c81e32] whitespace-nowrap shrink-0"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Language Switcher & Primary Action */}
        <div className="hidden sm:flex items-center gap-3.5 shrink-0">
          <LanguageSwitcher />

          <button
            onClick={onOpenContact}
            className="inline-flex items-center gap-2 px-4.5 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#c81e32] hover:bg-[#b01829] rounded-md transition-all duration-200 shadow-sm hover:shadow-[#c81e32]/25 hover:shadow-lg whitespace-nowrap shrink-0"
          >
            <span>{dict.nav.cta_button}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Controls (Lang Switcher + Hamburger) */}
        <div className="flex sm:hidden items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-400 hover:text-white rounded-md border border-white/10"
            aria-label="Navigation umschalten"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0c0e15] px-4 pt-3 pb-6 space-y-4">
          <div className="flex flex-col space-y-2.5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-zinc-300 hover:text-white px-2 py-2 rounded-md hover:bg-white/5 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-[#c81e32] rounded-md hover:bg-[#b01829] transition-colors"
            >
              <span>{dict.nav.mobile_cta}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
