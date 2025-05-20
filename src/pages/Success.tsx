import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Success: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const sessionId = searchParams.get('session_id');
  
  useEffect(() => {
    // Simulação de verificação do status do pagamento
    // Em um ambiente real, você consultaria seu backend ou a API do Stripe
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [sessionId]);
  
  return (
    <div className="min-h-screen bg-saldo-background text-saldo-text-primary flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-8">
          <div className="text-center mb-8">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full border-4 border-saldo-primary border-t-transparent animate-spin mb-4"></div>
                <h1 className="text-2xl font-bold mb-2">Verificando pagamento...</h1>
                <p className="text-saldo-text-secondary">Estamos confirmando seu pagamento com o Stripe</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Pagamento confirmado!</h1>
                <p className="text-saldo-text-secondary mb-4">
                  Seu pagamento foi processado com sucesso e sua assinatura está ativa.
                </p>
                <div className="p-4 bg-saldo-border rounded-lg w-full text-left mb-6">
                  <p className="text-sm text-saldo-text-secondary mb-2">ID da Transação:</p>
                  <p className="font-mono text-xs break-all">{sessionId || 'cs_test_...'}</p>
                </div>
                <p className="text-sm text-saldo-text-secondary mb-6">
                  Enviamos um e-mail com os detalhes da sua compra. 
                  Você pode acessar sua conta a qualquer momento para gerenciar sua assinatura.
                </p>
                <div className="space-y-4 w-full">
                  <Button asChild className="w-full">
                    <Link to="/dashboard">
                      Acessar minha conta
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
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Success; 