import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SERVICES } from '../data/content';
import { ShoppingBag, Target, Globe, BarChart3, Bot, Check, ArrowRight, Megaphone, Share2, Compass } from 'lucide-react';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  onSelectService: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const [activeServiceId, setActiveServiceId] = useState<string>(SERVICES[0].id);

  const activeService = SERVICES.find((s) => s.id === activeServiceId) || SERVICES[0];

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'shopify':
        return <ShoppingBag className="w-5 h-5" />;
      case 'landingpage':
        return <Target className="w-5 h-5" />;
      case 'meta-ads':
        return <Megaphone className="w-5 h-5" />;
      case 'social-audit':
        return <Share2 className="w-5 h-5" />;
      case 'strategic-analysis':
        return <Compass className="w-5 h-5" />;
      case 'crm-ai':
        return <Bot className="w-5 h-5" />;
      default:
        return <BarChart3 className="w-5 h-5" />;
    }
  };

  return (
    <section id="services" className="py-24 bg-[#090a0f] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#c81e32]">
            Leistungsspektrum
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mt-2 tracking-tight">
            Gezielte Web-Lösungen für spürbaren Verkaufserfolg.
          </h2>
          <p className="text-zinc-400 mt-4 text-base sm:text-lg leading-relaxed">
            Keine Standard-Websites von der Stange: Wir verbinden moderne Shop- und Webarchitektur mit messbarem Performance-Marketing und KI-gestützter Prozess-Automatisierung für Kölner und bundesweite Unternehmen.
          </p>
        </div>

        {/* Interactive Service Switcher & Bento Presentation */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Service Selector Tabs */}
          <div className="lg:col-span-5 space-y-3">
            {SERVICES.map((service: ServiceItem) => {
              const isActive = service.id === activeServiceId;
              return (
                <button
                  key={service.id}
                  onClick={() => setActiveServiceId(service.id)}
                  className={`w-full text-left p-5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 ${
                    isActive
                      ? 'bg-[#151923] border-[#c81e32] shadow-lg shadow-[#c81e32]/10'
                      : 'bg-[#10131b]/60 border-white/5 hover:border-white/15 hover:bg-[#131720]'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? 'bg-[#c81e32] text-white'
                          : 'bg-white/5 text-zinc-400'
                      }`}
                    >
                      {getServiceIcon(service.id)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-mono text-zinc-400">{service.number}. Service</div>
                      <div className="text-base font-semibold text-white truncate mt-0.5">
                        {service.title}
                      </div>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-[#c81e32] translate-x-1' : 'text-zinc-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Active Service Spotlight */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-white/10 bg-[#11141c] p-7 sm:p-8 relative overflow-hidden"
              >
                {/* Subtle top indicator */}
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#c81e32]/20 text-[#c81e32] font-semibold">
                      {activeService.number}
                    </span>
                    <span className="text-xs text-zinc-400 font-medium">Fokus &amp; Mehrwert</span>
                  </div>
                  <div className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded">
                    {activeService.metricsHighlight}
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <h3 className="text-2xl font-bold font-display text-white">
                    {activeService.title}
                  </h3>
                  <p className="text-zinc-300 leading-relaxed text-base">
                    {activeService.fullDescription}
                  </p>
                </div>

                {/* Deliverables */}
                <div className="mt-8">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Was in diesem Leistungspaket enthalten ist:
                  </h4>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeService.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-sm text-zinc-200">
                        <Check className="w-4 h-4 text-[#c81e32] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack & Target audience */}
                <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-zinc-400 font-medium">Technologien:</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {activeService.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectService(activeService.title)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#c81e32] hover:bg-[#b01829] rounded-md transition-all shrink-0 cursor-pointer"
                  >
                    <span>Dieses Paket anfragen</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
