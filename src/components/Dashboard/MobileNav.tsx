
import React from 'react';
import { Home, PieChart, Plus, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAddTransactionModal: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab, openAddTransactionModal }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 sm:hidden bg-background border-t border-border">
      <div className="flex justify-around items-center p-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={cn(
            "flex flex-col items-center justify-center w-16 h-14 rounded-md transition-colors",
            activeTab === 'dashboard' ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </button>
        
        <button
          onClick={() => setActiveTab('analytics')}
          className={cn(
            "flex flex-col items-center justify-center w-16 h-14 rounded-md transition-colors",
            activeTab === 'analytics' ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <PieChart size={20} />
          <span className="text-xs mt-1">Analytics</span>
        </button>
        
        <button
          onClick={openAddTransactionModal}
          className="flex flex-col items-center justify-center -mt-5 bg-smartspend-teal hover:bg-smartspend-teal/90 text-white w-14 h-14 rounded-full shadow-lg transition-colors"
        >
          <Plus size={24} />
        </button>
        
        <button
          onClick={() => setActiveTab('settings')}
          className={cn(
            "flex flex-col items-center justify-center w-16 h-14 rounded-md transition-colors",
            activeTab === 'settings' ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Settings size={20} />
          <span className="text-xs mt-1">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNav;
