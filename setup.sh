
#!/bin/bash

# Script para preparar e executar o ambiente de desenvolvimento

echo "Instalando dependências..."
npm install

echo "Configurando variáveis de ambiente..."
if [ ! -f .env ]; then
  echo "# Stripe API Keys
VITE_STRIPE_PUBLIC_KEY=pk_test_sua_chave_publica_aqui
STRIPE_SECRET_KEY=sk_test_sua_chave_secreta_aqui

# URLs
VITE_APP_URL=http://localhost:5173
VITE_API_URL=http://localhost:3001
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret_aqui" > .env
fi

echo "Iniciando ambiente de desenvolvimento..."
npm run dev
