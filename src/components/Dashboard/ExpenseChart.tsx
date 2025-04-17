
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTransactions } from '@/context/TransactionContext';

const ExpenseChart: React.FC = () => {
  const { transactions, categories } = useTransactions();

  // Group expenses by category and calculate total for each
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const categoryId = transaction.category;
      if (!acc[categoryId]) {
        acc[categoryId] = 0;
      }
      acc[categoryId] += transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  // Convert to array for the chart
  const chartData = Object.entries(expensesByCategory).map(([categoryId, amount]) => {
    const category = categories.find(c => c.id === categoryId);
    return {
      name: category ? category.name : 'Unknown',
      value: amount,
      color: category ? category.color : '#999',
    };
  });

  // Sort by amount (largest first)
  chartData.sort((a, b) => b.value - a.value);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border border-border rounded-md shadow-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-smartspend-teal font-semibold">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-card shadow-sm h-[400px]">
      <CardHeader className="pb-2">
        <CardTitle>Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No expense data to display
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={renderCustomTooltip} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;
