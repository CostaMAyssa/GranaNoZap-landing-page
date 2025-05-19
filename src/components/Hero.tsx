
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, DollarSign, BarChart3, FileText } from "lucide-react";

const Hero: React.FC = () => {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-6 bg-gradient-to-b from-saldo-background to-saldo-border/50">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl leading-tight mb-6 animate-fade-in text-saldo-text-primary">
            Domine suas finanças de forma simples, rápida e inteligente
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-saldo-text-secondary animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Com o SaldoForte, você controla tudo pelo WhatsApp e acompanha os resultados direto no painel.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 text-left mb-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-start gap-3">
              <span className="text-saldo-income">
                <DollarSign size={24} className="stroke-saldo-income" />
              </span>
              <p className="text-saldo-text-secondary">Registre suas movimentações com um simples envio de mensagem.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-saldo-balance">
                <BarChart3 size={24} className="stroke-saldo-balance" />
              </span>
              <p className="text-saldo-text-secondary">Veja tudo organizado automaticamente no dashboard.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-saldo-premium">
                <FileText size={24} className="stroke-saldo-premium" />
              </span>
              <p className="text-saldo-text-secondary">Exporte relatórios, acompanhe saldos e descubra onde está seu dinheiro — sem planilhas, sem complicações.</p>
            </div>
          </div>
          
          <blockquote className="border-l-4 border-saldo-primary pl-4 py-2 mb-8 text-xl italic text-saldo-text-primary animate-fade-in" style={{ animationDelay: '0.6s' }}>
            A plataforma inteligente que funciona pra você. Basta mandar, que a gente organiza.
          </blockquote>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <Button className="btn-primary w-full sm:w-auto flex items-center gap-2">
              Quero começar agora
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute left-0 right-0 bottom-0 h-1/2 bg-gradient-to-t from-saldo-background to-transparent -z-10"></div>
    </section>
  );
};

export default Hero;
