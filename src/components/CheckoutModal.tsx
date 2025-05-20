
import React, { useState, useEffect } from 'react';
import { X, CreditCard, FileText, QrCode, Loader2, AlertCircle, WifiOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createCheckoutSession } from "@/lib/stripe";
import { useToast } from "@/components/ui/use-toast";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  planPrice: string;
}

type PaymentMethod = 'card' | 'boleto' | 'pix';

// Interface para representar erros
interface ApiError extends Error {
  code?: string;
  param?: string;
  type?: string;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, planName, planPrice }) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isServerOnline, setIsServerOnline] = useState<boolean | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Verificar se o servidor está online quando o modal é aberto
    if (isOpen) {
      checkServerStatus();
    }
  }, [isOpen]);

  const checkServerStatus = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      console.log(`Verificando conexão com o servidor: ${apiUrl}/api/test`);
      
      const response = await fetch(`${apiUrl}/api/test`, { 
        method: 'GET',
        // Adicionando um timeout para não ficar esperando indefinidamente
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        console.log('Servidor online:', await response.json());
        setIsServerOnline(true);
        setError(null);
      } else {
        console.error('Servidor retornou erro:', response.status);
        setIsServerOnline(false);
        setError('O servidor de pagamento não está respondendo corretamente.');
      }
    } catch (err) {
      console.error('Erro ao verificar status do servidor:', err);
      setIsServerOnline(false);
      setError('Não foi possível conectar ao servidor de pagamento. Verifique se o servidor está rodando na porta 3001.');
    }
  };
  
  if (!isOpen) return null;

  // Determinar o ID do preço com base no plano e período
  const getPriceId = () => {
    const isPrime = planName.toLowerCase() === 'prime';
    const isYearly = planPrice.includes('ano');
    
    if (isPrime) {
      return isYearly ? 'prime-yearly' : 'prime-monthly';
    } else {
      return isYearly ? 'startend-yearly' : 'startend-monthly';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log("Iniciando checkout...");
      const priceId = getPriceId();
      console.log(`Usando priceId: ${priceId}`);
      
      const session = await createCheckoutSession(priceId);
      
      console.log("Resposta da API:", session);
      
      // Redireciona para a página de checkout do Stripe
      if (session.url) {
        console.log(`Redirecionando para: ${session.url}`);
        window.location.href = session.url;
      } else {
        throw new Error('URL de checkout não encontrada');
      }
    } catch (error: unknown) {
      console.error('Erro no checkout:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao processar pagamento';
      setError(errorMessage);
      toast({
        title: "Erro no processamento",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-saldo-background border border-saldo-border rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-saldo-border">
          <h2 className="text-xl font-bold">Assinar plano {planName}</h2>
          <button 
            onClick={onClose}
            className="text-saldo-text-secondary hover:text-saldo-text-primary"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <span className="text-saldo-text-secondary">Plano selecionado:</span>
            <div>
              <span className="font-bold">{planName}</span>
              <span className="ml-2 text-saldo-text-secondary">{planPrice}</span>
            </div>
          </div>
          
          {isServerOnline === false && (
            <div className="mb-4 p-3 bg-amber-100 border border-amber-300 text-amber-800 rounded flex items-start">
              <WifiOff className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Servidor de pagamento indisponível</p>
                <p className="text-xs mt-1">Certifique-se de que o servidor está rodando na porta 3001. Execute <code>node start-server.js</code> em um terminal separado.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 text-xs h-7" 
                  onClick={checkServerStatus}
                >
                  Verificar novamente
                </Button>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <Tabs defaultValue="card" onValueChange={(v) => setPaymentMethod(v as PaymentMethod)} className="mb-6">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="card" className="flex items-center gap-2" disabled={isLoading}>
                <CreditCard size={20} className="text-saldo-primary" />
                <span>Cartão</span>
              </TabsTrigger>
              <TabsTrigger value="boleto" className="flex items-center gap-2" disabled={isLoading}>
                <FileText size={20} className="text-saldo-primary" />
                <span>Boleto</span>
              </TabsTrigger>
              <TabsTrigger value="pix" className="flex items-center gap-2" disabled={isLoading}>
                <QrCode size={20} className="text-saldo-primary" />
                <span>Pix</span>
              </TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit}>
              {/* Formulário para Cartão de Crédito */}
              <TabsContent value="card" className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <CreditCard size={48} className="text-saldo-primary" />
                </div>
                <p className="text-sm text-center text-saldo-text-secondary mb-4">
                  Você será redirecionado para o checkout seguro do Stripe para concluir seu pagamento.
                </p>
              </TabsContent>
              
              {/* Formulário para Boleto */}
              <TabsContent value="boleto" className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <FileText size={48} className="text-saldo-primary" />
                </div>
                <p className="text-sm text-center text-saldo-text-secondary mb-4">
                  Você será redirecionado para o checkout seguro do Stripe para gerar seu boleto.
                </p>
              </TabsContent>
              
              {/* Formulário para Pix */}
              <TabsContent value="pix" className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <QrCode size={48} className="text-saldo-primary" />
                </div>
                <p className="text-sm text-center text-saldo-text-secondary mb-4">
                  Você será redirecionado para o checkout seguro do Stripe para concluir seu pagamento via Pix.
                </p>
              </TabsContent>
              
              <Button 
                type="submit" 
                className="w-full mt-8 btn-primary"
                disabled={isLoading || isServerOnline === false}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    {paymentMethod === 'card' ? 'Finalizar pagamento' : 
                     paymentMethod === 'boleto' ? 'Gerar boleto' : 'Gerar QR Code Pix'}
                  </>
                )}
              </Button>
            </form>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
