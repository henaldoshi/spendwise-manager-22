
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  PlusCircle,
  UserCircle,
  LogOut,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AppSidebarProps {
  openAddTransactionModal: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ 
  openAddTransactionModal, 
  activeTab,
  setActiveTab 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const menuItems = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      value: 'dashboard'
    },
    {
      name: 'Analytics',
      icon: <BarChart3 size={20} />,
      value: 'analytics'
    },
    {
      name: 'Settings',
      icon: <Settings size={20} />,
      value: 'settings'
    }
  ];
  
  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-30 transition-opacity duration-200",
          isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100 md:opacity-0 md:pointer-events-none"
        )}
        onClick={toggleSidebar}
      />
      
      <div 
        className={cn(
          "fixed left-0 top-0 h-full z-40 bg-card shadow-lg transition-all duration-200 flex flex-col",
          isCollapsed ? "w-16" : "w-64",
          "transform md:translate-x-0",
          isCollapsed ? "-translate-x-full md:translate-x-0" : "translate-x-0"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className={cn("flex items-center", isCollapsed ? "hidden md:flex" : "")}>
            <CreditCard className="h-6 w-6 text-primary mr-2" />
            <h1 className={cn("font-bold text-lg", isCollapsed ? "hidden" : "")}>SmartSpend</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:flex"
            onClick={toggleSidebar}
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </Button>
        </div>
        
        <div className="flex-1 py-6 overflow-y-auto">
          <div className="px-3 mb-6">
            <Button 
              className="w-full justify-start gap-2" 
              onClick={openAddTransactionModal}
            >
              <PlusCircle size={18} />
              {!isCollapsed && <span>Add Transaction</span>}
            </Button>
          </div>
          
          <nav className="space-y-1 px-3">
            {menuItems.map(item => (
              <Button
                key={item.value}
                variant={activeTab === item.value ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  isCollapsed ? "px-2" : "px-3"
                )}
                onClick={() => setActiveTab(item.value)}
              >
                {item.icon}
                {!isCollapsed && <span>{item.name}</span>}
              </Button>
            ))}
          </nav>
        </div>
        
        <div className="border-t p-4">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
            
            {!isCollapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium">User</p>
                <p className="text-xs text-muted-foreground">user@example.com</p>
              </div>
            )}
          </div>
          
          {isUserMenuOpen && !isCollapsed && (
            <div className="mt-3 space-y-1">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  setActiveTab('profile');
                }}
              >
                <UserCircle className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={() => {
                  toast.info("Logged out successfully");
                  setIsUserMenuOpen(false);
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Button 
          size="icon" 
          className="h-12 w-12 rounded-full shadow-lg"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </Button>
      </div>
    </>
  );
};

export default AppSidebar;
