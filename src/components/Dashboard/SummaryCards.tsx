
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';
import { useTransactions } from '@/context/TransactionContext';

const SummaryCards: React.FC = () => {
  const { totalIncome, totalExpenses, balance } = useTransactions();

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-fade-in">
      <Card className="glass-card overflow-hidden shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Income</p>
              <h3 className="text-2xl font-bold text-income mt-1">
                {formatCurrency(totalIncome)}
              </h3>
            </div>
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <ArrowUpRight className="h-6 w-6 text-income" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card overflow-hidden shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Expenses</p>
              <h3 className="text-2xl font-bold text-expense mt-1">
                {formatCurrency(totalExpenses)}
              </h3>
            </div>
            <div className="h-12 w-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <ArrowDownRight className="h-6 w-6 text-expense" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card overflow-hidden shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Balance</p>
              <h3 className={`text-2xl font-bold mt-1 ${balance >= 0 ? 'text-income' : 'text-expense'}`}>
                {formatCurrency(balance)}
              </h3>
            </div>
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Wallet className="h-6 w-6 text-smartspend-blue" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
