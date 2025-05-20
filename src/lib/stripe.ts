
import { loadStripe } from '@stripe/stripe-js';
import { toast } from "@/components/ui/use-toast";

// Get the Stripe public key from environment variables or use the fallback
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51RQpMqQthMMZdZj24KgMjUjrg1aL5SrHx0poDkJ5rur62Vzz0igogbFawWgZKGdYprnQtg5JFVAoaCC94SUB01UB00tKOVqFz1';

// API URL - Ajustado para usar uma URL que funcione tanto em desenvolvimento quanto em produção
const API_URL = import.meta.env.VITE_API_URL || window.location.hostname === 'localhost' 
  ? 'http://localhost:3001' 
  : 'https://api.grananozap.com';

export const stripePromise = loadStripe(stripePublicKey);

export const createCheckoutSession = async (priceId: string) => {
  try {
    console.log(`Creating checkout session for price ID: ${priceId}`);
    console.log(`Using API URL: ${API_URL}`);
    
    const response = await fetch(`${API_URL}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: 'Network error' } }));
      console.error('Erro na resposta do servidor:', errorData);
      throw new Error(errorData.error?.message || 'Erro ao conectar com o servidor de pagamento');
    }

    const session = await response.json();
    
    if (session.error) {
      console.error('Erro ao criar sessão:', session.error);
      throw new Error(session.error.message || 'Erro ao criar sessão de pagamento');
    }
    
    console.log('Sessão criada com sucesso:', session);
    return session;
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    toast({
      title: "Erro de conexão",
      description: error instanceof Error ? error.message : "Não foi possível conectar ao servidor de pagamento. Verifique sua conexão.",
      variant: "destructive"
    });
    throw error;
  }
};
