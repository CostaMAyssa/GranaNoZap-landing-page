
import React from 'react';
import { Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
  return (
    <nav className="fixed w-full z-50 bg-saldo-background/90 backdrop-blur-sm border-b border-saldo-border">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-2xl font-poppins font-bold text-saldo-text-primary">
            Saldo<span className="text-saldo-primary">Forte</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#funcionalidades" className="text-saldo-text-secondary hover:text-saldo-text-primary transition-colors">
            Funcionalidades
          </a>
          <a href="#visao-geral" className="text-saldo-text-secondary hover:text-saldo-text-primary transition-colors">
            Visão Geral
          </a>
          <a href="#dicas" className="text-saldo-text-secondary hover:text-saldo-text-primary transition-colors">
            Dicas
          </a>
        </div>
        <Button className="btn-primary">Quero começar agora</Button>
      </div>
    </nav>
  );
};

export default Navbar;
