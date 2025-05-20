import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToPlanos = () => {
    const planosSection = document.getElementById('planos');
    if (planosSection) {
      planosSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { href: "#funcionalidades", label: "Funcionalidades" },
    { href: "#visao-geral", label: "Visão Geral" },
    { href: "#dicas", label: "Dicas" },
    { href: "#planos", label: "Planos" }
  ];

  return (
    <nav className="fixed w-full z-50 bg-saldo-background/90 backdrop-blur-sm border-b border-saldo-border">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-2xl font-poppins font-bold text-saldo-text-primary">
            GranaNo<span className="text-saldo-primary">Zap</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item, index) => (
            <a 
              key={index}
              href={item.href} 
              className="text-saldo-text-secondary hover:text-saldo-text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-saldo-text-primary p-2">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Call to Action Button - Hidden on small screens when menu is open */}
        <Button 
          className={`btn-primary ${isMenuOpen ? 'hidden' : 'hidden sm:flex'}`} 
          onClick={scrollToPlanos}
        >
          Quero começar agora
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-saldo-background/95 backdrop-blur-md border-b border-saldo-border">
          <div className="container mx-auto py-4 flex flex-col gap-4">
            {menuItems.map((item, index) => (
              <a 
                key={index}
                href={item.href} 
                className="text-saldo-text-secondary hover:text-saldo-text-primary transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="px-4 pt-2 pb-4">
              <Button 
                className="btn-primary w-full" 
                onClick={scrollToPlanos}
              >
                Quero começar agora
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
