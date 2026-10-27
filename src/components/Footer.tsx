import React, { useState } from 'react';
import { CONTACT_EMAIL, CONTACT_PHONE, LOCATION_CITY } from '../data/content';
import { X } from 'lucide-react';
import { MilkyBossLogo } from './MilkyBossLogo';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const [legalModal, setLegalModal] = useState<'imprint' | 'privacy' | null>(null);
  const { dict, language } = useLanguage();
  const f = dict.footer;

  return (
    <footer className="bg-[#07080c] border-t border-white/10 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <a href="#" className="inline-flex items-center group" aria-label="Milky BOSS Agency Home">
              <MilkyBossLogo size="md" />
            </a>
            <p className="text-zinc-400 max-w-sm leading-relaxed">
              {f.desc}
            </p>
            <div className="text-zinc-400">
              {language === 'de' ? 'Standort:' : 'Location:'} MediaPark / Ehrenfeld, 50672 {LOCATION_CITY}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-white font-semibold uppercase tracking-wider text-[11px]">
              {f.services_title}
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Shopify E-Commerce Stores
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  High-Converting Landingpages
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  KMU Corporate Websites
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Google &amp; Meta Ads (ROAS)
                </a>
              </li>
              <li>
                <a href="#automation" className="hover:text-white transition-colors">
                  Google AI Studio &amp; CRM Flow
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation & Contact */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-white font-semibold uppercase tracking-wider text-[11px]">
              {language === 'de' ? 'Direkter Kontakt' : 'Direct Contact'}
            </div>
            <div className="space-y-2 text-zinc-300">
              <div>
                {language === 'de' ? 'E-Mail:' : 'Email:'}{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-white hover:underline">
                  {CONTACT_EMAIL}
                </a>
              </div>
              <div>
                {language === 'de' ? 'Telefon:' : 'Phone:'}{' '}
                <a href={`tel:${CONTACT_PHONE.replace(/\s+/g, '')}`} className="text-white hover:underline">
                  {CONTACT_PHONE}
                </a>
              </div>
              <div className="text-zinc-400 text-[11px] pt-1">
                {language === 'de'
                  ? 'Kostenlose Erstberatung (ca. 20 Min. per Telefon oder Google Meet)'
                  : 'Free discovery consultation (approx. 20 min via Phone or Google Meet)'}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-zinc-400 text-[11px]">
            &copy; {new Date().getFullYear()} Milky BOSS Agency. {f.rights}
          </div>
          <div className="flex items-center gap-6 text-[11px]">
            <button
              onClick={() => setLegalModal('imprint')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {f.imprint}
            </button>
            <button
              onClick={() => setLegalModal('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {f.privacy}
            </button>
            <a href="#services" className="hover:text-white transition-colors">
              {language === 'de' ? 'Nach oben ↑' : 'Back to top ↑'}
            </a>
          </div>
        </div>
      </div>

      {/* Legal Modal */}
      {legalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-[#11141c] border border-white/10 rounded-2xl p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white font-display">
                {legalModal === 'imprint' ? (language === 'de' ? 'Impressum (§ 5 DDG)' : 'Imprint / Legal Notice') : (language === 'de' ? 'Datenschutzerklärung' : 'Privacy Policy')}
              </h3>
              <button
                onClick={() => setLegalModal(null)}
                className="p-1 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 text-xs text-zinc-300 space-y-4 leading-relaxed">
              {legalModal === 'imprint' ? (
                <>
                  <p>
                    <strong>{language === 'de' ? 'Angaben gemäß § 5 DDG:' : 'Information according to German Telemedia Act (§ 5 DDG):'}</strong><br />
                    Milky BOSS Agency<br />
                    Webentwicklung &amp; E-Commerce Dienstleistungen<br />
                    MediaPark / Ehrenfeld<br />
                    50672 Köln, Deutschland
                  </p>
                  <p>
                    <strong>{language === 'de' ? 'Kontakt:' : 'Contact:'}</strong><br />
                    Telefon: {CONTACT_PHONE}<br />
                    E-Mail: {CONTACT_EMAIL}
                  </p>
                  <p>
                    <strong>Verantwortlich für den Inhalt:</strong><br />
                    Milky BOSS Agency Lead Developer &amp; Marketing Strategist<br />
                    Köln, Deutschland
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>Datenschutz auf einen Blick:</strong><br />
                    Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Personenbezogene Daten, die Sie über das Kontaktformular übermitteln, werden vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften (DSGVO) sowie dieser Datenschutzerklärung behandelt.
                  </p>
                  <p>
                    <strong>Datenerfassung auf dieser Website:</strong><br />
                    Die Datenerfassung auf dieser Website erfolgt durch den Websitebetreiber. Ihre Daten werden zum Zweck der Kontaktaufnahme und Angebotserstellung verarbeitet und niemals unbefugt an Dritte weitergegeben.
                  </p>
                  <p>
                    <strong>Ihre Rechte:</strong><br />
                    Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung oder Löschung dieser Daten.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
