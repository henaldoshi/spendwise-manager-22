
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SummaryCards from '@/components/Dashboard/SummaryCards';
import TransactionList from '@/components/Dashboard/TransactionList';
import ExpenseChart from '@/components/Dashboard/ExpenseChart';
import AddTransactionModal from '@/components/AddTransactionModal';
import { TransactionProvider, TransactionType, useTransactions } from '@/context/TransactionContext';
import { ThemeProvider } from '@/context/ThemeContext';
import MobileNav from '@/components/Dashboard/MobileNav';
import TransactionFilter from '@/components/Dashboard/TransactionFilter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SettingsPage from '@/components/Settings/SettingsPage';
import { toast } from 'sonner';
import { BarChart3, LayoutDashboard, Settings } from 'lucide-react';

const IndexContent: React.FC = () => {
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<TransactionType | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  
  const { checkBudgetAlerts, processRecurringTransactions } = useTransactions();

  // Check for budget alerts and recurring transactions on component mount and periodically
  useEffect(() => {
    const checkAlerts = () => {
      const { messages } = checkBudgetAlerts();
      if (messages.length > 0) {
        messages.forEach(message => toast.warning(message));
      }
    };
    
    // Initial check
    checkAlerts();
    processRecurringTransactions();
    
    // Set up interval checks
    const alertsInterval = setInterval(checkAlerts, 3600000); // Check every hour
    const recurringInterval = setInterval(processRecurringTransactions, 86400000); // Check every day
    
    return () => {
      clearInterval(alertsInterval);
      clearInterval(recurringInterval);
    };
  }, []);

  const handleEditTransaction = (transaction: TransactionType) => {
    setTransactionToEdit(transaction);
    setIsAddTransactionModalOpen(true);
  };

  const handleFilterChange = (transactions: any[]) => {
    setFilteredTransactions(transactions);
  };

  return (
    <div className="min-h-screen flex flex-col pb-16 sm:pb-0">
      <Header openAddTransactionModal={() => {
        setTransactionToEdit(undefined);
        setIsAddTransactionModalOpen(true);
      }} />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="hidden sm:flex sm:justify-start mb-6 bg-background/90 backdrop-blur-sm p-1 rounded-lg border">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
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
            <SettingsPage />
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
  );
};

const Index = () => (
  <ThemeProvider>
    <TransactionProvider>
      <IndexContent />
    </TransactionProvider>
  </ThemeProvider>
);

export default Index;
