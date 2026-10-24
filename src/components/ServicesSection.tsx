import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Target, BarChart3, Bot, Check, ArrowRight, Megaphone, Share2, Compass } from 'lucide-react';
import { ServiceItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ServicesSectionProps {
  onSelectService: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const { services, dict, language } = useLanguage();
  const [activeServiceId, setActiveServiceId] = useState<string>(services[0].id);

  const activeService = services.find((s) => s.id === activeServiceId) || services[0];

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
            {dict.services_section.tag}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mt-2 tracking-tight">
            {dict.services_section.heading}
          </h2>
          <p className="text-zinc-400 mt-4 text-base sm:text-lg leading-relaxed">
            {dict.services_section.subtext}
          </p>
        </div>

        {/* Interactive Service Switcher & Bento Presentation */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Service Selector Tabs */}
          <div className="lg:col-span-5 space-y-3">
            {services.map((service: ServiceItem) => {
              const isActive = service.id === activeServiceId;
              return (
                <button
                  key={service.id}
                  onClick={() => setActiveServiceId(service.id)}
                  className={`w-full text-left p-5 rounded-xl border transition-all duration-200 flex items-start gap-4 cursor-pointer relative overflow-hidden ${
                    isActive
                      ? 'bg-white/[0.07] border-[#c81e32] shadow-lg shadow-[#c81e32]/10'
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#c81e32]" />
                  )}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[#c81e32] text-white shadow-md'
                        : 'bg-white/5 text-zinc-400'
                    }`}
                  >
                    {getServiceIcon(service.id)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-zinc-400">
                        {service.number}
                      </span>
                    </div>
                    <div
                      className={`text-base font-semibold mt-1 transition-colors ${
                        isActive ? 'text-white' : 'text-zinc-200'
                      }`}
                    >
                      {service.title}
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {service.shortDescription}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Deep-Dive Card */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService.id + language}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="rounded-2xl border border-white/10 bg-[#11141c] p-7 sm:p-9 shadow-2xl relative"
              >
                {/* Metric Highlight Header */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c81e32]/10 border border-[#c81e32]/30 text-xs font-semibold text-[#ff3852] mb-6">
                  <span>●</span>
                  <span>{activeService.metricsHighlight}</span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-display text-white mb-4">
                    {activeService.title}
                  </h3>
                  <p className="text-zinc-300 leading-relaxed text-base">
                    {activeService.fullDescription}
                  </p>
                </div>

                {/* Deliverables */}
                <div className="mt-8">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    {dict.services_section.deliverables_label}
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
                    <div className="text-xs text-zinc-400 font-medium">
                      {language === 'de' ? 'Technologien:' : 'Technologies:'}
                    </div>
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
                    <span>{dict.services_section.details_cta}</span>
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
