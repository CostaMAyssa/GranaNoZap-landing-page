
import React from 'react';
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

  return (
    <section className="section-padding bg-saldo-border/10">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl text-center mb-8 font-poppins font-bold">
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
        
        <div className="card-highlight p-0 overflow-hidden animate-fade-in" style={{ animationDelay: '0.1s' }}>
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
        </div>
      </div>
    </section>
  );
};

export default TransactionsTable;
