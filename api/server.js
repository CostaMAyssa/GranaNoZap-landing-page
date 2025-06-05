import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Inicializa o Stripe com a chave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

// Inicializa o Supabase
const supabaseUrl = "https://qvlxefdinynlmgopjvtz.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8081',
    'https://grananozap.com'
  ],
  credentials: true
}));

// Teste de conexão
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Servidor GranaNoZap está online!', 
    timestamp: new Date().toISOString(),
    supabase_connected: !!supabase,
    stripe_connected: !!stripe
  });
});

// Funções auxiliares Supabase
async function createOrUpdateCustomer(email, name = null, stripeCustomerId = null) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .upsert({
        email,
        name,
        stripe_customer_id: stripeCustomerId,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'email'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao criar/atualizar customer:', error);
    throw error;
  }
}

async function getPlanByStripeId(stripePriceId) {
  try {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .or(`stripe_price_id_monthly.eq.${stripePriceId},stripe_price_id_yearly.eq.${stripePriceId}`)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar plano:', error);
    return null;
  }
}

// Middleware para webhook
app.use('/api/webhook', express.raw({type: 'application/json'}));
app.use(express.json());

// Rota para criar sessão de checkout
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    console.log('Recebida solicitação para criar sessão de checkout:', req.body);
    
    const { priceId, customerEmail, customerName } = req.body;
    
    if (!priceId) {
      return res.status(400).json({ error: { message: 'Preço do produto não fornecido.' } });
    }

    const priceIds = {
      'startend-monthly': 'price_1RQqc7QthMMZdZj2C8HBv5a2',
      'startend-yearly': 'price_1RQqc6QthMMZdZj2Ul3I8lUc',
      'prime-monthly': 'price_1RQqc8QthMMZdZj2SGjUs1wy',
      'prime-yearly': 'price_1RQqc8QthMMZdZj2FbDyGIUu',
    };
    
    const actualPriceId = priceIds[priceId] || priceId;
    console.log(`Usando ID de preço: ${actualPriceId}`);

    let stripeCustomer = null;
    if (customerEmail) {
      try {
        const existingCustomers = await stripe.customers.list({
          email: customerEmail,
          limit: 1
        });

        if (existingCustomers.data.length > 0) {
          stripeCustomer = existingCustomers.data[0];
        } else {
          stripeCustomer = await stripe.customers.create({
            email: customerEmail,
            name: customerName
          });
        }
      } catch (customerError) {
        console.error('Erro ao criar/buscar customer:', customerError);
      }
    }
    
    const sessionConfig = {
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
      metadata: {
        price_id: priceId
      }
    };

    if (stripeCustomer) {
      sessionConfig.customer = stripeCustomer.id;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log('Sessão de checkout criada com sucesso:', { id: session.id, url: session.url });
    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Erro ao criar sessão:', error.message);
    
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

// Webhook para processar eventos do Stripe
app.post('/api/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`Evento recebido: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Checkout session completed:', session.id);
        
        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          await handleSubscriptionCreated(subscription);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        console.log('Subscription created/updated:', subscription.id);
        await handleSubscriptionCreated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log('Subscription canceled:', subscription.id);
        await updateSubscriptionStatus(subscription.id, 'canceled');
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        console.log('Payment succeeded:', invoice.id);
        await handlePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.log('Payment failed:', invoice.id);
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Evento não tratado: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Handlers de webhook
async function handleSubscriptionCreated(subscription) {
  try {
    const customer = await stripe.customers.retrieve(subscription.customer);
    
    const supabaseCustomer = await createOrUpdateCustomer(
      customer.email,
      customer.name,
      customer.id
    );

    const priceId = subscription.items.data[0].price.id;
    const plan = await getPlanByStripeId(priceId);
    
    if (!plan) {
      console.error('Plano não encontrado para price_id:', priceId);
      return;
    }

    const billingPeriod = subscription.items.data[0].price.recurring.interval === 'year' ? 'yearly' : 'monthly';
    
    const subscriptionData = {
      customer_id: supabaseCustomer.id,
      plan_id: plan.id,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer,
      status: subscription.status,
      billing_period: billingPeriod,
      amount: subscription.items.data[0].price.unit_amount / 100,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
    };

    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (existingSubscription) {
      await supabase
        .from('subscriptions')
        .update({
          ...subscriptionData,
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', subscription.id);
    } else {
      await supabase
        .from('subscriptions')
        .insert(subscriptionData);
    }

    console.log('Subscription sincronizada com sucesso no Supabase');
  } catch (error) {
    console.error('Erro ao processar subscription:', error);
  }
}

async function updateSubscriptionStatus(stripeSubscriptionId, status) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', stripeSubscriptionId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao atualizar subscription:', error);
    throw error;
  }
}

async function handlePaymentSucceeded(invoice) {
  try {
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('stripe_customer_id', invoice.customer)
      .single();

    if (!customer) {
      console.error('Customer não encontrado:', invoice.customer);
      return;
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('stripe_subscription_id', invoice.subscription)
      .single();

    const paymentData = {
      customer_id: customer.id,
      subscription_id: subscription?.id || null,
      stripe_payment_intent_id: invoice.payment_intent,
      amount: invoice.amount_paid / 100,
      currency: invoice.currency.toUpperCase(),
      status: 'succeeded',
      payment_method: 'card',
      description: invoice.description || `Pagamento da fatura ${invoice.number}`
    };

    await supabase
      .from('payments')
      .insert(paymentData);

    console.log('Payment registrado com sucesso no Supabase');
  } catch (error) {
    console.error('Erro ao processar payment succeeded:', error);
  }
}

async function handlePaymentFailed(invoice) {
  try {
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('stripe_customer_id', invoice.customer)
      .single();

    if (!customer) {
      console.error('Customer não encontrado:', invoice.customer);
      return;
    }

    if (invoice.subscription) {
      await updateSubscriptionStatus(invoice.subscription, 'past_due');
    }

    const paymentData = {
      customer_id: customer.id,
      amount: invoice.amount_due / 100,
      currency: invoice.currency.toUpperCase(),
      status: 'failed',
      description: `Falha no pagamento da fatura ${invoice.number}`
    };

    await supabase
      .from('payments')
      .insert(paymentData);

    console.log('Payment failure registrado no Supabase');
  } catch (error) {
    console.error('Erro ao processar payment failed:', error);
  }
}

// Rota para estatísticas administrativas
app.get('/api/admin/stats', async (req, res) => {
  try {
    const { count: totalActive } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { data: revenueData } = await supabase
      .from('subscriptions')
      .select('amount')
      .eq('status', 'active');

    const totalRevenue = revenueData?.reduce((sum, sub) => sum + sub.amount, 0) || 0;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: newThisMonth } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString());

    res.json({
      total_active_subscriptions: totalActive || 0,
      total_monthly_revenue: totalRevenue,
      new_subscriptions_this_month: newThisMonth || 0
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor GranaNoZap rodando na porta ${port}`);
  console.log(`🔗 Supabase: ${supabaseUrl}`);
  console.log(`💳 Stripe: ${stripe ? 'Conectado' : 'Não conectado'}`);
});

export default app; 
