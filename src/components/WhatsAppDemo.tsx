import React from 'react';
import { MessageSquare, Send, LayoutDashboard } from "lucide-react";

const WhatsAppDemo: React.FC = () => {
  const handleWhatsAppContact = () => {
    window.open('https://wa.me/5500000000000', '_blank');
  };

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
                  <Send className="h-5 w-5 text-saldo-primary" />
                </span>
                <p className="text-saldo-text-secondary">
                  <strong className="text-saldo-text-primary">Rápido:</strong> Receba confirmação instantânea
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="bg-saldo-border/50 p-2 rounded-full">
                  <LayoutDashboard className="h-5 w-5 text-saldo-primary" />
                </span>
                <p className="text-saldo-text-secondary">
                  <strong className="text-saldo-text-primary">Eficiente:</strong> Veja tudo organizado no dashboard
                </p>
              </div>
            </div>
            
            <button 
              onClick={handleWhatsAppContact}
              className="mt-8 flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-medium py-3 px-6 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Falar com a gente
            </button>
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
                      <p className="text-white text-sm font-medium">GrananoZap Bot</p>
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
