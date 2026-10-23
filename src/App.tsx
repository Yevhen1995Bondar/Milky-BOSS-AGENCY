import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { ServicesSection } from './components/ServicesSection';
import { InteractiveRoiCalculator } from './components/InteractiveRoiCalculator';
import { PortfolioSection } from './components/PortfolioSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { WorkflowSection } from './components/WorkflowSection';
import { PricingSection } from './components/PricingSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

// Reusable viewport-triggered reveal container with Framer Motion
interface SectionRevealProps {
  children: React.ReactNode;
  id?: string;
  delay?: number;
}

const SectionReveal: React.FC<SectionRevealProps> = ({ children, id, delay = 0 }) => {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: '-50px' }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

export default function App() {
  const [contactService, setContactService] = useState<string>('Shopify Onlineshop (Neubau oder Relaunch)');
  const [contactMessage, setContactMessage] = useState<string>('');

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCalculator = () => {
    const el = document.getElementById('roi-calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectService = (serviceTitle: string) => {
    setContactService(serviceTitle);
    setContactMessage(`Hallo Milky BOSS Team, ich interessiere mich für das Leistungsfeld "${serviceTitle}". Bitte kontaktieren Sie mich für ein unverbindliches Erstgespräch.`);
    scrollToContact();
  };

  const handleSelectPlan = (planName: string, estimateDetails?: string) => {
    setContactService(planName);
    if (estimateDetails) {
      setContactMessage(`Hallo Milky BOSS Team, ich habe den Projekt-Kalkulator genutzt:\n${estimateDetails}\n\nBitte prüfen Sie dieses Vorhaben.`);
    } else {
      setContactMessage(`Hallo Milky BOSS Team, ich interessiere mich für das Paket "${planName}".`);
    }
    scrollToContact();
  };

  const handleApplyRoiCalculation = (estimatedRevenue: number) => {
    setContactService('Conversion-Optimierung & E-Commerce');
    setContactMessage(`Hallo Milky BOSS Team, laut Ihrem ROI-Simulator liegt unser jährliches Mehrumsatzpotenzial bei ca. ${estimatedRevenue.toLocaleString('de-DE')} €. Wir möchten dies gerne konkret besprechen.`);
    scrollToContact();
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col selection:bg-[#c81e32] selection:text-white">
      {/* Global Scroll Progress Indicator at very top */}
      <ScrollProgressBar />

      {/* Top Navbar */}
      <Navbar onOpenContact={scrollToContact} />

      {/* Main Content Area with Framer Motion Section Reveals */}
      <main className="flex-1">
        {/* 1. Hero */}
        <Hero
          onOpenContact={scrollToContact}
          onScrollToCalculator={scrollToCalculator}
        />

        {/* 2. Infinite Tech Marquee */}
        <Marquee />

        {/* 3. Services / Leistungsbereiche */}
        <SectionReveal>
          <ServicesSection onSelectService={handleSelectService} />
        </SectionReveal>

        {/* 4. Interactive ROI Simulator */}
        <SectionReveal>
          <InteractiveRoiCalculator onApplyCalculation={handleApplyRoiCalculation} />
        </SectionReveal>

        {/* 5. Projects & Case Studies */}
        <SectionReveal>
          <PortfolioSection onRequestProject={handleSelectService} />
        </SectionReveal>

        {/* 6. Client Feedback & Testimonials Slider */}
        <SectionReveal>
          <TestimonialsSection />
        </SectionReveal>

        {/* 7. Google AI Studio & CRM Workflow */}
        <SectionReveal>
          <WorkflowSection />
        </SectionReveal>

        {/* 7. Pricing & Custom Budget Estimator */}
        <SectionReveal>
          <PricingSection onSelectPlan={handleSelectPlan} />
        </SectionReveal>

        {/* 8. Frequently Asked Questions */}
        <SectionReveal>
          <FaqSection />
        </SectionReveal>

        {/* 9. Contact Form & Cologne Coordinates */}
        <SectionReveal>
          <ContactSection
            prefilledService={contactService}
            prefilledMessage={contactMessage}
          />
        </SectionReveal>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
