
import React, { useState } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpRight, TrendingDown, TrendingUp, Calendar, DollarSign, Tag } from 'lucide-react';
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Helper functions
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

const generateMonthlyData = (transactions: any[]) => {
  const monthlyData: Record<string, { income: number; expense: number }> = {};
  
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);
  
  // Initialize all months with zero values
  for (let i = 0; i <= 5; i++) {
    const date = new Date();
    date.setMonth(now.getMonth() - i);
    const monthKey = date.toLocaleString('default', { month: 'short' }) + ' ' + date.getFullYear();
    monthlyData[monthKey] = { income: 0, expense: 0 };
  }
  
  // Populate with actual data
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    if (date >= sixMonthsAgo) {
      const monthKey = date.toLocaleString('default', { month: 'short' }) + ' ' + date.getFullYear();
      if (monthlyData[monthKey]) {
        if (transaction.type === 'income') {
          monthlyData[monthKey].income += transaction.amount;
        } else {
          monthlyData[monthKey].expense += transaction.amount;
        }
      }
    }
  });
  
  // Convert to array format for charts
  return Object.keys(monthlyData)
    .sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA.getTime() - dateB.getTime();
    })
    .map(month => ({
      name: month,
      Income: monthlyData[month].income,
      Expenses: monthlyData[month].expense
    }));
};

const getCategoryData = (transactions: any[], categories: any[]) => {
  const expensesByCategory: Record<string, number> = {};
  
  // Initialize categories with zero
  categories.forEach(category => {
    expensesByCategory[category.name] = 0;
  });
  
  // Sum up expenses by category
  transactions
    .filter(t => t.type === 'expense')
    .forEach(transaction => {
      const categoryName = transaction.category;
      if (expensesByCategory[categoryName] !== undefined) {
        expensesByCategory[categoryName] += transaction.amount;
      }
    });
  
  // Convert to array format for charts
  return Object.keys(expensesByCategory)
    .filter(category => expensesByCategory[category] > 0)
    .map(category => ({
      name: category,
      value: expensesByCategory[category]
    }));
};

const AnalyticsDashboard: React.FC = () => {
  const { transactions, categories } = useTransactions();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  
  // Filter transactions based on timeframe
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const today = new Date();
    
    if (timeframe === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 7);
      return transactionDate >= oneWeekAgo;
    } else if (timeframe === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(today.getMonth() - 1);
      return transactionDate >= oneMonthAgo;
    } else {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(today.getFullYear() - 1);
      return transactionDate >= oneYearAgo;
    }
  });
  
  // Calculate key metrics
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const netSavings = totalIncome - totalExpenses;
  
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
  
  // Get monthly trend data
  const monthlyTrendData = generateMonthlyData(transactions);
  
  // Get category data for pie chart
  const categoryData = getCategoryData(filteredTransactions, categories);
  
  // Define colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Gain insights into your financial patterns</p>
        </div>
        
        <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as any)} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-muted-foreground">
              {timeframe === 'week' ? 'Last 7 days' : timeframe === 'month' ? 'Last 30 days' : 'Last 12 months'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">
              {timeframe === 'week' ? 'Last 7 days' : timeframe === 'month' ? 'Last 30 days' : 'Last 12 months'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netSavings)}
            </div>
            <div className="flex items-center text-xs">
              <ArrowUpRight className={`h-3 w-3 ${netSavings >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              <span className={`ml-1 ${netSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {savingsRate.toFixed(1)}%
              </span>
              <span className="ml-1 text-muted-foreground">of income</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <>
                <div className="text-2xl font-bold">{categoryData[0]?.name}</div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(categoryData[0]?.value)} total spend
                </p>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No expense data</div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Income vs. Expenses</CardTitle>
            <CardDescription>Monthly comparison over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyTrendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Bar dataKey="Income" fill="#4ade80" />
                  <Bar dataKey="Expenses" fill="#f87171" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
            <CardDescription>Breakdown by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">No expense data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional insights */}
      <Card>
        <CardHeader>
          <CardTitle>Spending Insights</CardTitle>
          <CardDescription>Key trends and patterns in your financial data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {totalExpenses > 0 ? (
              <>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-1">Biggest Expense Category</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {categoryData[0]?.name} accounts for{' '}
                    {((categoryData[0]?.value / totalExpenses) * 100).toFixed(0)}% of your total expenses.
                  </p>
                  <div className="w-full bg-primary/10 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(categoryData[0]?.value / totalExpenses) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-1">Monthly Trend</h3>
                    <p className="text-sm text-muted-foreground">
                      {monthlyTrendData[monthlyTrendData.length - 1]?.Expenses > 
                       monthlyTrendData[monthlyTrendData.length - 2]?.Expenses
                        ? 'Your expenses are increasing compared to last month.'
                        : 'Your expenses are decreasing compared to last month.'}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-1">Savings Rate</h3>
                    <p className="text-sm text-muted-foreground">
                      {savingsRate > 20
                        ? 'Excellent! Your savings rate is above 20%.'
                        : savingsRate > 10
                        ? 'Good job. Your savings rate is above 10%.'
                        : savingsRate > 0
                        ? 'You\'re saving, but try to increase your rate above 10%.'
                        : 'Warning: You\'re spending more than you earn.'}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No expense data available for analysis. Add some transactions to see insights.
              </p>
            )}
            
            <div className="flex justify-end">
              <Button>Download Report</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
