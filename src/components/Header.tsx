
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

interface HeaderProps {
  openAddTransactionModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ openAddTransactionModal }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary">
            <span className="text-smartspend-blue">Smart</span>
            <span className="text-smartspend-purple">Spend</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            onClick={openAddTransactionModal}
            className="bg-smartspend-teal hover:bg-smartspend-teal/90 text-white"
          >
            Add Transaction
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleTheme} 
            className="ml-2"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
