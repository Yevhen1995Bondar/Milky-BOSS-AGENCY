import React, { useState, useId } from 'react';
import { calculateConversionUplift } from '../utils/pricing';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface InteractiveRoiCalculatorProps {
  onApplyCalculation: (estimatedRevenue: number) => void;
}

export const InteractiveRoiCalculator: React.FC<InteractiveRoiCalculatorProps> = ({
  onApplyCalculation,
}) => {
  const visitorsId = useId();
  const crId = useId();
  const aovId = useId();
  const liftId = useId();
  const { language, dict } = useLanguage();

  const [visitors, setVisitors] = useState<number>(5000);
  const [conversionRate, setConversionRate] = useState<number>(1.5);
  const [aov, setAov] = useState<number>(75);
  const [lift, setLift] = useState<number>(40);

  const results = calculateConversionUplift({
    monthlyVisitors: visitors,
    conversionRate,
    averageOrderValue: aov,
    targetLiftPercent: lift,
  });

  const locale = language === 'de' ? 'de-DE' : 'en-US';

  return (
    <section id="roi-calculator" className="py-20 bg-[#0c0e15] border-y border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Explanatory Copy */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#c81e32]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{dict.calculator.tag}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
              {dict.calculator.heading}
            </h2>
            <p className="text-zinc-300 text-base leading-relaxed">
              {dict.calculator.subtext}
            </p>

            <div className="pt-2 text-xs text-zinc-400 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c81e32]" />
                <span>
                  {language === 'de'
                    ? 'Schnellere Shopify Ladezeiten reduzieren Abbrüche'
                    : 'Sub-second Shopify speeds directly eliminate bounce rates'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c81e32]" />
                <span>
                  {language === 'de'
                    ? 'Gezielte Instagram & Google Ads senken Streuverluste'
                    : 'Targeted Instagram & Google Ads pinpoint high-intent buyers'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c81e32]" />
                <span>
                  {language === 'de'
                    ? 'Automatisierte CRM E-Mails holen verlassene Warenkörbe zurück'
                    : 'Automated CRM flows recover abandoned checkouts 24/7'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Interactive Simulator Card */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-[#11141c] p-6 sm:p-8 shadow-xl space-y-6">
              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Visitors Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <label htmlFor={visitorsId} className="text-zinc-300 font-medium">
                      {dict.calculator.monthly_visitors}:
                    </label>
                    <span className="font-mono text-white font-bold">{visitors.toLocaleString(locale)}</span>
                  </div>
                  <input
                    id={visitorsId}
                    type="range"
                    min="1000"
                    max="50000"
                    step="1000"
                    value={visitors}
                    onChange={(e) => setVisitors(Number(e.target.value))}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#c81e32]"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>1.000</span>
                    <span>50.000</span>
                  </div>
                </div>

                {/* Conversion Rate Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <label htmlFor={crId} className="text-zinc-300 font-medium">
                      {dict.calculator.current_cr}:
                    </label>
                    <span className="font-mono text-white font-bold">{conversionRate.toFixed(1)} %</span>
                  </div>
                  <input
                    id={crId}
                    type="range"
                    min="0.5"
                    max="5.0"
                    step="0.1"
                    value={conversionRate}
                    onChange={(e) => setConversionRate(Number(e.target.value))}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#c81e32]"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>0.5%</span>
                    <span>5.0%</span>
                  </div>
                </div>

                {/* Average Order Value (AOV) */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <label htmlFor={aovId} className="text-zinc-300 font-medium">
                      {dict.calculator.avg_order_value}:
                    </label>
                    <span className="font-mono text-white font-bold">{aov} €</span>
                  </div>
                  <input
                    id={aovId}
                    type="range"
                    min="20"
                    max="500"
                    step="5"
                    value={aov}
                    onChange={(e) => setAov(Number(e.target.value))}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#c81e32]"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>20 €</span>
                    <span>500 €</span>
                  </div>
                </div>

                {/* Expected Lift Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <label htmlFor={liftId} className="text-zinc-300 font-medium">
                      {language === 'de' ? 'Erwartete Optimierung:' : 'Target CRO Lift:'}
                    </label>
                    <span className="font-mono text-[#c81e32] font-bold">+{lift} % Uplift</span>
                  </div>
                  <input
                    id={liftId}
                    type="range"
                    min="15"
                    max="100"
                    step="5"
                    value={lift}
                    onChange={(e) => setLift(Number(e.target.value))}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#c81e32]"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>+15%</span>
                    <span>+100%</span>
                  </div>
                </div>
              </div>

              {/* Live Calculated Metric Spotlight */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-[#161b26] to-[#12151e] border border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
                  <div>
                    <div className="text-[11px] text-zinc-400 uppercase tracking-wider">
                      {language === 'de' ? 'Neue Conversion Rate' : 'Target Conversion Rate'}
                    </div>
                    <div className="text-xl font-bold text-white font-display mt-0.5 tabular-nums">
                      {results.projectedConversionRate}%
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      {language === 'de' ? `vorher ${conversionRate.toFixed(1)}%` : `baseline ${conversionRate.toFixed(1)}%`}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-zinc-400 uppercase tracking-wider">
                      {language === 'de' ? 'Zusätzlicher Monatsumsatz' : 'Monthly Extra Revenue'}
                    </div>
                    <div className="text-xl font-bold text-emerald-400 font-display mt-0.5 tabular-nums">
                      +{results.monthlyExtraRevenue.toLocaleString(locale)} €
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      {language === 'de' ? 'pro Monat' : 'per month'}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-[#c81e32] font-semibold uppercase tracking-wider">
                      {language === 'de' ? 'Prognose pro Jahr' : 'Annual Run-Rate Gain'}
                    </div>
                    <div className="text-2xl font-bold text-white font-display mt-0.5 tabular-nums">
                      +{results.annualExtraRevenue.toLocaleString(locale)} €
                    </div>
                    <div className="text-[10px] text-emerald-400 font-medium">
                      {language === 'de' ? 'Möglicher Mehrertrag' : 'Projected growth'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <span className="text-xs text-zinc-400 text-center sm:text-left">
                  {language === 'de'
                    ? 'Berechnung basiert auf realen Benchmarks unserer Kölner E-Commerce Projekte.'
                    : 'Calculated using empirical benchmarks from our Cologne e-commerce deployments.'}
                </span>
                <button
                  onClick={() => onApplyCalculation(results.annualExtraRevenue)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#c81e32] hover:bg-[#b01829] rounded-md transition-colors shrink-0 cursor-pointer"
                >
                  <span>{dict.calculator.apply_cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
