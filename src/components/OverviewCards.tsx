
import React from 'react';
import { TrendingUp, TrendingDown, CircleDollarSign } from "lucide-react";

const OverviewCards: React.FC = () => {
  return (
    <section id="visao-geral" className="section-padding bg-saldo-border/10">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl text-center mb-16 font-poppins font-bold">
          Visão <span className="text-saldo-primary">Geral</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card-highlight border-t-4 border-saldo-income animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-saldo-text-secondary mb-2">Receita Total</p>
                <h3 className="text-2xl md:text-3xl font-bold text-saldo-income">R$ 5.235,80</h3>
              </div>
              <div className="p-2 rounded-full bg-saldo-income/10">
                <TrendingUp className="h-6 w-6 text-saldo-income" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-saldo-border">
              <p className="text-saldo-text-secondary text-sm">
                <span className="text-saldo-income">↑ 12%</span> em relação ao mês anterior
              </p>
            </div>
          </div>
          
          <div className="card-highlight border-t-4 border-saldo-expense animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-saldo-text-secondary mb-2">Despesa Total</p>
                <h3 className="text-2xl md:text-3xl font-bold text-saldo-expense">R$ 3.842,75</h3>
              </div>
              <div className="p-2 rounded-full bg-saldo-expense/10">
                <TrendingDown className="h-6 w-6 text-saldo-expense" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-saldo-border">
              <p className="text-saldo-text-secondary text-sm">
                <span className="text-saldo-expense">↑ 5%</span> em relação ao mês anterior
              </p>
            </div>
          </div>
          
          <div className="card-highlight border-t-4 border-saldo-balance animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-saldo-text-secondary mb-2">Saldo Atual</p>
                <h3 className="text-2xl md:text-3xl font-bold text-saldo-balance">R$ 1.393,05</h3>
              </div>
              <div className="p-2 rounded-full bg-saldo-balance/10">
                <CircleDollarSign className="h-6 w-6 text-saldo-balance" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-saldo-border">
              <p className="text-saldo-text-secondary text-sm">
                <span className="text-saldo-income">↑ 25%</span> em relação ao mês anterior
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OverviewCards;
