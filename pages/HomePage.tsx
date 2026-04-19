import React from 'react';
import { PageType } from '../App';
import { Hero } from '../components/sections/Hero';
import { HValues } from '../components/sections/HValues';
import { AIServices } from '../components/sections/AIServices';
import { M8Mates } from '../components/sections/M8Mates';
import { Contact } from '../components/sections/Contact';

interface HomePageProps {
  onNavigate?: (page: PageType) => void;
}

export const HomePage: React.FC<HomePageProps> = () => {
  return (
    <main className="relative">
      <section id="hero">
        <Hero />
      </section>
      <section id="h-values">
        <HValues />
      </section>
      <section id="ai-services">
        <AIServices />
      </section>
      <section id="m8">
        <M8Mates />
      </section>
      <section id="contact">
        <Contact />
      </section>
    </main>
  );
};
