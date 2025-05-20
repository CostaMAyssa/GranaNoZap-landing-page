import { loadStripe } from '@stripe/stripe-js';

// Chave pública do Stripe
const stripePublicKey = 'pk_test_51RQpMqQthMMZdZj24KgMjUjrg1aL5SrHx0poDkJ5rur62Vzz0igogbFawWgZKGdYprnQtg5JFVAoaCC94SUB01UB00tKOVqFz1';

export const stripePromise = loadStripe(stripePublicKey);

export const createCheckoutSession = async (priceId: string) => {
  try {
    const response = await fetch('http://localhost:3001/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
      }),
    });

    const session = await response.json();
    
    if (session.error) {
      console.error('Erro ao criar sessão:', session.error);
      throw new Error(session.error.message);
    }
    
    return session;
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    throw error;
  }
}; 