import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const ChartSection: React.FC = () => {
  // Sample data for the monthly balance chart
  const monthlyData = [
    { name: 'Jan', receita: 4200, despesa: 3800, saldo: 400 },
    { name: 'Fev', receita: 4500, despesa: 3900, saldo: 600 },
    { name: 'Mar', receita: 4100, despesa: 3700, saldo: 400 },
    { name: 'Abr', receita: 4800, despesa: 3950, saldo: 850 },
    { name: 'Mai', receita: 5000, despesa: 4000, saldo: 1000 },
    { name: 'Jun', receita: 5235.80, despesa: 3842.75, saldo: 1393.05 },
  ];

  // Sample data for the category distribution pie chart
  const categoryData = [
    { name: 'Moradia', value: 1200 },
    { name: 'Alimentação', value: 800 },
    { name: 'Transporte', value: 600 },
    { name: 'Lazer', value: 300 },
    { name: 'Outros', value: 942.75 },
  ];

  // Colors for the pie chart
  const COLORS = ['#34d399', '#f87171', '#8b5cf6', '#d4af37', '#60a5fa'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-saldo-border p-3 rounded-md border border-saldo-border shadow-lg">
          <p className="font-bold text-saldo-text-primary">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: R$ ${entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Renderização responsiva do rótulo do gráfico de pizza
  const renderCustomizedLabel = ({ name, percent, x, y, cx, midAngle }: any) => {
    // Em telas pequenas, não mostrar texto, apenas valores no Legend
    if (window.innerWidth < 768) {
      return null;
    }
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Calcular o tamanho do gráfico de pizza com base na largura da tela
  const getPieChartSize = () => {
    return window.innerWidth < 768 ? 90 : 120;
  };

  return (
    <section className="section-padding bg-saldo-background">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl text-center mb-8 md:mb-16 font-poppins font-bold">
          Gráficos <span className="text-saldo-primary">Interativos</span>
        </h2>
        
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          <div className="card-highlight h-[300px] md:h-[400px] animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-center">Saldo Mensal</h3>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={monthlyData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#a9b0a6" fontSize={12} />
                <YAxis stroke="#a9b0a6" fontSize={12} width={40} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="receita" name="Receita" fill="#34d399" radius={[4, 4, 0, 0]} />
                <Bar dataKey="despesa" name="Despesa" fill="#f87171" radius={[4, 4, 0, 0]} />
                <Bar dataKey="saldo" name="Saldo" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="card-highlight h-[300px] md:h-[400px] animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-center">Distribuição por Categoria</h3>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={window.innerWidth < 768 ? 90 : 120}
                  fill="#8884d8"
                  dataKey="value"
                  label={renderCustomizedLabel}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChartSection;
