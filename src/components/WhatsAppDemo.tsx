
import React from 'react';
import { MessageSquare, Send } from "lucide-react";

const WhatsAppDemo: React.FC = () => {
  return (
    <section className="py-16 md:py-24 px-6 bg-saldo-background">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl mb-6 font-bold leading-tight text-saldo-text-primary">
              Uma simples mensagem para <span className="text-saldo-primary">controlar seus gastos</span>
            </h2>
            
            <p className="text-xl mb-8 text-saldo-text-secondary">
              Envie suas despesas e receitas pelo WhatsApp e deixe que organizamos tudo para você automaticamente.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="bg-saldo-border/50 p-2 rounded-full">
                  <MessageSquare className="h-5 w-5 text-saldo-primary" />
                </span>
                <p className="text-saldo-text-secondary">
                  <strong className="text-saldo-text-primary">Simples:</strong> Envie "Gastei R$25 no café"
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="bg-saldo-border/50 p-2 rounded-full">
                  <Send className="h-5 w-5 text-saldo-income" />
                </span>
                <p className="text-saldo-text-secondary">
                  <strong className="text-saldo-text-primary">Rápido:</strong> Receba confirmação instantânea
                </p>
              </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2 mx-auto md:mx-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative w-72 max-w-full">
              {/* Phone frame */}
              <div className="bg-saldo-border rounded-3xl p-3 shadow-xl">
                {/* WhatsApp chat interface */}
                <div className="bg-[#111b21] rounded-2xl overflow-hidden h-[500px]">
                  {/* Header */}
                  <div className="bg-[#222e35] px-4 py-2 flex items-center">
                    <div className="w-10 h-10 bg-saldo-border rounded-full"></div>
                    <div className="ml-3">
                      <p className="text-white text-sm font-medium">SaldoForte Bot</p>
                      <p className="text-green-500 text-xs">online</p>
                    </div>
                  </div>
                  
                  {/* Chat */}
                  <div className="p-3 h-[430px] overflow-y-auto flex flex-col justify-end">
                    {/* Bot message */}
                    <div className="flex mb-4">
                      <div className="bg-[#222e35] rounded-lg p-2 max-w-[80%]">
                        <p className="text-white text-sm">Olá! Como posso te ajudar hoje?</p>
                        <p className="text-xs text-gray-400 text-right">10:30</p>
                      </div>
                    </div>
                    
                    {/* User message */}
                    <div className="flex justify-end mb-4">
                      <div className="bg-[#005c4b] rounded-lg p-2 max-w-[80%]">
                        <p className="text-white text-sm">Gastei R$25 no café</p>
                        <p className="text-xs text-gray-400 text-right">10:31</p>
                      </div>
                    </div>
                    
                    {/* Bot message */}
                    <div className="flex mb-4">
                      <div className="bg-[#222e35] rounded-lg p-2 max-w-[80%]">
                        <p className="text-white text-sm">Registrado! Despesa de R$ 25,00 na categoria "Alimentação"</p>
                        <p className="text-xs text-gray-400 text-right">10:31</p>
                      </div>
                    </div>
                    
                    {/* User message */}
                    <div className="flex justify-end">
                      <div className="bg-[#005c4b] rounded-lg p-2 max-w-[80%]">
                        <p className="text-white text-sm">Qual meu saldo atual?</p>
                        <p className="text-xs text-gray-400 text-right">10:32</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Input area */}
                  <div className="bg-[#222e35] px-4 py-2 flex items-center">
                    <input 
                      type="text" 
                      placeholder="Digite uma mensagem"
                      className="bg-[#2a3942] text-white text-sm rounded-full px-4 py-2 flex-1 outline-none"
                      readOnly
                    />
                    <Send className="h-5 w-5 text-gray-400 ml-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatsAppDemo;
