import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Inicializa o Stripe com a chave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10', // Usando a versão mais recente da API
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:5173'],
  credentials: true,
}));

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando!', timestamp: new Date().toISOString() });
});

// Rota para criar uma sessão de checkout
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    console.log('Recebida solicitação para criar sessão de checkout:', req.body);
    
    const { priceId } = req.body;
    
    if (!priceId) {
      return res.status(400).json({ error: { message: 'Preço do produto não fornecido.' } });
    }

    // Mapeamento de preços do Stripe (IDs reais do Stripe)
    const priceIds = {
      'startend-monthly': 'price_1RQqc6QthMMZdZj2Ul3I8lUc',
      'startend-yearly': 'price_1RQqc7QthMMZdZj2C8HBv5a2',
      'prime-monthly': 'price_1RQqc8QthMMZdZj2FbDyGIUu',
      'prime-yearly': 'price_1RQqc8QthMMZdZj2SGjUs1wy',
    };
    
    // Verificar se o priceId existe no mapeamento
    const actualPriceId = priceIds[priceId] || priceId;
    console.log(`Usando ID de preço: ${actualPriceId}`);
    
    // Cria sessão de checkout de acordo com a documentação
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: actualPriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.VITE_APP_URL || 'http://localhost:8081'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_APP_URL || 'http://localhost:8081'}/canceled`,
    });

    console.log('Sessão de checkout criada com sucesso:', { id: session.id, url: session.url });
    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Erro ao criar sessão:', error.message);
    
    // Retorna um erro formatado conforme recomendação da documentação
    res.status(500).json({
      error: {
        type: 'api_error',
        message: error.message || 'Erro ao criar sessão de checkout.',
        code: error.code,
        param: error.param,
      },
    });
  }
});

// Configurar corretamente para lidar com webhooks
const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

// Webhook para processar eventos do Stripe
app.post('/api/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Lida com o evento
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Implementar lógica quando uma compra for finalizada com sucesso
      console.log('Pagamento bem-sucedido:', session);
      break;
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      const subscription = event.data.object;
      // Implementar lógica quando uma assinatura for criada ou atualizada
      console.log('Assinatura criada/atualizada:', subscription);
      break;
    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      // Implementar lógica quando um pagamento de fatura for bem-sucedido
      console.log('Pagamento de fatura bem-sucedido:', invoice);
      break;
    default:
      console.log(`Evento não tratado: ${event.type}`);
  }

  res.json({ received: true });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`API disponível em http://localhost:${port}/api/test`);
});

export default app; 