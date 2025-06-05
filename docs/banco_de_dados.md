
Excelente pergunta! Vou analisar a landing page do GranaNoZap e definir as tabelas essenciais para um sistema de vendas funcional:

Search files...
## **📊 TABELAS ESSENCIAIS PARA LANDING PAGE - GRANANO ZAP**

### **🎯 TABELAS PRINCIPAIS**

#### **1. 👥 TABELA: `customers`**
```sql
CREATE TABLE customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR,
  phone VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **2. 📋 TABELA: `plans`**
```sql
CREATE TABLE plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR NOT NULL, -- 'Startend', 'Prime', 'Enterprise'
  price_monthly DECIMAL(8,2),
  price_yearly DECIMAL(8,2),
  features JSONB, -- Array de features do plano
  max_transactions INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **3. 💳 TABELA: `subscriptions`**
```sql
CREATE TABLE subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  plan_id UUID REFERENCES plans(id),
  stripe_subscription_id VARCHAR UNIQUE,
  stripe_customer_id VARCHAR,
  status VARCHAR, -- 'active', 'canceled', 'past_due', 'incomplete'
  billing_period VARCHAR, -- 'monthly', 'yearly'
  amount DECIMAL(8,2),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **4. 💰 TABELA: `payments`**
```sql
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subscription_id UUID REFERENCES subscriptions(id),
  customer_id UUID REFERENCES customers(id),
  stripe_payment_intent_id VARCHAR UNIQUE,
  amount DECIMAL(8,2) NOT NULL,
  currency VARCHAR DEFAULT 'BRL',
  status VARCHAR, -- 'succeeded', 'pending', 'failed'
  payment_method VARCHAR, -- 'card', 'boleto', 'pix'
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **5. 📧 TABELA: `leads`**
```sql
CREATE TABLE leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR,
  name VARCHAR,
  phone VARCHAR,
  source VARCHAR, -- 'landing_page', 'whatsapp', 'referral'
  utm_source VARCHAR,
  utm_medium VARCHAR,
  utm_campaign VARCHAR,
  interested_plan VARCHAR,
  status VARCHAR DEFAULT 'new', -- 'new', 'contacted', 'converted', 'lost'
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **6. 🎟️ TABELA: `coupons`**
```sql
CREATE TABLE coupons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code VARCHAR UNIQUE NOT NULL,
  discount_type VARCHAR, -- 'percentage', 'fixed'
  discount_value DECIMAL(8,2),
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMP DEFAULT NOW(),
  valid_until TIMESTAMP,
  applicable_plans JSONB, -- Array de planos válidos
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **🔗 TABELAS AUXILIARES**

#### **7. 📊 TABELA: `analytics_events`**
```sql
CREATE TABLE analytics_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id VARCHAR,
  event_type VARCHAR, -- 'page_view', 'button_click', 'form_submit', 'checkout_start'
  event_data JSONB,
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **8. 📞 TABELA: `contact_requests`**
```sql
CREATE TABLE contact_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR,
  email VARCHAR,
  phone VARCHAR,
  message TEXT,
  type VARCHAR, -- 'support', 'sales', 'enterprise'
  status VARCHAR DEFAULT 'pending', -- 'pending', 'responded', 'closed'
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **📝 DADOS INICIAIS PARA INSERIR**

#### **Planos (seeds)**
```sql
INSERT INTO plans (name, price_monthly, price_yearly, features, max_transactions) VALUES 
('Startend', 19.99, 203.90, 
 '["Até 60 lançamentos por mês", "WhatsApp integrado", "Dashboard básico", "Exportação PDF", "Suporte via chat"]'::jsonb, 
 60),
('Prime', 29.99, 305.90, 
 '["Até 120 lançamentos por mês", "Tudo do Startend", "Categorias ilimitadas", "Exportação em Excel", "Filtros inteligentes", "Suporte via WhatsApp"]'::jsonb, 
 120),
('Enterprise', NULL, NULL, 
 '["Lançamentos ilimitados", "Relatórios gerenciais", "Alertas por WhatsApp", "Suporte dedicado", "Integrações via API", "Consultoria 1:1"]'::jsonb, 
 -1);
```

### **🎯 FUNCIONALIDADES QUE CADA TABELA SUPORTA**

#### **✅ Checkout e Pagamentos**
- `customers`: Dados do comprador
- `subscriptions`: Controle de assinaturas
- `payments`: Histórico de pagamentos
- `plans`: Preços e features dos planos

#### **✅ Marketing e Vendas**
- `leads`: Captura de interesse
- `contact_requests`: Solicitações de contato
- `coupons`: Códigos promocionais
- `analytics_events`: Tracking de conversão

#### **✅ Controle de Acesso**
- `subscriptions`: Verificar se usuário pode acessar dashboard
- `plans`: Limites de cada plano
- `customers`: Dados para login

### **🚀 INTEGRAÇÃO COM STRIPE**

```typescript
// Exemplo de uso com as tabelas
import { supabase } from "@/integrations/supabase/client";

// Criar cliente e assinatura após pagamento
const createSubscription = async (stripeSubscription: any) => {
  // 1. Criar/atualizar cliente
  const { data: customer } = await supabase
    .from('customers')
    .upsert({
      email: stripeSubscription.customer_email,
      stripe_customer_id: stripeSubscription.customer
    });

  // 2. Criar assinatura
  const { data: subscription } = await supabase
    .from('subscriptions')
    .insert({
      customer_id: customer.id,
      stripe_subscription_id: stripeSubscription.id,
      status: stripeSubscription.status,
      amount: stripeSubscription.items.data[0].price.unit_amount / 100
    });

  return subscription;
};
```

### **📋 ORDEM DE IMPLEMENTAÇÃO**

1. **✅ Primeiro**: `customers`, `plans` (essenciais)
2. **✅ Segundo**: `subscriptions`, `payments` (checkout)
3. **✅ Terceiro**: `leads`, `contact_requests` (marketing)
4. **✅ Quarto**: `coupons`, `analytics_events` (extras)

Essas tabelas darão suporte completo para uma landing page que vende assinaturas do GranaNoZap! 🚀
