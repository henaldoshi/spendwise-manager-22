
import React from 'react';
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
  CreditCard,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

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
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
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
    },
    {
      name: 'Profile',
      icon: <UserCircle size={20} />,
      value: 'profile'
    }
  ];

  const handleLogout = () => {
    toast.info("Logged out successfully");
    setIsUserMenuOpen(false);
    navigate('/');
  };
  
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center p-4">
          <CreditCard className="h-6 w-6 text-primary mr-2" />
          <h1 className="font-bold text-lg">SmartSpend</h1>
        </div>
      </SidebarHeader>
        
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Home"
                  isActive={location.pathname === '/'}
                  onClick={() => navigate('/')}
                >
                  <Home size={20} />
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {menuItems.map(item => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    tooltip={item.name}
                    isActive={activeTab === item.value}
                    onClick={() => setActiveTab(item.value)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Add Transaction"
                  onClick={openAddTransactionModal}
                >
                  <PlusCircle size={20} />
                  <span>Add Transaction</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
        
      <SidebarFooter>
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
              
              <div className="ml-3">
                <p className="text-sm font-medium">User</p>
                <p className="text-xs text-muted-foreground">user@example.com</p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleLogout}
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
