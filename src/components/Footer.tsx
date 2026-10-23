import React, { useState } from 'react';
import { CONTACT_EMAIL, CONTACT_PHONE, LOCATION_CITY } from '../data/content';
import { ArrowUpRight, X } from 'lucide-react';
import { MilkyBossLogo } from './MilkyBossLogo';

export const Footer: React.FC = () => {
  const [legalModal, setLegalModal] = useState<'imprint' | 'privacy' | null>(null);

  return (
    <footer className="bg-[#07080c] border-t border-white/10 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <a href="#" className="inline-flex items-center" aria-label="Milky BOSS Agency Home">
              <MilkyBossLogo size="sm" />
            </a>
            <p className="text-zinc-400 max-w-sm leading-relaxed">
              Spezialisierte Webentwicklung &amp; Performance-Marketing in Köln. Wir bauen verkaufsstarke Shopify-Shops, Landingpages und KI-gestützte CRM-Systeme für den deutschen Mittelstand.
            </p>
            <div className="text-zinc-400">
              Standort: MediaPark / Ehrenfeld, 50672 {LOCATION_CITY}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-white font-semibold uppercase tracking-wider text-[11px]">
              Dienstleistungen
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
              Direkter Kontakt
            </div>
            <div className="space-y-2 text-zinc-300">
              <div>
                E-Mail:{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-white hover:underline">
                  {CONTACT_EMAIL}
                </a>
              </div>
              <div>
                Telefon:{' '}
                <a href={`tel:${CONTACT_PHONE.replace(/\s+/g, '')}`} className="text-white hover:underline">
                  {CONTACT_PHONE}
                </a>
              </div>
              <div className="text-zinc-400 text-[11px] pt-1">
                Kostenlose Erstberatung (ca. 20 Min. per Telefon oder Google Meet)
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-zinc-400 text-[11px]">
            &copy; {new Date().getFullYear()} Milky BOSS Agency. Alle Rechte vorbehalten. Entwickelt in Köln.
          </div>
          <div className="flex items-center gap-6 text-[11px]">
            <button
              onClick={() => setLegalModal('imprint')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Impressum
            </button>
            <button
              onClick={() => setLegalModal('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Datenschutz
            </button>
            <a href="#services" className="hover:text-white transition-colors">
              Nach oben ↑
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
                {legalModal === 'imprint' ? 'Impressum (§ 5 DDG)' : 'Datenschutzerklärung'}
              </h3>
              <button
                onClick={() => setLegalModal(null)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 text-xs text-zinc-300 space-y-4 leading-relaxed">
              {legalModal === 'imprint' ? (
                <>
                  <p>
                    <strong>Angaben gemäß § 5 DDG:</strong><br />
                    Milky BOSS Agency<br />
                    Webentwicklung &amp; E-Commerce Dienstleistungen<br />
                    MediaPark / Ehrenfeld<br />
                    50672 Köln, Deutschland
                  </p>
                  <p>
                    <strong>Kontakt:</strong><br />
                    Telefon: {CONTACT_PHONE}<br />
                    E-Mail: {CONTACT_EMAIL}
                  </p>
                  <p>
                    <strong>Umsatzsteuer:</strong><br />
                    Umsatzsteuer-Identifikationsnummer gemäß § 27 a UStG: DE349812745
                  </p>
                  <p>
                    <strong>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:</strong><br />
                    Milky BOSS Agency, MediaPark, 50672 Köln
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>1. Datenschutz auf einen Blick</strong><br />
                    Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften (DSGVO) sowie dieser Datenschutzerklärung.
                  </p>
                  <p>
                    <strong>2. Datenerfassung auf dieser Website</strong><br />
                    Die Datenerfassung auf dieser Website erfolgt ausschließlich zur Bearbeitung von Projektanfragen über das Kontaktformular. Eine Weitergabe an unberechtigte Dritte findet zu keinem Zeitpunkt statt.
                  </p>
                  <p>
                    <strong>3. Ihre Rechte</strong><br />
                    Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung oder Löschung dieser Daten.
                  </p>
                </>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-right">
              <button
                onClick={() => setLegalModal(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md text-xs font-semibold cursor-pointer"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
