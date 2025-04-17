
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { TransactionType, CategoryType, useTransactions } from '@/context/TransactionContext';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownRight,
  ShoppingBag,
  Home,
  Car,
  Film,
  Utensils,
  Bolt,
  HeartPulse,
  Wallet
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface TransactionListProps {
  onEditTransaction: (transaction: TransactionType) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ onEditTransaction }) => {
  const { transactions, categories, deleteTransaction } = useTransactions();

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'shopping-bag': return <ShoppingBag size={16} />;
      case 'home': return <Home size={16} />;
      case 'car': return <Car size={16} />;
      case 'film': return <Film size={16} />;
      case 'utensils': return <Utensils size={16} />;
      case 'bolt': return <Bolt size={16} />;
      case 'heart-pulse': return <HeartPulse size={16} />;
      case 'wallet': return <Wallet size={16} />;
      default: return <ShoppingBag size={16} />;
    }
  };

  const getCategoryById = (id: string): CategoryType | undefined => {
    return categories.find(cat => cat.id === id);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className="glass-card shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No transactions yet. Add one to get started!
          </div>
        ) : (
          <div className="space-y-4">
            {sortedTransactions.map((transaction, index) => {
              const category = getCategoryById(transaction.category);
              return (
                <div key={transaction.id} className="transaction-item">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-10 w-10 rounded-full flex items-center justify-center" 
                        style={{ backgroundColor: category?.color + '20' }}
                      >
                        {category ? (
                          <span style={{ color: category.color }}>
                            {getCategoryIcon(category.icon)}
                          </span>
                        ) : (
                          <ShoppingBag size={16} className="text-muted-foreground" />
                        )}
                      </div>
                      
                      <div>
                        <div className="font-medium">
                          {transaction.notes || (category ? category.name : 'Unknown')}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          {formatDate(transaction.date)}
                          {category && (
                            <>
                              <span>•</span>
                              <Badge 
                                variant="outline" 
                                className="text-xs py-0 h-5"
                                style={{ borderColor: category.color + '40', color: category.color }}
                              >
                                {category.name}
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`font-semibold flex items-center ${transaction.type === 'income' ? 'text-income' : 'text-expense'}`}>
                        {transaction.type === 'income' ? (
                          <ArrowUpRight size={16} className="mr-1" />
                        ) : (
                          <ArrowDownRight size={16} className="mr-1" />
                        )}
                        {formatCurrency(transaction.amount)}
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-muted transition-colors">
                            <MoreVertical size={16} className="text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => onEditTransaction(transaction)}>
                            <Edit size={14} className="mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteTransaction(transaction.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 size={14} className="mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  {index < sortedTransactions.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionList;
