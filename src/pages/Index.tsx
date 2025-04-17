
import React, { useState, useEffect } from 'react';
import { TransactionProvider, TransactionType, useTransactions } from '@/context/TransactionContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { toast } from 'sonner';
import AppSidebar from '@/components/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import SummaryCards from '@/components/Dashboard/SummaryCards';
import TransactionList from '@/components/Dashboard/TransactionList';
import ExpenseChart from '@/components/Dashboard/ExpenseChart';
import AddTransactionModal from '@/components/AddTransactionModal';
import TransactionFilter from '@/components/Dashboard/TransactionFilter';
import SettingsPage from '@/components/Settings/SettingsPage';
import UserProfile from '@/components/Settings/UserProfile';
import AnalyticsDashboard from '@/components/Analytics/AnalyticsDashboard';

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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
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
          </div>
        );
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'settings':
        return <SettingsPage />;
      case 'profile':
        return <UserProfile />;
      default:
        return null;
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <AppSidebar 
          openAddTransactionModal={openAddTransactionModal} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
        />
        
        <SidebarInset>
          <main className="flex-1 container py-6 px-4 md:px-6">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
      
      <AddTransactionModal 
        isOpen={isAddTransactionModalOpen} 
        onClose={() => {
          setIsAddTransactionModalOpen(false);
          setTransactionToEdit(undefined);
        }}
        transactionToEdit={transactionToEdit}
      />
    </SidebarProvider>
  );
};

// Add a missing import at the top
import { useState } from 'react';

const Index = () => (
  <ThemeProvider>
    <TransactionProvider>
      <IndexContent />
    </TransactionProvider>
  </ThemeProvider>
);

export default Index;
