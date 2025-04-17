
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
import { Tabs, TabsContent } from '@/components/ui/tabs';
import SettingsPage from '@/components/Settings/SettingsPage';
import UserProfile from '@/components/Settings/UserProfile';
import { toast } from 'sonner';
import { BarChart3, LayoutDashboard, Settings, User } from 'lucide-react';
import AppSidebar from '@/components/AppSidebar';

const IndexContent: React.FC = () => {
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<TransactionType | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  
  const { checkBudgetAlerts, processRecurringTransactions } = useTransactions();

  // Check for budget alerts and recurring transactions on component mount and periodically
  useEffect(() => {
    const checkAlerts = () => {
      try {
        const { messages } = checkBudgetAlerts();
        if (messages && messages.length > 0) {
          messages.forEach(message => toast.warning(message));
        }
      } catch (error) {
        console.error("Error checking budget alerts:", error);
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
  }, [checkBudgetAlerts, processRecurringTransactions]);

  const handleEditTransaction = (transaction: TransactionType) => {
    setTransactionToEdit(transaction);
    setIsAddTransactionModalOpen(true);
  };

  const handleFilterChange = (transactions: any[]) => {
    setFilteredTransactions(transactions);
  };

  const openAddTransactionModal = () => {
    setTransactionToEdit(undefined);
    setIsAddTransactionModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header openAddTransactionModal={openAddTransactionModal} />
      
      <div className="flex flex-1">
        <AppSidebar 
          openAddTransactionModal={openAddTransactionModal} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
        />
        
        <main className="flex-1 container mx-auto px-4 py-6 md:pl-20">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
            
            <TabsContent value="profile" className="animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold">User Profile</h1>
                  <p className="text-muted-foreground">Manage your account and preferences</p>
                </div>
              </div>
              <UserProfile />
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
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
