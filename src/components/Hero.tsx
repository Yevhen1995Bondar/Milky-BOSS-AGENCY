import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShoppingBag, Bot, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { HeroParticleBackground } from './HeroParticleBackground';
import { useLanguage } from '../context/LanguageContext';
import { EditableText } from './EditableText';

interface HeroProps {
  onOpenContact: () => void;
  onScrollToPricing: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenContact, onScrollToPricing }) => {
  const { dict, language } = useLanguage();
  const h = dict.hero;

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
              <EditableText
                contentKey="hero.kicker_service"
                defaultValue={h.kicker_service}
                label="Hero надзаголовок (услуга)"
              />
              <span className="text-zinc-600">·</span>
              <EditableText
                contentKey="hero.kicker_location"
                defaultValue={h.kicker_location}
                label="Hero надзаголовок (локация)"
                className="text-zinc-300"
              />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display leading-[1.1] text-balance">
              <EditableText
                contentKey="hero.title_part1"
                defaultValue={h.title_part1}
                label="Заголовок Hero (часть 1)"
              />
              <span className="bg-gradient-to-r from-white via-zinc-200 to-[#e11d48] bg-clip-text text-transparent">
                <EditableText
                  contentKey="hero.title_highlight"
                  defaultValue={h.title_highlight}
                  label="Заголовок Hero (акцент)"
                />
              </span>
              <EditableText
                contentKey="hero.title_part2"
                defaultValue={h.title_part2}
                label="Заголовок Hero (часть 2)"
              />
            </h1>

            <EditableText
              as="p"
              contentKey="hero.subtext"
              defaultValue={h.subtext}
              multiline
              label="Подзаголовок Hero"
              className="text-lg sm:text-xl text-zinc-300 max-w-2xl font-normal leading-relaxed block"
            />

            {/* Core Capability Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-zinc-300">
              {h.checkpoints.map((cp, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#c81e32] shrink-0" />
                  <EditableText
                    contentKey={`hero.checkpoint.${idx}`}
                    defaultValue={cp}
                    label={`Hero преимущество ${idx + 1}`}
                  />
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                onClick={onOpenContact}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#c81e32] hover:bg-[#b01829] rounded-md transition-all shadow-lg shadow-[#c81e32]/20 hover:shadow-[#c81e32]/40 cursor-pointer"
              >
                <EditableText
                  contentKey="hero.cta_primary"
                  defaultValue={h.cta_primary}
                  label="Главная кнопка Hero"
                />
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onScrollToPricing}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium text-zinc-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-all cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-[#c81e32]" />
                <EditableText
                  contentKey="hero.cta_secondary"
                  defaultValue={h.cta_secondary}
                  label="Вторая кнопка Hero"
                />
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
                  <EditableText
                    contentKey="hero.growth_engine_badge"
                    defaultValue={h.growth_engine_badge}
                    label="Заголовок карточки роста"
                    className="text-xs font-semibold tracking-wider uppercase text-zinc-300"
                  />
                </div>
                <EditableText
                  contentKey="hero.growth_engine_sub"
                  defaultValue={h.growth_engine_sub}
                  label="Подзаголовок карточки роста"
                  className="text-xs font-mono text-zinc-400"
                />
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
                    <EditableText
                      as="div"
                      contentKey="hero.step1_title"
                      defaultValue={h.step1_title}
                      label="Карточка Hero шаг 1 заголовок"
                      className="text-xs text-zinc-400"
                    />
                    <EditableText
                      as="div"
                      contentKey="hero.step1_desc"
                      defaultValue={h.step1_desc}
                      label="Карточка Hero шаг 1 текст"
                      className="text-sm font-semibold text-white truncate"
                    />
                  </div>
                  <EditableText
                    contentKey="hero.step1_badge"
                    defaultValue={h.step1_badge}
                    label="Карточка Hero шаг 1 метрика"
                    className="text-xs font-mono text-[#c81e32] font-semibold shrink-0"
                  />
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
                    <EditableText
                      as="div"
                      contentKey="hero.step2_title"
                      defaultValue={h.step2_title}
                      label="Карточка Hero шаг 2 заголовок"
                      className="text-xs text-zinc-400"
                    />
                    <EditableText
                      as="div"
                      contentKey="hero.step2_desc"
                      defaultValue={h.step2_desc}
                      label="Карточка Hero шаг 2 текст"
                      className="text-sm font-semibold text-white truncate"
                    />
                  </div>
                  <EditableText
                    contentKey="hero.step2_badge"
                    defaultValue={h.step2_badge}
                    label="Карточка Hero шаг 2 метрика"
                    className="text-xs font-mono text-emerald-400 font-semibold shrink-0"
                  />
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
                    <EditableText
                      as="div"
                      contentKey="hero.step3_title"
                      defaultValue={h.step3_title}
                      label="Карточка Hero шаг 3 заголовок"
                      className="text-xs text-zinc-300"
                    />
                    <EditableText
                      as="div"
                      contentKey="hero.step3_desc"
                      defaultValue={h.step3_desc}
                      label="Карточка Hero шаг 3 текст"
                      className="text-sm font-semibold text-white truncate"
                    />
                  </div>
                  <EditableText
                    contentKey="hero.step3_badge"
                    defaultValue={h.step3_badge}
                    label="Карточка Hero шаг 3 метрика"
                    className="text-xs font-mono text-white font-semibold shrink-0"
                  />
                </motion.div>
              </div>

              {/* Bottom Result Highlight */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#c81e32]" />
                  <EditableText
                    contentKey="hero.flow_footer_left"
                    defaultValue={h.flow_footer_left}
                    label="Подпись карточки роста (слева)"
                  />
                </span>
                <EditableText
                  contentKey="hero.flow_footer_right"
                  defaultValue={h.flow_footer_right}
                  label="Подпись карточки роста (справа)"
                  className="text-zinc-200 font-semibold"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* 4-Column Proof & KPI Strip Below Hero Split */}
        <div className="mt-16 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <div className="text-3xl sm:text-4xl font-bold font-display text-white tabular-nums tracking-tight">
              <EditableText contentKey="hero.kpi1_val" defaultValue="+185%" shared label="KPI 1 значение" />
            </div>
            <EditableText
              as="div"
              contentKey="hero.kpi1_label"
              defaultValue={language === 'de' ? 'Ø Mehr Umsatz bei E-Commerce' : 'Avg. E-Commerce Growth'}
              label="KPI 1 подпись"
              className="text-xs text-zinc-400 mt-1 uppercase tracking-wider"
            />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold font-display text-white tabular-nums tracking-tight">
              <EditableText contentKey="hero.kpi2_val" defaultValue="3.4x" shared label="KPI 2 значение" />
            </div>
            <EditableText
              as="div"
              contentKey="hero.kpi2_label"
              defaultValue={language === 'de' ? 'Durchschnittlicher ROAS bei Ads' : 'Average Campaign ROAS'}
              label="KPI 2 подпись"
              className="text-xs text-zinc-400 mt-1 uppercase tracking-wider"
            />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold font-display text-white tabular-nums tracking-tight">
              <EditableText contentKey="hero.kpi3_val" defaultValue="< 1.2s" shared label="KPI 3 значение" />
            </div>
            <EditableText
              as="div"
              contentKey="hero.kpi3_label"
              defaultValue={language === 'de' ? 'Ladezeit auf mobilen Endgeräten' : 'Mobile Load Speed'}
              label="KPI 3 подпись"
              className="text-xs text-zinc-400 mt-1 uppercase tracking-wider"
            />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold font-display text-white tabular-nums tracking-tight">
              <EditableText contentKey="hero.kpi4_val" defaultValue="Köln NRW" shared label="KPI 4 значение" />
            </div>
            <EditableText
              as="div"
              contentKey="hero.kpi4_label"
              defaultValue={language === 'de' ? 'Lokale Betreuung & Termine' : 'Cologne HQ & Global Delivery'}
              label="KPI 4 подпись"
              className="text-xs text-zinc-400 mt-1 uppercase tracking-wider"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
