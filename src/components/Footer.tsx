
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-10 px-6 bg-[#1a1a1a] border-t border-saldo-border">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span className="text-xl font-poppins font-bold text-saldo-text-primary">
              Granano<span className="text-saldo-primary">Zap</span>
            </span>
            <p className="text-saldo-text-secondary mt-2">Suas finanças sob controle em um só lugar.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 md:gap-12">
            <div>
              <h4 className="font-bold mb-3 text-saldo-text-primary">Funcionalidades</h4>
              <ul className="space-y-2 text-saldo-text-secondary">
                <li><a href="#" className="hover:text-saldo-primary transition-colors">WhatsApp</a></li>
                <li><a href="#" className="hover:text-saldo-primary transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-saldo-primary transition-colors">Relatórios</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-3 text-saldo-text-primary">Suporte</h4>
              <ul className="space-y-2 text-saldo-text-secondary">
                <li><a href="#" className="hover:text-saldo-primary transition-colors">Ajuda</a></li>
                <li><a href="#" className="hover:text-saldo-primary transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-saldo-primary transition-colors">Termos</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-saldo-border mt-8 pt-8 text-center">
          <p className="text-saldo-text-secondary text-sm">© 2025 GrananoZap. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
