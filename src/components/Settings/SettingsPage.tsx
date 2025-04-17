
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BudgetSettings from './BudgetSettings';
import CategorySettings from './CategorySettings';
import RecurringTransactions from './RecurringTransactions';
import ReportsExport from './ReportsExport';
import ThemeSettings from './ThemeSettings';
import { Badge } from '@/components/ui/badge';
import { useTransactions } from '@/context/TransactionContext';
import { Bell, Wallet, Tag, Repeat, FileText, Paintbrush } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('budgets');
  const { budgets, transactions } = useTransactions();
  
  // Count recurring transactions
  const recurringCount = transactions.filter(t => t.isRecurring).length;
  
  // Check if any budget is over 80% used
  const budgetAlerts = budgets.filter(budget => {
    const percentage = budget.spent / budget.amount * 100;
    return percentage >= 80;
  }).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your preferences and financial settings</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8">
          <TabsTrigger value="budgets" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span className="hidden md:inline">Budgets</span>
            {budgetAlerts > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {budgetAlerts}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span className="hidden md:inline">Categories</span>
          </TabsTrigger>
          
          <TabsTrigger value="recurring" className="flex items-center gap-2">
            <Repeat className="h-4 w-4" />
            <span className="hidden md:inline">Recurring</span>
            {recurringCount > 0 && (
              <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-blue-500 text-white">
                {recurringCount}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Reports</span>
          </TabsTrigger>
          
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Paintbrush className="h-4 w-4" />
            <span className="hidden md:inline">Appearance</span>
          </TabsTrigger>
          
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">Alerts</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="budgets" className="space-y-4 animate-fade-in">
          <BudgetSettings />
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4 animate-fade-in">
          <CategorySettings />
        </TabsContent>
        
        <TabsContent value="recurring" className="space-y-4 animate-fade-in">
          <RecurringTransactions />
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4 animate-fade-in">
          <ReportsExport />
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4 animate-fade-in">
          <ThemeSettings />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 animate-fade-in">
          <div className="glass-card p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Budget Alerts
            </h2>
            <p className="text-muted-foreground mb-4">
              You will receive notifications when you exceed budget thresholds
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <h3 className="font-medium">Budget Warning</h3>
                  <p className="text-sm text-muted-foreground">When you've used 80% of any budget</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="budget-warning"
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                    defaultChecked={true}
                  />
                  <label htmlFor="budget-warning" className="ml-2 text-sm">Enabled</label>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <h3 className="font-medium">Budget Alert</h3>
                  <p className="text-sm text-muted-foreground">When you exceed any budget</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="budget-alert"
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                    defaultChecked={true}
                  />
                  <label htmlFor="budget-alert" className="ml-2 text-sm">Enabled</label>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <h3 className="font-medium">Weekly Summary</h3>
                  <p className="text-sm text-muted-foreground">Receive a weekly spending summary</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="weekly-summary"
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                    defaultChecked={false}
                  />
                  <label htmlFor="weekly-summary" className="ml-2 text-sm">Enabled</label>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
