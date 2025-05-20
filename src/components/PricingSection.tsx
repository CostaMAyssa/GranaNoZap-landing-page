
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check, Zap, Users, FileText, LayoutDashboard, MessageSquare, Share2 } from "lucide-react";
import CheckoutModal from './CheckoutModal';

interface PlanFeatureProps {
  children: React.ReactNode;
}

const PlanFeature: React.FC<PlanFeatureProps> = ({ children }) => (
  <div className="flex items-center gap-2 mb-3">
    <Check className="h-5 w-5 text-saldo-primary flex-shrink-0" />
    <span className="text-sm text-saldo-text-secondary">{children}</span>
  </div>
);

const PricingSection: React.FC = () => {
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string }>({ name: '', price: '' });
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const handleStartendPlan = () => {
    const price = billingPeriod === "monthly" ? "R$ 19,99/mês" : "R$ 203,90/ano (R$ 16,99/mês)";
    setSelectedPlan({ name: 'Startend', price });
    setCheckoutModalOpen(true);
  };

  const handlePrimePlan = () => {
    const price = billingPeriod === "monthly" ? "R$ 29,99/mês" : "R$ 305,90/ano (R$ 25,49/mês)";
    setSelectedPlan({ name: 'Prime', price });
    setCheckoutModalOpen(true);
  };

  const handleEnterprisePlan = () => {
    // Redirecionar para WhatsApp com mensagem pré-definida
    const message = encodeURIComponent("Olá, tenho interesse no plano Enterprise do GranaNoZap e gostaria de falar com um consultor.");
    window.open(`https://wa.me/5500000000000?text=${message}`, '_blank');
  };

  return (
    <>
      <section id="planos" className="section-padding bg-radial-gradient relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Escolha o plano ideal para o seu momento
            </h2>
            <p className="text-xl text-saldo-text-secondary max-w-3xl mx-auto mb-8">
              Comece com o essencial, escale para o controle completo ou vá além com automações e consultoria personalizada.
            </p>
            
            <div className="inline-flex items-center bg-saldo-border rounded-full p-1 mb-12">
              <button 
                onClick={() => setBillingPeriod("monthly")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${billingPeriod === "monthly" ? "bg-saldo-primary text-black" : "text-saldo-text-secondary"}`}
              >
                Mensal
              </button>
              <button 
                onClick={() => setBillingPeriod("yearly")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${billingPeriod === "yearly" ? "bg-saldo-primary text-black" : "text-saldo-text-secondary"}`}
              >
                Anual <span className="text-xs ml-1">(-15%)</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Plano Startend */}
            <div className="bg-saldo-border rounded-2xl p-8 flex flex-col h-full border border-transparent hover:border-saldo-primary transition-all duration-300">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-6 w-6 text-saldo-primary" />
                  <h3 className="text-2xl font-bold">Startend</h3>
                </div>
                <div className="mt-4 mb-2">
                  {billingPeriod === "monthly" ? (
                    <div>
                      <span className="text-3xl font-bold">R$ 19,99</span>
                      <span className="text-saldo-text-secondary">/mês</span>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <div>
                        <span className="text-3xl font-bold">R$ 203,90</span>
                        <span className="text-saldo-text-secondary">/ano</span>
                      </div>
                      <div className="text-sm text-saldo-text-secondary">
                        (equivalente a R$ 16,99/mês)
                      </div>
                      <div className="mt-2 text-xs text-saldo-primary font-medium">
                        💸 Economize 15% com o plano anual
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-saldo-text-secondary mb-6">
                  Para quem está começando a organizar suas finanças.
                </p>
              </div>
              
              <div className="flex-grow">
                <PlanFeature>Até 50 lançamentos por mês</PlanFeature>
                <PlanFeature>Dashboard com saldos e gráficos</PlanFeature>
                <PlanFeature>Registro via WhatsApp</PlanFeature>
                <PlanFeature>3 categorias personalizadas</PlanFeature>
                <PlanFeature>Exportação mensal em PDF</PlanFeature>
              </div>
              
              <Button 
                onClick={handleStartendPlan}
                className="w-full mt-8 btn-primary"
              >
                Começar com Startend
              </Button>
            </div>

            {/* Plano Prime - Destacado */}
            <div className="bg-saldo-border rounded-2xl p-8 flex flex-col h-full relative border-2 border-saldo-primary shadow-lg shadow-saldo-primary/20 transform md:-translate-y-4">
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span className="bg-saldo-primary text-black text-sm font-bold px-4 py-1 rounded-full">
                  Mais Popular
                </span>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <LayoutDashboard className="h-6 w-6 text-saldo-primary" />
                  <h3 className="text-2xl font-bold">Prime</h3>
                </div>
                <div className="mt-4 mb-2">
                  {billingPeriod === "monthly" ? (
                    <div>
                      <span className="text-3xl font-bold">R$ 29,99</span>
                      <span className="text-saldo-text-secondary">/mês</span>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <div>
                        <span className="text-3xl font-bold">R$ 305,90</span>
                        <span className="text-saldo-text-secondary">/ano</span>
                      </div>
                      <div className="text-sm text-saldo-text-secondary">
                        (equivalente a R$ 25,49/mês)
                      </div>
                      <div className="mt-2 text-xs text-saldo-primary font-medium">
                        💸 Economize 15% com o plano anual
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-saldo-text-secondary mb-6">
                  Ideal para quem já tem volume médio de movimentações.
                </p>
              </div>
              
              <div className="flex-grow">
                <PlanFeature>Até 120 lançamentos por mês</PlanFeature>
                <PlanFeature>Tudo do Startend</PlanFeature>
                <PlanFeature>Categorias ilimitadas</PlanFeature>
                <PlanFeature>Exportação em Excel</PlanFeature>
                <PlanFeature>Filtros inteligentes</PlanFeature>
                <PlanFeature>Suporte via WhatsApp</PlanFeature>
              </div>
              
              <Button 
                onClick={handlePrimePlan}
                className="w-full mt-8 btn-primary"
              >
                Assinar Prime
              </Button>
            </div>

            {/* Plano Enterprise */}
            <div className="bg-saldo-border rounded-2xl p-8 flex flex-col h-full border border-transparent hover:border-saldo-primary transition-all duration-300">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-6 w-6 text-saldo-primary" />
                  <h3 className="text-2xl font-bold">Enterprise</h3>
                </div>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-bold">Sob Consulta</span>
                </div>
                <p className="text-saldo-text-secondary mb-6">
                  Para empresas ou usuários avançados.
                </p>
              </div>
              
              <div className="flex-grow">
                <PlanFeature>Lançamentos ilimitados</PlanFeature>
                <PlanFeature>Relatórios gerenciais e comparativos</PlanFeature>
                <PlanFeature>Alertas por WhatsApp</PlanFeature>
                <PlanFeature>Suporte com analista dedicado</PlanFeature>
                <PlanFeature>Integrações via API / n8n</PlanFeature>
                <PlanFeature>Consultoria 1:1 com especialista</PlanFeature>
              </div>
              
              <Button 
                onClick={handleEnterprisePlan}
                className="w-full mt-8"
                variant="outline"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Falar com Consultor
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Checkout */}
      <CheckoutModal 
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        planName={selectedPlan.name}
        planPrice={selectedPlan.price}
      />
    </>
  );
};

export default PricingSection;
