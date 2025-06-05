# 🚀 INTEGRAÇÃO COMPLETA STRIPE + SUPABASE - GRANANO ZAP

Este guia mostra como configurar completamente a integração entre Stripe e Supabase para o sistema GranaNoZap.

## 📋 PRÉ-REQUISITOS

- [x] Conta Supabase criada
- [x] Conta Stripe configurada 
- [x] Projeto GranaNoZap clonado
- [ ] Variáveis de ambiente configuradas

## 🗄️ PASSO 1: CONFIGURAR BANCO DE DADOS

### 1.1 Executar SQL no Supabase

1. Acesse seu projeto Supabase: https://qvlxefdinynlmgopjvtz.supabase.co
2. Vá em **SQL Editor**
3. Copie e execute o conteúdo do arquivo `supabase-setup.sql`

```sql
-- O arquivo supabase-setup.sql contém:
-- ✅ Criação de todas as tabelas
-- ✅ Configuração de RLS (Row Level Security)
-- ✅ Inserção dos planos iniciais
-- ✅ Funções auxiliares
-- ✅ Views para relatórios
```

### 1.2 Verificar Tabelas Criadas

Após executar o SQL, você deve ter as seguintes tabelas:

- `customers` - Dados dos clientes
- `plans` - Planos de assinatura
- `subscriptions` - Assinaturas ativas
- `payments` - Histórico de pagamentos  
- `leads` - Leads capturados

## 🔑 PASSO 2: CONFIGURAR VARIÁVEIS DE AMBIENTE

### 2.1 Criar arquivo .env na raiz do projeto

```bash
# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_test_sua_chave_publica_stripe
STRIPE_SECRET_KEY=sk_test_sua_chave_secreta_stripe
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret

# Supabase
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_supabase

# URLs
VITE_APP_URL=http://localhost:5173
VITE_API_URL=http://localhost:3001
```

### 2.2 Onde encontrar as chaves

#### Stripe:
1. Dashboard Stripe → Desenvolvedores → Chaves de API
2. Copie a **Chave publicável** e **Chave secreta**

#### Supabase:
1. Dashboard Supabase → Configurações → API
2. Copie a **service_role key** (não a anon key!)

## 📦 PASSO 3: CONFIGURAR PRODUTOS NO STRIPE

### 3.1 Criar Produtos

No Dashboard do Stripe, crie os seguintes produtos:

#### Produto: GranaNoZap Startend
- **Preço Mensal**: R$ 19,99/mês
- **Preço Anual**: R$ 203,90/ano
- **ID Mensal**: `price_1RQqc7QthMMZdZj2C8HBv5a2`
- **ID Anual**: `price_1RQqc6QthMMZdZj2Ul3I8lUc`

#### Produto: GranaNoZap Prime  
- **Preço Mensal**: R$ 29,99/mês
- **Preço Anual**: R$ 305,90/ano
- **ID Mensal**: `price_1RQqc8QthMMZdZj2SGjUs1wy`
- **ID Anual**: `price_1RQqc8QthMMZdZj2FbDyGIUu`

### 3.2 Atualizar IDs no Código

Os IDs já estão configurados no arquivo `api/server.js`:

```javascript
const priceIds = {
  'startend-monthly': 'price_1RQqc7QthMMZdZj2C8HBv5a2',
  'startend-yearly': 'price_1RQqc6QthMMZdZj2Ul3I8lUc', 
  'prime-monthly': 'price_1RQqc8QthMMZdZj2SGjUs1wy',
  'prime-yearly': 'price_1RQqc8QthMMZdZj2FbDyGIUu',
};
```

## 🔗 PASSO 4: CONFIGURAR WEBHOOKS

### 4.1 Criar Webhook no Stripe

1. Dashboard Stripe → Desenvolvedores → Webhooks
2. Clique em **Adicionar endpoint**
3. URL: `https://seu-dominio.com/api/webhook` (ou `http://localhost:3001/api/webhook` para testes)
4. Eventos para escutar:

```
✅ checkout.session.completed
✅ customer.subscription.created  
✅ customer.subscription.updated
✅ customer.subscription.deleted
✅ invoice.payment_succeeded
✅ invoice.payment_failed
```

5. Copie o **Signing Secret** e adicione no `.env` como `STRIPE_WEBHOOK_SECRET`

### 4.2 Testar Webhook Localmente

Para testes locais, use o Stripe CLI:

```bash
# Instalar Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Encaminhar webhooks para localhost
stripe listen --forward-to localhost:3001/api/webhook
```

## 🚀 PASSO 5: EXECUTAR O SISTEMA

### 5.1 Instalar Dependências

```bash
npm install
```

### 5.2 Iniciar em Modo Desenvolvimento

```bash
npm run start:dev
```

Este comando inicia:
- Frontend (Vite): http://localhost:5173
- Backend (Express): http://localhost:3001

### 5.3 Testar Integração

1. Acesse http://localhost:5173
2. Clique em "Quero começar agora"
3. Escolha um plano (Startend ou Prime)
4. Complete o checkout com dados de teste:

```
Cartão: 4242 4242 4242 4242
Data: Qualquer data futura
CVC: Qualquer 3 dígitos
```

## 🧪 PASSO 6: VERIFICAR FUNCIONAMENTO

### 6.1 Logs do Servidor

Verifique os logs no terminal para confirmar:

```
✅ Servidor GranaNoZap rodando na porta 3001
✅ Supabase: https://qvlxefdinynlmgopjvtz.supabase.co  
✅ Stripe: Conectado
✅ Checkout session completed: cs_xxx
✅ Subscription created/updated: sub_xxx
✅ Subscription sincronizada com sucesso no Supabase
```

### 6.2 Verificar no Supabase

1. Acesse o Dashboard do Supabase
2. Vá em **Table Editor**
3. Verifique se foram criados registros em:
   - `customers`
   - `subscriptions` 
   - `payments`

### 6.3 Endpoint de Estatísticas

Teste o endpoint de estatísticas:

```bash
curl http://localhost:3001/api/admin/stats
```

Resposta esperada:
```json
{
  "total_active_subscriptions": 1,
  "total_monthly_revenue": 19.99,
  "new_subscriptions_this_month": 1
}
```

## 🔧 PASSO 7: FUNCIONALIDADES IMPLEMENTADAS

### ✅ Checkout Completo
- Criação de sessões Stripe
- Redirecionamento para pagamento
- Captura de dados do cliente

### ✅ Sincronização Automática
- Webhooks Stripe → Supabase
- Criação automática de customers
- Gerenciamento de subscriptions
- Registro de payments

### ✅ Serviços Supabase
- CRUD completo para todas as entidades
- Verificação de acesso de clientes
- Estatísticas de vendas
- Funções auxiliares

### ✅ Segurança
- Row Level Security habilitado
- Validação de webhooks Stripe
- Tratamento de erros

## 🚀 PASSO 8: PRÓXIMOS PASSOS

### Para Produção:
1. **Trocar chaves de teste por produção**
2. **Configurar domínio no webhook**
3. **Adicionar autenticação nas rotas admin**
4. **Configurar SSL/HTTPS**

### Para Dashboard:
1. **Usar `SupabaseService` nos componentes**
2. **Implementar autenticação de usuários**
3. **Criar páginas de gerenciamento**
4. **Adicionar relatórios**

## 📞 SUPORTE

Em caso de problemas:

1. **Verifique os logs** do servidor e do browser
2. **Confirme as variáveis** de ambiente
3. **Teste os webhooks** com Stripe CLI
4. **Valide os dados** no Supabase

---

## 🎯 RESUMO DO QUE FOI IMPLEMENTADO

✅ **Database**: 5 tabelas + RLS + funções  
✅ **Stripe**: Checkout + webhooks + sincronização  
✅ **Supabase**: Serviços + tipos TypeScript  
✅ **Backend**: API completa + handlers  
✅ **Frontend**: Integração com checkout  

**🎉 SISTEMA PRONTO PARA VENDAS! 🎉** 