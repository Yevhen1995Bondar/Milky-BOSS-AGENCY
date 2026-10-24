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
import { PagePreloader } from './components/PagePreloader';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

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

function MainApplication() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { language } = useLanguage();
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
    if (language === 'de') {
      setContactMessage(`Hallo Milky BOSS Team, ich interessiere mich für das Leistungsfeld "${serviceTitle}". Bitte kontaktieren Sie mich für ein unverbindliches Erstgespräch.`);
    } else {
      setContactMessage(`Hello Milky BOSS Team, I am interested in your service offering "${serviceTitle}". Please contact me for an introductory consultation.`);
    }
    scrollToContact();
  };

  const handleSelectPlan = (planName: string, estimateDetails?: string) => {
    setContactService(planName);
    if (language === 'de') {
      if (estimateDetails) {
        setContactMessage(`Hallo Milky BOSS Team, ich habe den Projekt-Kalkulator genutzt:\n${estimateDetails}\n\nBitte prüfen Sie dieses Vorhaben.`);
      } else {
        setContactMessage(`Hallo Milky BOSS Team, ich interessiere mich für das Paket "${planName}".`);
      }
    } else {
      if (estimateDetails) {
        setContactMessage(`Hello Milky BOSS Team, I configured my project using the estimator:\n${estimateDetails}\n\nPlease review this scope.`);
      } else {
        setContactMessage(`Hello Milky BOSS Team, I am interested in the package "${planName}".`);
      }
    }
    scrollToContact();
  };

  const handleApplyRoiCalculation = (estimatedRevenue: number) => {
    setContactService(language === 'de' ? 'Conversion-Optimierung & E-Commerce' : 'Conversion Rate Optimization & E-Commerce');
    const formattedRev = estimatedRevenue.toLocaleString(language === 'de' ? 'de-DE' : 'en-US');
    if (language === 'de') {
      setContactMessage(`Hallo Milky BOSS Team, laut Ihrem ROI-Simulator liegt unser jährliches Mehrumsatzpotenzial bei ca. ${formattedRev} €. Wir möchten dies gerne konkret besprechen.`);
    } else {
      setContactMessage(`Hello Milky BOSS Team, according to your ROI simulator our estimated annual revenue gain is approx. €${formattedRev}. We would like to discuss this concrete business case.`);
    }
    scrollToContact();
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col selection:bg-[#c81e32] selection:text-white relative">
      {/* 1. Initial Page Loading Animation */}
      <PagePreloader onComplete={() => setIsLoaded(true)} />

      {/* Global Scroll Progress Indicator at very top */}
      <ScrollProgressBar />

      {/* Top Navbar with Language Switcher */}
      <Navbar onOpenContact={scrollToContact} />

      {/* Main Content Area: Smooth entrance after preloader finishes */}
      <motion.main
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
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

        {/* 8. Pricing & Custom Budget Estimator */}
        <SectionReveal>
          <PricingSection onSelectPlan={handleSelectPlan} />
        </SectionReveal>

        {/* 9. Frequently Asked Questions */}
        <SectionReveal>
          <FaqSection />
        </SectionReveal>

        {/* 10. Contact Form & Cologne Coordinates */}
        <SectionReveal>
          <ContactSection
            prefilledService={contactService}
            prefilledMessage={contactMessage}
          />
        </SectionReveal>
      </motion.main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApplication />
    </LanguageProvider>
  );
}
