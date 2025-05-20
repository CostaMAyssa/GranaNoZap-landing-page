import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ChevronLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Canceled: React.FC = () => {
  return (
    <div className="min-h-screen bg-saldo-background text-saldo-text-primary flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-amber-500 flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Pagamento cancelado</h1>
              <p className="text-saldo-text-secondary mb-6">
                Seu pagamento não foi concluído ou foi cancelado. 
                Nenhum valor foi debitado da sua conta.
              </p>
              
              <div className="space-y-4 w-full">
                <Button asChild className="w-full">
                  <Link to="/#planos" className="flex items-center justify-center">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Tentar novamente
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/" className="flex items-center justify-center">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Voltar para a página inicial
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Canceled; 