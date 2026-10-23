import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bot, ShoppingBag, Database, Zap, ArrowRight, CheckCircle2, Cpu } from 'lucide-react';

export const WorkflowSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'crm' | 'shopify' | 'ai'>('crm');

  return (
    <section id="automation" className="py-24 bg-[#090a0f] relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#c81e32]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#c81e32]">
            System-Architektur &amp; Effizienz
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mt-2 tracking-tight">
            Shopify &amp; Google AI Studio: Die smarte Symbiose.
          </h2>
          <p className="text-zinc-400 mt-3 text-base sm:text-lg leading-relaxed">
            Verbinden Sie modernen E-Commerce mit künstlicher Intelligenz. Wir integrieren Google AI Studio direkt in Ihre Vertriebs- und CRM-Prozesse, um Bestellungen, Kundenanfragen und Follow-ups vollautomatisch abzuwickeln.
          </p>
        </div>

        {/* Feature Interactive Showcase */}
        <div className="mt-14 rounded-2xl border border-white/10 bg-[#11141c] p-6 sm:p-10">
          {/* Top Switcher */}
          <div className="flex flex-wrap gap-2 border-b border-white/10 pb-6">
            <button
              onClick={() => setActiveTab('crm')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'crm'
                  ? 'bg-[#c81e32] text-white'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>CRM &amp; Lead-Pipeline</span>
            </button>

            <button
              onClick={() => setActiveTab('shopify')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'shopify'
                  ? 'bg-[#c81e32] text-white'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shopify Bestell-Automation</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'ai'
                  ? 'bg-[#c81e32] text-white'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Google AI Studio Triage</span>
            </button>
          </div>

          {/* Workflow Interactive Grid */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-xl bg-[#141824] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-zinc-300">
                  Schritt 01
                </span>
                <Zap className="w-4 h-4 text-[#c81e32]" />
              </div>
              <h4 className="text-lg font-bold text-white font-display">
                Erfassung &amp; Routing
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Kunde bestellt auf Shopify oder füllt Anfrageformular auf der Landingpage aus. Daten werden validiert und in Echtzeit per Webhook weitergeleitet.
              </p>
              <div className="pt-2 text-xs font-mono text-zinc-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Reaktionszeit &lt; 200ms</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-xl bg-[#141824] border border-[#c81e32]/30 space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#c81e32]/20 text-[#c81e32] font-semibold">
                  Schritt 02 · AI Core
                </span>
                <Cpu className="w-4 h-4 text-[#c81e32]" />
              </div>
              <h4 className="text-lg font-bold text-white font-display">
                Google AI Studio Analyse
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Das Modell klassifiziert Anfragen nach Dringlichkeit, Budget und Produktkategorie. Es generiert personalisierte Antwortentwürfe oder Rabatt-Anreize für den Checkout.
              </p>
              <div className="pt-2 text-xs font-mono text-[#c81e32] flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5" />
                <span>Intelligente Vor-Qualifizierung</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-xl bg-[#141824] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-zinc-300">
                  Schritt 03
                </span>
                <Database className="w-4 h-4 text-emerald-400" />
              </div>
              <h4 className="text-lg font-bold text-white font-display">
                CRM &amp; Fulfillment Sync
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Automatische Anlage des Kontakts in HubSpot, Klaviyo oder Pipedrive. Bestätigungen per WhatsApp oder SMS und direkte Übergabe an das Versandlager.
              </p>
              <div className="pt-2 text-xs font-mono text-zinc-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>0 Minuten manueller Aufwand</span>
              </div>
            </div>
          </div>

          {/* Bottom Benefit Banner */}
          <div className="mt-8 p-5 rounded-xl bg-gradient-to-r from-red-950/20 via-[#181c26] to-[#141824] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#c81e32]/20 text-[#c81e32] flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="text-sm">
                <span className="font-semibold text-white">Unterstützte Systeme: </span>
                <span className="text-zinc-400">Shopify Flow, Google AI Studio, HubSpot, Klaviyo, Pipedrive, Zapier &amp; Make.</span>
              </div>
            </div>
            <a
              href="#pricing"
              className="text-xs font-semibold text-zinc-200 hover:text-white underline underline-offset-4 shrink-0"
            >
              Zu den Tarifen &amp; Kosten →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
