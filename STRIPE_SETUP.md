# Configuração do Stripe para o GranaNoZap

Este guia irá ajudá-lo a configurar a integração com o Stripe para processar pagamentos de assinaturas no GranaNoZap.

## Pré-requisitos

1. Uma conta no Stripe (você pode criar uma em [stripe.com](https://stripe.com))
2. Node.js e npm instalados em seu sistema

## Passo 1: Configurar sua conta Stripe

1. Faça login no [Dashboard do Stripe](https://dashboard.stripe.com/)
2. Vá para a seção de Produtos e clique em "Criar Produto"
3. Crie os seguintes produtos e preços:

### Produto: Startend
- **Preço Mensal**: R$ 19,99/mês (recorrente)
- **Preço Anual**: R$ 203,90/ano (recorrente)

### Produto: Prime
- **Preço Mensal**: R$ 29,99/mês (recorrente)
- **Preço Anual**: R$ 305,90/ano (recorrente)

## Passo 2: Obter as chaves de API

1. No Dashboard do Stripe, vá para Desenvolvedores → Chaves de API
2. Copie a "Chave publicável" e a "Chave secreta"
   - Para testes, use as chaves que começam com `pk_test_` e `sk_test_`
   - Para produção, use as chaves que começam com `pk_live_` e `sk_live_`

## Passo 3: Configurar o arquivo .env

Crie ou edite o arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:

```
# Stripe API Keys
VITE_STRIPE_PUBLIC_KEY=pk_test_sua_chave_publica_aqui
STRIPE_SECRET_KEY=sk_test_sua_chave_secreta_aqui

# URLs
VITE_APP_URL=http://localhost:5173
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret_aqui
```

## Passo 4: Configurar IDs de preços no servidor

Edite o arquivo `api/server.js` e atualize o objeto `priceIds` com os IDs dos preços que você criou no Stripe:

```javascript
const priceIds = {
  'startend-monthly': 'price_seu_id_do_startend_mensal',
  'startend-yearly': 'price_seu_id_do_startend_anual',
  'prime-monthly': 'price_seu_id_do_prime_mensal',
  'prime-yearly': 'price_seu_id_do_prime_anual',
};
```

Você pode encontrar os IDs dos preços no Dashboard do Stripe, na seção Produtos, clicando em cada produto e copiando o ID do preço.

## Passo 5: Configurar Webhooks (Opcional, mas recomendado)

1. No Dashboard do Stripe, vá para Desenvolvedores → Webhooks
2. Clique em "Adicionar endpoint"
3. Configure seu endpoint de webhook (em desenvolvimento, você pode usar [Stripe CLI](https://stripe.com/docs/stripe-cli) para testar webhooks localmente)
4. Adicione os seguintes eventos para ouvir:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `invoice.payment_succeeded`
5. Copie o "Signing Secret" e adicione-o ao seu arquivo `.env` como `STRIPE_WEBHOOK_SECRET`

## Passo 6: Testar o Checkout

1. Execute o servidor de desenvolvimento com `npm run start:dev`
2. Acesse o site e tente fazer uma assinatura
3. Use os dados de cartão de teste do Stripe:
   - Número: 4242 4242 4242 4242
   - Data: Qualquer data futura
   - CVC: Qualquer 3 dígitos
   - Nome e endereço: Qualquer valor

## Solução de Problemas

### Pagamentos não estão sendo processados
- Verifique se as chaves de API estão corretas
- Certifique-se de que os IDs de preço estão corretos
- Verifique os logs do servidor e do console do navegador para erros

### Webhooks não estão funcionando
- Verifique se o webhook secret está configurado corretamente
- Use o Stripe CLI para depurar eventos de webhook localmente

## Recursos Adicionais

- [Documentação do Stripe](https://stripe.com/docs)
- [Documentação do Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Documentação de Assinaturas do Stripe](https://stripe.com/docs/billing/subscriptions/overview) 