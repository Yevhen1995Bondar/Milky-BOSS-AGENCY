import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShoppingBag, Bot, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { HeroParticleBackground } from './HeroParticleBackground';

interface HeroProps {
  onOpenContact: () => void;
  onScrollToCalculator: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenContact, onScrollToCalculator }) => {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Interactive particle background */}
      <HeroParticleBackground />

      {/* Dynamic ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-[#c81e32]/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] bg-red-950/20 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Proposition & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Location & Trust text kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <span className="text-[#c81e32]">●</span>
              <span>Webentwicklung & E-Commerce Partner</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-300">Köln & NRW</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display leading-[1.1] text-balance">
              Hochkonvertierende Webauftritte &amp;{' '}
              <span className="bg-gradient-to-r from-white via-zinc-200 to-[#e11d48] bg-clip-text text-transparent">
                Shopify Stores
              </span>{' '}
              mit AI-Automation.
            </h1>

            <p className="text-lg sm:text-xl text-zinc-300 max-w-2xl font-normal leading-relaxed">
              Wir entwickeln messbar verkaufsstarke Onlineshops, fokussierte Landingpages und KMU-Unternehmenswebsites. Mit gezielter Google &amp; Instagram Werbung sowie Google AI Studio CRM-Automatisierung für maximale Effizienz.
            </p>

            {/* Core Capability Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-zinc-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c81e32] shrink-0" />
                <span>Shopify OS 2.0 &amp; Sub-Sekunden Ladezeit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c81e32] shrink-0" />
                <span>Google AI Studio &amp; CRM-Workflows</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c81e32] shrink-0" />
                <span>Google &amp; Meta Ads (ROAS Fokus)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c81e32] shrink-0" />
                <span>Persönlicher Ansprechpartner in Köln</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                onClick={onOpenContact}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#c81e32] hover:bg-[#b01829] rounded-md transition-all shadow-lg shadow-[#c81e32]/20 hover:shadow-[#c81e32]/40 cursor-pointer"
              >
                <span>Erstgespräch anfragen</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onScrollToCalculator}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium text-zinc-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-all cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-[#c81e32]" />
                <span>Umsatz-Rechner &amp; Tarife</span>
              </button>
            </div>
          </motion.div>

          {/* Right Column: Interactive Animated Ecosystem Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-2xl border border-white/10 bg-[#11141c]/90 backdrop-blur-xl p-6 sm:p-7 shadow-2xl">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-[#c81e32]" />
                  <span className="text-xs font-semibold tracking-wider uppercase text-zinc-300">
                    Milky BOSS Wachstumsmotor
                  </span>
                </div>
                <span className="text-xs font-mono text-zinc-400">Köln · Live Flow</span>
              </div>

              {/* Animated Interactive Flow Diagram */}
              <div className="py-6 space-y-4">
                {/* Step 1: Paid Traffic */}
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 transition-colors hover:border-[#c81e32]/40"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-[#c81e32] shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-zinc-400">1. Traffic Akquise</div>
                    <div className="text-sm font-semibold text-white truncate">Google Ads &amp; Instagram Kampagnen</div>
                  </div>
                  <span className="text-xs font-mono text-[#c81e32] font-semibold shrink-0">3.4x ROAS</span>
                </motion.div>

                {/* Step 2: Conversion Engine */}
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 transition-colors hover:border-[#c81e32]/40"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-zinc-400">2. Konvertierung</div>
                    <div className="text-sm font-semibold text-white truncate">Shopify Store &amp; High-Speed UX</div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-semibold shrink-0">&lt; 1.0s Speed</span>
                </motion.div>

                {/* Step 3: Google AI Studio CRM */}
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-[#c81e32]/10 border border-[#c81e32]/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#c81e32] flex items-center justify-center text-white shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-zinc-300">3. Automation &amp; CRM</div>
                    <div className="text-sm font-semibold text-white truncate">Google AI Studio &amp; HubSpot / Klaviyo</div>
                  </div>
                  <span className="text-xs font-mono text-white font-semibold shrink-0">Auto-Sync</span>
                </motion.div>
              </div>

              {/* Bottom Result Highlight */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#c81e32]" />
                  <span>Automatische Bestell- &amp; Lead-Verarbeitung</span>
                </span>
                <span className="text-zinc-200 font-semibold">24/7 aktiv</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 4-Column Proof & KPI Strip Below Hero Split (Claim-to-Proof Adjacency) */}
        <div className="mt-16 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <div className="text-3xl sm:text-4xl font-bold font-display text-white tabular-nums tracking-tight">
              +185<span className="text-[#c81e32]">%</span>
            </div>
            <div className="text-xs text-zinc-400 mt-1 uppercase tracking-wider">Ø Mehr Umsatz bei E-Commerce</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold font-display text-white tabular-nums tracking-tight">
              3.4<span className="text-[#c81e32]">x</span>
            </div>
            <div className="text-xs text-zinc-400 mt-1 uppercase tracking-wider">Durchschnittlicher ROAS bei Ads</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold font-display text-white tabular-nums tracking-tight">
              &lt; 1.2<span className="text-[#c81e32]">s</span>
            </div>
            <div className="text-xs text-zinc-400 mt-1 uppercase tracking-wider">Ladezeit auf mobilen Endgeräten</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold font-display text-white tabular-nums tracking-tight">
              Köln <span className="text-[#c81e32]">NRW</span>
            </div>
            <div className="text-xs text-zinc-400 mt-1 uppercase tracking-wider">Lokale Betreuung &amp; Vor-Ort Termine</div>
          </div>
        </div>
      </div>
    </section>
  );
};
