import React from 'react';
import { MessageSquare, ChartBar, Filter, FileText } from "lucide-react";

const Features: React.FC = () => {
  const features = [
    {
      icon: <MessageSquare className="h-10 w-10 text-saldo-primary" />,
      title: "Automação via WhatsApp",
      description: "Envie suas transações por mensagem e deixe o sistema fazer o resto."
    },
    {
      icon: <ChartBar className="h-10 w-10 text-saldo-primary" />,
      title: "Dashboard Visual",
      description: "Acompanhe saldos, categorias e tendências com visualizações claras e intuitivas."
    },
    {
      icon: <Filter className="h-10 w-10 text-saldo-primary" />,
      title: "Filtros Inteligentes",
      description: "Período, tipo e status em um clique para análises mais precisas."
    },
    {
      icon: <FileText className="h-10 w-10 text-saldo-primary" />,
      title: "Exportação Fácil",
      description: "Gere relatórios em PDF ou Excel com um toque para usar onde quiser."
    }
  ];

  return (
    <section id="funcionalidades" className="section-padding bg-saldo-background">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl text-center mb-16 font-poppins font-bold text-saldo-text-primary">
          Funcionalidades <span className="text-saldo-primary">Poderosas</span>
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="card-highlight flex flex-col items-center text-center animate-fade-in"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <div className="mb-4 p-4 rounded-full bg-saldo-border/50">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-saldo-primary">{feature.title}</h3>
              <p className="text-saldo-text-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
