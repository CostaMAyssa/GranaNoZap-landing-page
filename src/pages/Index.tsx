import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import WhatsAppDemo from '@/components/WhatsAppDemo';
import Features from '@/components/Features';
import PricingSection from '@/components/PricingSection';
import OverviewCards from '@/components/OverviewCards';
import ChartSection from '@/components/ChartSection';
import TransactionsTable from '@/components/TransactionsTable';
import TipsSection from '@/components/TipsSection';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-saldo-background text-saldo-text-primary flex flex-col">
      <Navbar />
      <main>
        <Hero />
        <WhatsAppDemo />
        <Features />
        <OverviewCards />
        <ChartSection />
        <TransactionsTable />
        <TipsSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
