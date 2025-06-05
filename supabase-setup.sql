-- ================================================
-- SETUP COMPLETO DO SUPABASE PARA GRANANO ZAP
-- Execute este script no SQL Editor do Supabase
-- ================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- 1. TABELA CUSTOMERS
-- ================================================
CREATE TABLE customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR,
  phone VARCHAR,
  stripe_customer_id VARCHAR UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_stripe_id ON customers(stripe_customer_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customers_updated_at 
  BEFORE UPDATE ON customers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- 2. TABELA PLANS
-- ================================================
CREATE TABLE plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR NOT NULL,
  price_monthly DECIMAL(8,2),
  price_yearly DECIMAL(8,2),
  features JSONB,
  max_transactions INTEGER,
  is_active BOOLEAN DEFAULT true,
  stripe_price_id_monthly VARCHAR,
  stripe_price_id_yearly VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_plans_name ON plans(name);
CREATE INDEX idx_plans_active ON plans(is_active);

-- ================================================
-- 3. TABELA SUBSCRIPTIONS
-- ================================================
CREATE TABLE subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES plans(id),
  stripe_subscription_id VARCHAR UNIQUE,
  stripe_customer_id VARCHAR,
  status VARCHAR NOT NULL, -- 'active', 'canceled', 'past_due', 'incomplete'
  billing_period VARCHAR NOT NULL, -- 'monthly', 'yearly'
  amount DECIMAL(8,2) NOT NULL,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_subscriptions_customer ON subscriptions(customer_id);
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_subscriptions_updated_at 
  BEFORE UPDATE ON subscriptions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- 4. TABELA PAYMENTS
-- ================================================
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subscription_id UUID REFERENCES subscriptions(id),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  stripe_payment_intent_id VARCHAR UNIQUE,
  amount DECIMAL(8,2) NOT NULL,
  currency VARCHAR DEFAULT 'BRL',
  status VARCHAR NOT NULL, -- 'succeeded', 'pending', 'failed'
  payment_method VARCHAR, -- 'card', 'boleto', 'pix'
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_payments_customer ON payments(customer_id);
CREATE INDEX idx_payments_subscription ON payments(subscription_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_date ON payments(created_at);

-- ================================================
-- 5. TABELA LEADS
-- ================================================
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

-- Índices para performance
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_source ON leads(source);

-- ================================================
-- 6. CONFIGURAR ROW LEVEL SECURITY (RLS)
-- ================================================
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Políticas para customers (users podem ver apenas seus próprios dados)
CREATE POLICY "Customers can view their own data" ON customers
  FOR ALL USING (auth.uid()::text = id::text);

-- Políticas para plans (todos podem ver planos ativos)
CREATE POLICY "Anyone can view active plans" ON plans
  FOR SELECT USING (is_active = true);

-- Políticas para subscriptions (users podem ver apenas suas assinaturas)
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
  FOR ALL USING (
    customer_id IN (
      SELECT id FROM customers WHERE auth.uid()::text = id::text
    )
  );

-- Políticas para payments (users podem ver apenas seus pagamentos)
CREATE POLICY "Users can view their own payments" ON payments
  FOR ALL USING (
    customer_id IN (
      SELECT id FROM customers WHERE auth.uid()::text = id::text
    )
  );

-- Políticas para leads (acesso restrito - apenas inserção pública)
CREATE POLICY "Anyone can insert leads" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can view leads" ON leads
  FOR SELECT USING (false); -- Ajustar conforme necessário

-- ================================================
-- 7. INSERIR DADOS INICIAIS DOS PLANOS
-- ================================================
INSERT INTO plans (name, price_monthly, price_yearly, features, max_transactions, stripe_price_id_monthly, stripe_price_id_yearly) VALUES 
('Startend', 19.99, 203.90, 
 '["Até 60 lançamentos por mês", "WhatsApp integrado", "Dashboard básico", "Exportação PDF", "Suporte via chat"]'::jsonb, 
 60, 'price_1RQqc7QthMMZdZj2C8HBv5a2', 'price_1RQqc6QthMMZdZj2Ul3I8lUc'),
('Prime', 29.99, 305.90, 
 '["Até 120 lançamentos por mês", "Tudo do Startend", "Categorias ilimitadas", "Exportação em Excel", "Filtros inteligentes", "Suporte via WhatsApp"]'::jsonb, 
 120, 'price_1RQqc8QthMMZdZj2SGjUs1wy', 'price_1RQqc8QthMMZdZj2FbDyGIUu'),
('Enterprise', NULL, NULL, 
 '["Lançamentos ilimitados", "Relatórios gerenciais", "Alertas por WhatsApp", "Suporte dedicado", "Integrações via API", "Consultoria 1:1"]'::jsonb, 
 -1, NULL, NULL);

-- ================================================
-- 8. FUNÇÕES AUXILIARES
-- ================================================

-- Função para buscar plano por stripe_price_id
CREATE OR REPLACE FUNCTION get_plan_by_stripe_price_id(price_id TEXT)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  plan_uuid UUID;
BEGIN
  SELECT id INTO plan_uuid
  FROM plans 
  WHERE stripe_price_id_monthly = price_id 
     OR stripe_price_id_yearly = price_id;
  
  RETURN plan_uuid;
END;
$$;

-- Função para verificar se customer tem assinatura ativa
CREATE OR REPLACE FUNCTION customer_has_active_subscription(customer_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  has_active BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM subscriptions 
    WHERE customer_id = customer_uuid 
    AND status = 'active'
    AND current_period_end > NOW()
  ) INTO has_active;
  
  RETURN has_active;
END;
$$;

-- ================================================
-- 9. VIEWS ÚTEIS
-- ================================================

-- View com dados completos de assinaturas
CREATE VIEW subscription_details AS
SELECT 
  s.id as subscription_id,
  s.stripe_subscription_id,
  s.status,
  s.billing_period,
  s.amount,
  s.current_period_start,
  s.current_period_end,
  c.email as customer_email,
  c.name as customer_name,
  p.name as plan_name,
  p.max_transactions,
  s.created_at
FROM subscriptions s
JOIN customers c ON s.customer_id = c.id
JOIN plans p ON s.plan_id = p.id;

-- View com estatísticas de vendas
CREATE VIEW sales_stats AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as total_subscriptions,
  SUM(amount) as total_revenue,
  AVG(amount) as avg_revenue
FROM subscriptions
WHERE status = 'active'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- ================================================
-- 10. COMENTÁRIOS FINAIS
-- ================================================

-- Para conectar com seu Stripe webhook, use as seguintes informações:
-- - URL: https://qvlxefdinynlmgopjvtz.supabase.co
-- - Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

COMMENT ON TABLE customers IS 'Tabela de clientes do GranaNoZap';
COMMENT ON TABLE plans IS 'Planos de assinatura disponíveis';
COMMENT ON TABLE subscriptions IS 'Assinaturas ativas e históricas';
COMMENT ON TABLE payments IS 'Histórico de pagamentos';
COMMENT ON TABLE leads IS 'Leads capturados na landing page';

-- ================================================
-- SETUP CONCLUÍDO! 🎉
-- ================================================ 