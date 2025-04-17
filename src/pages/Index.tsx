
import React, { useState } from 'react';
import Header from '@/components/Header';
import SummaryCards from '@/components/Dashboard/SummaryCards';
import TransactionList from '@/components/Dashboard/TransactionList';
import ExpenseChart from '@/components/Dashboard/ExpenseChart';
import AddTransactionModal from '@/components/AddTransactionModal';
import { TransactionProvider, TransactionType } from '@/context/TransactionContext';
import { ThemeProvider } from '@/context/ThemeContext';
import MobileNav from '@/components/Dashboard/MobileNav';
import TransactionFilter from '@/components/Dashboard/TransactionFilter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<TransactionType | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);

  const handleEditTransaction = (transaction: TransactionType) => {
    setTransactionToEdit(transaction);
    setIsAddTransactionModalOpen(true);
  };

  const handleFilterChange = (transactions: any[]) => {
    setFilteredTransactions(transactions);
  };

  return (
    <ThemeProvider>
      <TransactionProvider>
        <div className="min-h-screen flex flex-col pb-16 sm:pb-0">
          <Header openAddTransactionModal={() => {
            setTransactionToEdit(undefined);
            setIsAddTransactionModalOpen(true);
          }} />
          
          <main className="flex-1 container mx-auto px-4 py-6">
            <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="hidden sm:flex w-full justify-start mb-6">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard" className="animate-fade-in">
                <SummaryCards />
                
                <TransactionFilter onFilterChange={handleFilterChange} />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <TransactionList onEditTransaction={handleEditTransaction} />
                  </div>
                  <div className="hidden lg:block">
                    <ExpenseChart />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="analytics" className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ExpenseChart />
                  
                  <div className="glass-card p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Analytics</h2>
                    <p className="text-muted-foreground">
                      Advanced analytics features coming soon! This will include income vs. expense trends, 
                      monthly comparisons, and budget tracking.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="animate-fade-in">
                <div className="glass-card p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Settings</h2>
                  <p className="text-muted-foreground">
                    Settings page coming soon! Here you'll be able to manage categories,
                    set budgets, and personalize your experience.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </main>
          
          <MobileNav 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            openAddTransactionModal={() => {
              setTransactionToEdit(undefined);
              setIsAddTransactionModalOpen(true);
            }} 
          />
          
          <AddTransactionModal 
            isOpen={isAddTransactionModalOpen} 
            onClose={() => {
              setIsAddTransactionModalOpen(false);
              setTransactionToEdit(undefined);
            }}
            transactionToEdit={transactionToEdit}
          />
        </div>
      </TransactionProvider>
    </ThemeProvider>
  );
};

export default Index;
