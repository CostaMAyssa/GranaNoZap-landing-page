
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createProducts() {
  try {
    console.log('Criando produtos e preços no Stripe...');

    // Criar produto Startend
    const startendProduct = await stripe.products.create({
      name: 'Startend',
      description: 'Para quem está começando a organizar suas finanças.',
    });

    console.log(`Produto Startend criado com ID: ${startendProduct.id}`);

    // Criar preços para Startend
    const startendMonthly = await stripe.prices.create({
      product: startendProduct.id,
      unit_amount: 1999, // R$ 19,99
      currency: 'brl',
      recurring: {
        interval: 'month',
      },
      nickname: 'Startend Mensal',
    });

    const startendYearly = await stripe.prices.create({
      product: startendProduct.id,
      unit_amount: 20390, // R$ 203,90
      currency: 'brl',
      recurring: {
        interval: 'year',
      },
      nickname: 'Startend Anual',
    });

    console.log(`Preço Startend Mensal criado com ID: ${startendMonthly.id}`);
    console.log(`Preço Startend Anual criado com ID: ${startendYearly.id}`);

    // Criar produto Prime
    const primeProduct = await stripe.products.create({
      name: 'Prime',
      description: 'Ideal para quem já tem volume médio de movimentações.',
    });

    console.log(`Produto Prime criado com ID: ${primeProduct.id}`);

    // Criar preços para Prime
    const primeMonthly = await stripe.prices.create({
      product: primeProduct.id,
      unit_amount: 2999, // R$ 29,99
      currency: 'brl',
      recurring: {
        interval: 'month',
      },
      nickname: 'Prime Mensal',
    });

    const primeYearly = await stripe.prices.create({
      product: primeProduct.id,
      unit_amount: 30590, // R$ 305,90
      currency: 'brl',
      recurring: {
        interval: 'year',
      },
      nickname: 'Prime Anual',
    });

    console.log(`Preço Prime Mensal criado com ID: ${primeMonthly.id}`);
    console.log(`Preço Prime Anual criado com ID: ${primeYearly.id}`);

    // Mostrar IDs para atualizar no servidor - já atualizados com os valores fornecidos
    console.log('\nIDs de preço atualizados no servidor:');
    console.log(`'startend-monthly': 'price_1RQqc7QthMMZdZj2C8HBv5a2',`);  // Startend Mensal
    console.log(`'startend-yearly': 'price_1RQqc6QthMMZdZj2Ul3I8lUc',`);   // Startend Anual 
    console.log(`'prime-monthly': 'price_1RQqc8QthMMZdZj2SGjUs1wy',`);     // Prime Mensal
    console.log(`'prime-yearly': 'price_1RQqc8QthMMZdZj2FbDyGIUu'`);       // Prime Anual
  } catch (error) {
    console.error('Erro ao criar produtos e preços:', error);
  }
}

createProducts(); 
