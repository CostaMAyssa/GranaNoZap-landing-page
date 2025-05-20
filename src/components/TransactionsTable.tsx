import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { CircleCheck, ChartBar, ArrowUp, ArrowDown } from "lucide-react";

const TransactionsTable: React.FC = () => {
  // Estado para controlar visualização em dispositivos móveis
  const [isMobile, setIsMobile] = useState(false);

  // Verificar tamanho da tela quando componente montar e quando redimensionar
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Sample transaction data
  const transactions = [
    { id: 1, date: '15/06/2025', description: 'Salário', category: 'Renda', type: 'receita', value: 3500.00, status: 'confirmado' },
    { id: 2, date: '10/06/2025', description: 'Aluguel', category: 'Moradia', type: 'despesa', value: 1200.00, status: 'confirmado' },
    { id: 3, date: '12/06/2025', description: 'Supermercado', category: 'Alimentação', type: 'despesa', value: 450.75, status: 'confirmado' },
    { id: 4, date: '05/06/2025', description: 'Freelance', category: 'Renda Extra', type: 'receita', value: 1735.80, status: 'confirmado' },
    { id: 5, date: '08/06/2025', description: 'Gasolina', category: 'Transporte', type: 'despesa', value: 200.00, status: 'confirmado' },
    { id: 6, date: '14/06/2025', description: 'Cinema', category: 'Lazer', type: 'despesa', value: 80.00, status: 'confirmado' },
    { id: 7, date: '18/06/2025', description: 'Internet', category: 'Serviços', type: 'despesa', value: 120.00, status: 'pendente' },
  ];

  // Renderização para dispositivos móveis (cards em vez de tabela)
  const renderMobileView = () => {
    return (
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="bg-saldo-border/30 p-3 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium">{tx.date}</span>
              <span className={`text-sm font-bold ${tx.type === 'receita' ? 'text-saldo-income' : 'text-saldo-expense'}`}>
                {`R$ ${tx.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              </span>
            </div>
            <div className="mb-1">
              <span className="text-sm font-medium">{tx.description}</span>
            </div>
            <div className="flex justify-between text-xs text-saldo-text-secondary">
              <span className="flex items-center gap-1">
                <ChartBar className="h-3 w-3 text-saldo-primary" />
                {tx.category}
              </span>
              <span className={`flex items-center gap-1 ${tx.type === 'receita' ? 'text-saldo-income' : 'text-saldo-expense'}`}>
                {tx.type === 'receita' ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                {tx.type === 'receita' ? 'Receita' : 'Despesa'}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Renderização para desktop (tabela completa)
  const renderDesktopView = () => {
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-saldo-border hover:bg-saldo-border">
              <TableHead className="text-saldo-text-primary">Data</TableHead>
              <TableHead className="text-saldo-text-primary">Descrição</TableHead>
              <TableHead className="text-saldo-text-primary">Categoria</TableHead>
              <TableHead className="text-saldo-text-primary">Tipo</TableHead>
              <TableHead className="text-saldo-text-primary text-right">Valor</TableHead>
              <TableHead className="text-saldo-text-primary">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id} className="hover:bg-saldo-border/50">
                <TableCell className="font-medium">{tx.date}</TableCell>
                <TableCell>{tx.description}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-2">
                    <ChartBar className="h-4 w-4 text-saldo-primary" />
                    {tx.category}
                  </span>
                </TableCell>
                <TableCell>
                  {tx.type === 'receita' ? (
                    <span className="flex items-center gap-1 text-saldo-income">
                      <ArrowUp className="h-4 w-4" />
                      Receita
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-saldo-expense">
                      <ArrowDown className="h-4 w-4" />
                      Despesa
                    </span>
                  )}
                </TableCell>
                <TableCell className={`text-right ${tx.type === 'receita' ? 'text-saldo-income' : 'text-saldo-expense'}`}>
                  {`R$ ${tx.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                </TableCell>
                <TableCell>
                  {tx.status === 'confirmado' ? (
                    <span className="flex items-center gap-1 text-saldo-income">
                      <CircleCheck className="h-4 w-4" />
                      Confirmado
                    </span>
                  ) : (
                    <span className="text-saldo-text-secondary">Pendente</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <section className="section-padding bg-saldo-border/10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl text-center mb-8 font-poppins font-bold">
          Últimas <span className="text-saldo-primary">Transações</span>
        </h2>
        
        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <p className="text-saldo-text-secondary">Veja suas transações mais recentes e filtre-as facilmente</p>
          <div className="w-full md:w-64">
            <Input 
              placeholder="Buscar transação..." 
              className="bg-saldo-border text-saldo-text-primary border-saldo-border"
            />
          </div>
        </div>
        
        <div className="card-highlight p-0 md:p-4 overflow-hidden animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {isMobile ? renderMobileView() : renderDesktopView()}
        </div>
      </div>
    </section>
  );
};

export default TransactionsTable;
