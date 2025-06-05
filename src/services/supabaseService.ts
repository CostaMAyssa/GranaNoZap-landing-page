import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

// Types
type Customer = Tables<'customers'>;
type Plan = Tables<'plans'>;
type Subscription = Tables<'subscriptions'>;
type Payment = Tables<'payments'>;
type Lead = Tables<'leads'>;

export class SupabaseService {
  // ==========================================
  // CUSTOMERS
  // ==========================================
  
  static async createOrUpdateCustomer(customerData: {
    email: string;
    name?: string;
    phone?: string;
    stripe_customer_id?: string;
  }): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .upsert({
        email: customerData.email,
        name: customerData.name,
        phone: customerData.phone,
        stripe_customer_id: customerData.stripe_customer_id,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'email'
      })
      .select()
      .single();

    if (error) throw new Error(`Erro ao criar/atualizar customer: ${error.message}`);
    return data;
  }

  static async getCustomerByEmail(email: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Erro ao buscar customer: ${error.message}`);
    }
    
    return data;
  }

  static async getCustomerByStripeId(stripeCustomerId: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('stripe_customer_id', stripeCustomerId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Erro ao buscar customer por Stripe ID: ${error.message}`);
    }
    
    return data;
  }

  // ==========================================
  // PLANS
  // ==========================================
  
  static async getAllPlans(): Promise<Plan[]> {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('is_active', true)
      .order('price_monthly');

    if (error) throw new Error(`Erro ao buscar planos: ${error.message}`);
    return data || [];
  }

  static async getPlanByStripeId(stripePriceId: string): Promise<Plan | null> {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .or(`stripe_price_id_monthly.eq.${stripePriceId},stripe_price_id_yearly.eq.${stripePriceId}`)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Erro ao buscar plano por Stripe ID: ${error.message}`);
    }
    
    return data;
  }

  // ==========================================
  // SUBSCRIPTIONS
  // ==========================================
  
  static async createSubscription(subscriptionData: {
    customer_id: string;
    plan_id: string;
    stripe_subscription_id: string;
    stripe_customer_id: string;
    status: string;
    billing_period: string;
    amount: number;
    current_period_start?: string;
    current_period_end?: string;
  }): Promise<Subscription> {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(subscriptionData)
      .select()
      .single();

    if (error) throw new Error(`Erro ao criar subscription: ${error.message}`);
    return data;
  }

  static async updateSubscription(
    stripeSubscriptionId: string, 
    updates: TablesUpdate<'subscriptions'>
  ): Promise<Subscription> {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', stripeSubscriptionId)
      .select()
      .single();

    if (error) throw new Error(`Erro ao atualizar subscription: ${error.message}`);
    return data;
  }

  static async getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<Subscription | null> {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('stripe_subscription_id', stripeSubscriptionId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Erro ao buscar subscription: ${error.message}`);
    }
    
    return data;
  }

  static async getCustomerActiveSubscription(customerId: string): Promise<Subscription | null> {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('customer_id', customerId)
      .eq('status', 'active')
      .gte('current_period_end', new Date().toISOString())
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Erro ao buscar subscription ativa: ${error.message}`);
    }
    
    return data;
  }

  // ==========================================
  // PAYMENTS
  // ==========================================
  
  static async createPayment(paymentData: {
    customer_id: string;
    subscription_id?: string;
    stripe_payment_intent_id?: string;
    amount: number;
    currency?: string;
    status: string;
    payment_method?: string;
    description?: string;
  }): Promise<Payment> {
    const { data, error } = await supabase
      .from('payments')
      .insert({
        currency: 'BRL',
        ...paymentData
      })
      .select()
      .single();

    if (error) throw new Error(`Erro ao criar payment: ${error.message}`);
    return data;
  }

  static async getPaymentsByCustomer(customerId: string): Promise<Payment[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Erro ao buscar payments: ${error.message}`);
    return data || [];
  }

  // ==========================================
  // LEADS
  // ==========================================
  
  static async createLead(leadData: {
    email?: string;
    name?: string;
    phone?: string;
    source?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    interested_plan?: string;
  }): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .insert({
        status: 'new',
        ...leadData
      })
      .select()
      .single();

    if (error) throw new Error(`Erro ao criar lead: ${error.message}`);
    return data;
  }

  // ==========================================
  // ANALYTICS & STATS
  // ==========================================
  
  static async getSubscriptionStats(): Promise<{
    total_active: number;
    total_revenue: number;
    new_this_month: number;
  }> {
    // Total de assinaturas ativas
    const { count: totalActive } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Receita total das assinaturas ativas
    const { data: revenueData } = await supabase
      .from('subscriptions')
      .select('amount')
      .eq('status', 'active');

    const totalRevenue = revenueData?.reduce((sum, sub) => sum + sub.amount, 0) || 0;

    // Novas assinaturas neste mês
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: newThisMonth } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString());

    return {
      total_active: totalActive || 0,
      total_revenue: totalRevenue,
      new_this_month: newThisMonth || 0
    };
  }

  // ==========================================
  // UTILITIES
  // ==========================================
  
  static async checkCustomerAccess(customerId: string): Promise<boolean> {
    const subscription = await this.getCustomerActiveSubscription(customerId);
    return !!subscription;
  }

  static async getCustomerPlanLimits(customerId: string): Promise<{
    max_transactions: number;
    plan_name: string;
  } | null> {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        plans (
          name,
          max_transactions
        )
      `)
      .eq('customer_id', customerId)
      .eq('status', 'active')
      .single();

    if (error || !data) return null;

    // Type assertion para os dados retornados do join (plans retorna como array)
    const subscription = data as unknown as { 
      plans: { name: string; max_transactions: number }[] 
    };
    
    const plan = subscription.plans[0];
    if (!plan) return null;
    
    return {
      max_transactions: plan.max_transactions,
      plan_name: plan.name
    };
  }
}

// Export default para facilitar importação
export default SupabaseService; 