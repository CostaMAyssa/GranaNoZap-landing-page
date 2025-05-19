import React from 'react';
import { CircleCheck, CircleDollarSign, Filter, ChartBar } from "lucide-react";

const TipsSection: React.FC = () => {
  const tips = [
    {
      icon: <Filter className="h-6 w-6 text-saldo-primary" />,
      title: "Use os filtros para análises precisas",
      description: "Combine filtros de período, categoria e tipo para extrair insights mais profundos sobre seus gastos."
    },
    {
      icon: <CircleDollarSign className="h-6 w-6 text-saldo-primary" />,
      title: "Planeje seu orçamento mensal",
      description: "Defina limites de gastos por categoria e acompanhe o progresso para manter suas finanças sob controle."
    },
    {
      icon: <ChartBar className="h-6 w-6 text-saldo-primary" />,
      title: "Analise as categorias de gastos",
      description: "Identifique onde seu dinheiro está indo e encontre oportunidades para economizar."
    },
    {
      icon: <CircleCheck className="h-6 w-6 text-saldo-primary" />,
      title: "Monitore sua saúde financeira",
      description: "Acompanhe regularmente seu saldo e a proporção entre receitas e despesas."
    }
  ];

  return (
    <section id="dicas" className="section-padding bg-saldo-background relative overflow-hidden">
      {/* Gradient overlay for the section */}
      <div className="absolute top-0 right-0 w-2/3 h-full opacity-5 bg-radial-gradient pointer-events-none"></div>
      
      <div className="container mx-auto relative z-10">
        <h2 className="text-3xl md:text-4xl text-center mb-16 font-poppins font-bold">
          Dicas e <span className="text-saldo-primary">Boas Práticas</span>
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {tips.map((tip, index) => (
            <div 
              key={index} 
              className="card-highlight flex gap-4 animate-fade-in"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <div className="shrink-0 p-2 h-10 w-10 flex items-center justify-center rounded-full bg-saldo-border/50">
                {tip.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-saldo-primary">{tip.title}</h3>
                <p className="text-saldo-text-secondary">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TipsSection;
