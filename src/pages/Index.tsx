import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Article } from "@/components/sections/Article";
import { Registration } from "@/components/sections/Registration";
import { FloatingRegistration } from "@/components/sections/FloatingRegistration";
import { FAQ } from "@/components/sections/FAQ";
import { PartnerLogos } from "@/components/sections/PartnerLogos";
import { KeyAdvantages } from "@/components/sections/KeyAdvantages";
import { CourseDetails } from "@/components/sections/CourseDetails";
import { Statistics } from "@/components/sections/Statistics";
import { AboutUs } from "@/components/sections/AboutUs";
import { CTA } from "@/components/sections/CTA";
import { SideMenu } from "@/components/layout/SideMenu";
import { Testimonials } from "@/components/sections/Testimonials";
import { QuestionsAndCTA } from "@/components/sections/QuestionsAndCTA";
import { TechnicalDetails } from "@/components/sections/TechnicalDetails";
import { useState } from "react";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <main className="pt-16">
        <Hero />
        <Features />
        <Testimonials />
        <AboutUs />
        <KeyAdvantages />
        <Statistics />
        <Registration />
        <PartnerLogos />
        <CourseDetails />
        <FAQ />
        <TechnicalDetails />
        <QuestionsAndCTA />
        <FloatingRegistration />
      </main>
      <CTA />
    </div>
  );
};

export default Index;
