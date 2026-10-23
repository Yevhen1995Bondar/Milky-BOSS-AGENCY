import { ServiceItem, ProjectCaseStudy, PricingPlan } from '../types';

export const BRAND_NAME = 'Milky BOSS Agency';
export const BRAND_TAGLINE = 'Webentwicklung & E-Commerce Köln';
export const LOGO_PATH = '/assets/milkyboss-logo.svg';
export const CONTACT_EMAIL = 'teams@milkyboss.de';
export const CONTACT_PHONE = '+49 221 459 8820';
export const LOCATION_CITY = 'Köln, Deutschland';

export const SERVICES: ServiceItem[] = [
  {
    id: 'shopify',
    number: '01',
    title: 'Shopify Onlineshops & E-Commerce',
    shortDescription: 'Conversion-optimierte Onlineshops mit extrem schnellen Ladezeiten, individuellem Theme-Design und nahtlosem Checkout.',
    fullDescription: 'Von der Konzeption über die Liquid- & Headless-Entwicklung bis hin zur Zahlungsanbindung: Wir entwickeln skalierbare Shopify-Shops, die Besucher in treue Käufer verwandeln. Jeder Shop wird von Grund auf für maximale Conversion Rate und mobile Performance optimiert.',
    deliverables: [
      'Maßgeschneidertes Shopify OS 2.0 Theme',
      'Mobile-First Checkout & Express-Pay (Apple/Google Pay, Klarna, PayPal)',
      'Ladezeit < 1.2 Sekunden & Core Web Vitals Optimierung',
      'ERP- & Warenwirtschaft-Anbindung (Shopify Flow, Billbee, Xentral)',
    ],
    technologies: ['Shopify Liquid', 'Hydrogen / React', 'Tailwind CSS', 'Shopify Plus API'],
    metricsHighlight: '+185% durchschnittliche Umsatzsteigerung im 1. Halbjahr',
    idealFor: 'D2C Brands, Händler und etablierte KMU, die ihren Online-Umsatz nachhaltig skalieren wollen.',
  },
  {
    id: 'landingpage',
    number: '02',
    title: 'High-Converting Landingpages & KMU Websites',
    shortDescription: 'Fokussierte Zielseiten und moderne Unternehmensauftritte mit glasklarem Verkaufsfokus und hoher Lead-Quote.',
    fullDescription: 'Keine Ablenkung, maximaler Verkaufsdruck mit sympathischer Tonalität. Wir konzipieren und programmieren Landingpages nach wissenschaftlichen Verkaufspsychologie-Prinzipien, die aus bezahltem Werbetraffic das Maximum an qualifizierten Anfragen herausholen.',
    deliverables: [
      'Psychologisch strukturierter Aufbau nach AIDA & PAS-Framework',
      'A/B-Testing fähig & Heatmap-Tracking Integration',
      'Interaktive Formulare, Rechner & Calendly-Terminbuchung',
      'Optimiert für Google Quality Score & Meta Conversion API',
    ],
    technologies: ['React 19', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],
    metricsHighlight: 'Ø 7.2% Conversion Rate bei Kalt-Traffic',
    idealFor: 'Dienstleister, Berater, Ärzte & B2B-Unternehmen mit konkreten Lead-Gen Zielen.',
  },
  {
    id: 'meta-ads',
    number: '03',
    title: 'Meta Ads: Erstellung, Audit & Skalierung',
    shortDescription: 'Messbare Neukundengewinnung über Instagram & Facebook Werbekampagnen mit Ad-Audit und CAPI-Tracking.',
    fullDescription: 'Von Grund auf profitable Kampagnenarchitektur: Wir erstellen performante Instagram- & Facebook-Werbekampagnen, testen kreative Video-Hooks und führen umfassende Audits bestehender Werbekonten durch, um Budgetverschwendung sofort zu stoppen.',
    deliverables: [
      'Erstellung & Kampagnen-Setup für Instagram Feed, Reels & Facebook Ads',
      'Meta Ads Konto-Audit & Verschwendungs-Analyse (Ad Spend Effizienz)',
      'Meta Conversions API (CAPI) & Server-Side Tracking Setup',
      'A/B-Testing von Creatives, Werbetexten & Zielgruppen-Segmenten',
      'Wöchentliche Skalierungs-Strategie mit festem ROAS-Ziel',
    ],
    technologies: ['Meta Business Suite', 'Instagram Ads Manager', 'Conversions API', 'Creative Testing Engine'],
    metricsHighlight: 'Ø 3.8x Return on Ad Spend (ROAS)',
    idealFor: 'E-Commerce Brands & Dienstleister, die Werbebudgets ab 1.000 €/Monat profitabel skalieren wollen.',
  },
  {
    id: 'social-audit',
    number: '04',
    title: 'Instagram & TikTok Audit & Content-Plan',
    shortDescription: 'Tiefgehende Social-Media-Kanalanalysen, Wettbewerber-Screening und datenbasierte 30-Tage Content-Pläne.',
    fullDescription: 'Schluss mit planlosem Posten: Wir analysieren Ihre aktuellen Instagram- und TikTok-Profile sowie die Content-Strategien Ihrer stärksten Wettbewerber. Sie erhalten einen praxiserprobten Redaktionsplan mit konkreten Hook-Formeln, Skripten und Posting-Zeiten.',
    deliverables: [
      'Vollständiger Audit von Instagram- & TikTok-Profilen (Bio, Content-Mix, Engagement-Rate)',
      'Wettbewerbsanalyse & Content-Benchmarking der Top-Konkurrenten',
      'Strategischer 30-Tage Content-Plan mit Hooks, Skripten & Call-to-Actions',
      'Short-Form Video Guidelines (Reels & TikToks für organische Reichweite)',
      'DM-Automatisierungs-Konzepte zur direkten Lead-Gewinnung',
    ],
    technologies: ['Instagram Analytics', 'TikTok Creative Center', 'Content Matrix', 'Competitive Spy Tools'],
    metricsHighlight: '+320% Interaktions- & Profilaufruf-Steigerung',
    idealFor: 'Unternehmen und Marken, die über Social Media qualifizierte Leads und Käufer anziehen wollen.',
  },
  {
    id: 'strategic-analysis',
    number: '05',
    title: 'Strategische Analyse (SWOT, PESTEL & Lebenszyklus)',
    shortDescription: 'Fundierte Unternehmens- und Marktanalyse: SWOT-, PESTEL- und Lebenszyklus-Diagnose für strategisches Wachstum.',
    fullDescription: 'Nachhaltiger digitaler Erfolg erfordert ein solides strategisches Fundament. Wir durchleuchten Ihre Marktposition, Wettbewerber, interne Stärken und externe Makrotrends, um die optimale Skalierungsstrategie für Ihr Unternehmen zu definieren.',
    deliverables: [
      'Detaillierte Wettbewerber-Recherche & Marktlücken-Analyse',
      'SWOT-Analyse (Stärken, Schwächen, Chancen, Risiken)',
      'PESTEL-Analyse (Politisch, Ökonomisch, Soziokulturell, Technologisch, Ökologisch, Rechtlich)',
      'Analyse des Unternehmenslebenszyklus (Pionier-, Wachstums-, Reife- oder Wendephase)',
      'Priorisierter digitaler Maßnahmenkatalog mit klarem ROI-Fokus',
    ],
    technologies: ['SWOT Matrix', 'PESTEL Framework', 'Industry Benchmark Databases', 'Lifecycle Modeling'],
    metricsHighlight: 'Glasklare Differenzierung & strategischer Marktvorteil',
    idealFor: 'KMU-Geschäftsführer und Gründer vor Relaunch, Neupositionierung oder Marktexpansion.',
  },
  {
    id: 'crm-ai',
    number: '06',
    title: 'Google AI Studio & CRM-Automatisierung',
    shortDescription: 'Automatische Lead-Qualifizierung, CRM-Synchronisierung und intelligente Workflows für schnellere Auftragsabwicklung.',
    fullDescription: 'Schluss mit manuellem Copy-Paste von Kundendaten: Wir verknüpfen Ihre Website oder Ihren Shopify-Shop direkt mit CRM-Systemen (HubSpot, Pipedrive, Klaviyo) und implementieren Google AI Studio Assistenten zur intelligenten Vorqualifizierung von Kundenanfragen.',
    deliverables: [
      'Google AI Studio Workflow für intelligente E-Mail- & Anfrage-Triage',
      '2-Wege-Sync zu HubSpot, Pipedrive, Notion oder Salesforce',
      'Automatische E-Mail-Follow-up Sequenzen & Angebotsversand',
      'Echtzeit-Benachrichtigungen via Slack oder WhatsApp Business',
    ],
    technologies: ['Google AI Studio', 'Gemini API', 'HubSpot API', 'Shopify Flow', 'Webhooks'],
    metricsHighlight: 'Bis zu 14 Stunden manuelle Verwaltungszeit pro Woche eingespart',
    idealFor: 'Wachsende Teams, die Reaktionszeiten verkürzen und Abschlussquoten erhöhen möchten.',
  },
];

export const PROJECTS: ProjectCaseStudy[] = [
  {
    id: 'aether-co-shopify',
    title: 'Aether & Co. — Luxus Fashion D2C',
    client: 'Aether Lifestyle GmbH',
    location: 'Köln (Belgisches Viertel)',
    category: 'shopify',
    categoryLabel: 'Shopify Onlineshop',
    image: '/src/assets/images/case_study_shopify_store_1792780593787.jpg',
    overview: 'Kompletter Neuaufbau des Shopify-Stores für eine Kölner Premium-Modemarke mit Fokus auf minimalistische Ästhetik und mobile Checkout-Geschwindigkeit.',
    challenge: 'Der vorherige WooCommerce-Shop litt unter Ladezeiten von über 4,5 Sekunden und einer hohen Warenkorb-Abbruchquote von über 78% auf Smartphones.',
    solution: 'Entwicklung eines maßgeschneiderten Shopify OS 2.0 Themes mit Sub-Sekunden Ladezeiten, 1-Click Checkout, Klaviyo E-Mail Automatisierung und Instagram Shopping Feed Integration.',
    results: [
      { label: 'Umsatzwachstum', value: '+185%' },
      { label: 'Ladezeit Mobil', value: '0.9s' },
      { label: 'Warenkorb-Konversion', value: '+42%' },
      { label: 'Meta Ads ROAS', value: '3.8x' },
    ],
    techStack: ['Shopify OS 2.0', 'Liquid', 'Tailwind CSS', 'Klaviyo', 'Meta CAPI'],
    duration: '4 Wochen',
    year: '2026',
  },
  {
    id: 'aurora-clinic-landing',
    title: 'Aurora Clinic — Ästhetik & Fachzentrum',
    client: 'Privatpraxis Dr. med. M. Lindner',
    location: 'Köln (Hohenzollernring)',
    category: 'landingpage',
    categoryLabel: 'Performance Landingpage',
    image: '/src/assets/images/case_study_landing_clinic_1792780595812.jpg',
    overview: 'Konzeption und Programmierung einer hochkonvertierenden Buchungs-Landingpage für dermatologische und ästhetische Behandlungen mit direkter Kalendersynchronisation.',
    challenge: 'Hohe Klickkosten bei Google Ads, aber zu wenige qualifizierte Patientenanfragen über die bestehende statische Praxis-Website.',
    solution: 'Entwicklung einer fokussierten Landingpage mit interaktivem Behandlungsberater, Patienten-Reviews, DSGVO-konformer Online-Terminbuchung und Google Ads Search Kampagnen.',
    results: [
      { label: 'Erstberatungstermine', value: '+240%' },
      { label: 'Kosten pro Lead (CPL)', value: '-52%' },
      { label: 'Google Ads QS', value: '10/10' },
      { label: 'Abschlussquote', value: '68%' },
    ],
    techStack: ['React', 'TypeScript', 'Calendly API', 'Google Ads', 'Framer Motion'],
    duration: '2 Wochen',
    year: '2026',
  },
  {
    id: 'apex-connect-crm',
    title: 'Apex Dynamics — B2B Plattform & CRM',
    client: 'Apex Industrial Solutions KG',
    location: 'Köln & Düsseldorf',
    category: 'corporate',
    categoryLabel: 'Corporate Website & CRM',
    image: '/src/assets/images/case_study_b2b_platform_1792780596370.jpg',
    overview: 'Relaunch der mehrsprachigen B2B-Unternehmenswebsite mit intelligenter CRM-Pipeline und KI-gestützter Lead-Qualifizierung via Google AI Studio.',
    challenge: 'Vertrieb verbrachte wöchentlich 20+ Stunden mit der manuellen Erfassung und Sichtung unsortierter E-Mail-Anfragen von Industrie-Kunden.',
    solution: 'Entwicklung einer modernen Web-Präsenz mit integriertem interaktiven Konfigurator. Einbindung von Google AI Studio zur automatischen Klassifizierung von Ausschreibungsunterlagen und Sync mit HubSpot CRM.',
    results: [
      { label: 'Reaktionszeit Lead', value: 'von 24h auf 4 Min' },
      { label: 'B2B Lead-Steigerung', value: '+115%' },
      { label: 'Vertriebszeit gespart', value: '18h / Woche' },
      { label: 'Deal-Volumen', value: '2.4M €' },
    ],
    techStack: ['React', 'Google AI Studio', 'Gemini API', 'HubSpot CRM', 'Tailwind'],
    duration: '6 Wochen',
    year: '2026',
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'landingpage',
    name: 'Sprint Landingpage',
    subtitle: 'Für Kampagnen & gezielte Lead-Generierung',
    price: '1.850 €',
    deliveryTime: 'Lieferzeit: ca. 10–14 Werktage',
    features: [
      '1 maßgeschneiderte, hochkonvertierende Landingpage',
      'Psychologische Conversion-Struktur & Copywriting-Unterstützung',
      'Mobile-First Design (Performance Score 95+)',
      'Interaktives Anfrageformular oder Termin-Widget (Calendly)',
      'DSGVO-konformes Cookie-Banner & Google Tag Manager Setup',
      '1 Monat technische Gewährleistung inklusive',
    ],
    suitableFor: 'Ideal für Dienstleister, Berater und Produkteinführungen mit aktivem Werbebudget.',
  },
  {
    id: 'shopify',
    name: 'Shopify E-Commerce Pro',
    subtitle: 'Für Händler & D2C-Marken mit Wachstumsanspruch',
    price: '3.900 €',
    recommended: true,
    deliveryTime: 'Lieferzeit: ca. 3–4 Wochen',
    features: [
      'Komplettes, individuelles Shopify OS 2.0 Store-Design',
      'Conversion-optimierte Produkt- und Kategorieseiten',
      'Express Checkout (Apple Pay, Google Pay, Klarna, PayPal)',
      'Ladezeit < 1.2s für überlegene Mobile-Konversionsraten',
      'Anbindung von Zahlungsanbietern & Versanddienstleistern',
      'Klaviyo E-Mail Marketing Grundsetup (Welcome & Abandoned Cart)',
      'Basis CRM-Synchronisation & Produktdaten-Import',
    ],
    suitableFor: 'Ideal für neue Brands oder bestehende Händler, die von WooCommerce/Shopware migrieren wollen.',
  },
  {
    id: 'audit-strategy',
    name: 'Audit & Strategie Suite',
    subtitle: 'SWOT, PESTEL, Social Audit & Content-Plan',
    price: '1.450 €',
    deliveryTime: 'Lieferzeit: ca. 7–10 Werktage',
    features: [
      'Instagram & TikTok Kanal-Audit inkl. Konkurrenz-Benchmarking',
      'Vollständige SWOT- & PESTEL-Marktpotenzialanalyse',
      'Analyse des Unternehmenslebenszyklus & Skalierungs-Engpässe',
      'Strategischer 30-Tage Redaktions- & Content-Plan mit Hooks',
      'Meta Ads Werbekonto-Audit & Optimierungs-Roadmap',
      '90-minütiger Strategie-Workshop & Ergebnis-Präsentation',
    ],
    suitableFor: 'Ideal für Unternehmen, die vor Investitionen fundierte Klarheit und Marktvorteile wollen.',
  },
];

export const RETAINER_PLANS = [
  {
    id: 'ads-retainer',
    name: 'Meta & Google Ads Betreuung',
    price: 'ab 850 € / Monat',
    description: 'Erstellung und laufende Optimierung von Instagram, Facebook & Google Werbekampagnen, Creative-Tests und wöchentliches ROAS-Reporting.',
  },
  {
    id: 'social-retainer',
    name: 'Social Media & Content-Begleitung',
    price: 'ab 650 € / Monat',
    description: 'Monatlicher Instagram & TikTok Content-Plan, Skripterstellung für Reels/TikToks, Trend-Monitoring und monatlicher Performance-Check.',
  },
  {
    id: 'care-retainer',
    name: 'Wartung & Support Flat',
    price: '390 € / Monat',
    description: 'Regelmäßige Updates, monatliche Performance-Audits, Content-Pflege bis 4 Std./Monat und Notfall-Support binnen 4 Stunden.',
  },
];

export const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Analyse & Architektur',
    description: 'Wir analysieren Ihre Zielgruppe, bestehende Konversionsdaten und Wettbewerber in Köln/bundesweit. Wir definieren das klare Verkaufsziel und den Tech-Stack.',
  },
  {
    step: '02',
    title: 'Design & Prototyping',
    description: 'Entwicklung des maßgeschneiderten UI/UX Konzepts mit Fokus auf klare Führung des Besuchers, responsive Typografie und interaktive Markenerlebnisse.',
  },
  {
    step: '03',
    title: 'Code & CRM-Integration',
    description: 'Saubere, blitzschnelle Programmierung auf Shopify oder modernem React. Anbindung Ihrer CRM-Tools und Integration von Google AI Studio zur automatisierten Lead-Bearbeitung.',
  },
  {
    step: '04',
    title: 'Launch & Traffic Scaling',
    description: 'Umfassendes QA-Testing, Go-Live ohne Ausfallzeiten und Start zielgerichteter Google & Instagram Kampagnen zur sofortigen Neukundengewinnung.',
  },
];

export const FAQS = [
  {
    q: 'Bieten Sie auch persönliche Termine vor Ort in Köln an?',
    a: 'Ja, sehr gerne! Unser Standort ist in Köln. Für Projektbesprechungen, Konzeptionsworkshops oder Relaunch-Strategien treffen wir uns persönlich bei Ihnen im Unternehmen oder in zentralen Kölner Meeting-Locations (z. B. im MediaPark oder Belgischen Viertel), alternativ jederzeit per Videokonferenz.',
  },
  {
    q: 'Warum setzen Sie auf Shopify und Google AI Studio?',
    a: 'Shopify ist die weltweit stabilste und konversionsstärkste E-Commerce Plattform mit unübertroffener Checkout-Geschwindigkeit. Durch die zusätzliche Verknüpfung mit Google AI Studio schaffen wir automatisierte Vertriebsabläufe: Eingehende Anfragen werden durch intelligente Sprachmodelle vorstrukturiert und direkt in Ihr CRM übergeben.',
  },
  {
    q: 'Wie läuft die Zusammenarbeit und wie schnell ist die Umsetzung?',
    a: 'Eine Sprint Landingpage ist in der Regel innerhalb von 10–14 Werktagen einsatzbereit. Ein vollständiger Shopify Onlineshop benötigt ca. 3–4 Wochen. Wir arbeiten mit klaren Meilensteinen, transparenten wöchentlichen Statusberichten und festen Ansprechpartnern ohne Agentur-Wasserkopf.',
  },
  {
    q: 'Übernehmen Sie auch die Schaltung von Werbeanzeigen?',
    a: 'Ja, genau darin liegt unser holistischer Ansatz: Ein moderner Shop oder eine Landingpage funktioniert am profitabelsten, wenn Werbekampagne und Zielseite perfekt aufeinander abgestimmt sind. Wir steuern Google Ads (Search & Shopping) und Meta Ads (Instagram Reels, Feed & Stories) mit direktem Fokus auf ROAS und messbaren Deckungsbeitrag.',
  },
  {
    q: 'Gibt es versteckte Kosten oder langfristige Knebelverträge?',
    a: 'Nein. Unsere Projektangebote sind transparente Festpreise ohne versteckte Nachforderungen. Bei laufender Kampagnen- oder Shop-Betreuung arbeiten wir mit flexiblen Monatsverträgen mit 30 Tagen Kündigungsfrist.',
  },
];

export const CLIENT_TESTIMONIALS = [
  {
    id: 'aether',
    quote: 'Dank des neuen Shopify Stores haben wir unsere mobile Conversion Rate von 1,4% auf 3,6% mehr als verdoppelt. Die Anbindung an unser Warenwirtschaftssystem spart uns jeden Tag spürbar Zeit.',
    author: 'Maximilian Schäfer',
    role: 'Gründer & Geschäftsführer',
    company: 'Aether Lifestyle GmbH, Köln',
    service: 'Shopify Store Relaunch',
    metric: '+185% Umsatz im Q1',
    rating: 5,
  },
  {
    id: 'aurora',
    quote: 'Die neue Landingpage in Kombination mit zielgerichteten Google Ads hat unsere Terminbuchungen für Privatpatienten verdreifacht. Professionell, extrem schnell und verlässlich umgesetzt.',
    author: 'Dr. med. Miriam Lindner',
    role: 'Fachärztin & Praxisinhaberin',
    company: 'Aurora Ästhetikzentrum, Köln',
    service: 'High-Converting Landingpage',
    metric: '+240% Terminanfragen',
    rating: 5,
  },
  {
    id: 'veloce',
    quote: 'Der Instagram & TikTok Audit hat uns endlich die Augen geöffnet. Mit dem 30-Tage Content-Plan und den Video-Hooks haben wir innerhalb von zwei Monaten unsere organische Reichweite vervielfacht und konkrete Shop-Käufe erzielt.',
    author: 'Sarah Van der Beek',
    role: 'Marketingleiterin',
    company: 'Veloce Concept Store, Köln (Belgisches Viertel)',
    service: 'Social Media Audit & Content-Plan',
    metric: '+320% Profil-Engagement',
    rating: 5,
  },
  {
    id: 'apex',
    quote: 'Die CRM-Integration mit Google AI Studio hat unseren B2B-Vertrieb revolutioniert. Anfragen werden sofort qualifiziert und landen sekundenschnell im richtigen HubSpot-Deal.',
    author: 'Thomas Brinkmann',
    role: 'Vertriebsleiter',
    company: 'Apex Industrial Solutions KG, Köln & Düsseldorf',
    service: 'B2B Web & AI CRM-Flow',
    metric: '18h Zeitersparnis / Woche',
    rating: 5,
  },
  {
    id: 'rheintech',
    quote: 'Die Meta Ads Kampagnen für Instagram & Facebook liefern kontinuierlich qualifizierte B2B-Leads zu sensationellen Kosten. Die vorangegangene SWOT- und Wettbewerbsanalyse war goldwert für unsere Neupositionierung.',
    author: 'Jonas Kettler',
    role: 'Co-Founder & Head of Growth',
    company: 'RheinTech Digital GmbH, Köln',
    service: 'Meta Ads & SWOT-Analyse',
    metric: '3.8x konstanter ROAS',
    rating: 5,
  },
];
