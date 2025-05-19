import React, { useState } from 'react';
import { X, CreditCard, Receipt, QrCode } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  planPrice: string;
}

type PaymentMethod = 'card' | 'boleto' | 'pix';

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, planName, planPrice }) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria integrado com a API da Stripe
    alert('Em um ambiente real, este formulário seria processado pela Stripe');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-saldo-background border border-saldo-border rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-saldo-border">
          <h2 className="text-xl font-bold">Assinar plano {planName}</h2>
          <button 
            onClick={onClose}
            className="text-saldo-text-secondary hover:text-saldo-text-primary"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <span className="text-saldo-text-secondary">Plano selecionado:</span>
            <div>
              <span className="font-bold">{planName}</span>
              <span className="ml-2 text-saldo-text-secondary">{planPrice}</span>
            </div>
          </div>
          
          <Tabs defaultValue="card" onValueChange={(v) => setPaymentMethod(v as PaymentMethod)} className="mb-6">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="card" className="flex items-center gap-2">
                <CreditCard size={20} className="text-saldo-primary" />
                <span>Cartão</span>
              </TabsTrigger>
              <TabsTrigger value="boleto" className="flex items-center gap-2">
                <Receipt size={20} className="text-saldo-primary" />
                <span>Boleto</span>
              </TabsTrigger>
              <TabsTrigger value="pix" className="flex items-center gap-2">
                <QrCode size={20} className="text-saldo-primary" />
                <span>Pix</span>
              </TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit}>
              {/* Formulário para Cartão de Crédito */}
              <TabsContent value="card" className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <CreditCard size={48} className="text-saldo-primary" />
                </div>
                <div>
                  <Label htmlFor="card-name">Nome no cartão</Label>
                  <Input id="card-name" placeholder="Nome como aparece no cartão" required />
                </div>
                <div>
                  <Label htmlFor="card-number">Número do cartão</Label>
                  <Input id="card-number" placeholder="1234 5678 9012 3456" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="card-expiry">Validade (MM/AA)</Label>
                    <Input id="card-expiry" placeholder="MM/AA" required />
                  </div>
                  <div>
                    <Label htmlFor="card-cvc">CVC</Label>
                    <Input id="card-cvc" placeholder="123" required />
                  </div>
                </div>
              </TabsContent>
              
              {/* Formulário para Boleto */}
              <TabsContent value="boleto" className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <Receipt size={48} className="text-saldo-primary" />
                </div>
                <div>
                  <Label htmlFor="boleto-name">Nome completo</Label>
                  <Input id="boleto-name" placeholder="Seu nome completo" required />
                </div>
                <div>
                  <Label htmlFor="boleto-email">Email</Label>
                  <Input id="boleto-email" type="email" placeholder="seu@email.com" required />
                </div>
                <div>
                  <Label htmlFor="boleto-cpf">CPF</Label>
                  <Input id="boleto-cpf" placeholder="000.000.000-00" required />
                </div>
                <div>
                  <Label htmlFor="boleto-address">Endereço</Label>
                  <Input id="boleto-address" placeholder="Rua, número" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="boleto-city">Cidade</Label>
                    <Input id="boleto-city" placeholder="Cidade" required />
                  </div>
                  <div>
                    <Label htmlFor="boleto-cep">CEP</Label>
                    <Input id="boleto-cep" placeholder="00000-000" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="boleto-state">Estado</Label>
                    <Input id="boleto-state" placeholder="UF" required />
                  </div>
                  <div>
                    <Label htmlFor="boleto-country">País</Label>
                    <Input id="boleto-country" placeholder="Brasil" defaultValue="Brasil" required />
                  </div>
                </div>
              </TabsContent>
              
              {/* Formulário para Pix */}
              <TabsContent value="pix" className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <QrCode size={48} className="text-saldo-primary" />
                </div>
                <div>
                  <Label htmlFor="pix-name">Nome completo</Label>
                  <Input id="pix-name" placeholder="Seu nome completo" required />
                </div>
                <div>
                  <Label htmlFor="pix-cpf">CPF</Label>
                  <Input id="pix-cpf" placeholder="000.000.000-00" required />
                </div>
                <div>
                  <Label htmlFor="pix-email">Email</Label>
                  <Input id="pix-email" type="email" placeholder="seu@email.com" required />
                </div>
              </TabsContent>
              
              <Button type="submit" className="w-full mt-8 btn-primary">
                {paymentMethod === 'card' ? 'Finalizar pagamento' : 
                 paymentMethod === 'boleto' ? 'Gerar boleto' : 'Gerar QR Code Pix'}
              </Button>
            </form>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal; 