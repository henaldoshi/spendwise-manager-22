
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { toast } from "sonner";

// Define types for our application
export type CategoryType = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

export type TransactionType = {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  notes: string;
  isRecurring?: boolean;
  recurringPeriod?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextOccurrence?: string;
};

export type BudgetType = {
  id: string;
  categoryId: string; // if empty, it's a total budget
  amount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  spent: number; // This will be calculated
  remaining: number; // This will be calculated
  startDate: string;
  endDate?: string;
};

export type ReportType = {
  id: string;
  name: string;
  type: 'income' | 'expense' | 'all';
  period: 'weekly' | 'monthly' | 'yearly';
  format: 'csv' | 'pdf';
  createdAt: string;
};

type TransactionState = {
  transactions: TransactionType[];
  categories: CategoryType[];
  budgets: BudgetType[];
  reports: ReportType[];
};

type TransactionAction =
  | { type: 'ADD_TRANSACTION'; payload: TransactionType }
  | { type: 'EDIT_TRANSACTION'; payload: TransactionType }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: CategoryType }
  | { type: 'EDIT_CATEGORY'; payload: CategoryType }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'ADD_BUDGET'; payload: BudgetType }
  | { type: 'EDIT_BUDGET'; payload: BudgetType }
  | { type: 'DELETE_BUDGET'; payload: string }
  | { type: 'ADD_REPORT'; payload: ReportType }
  | { type: 'DELETE_REPORT'; payload: string }
  | { type: 'SET_INITIAL_DATA'; payload: TransactionState };

type TransactionContextType = {
  transactions: TransactionType[];
  categories: CategoryType[];
  budgets: BudgetType[];
  reports: ReportType[];
  addTransaction: (transaction: Omit<TransactionType, 'id'>) => void;
  editTransaction: (transaction: TransactionType) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<CategoryType, 'id'>) => void;
  editCategory: (category: CategoryType) => void;
  deleteCategory: (id: string) => void;
  addBudget: (budget: Omit<BudgetType, 'id' | 'spent' | 'remaining'>) => void;
  editBudget: (budget: BudgetType) => void;
  deleteBudget: (id: string) => void;
  addReport: (report: Omit<ReportType, 'id' | 'createdAt'>) => void;
  deleteReport: (id: string) => void;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  filterTransactionsByDate: (start?: Date, end?: Date) => TransactionType[];
  filterTransactionsByCategory: (categoryId: string) => TransactionType[];
  getSpentByCategory: (categoryId: string, period?: 'daily' | 'weekly' | 'monthly' | 'yearly') => number;
  getBudgetStatus: (budgetId: string) => { spent: number; remaining: number; percentage: number };
  checkBudgetAlerts: () => { alertBudgets: BudgetType[], messages: string[] };
  generateReport: (type: 'csv' | 'pdf', period: 'weekly' | 'monthly' | 'yearly') => void;
  processRecurringTransactions: () => void;
};

// Initial sample data
const initialDefaultCategories: CategoryType[] = [
  { id: '1', name: 'Food & Dining', color: '#FF5A5A', icon: 'utensils' },
  { id: '2', name: 'Housing & Rent', color: '#5D5FEF', icon: 'home' },
  { id: '3', name: 'Transportation', color: '#3B82F6', icon: 'car' },
  { id: '4', name: 'Entertainment', color: '#8B5CF6', icon: 'film' },
  { id: '5', name: 'Shopping', color: '#EC4899', icon: 'shopping-bag' },
  { id: '6', name: 'Utilities', color: '#F59E0B', icon: 'bolt' },
  { id: '7', name: 'Healthcare', color: '#10B981', icon: 'heart-pulse' },
  { id: '8', name: 'Income', color: '#4CAF50', icon: 'wallet' },
];

const initialDefaultTransactions: TransactionType[] = [
  {
    id: '1',
    amount: 2500,
    type: 'income',
    category: '8',
    date: new Date().toISOString(),
    notes: 'Monthly salary',
  },
  {
    id: '2',
    amount: 35.50,
    type: 'expense',
    category: '1',
    date: new Date(Date.now() - 86400000).toISOString(), // yesterday
    notes: 'Dinner at restaurant',
  },
  {
    id: '3',
    amount: 950,
    type: 'expense',
    category: '2',
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    notes: 'Rent payment',
  },
  {
    id: '4',
    amount: 125.75,
    type: 'expense',
    category: '5',
    date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    notes: 'New clothes',
  },
  {
    id: '5',
    amount: 45.20,
    type: 'expense',
    category: '3',
    date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    notes: 'Gas refill',
  },
];

const initialDefaultBudgets: BudgetType[] = [
  {
    id: '1',
    categoryId: '',
    amount: 2000,
    period: 'monthly',
    spent: 0,
    remaining: 2000,
    startDate: new Date().toISOString(),
  },
  {
    id: '2',
    categoryId: '1',
    amount: 300,
    period: 'monthly',
    spent: 0,
    remaining: 300,
    startDate: new Date().toISOString(),
  },
];

const initialState: TransactionState = {
  transactions: initialDefaultTransactions,
  categories: initialDefaultCategories,
  budgets: initialDefaultBudgets,
  reports: [],
};

// Reducer for state management
const transactionReducer = (state: TransactionState, action: TransactionAction): TransactionState => {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t => 
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };
    case 'EDIT_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(c => 
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(c => c.id !== action.payload),
      };
    case 'ADD_BUDGET':
      return {
        ...state,
        budgets: [...state.budgets, action.payload],
      };
    case 'EDIT_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(b => 
          b.id === action.payload.id ? action.payload : b
        ),
      };
    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(b => b.id !== action.payload),
      };
    case 'ADD_REPORT':
      return {
        ...state,
        reports: [...state.reports, action.payload],
      };
    case 'DELETE_REPORT':
      return {
        ...state,
        reports: state.reports.filter(r => r.id !== action.payload),
      };
    case 'SET_INITIAL_DATA':
      return action.payload;
    default:
      return state;
  }
};

// Create the context
const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

// Custom hook to use the context
export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

// Provider component
export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check if data exists in localStorage
  const [isLoading, setIsLoading] = useState(true);

  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // Calculate budget spent and remaining
  const calculateBudgets = (budgets: BudgetType[], transactions: TransactionType[]): BudgetType[] => {
    return budgets.map(budget => {
      const relevantTransactions = transactions.filter(t => {
        // For category specific budgets
        if (budget.categoryId && t.category !== budget.categoryId) return false;
        
        // Filter by transaction date within budget period
        const transactionDate = new Date(t.date);
        const budgetStartDate = new Date(budget.startDate);
        
        // Calculate budget end date based on period
        let budgetEndDate;
        if (budget.endDate) {
          budgetEndDate = new Date(budget.endDate);
        } else {
          budgetEndDate = new Date(budgetStartDate);
          switch(budget.period) {
            case 'daily':
              budgetEndDate.setDate(budgetEndDate.getDate() + 1);
              break;
            case 'weekly':
              budgetEndDate.setDate(budgetEndDate.getDate() + 7);
              break;
            case 'monthly':
              budgetEndDate.setMonth(budgetEndDate.getMonth() + 1);
              break;
            case 'yearly':
              budgetEndDate.setFullYear(budgetEndDate.getFullYear() + 1);
              break;
          }
        }
        
        return transactionDate >= budgetStartDate && transactionDate <= budgetEndDate;
      });
      
      const spent = relevantTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        ...budget,
        spent,
        remaining: budget.amount - spent
      };
    });
  };

  useEffect(() => {
    // Load data from localStorage
    const storedData = localStorage.getItem('smartspend_data');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        
        // Ensure budgets have spent and remaining calculated
        if (parsedData.budgets) {
          parsedData.budgets = calculateBudgets(parsedData.budgets, parsedData.transactions);
        }
        
        dispatch({ type: 'SET_INITIAL_DATA', payload: parsedData });
      } catch (error) {
        console.error('Failed to parse stored data:', error);
      }
    }
    setIsLoading(false);
    
    // Process recurring transactions on load
    processRecurringTransactions();
    
    // Check for budget alerts on load
    const { alertBudgets, messages } = checkBudgetAlerts();
    if (messages.length > 0) {
      messages.forEach(message => toast.warning(message));
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('smartspend_data', JSON.stringify(state));
    }
  }, [state, isLoading]);

  // Process recurring transactions
  const processRecurringTransactions = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const recurringTransactions = state.transactions.filter(
      t => t.isRecurring && t.nextOccurrence
    );
    
    recurringTransactions.forEach(transaction => {
      if (!transaction.nextOccurrence) return;
      
      const nextDate = new Date(transaction.nextOccurrence);
      nextDate.setHours(0, 0, 0, 0);
      
      if (nextDate <= today) {
        // Create new transaction instance
        const newTransaction: Omit<TransactionType, 'id'> = {
          amount: transaction.amount,
          type: transaction.type,
          category: transaction.category,
          date: new Date().toISOString(),
          notes: `${transaction.notes} (Recurring)`,
          isRecurring: true,
          recurringPeriod: transaction.recurringPeriod,
        };
        
        // Calculate next occurrence
        const nextOccurrence = new Date(nextDate);
        if (transaction.recurringPeriod === 'daily') {
          nextOccurrence.setDate(nextOccurrence.getDate() + 1);
        } else if (transaction.recurringPeriod === 'weekly') {
          nextOccurrence.setDate(nextOccurrence.getDate() + 7);
        } else if (transaction.recurringPeriod === 'monthly') {
          nextOccurrence.setMonth(nextOccurrence.getMonth() + 1);
        } else if (transaction.recurringPeriod === 'yearly') {
          nextOccurrence.setFullYear(nextOccurrence.getFullYear() + 1);
        }
        
        // Update the original transaction with new next occurrence
        const updatedTransaction = {
          ...transaction,
          nextOccurrence: nextOccurrence.toISOString()
        };
        
        // Add new transaction and update the recurring one
        addTransaction(newTransaction);
        editTransaction(updatedTransaction);
        
        toast.info(`Recurring transaction: ${transaction.notes} has been added`);
      }
    });
  };

  // Calculate totals
  const totalIncome = state.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = state.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Helper functions for adding new items
  const addTransaction = (transaction: Omit<TransactionType, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    
    // Recalculate budgets after adding transaction
    const updatedBudgets = calculateBudgets(state.budgets, [...state.transactions, newTransaction]);
    updatedBudgets.forEach(budget => {
      dispatch({ type: 'EDIT_BUDGET', payload: budget });
    });
    
    // Check for budget alerts
    checkBudgetAlerts();
  };

  const editTransaction = (transaction: TransactionType) => {
    dispatch({ type: 'EDIT_TRANSACTION', payload: transaction });
    
    // Recalculate budgets after editing transaction
    const updatedTransactions = state.transactions.map(t => 
      t.id === transaction.id ? transaction : t
    );
    const updatedBudgets = calculateBudgets(state.budgets, updatedTransactions);
    updatedBudgets.forEach(budget => {
      dispatch({ type: 'EDIT_BUDGET', payload: budget });
    });
    
    // Check for budget alerts
    checkBudgetAlerts();
  };

  const deleteTransaction = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    
    // Recalculate budgets after deleting transaction
    const updatedTransactions = state.transactions.filter(t => t.id !== id);
    const updatedBudgets = calculateBudgets(state.budgets, updatedTransactions);
    updatedBudgets.forEach(budget => {
      dispatch({ type: 'EDIT_BUDGET', payload: budget });
    });
    
    // Check for budget alerts
    checkBudgetAlerts();
  };

  const addCategory = (category: Omit<CategoryType, 'id'>) => {
    const newCategory = {
      ...category,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
  };

  const editCategory = (category: CategoryType) => {
    dispatch({ type: 'EDIT_CATEGORY', payload: category });
  };

  const deleteCategory = (id: string) => {
    dispatch({ type: 'DELETE_CATEGORY', payload: id });
  };
  
  const addBudget = (budget: Omit<BudgetType, 'id' | 'spent' | 'remaining'>) => {
    // Initialize spent and remaining
    const newBudget: BudgetType = {
      ...budget,
      id: Date.now().toString(),
      spent: 0,
      remaining: budget.amount,
    };
    
    // Calculate actual spent and remaining
    const calculatedBudget = calculateBudgets([newBudget], state.transactions)[0];
    
    dispatch({ type: 'ADD_BUDGET', payload: calculatedBudget });
  };
  
  const editBudget = (budget: BudgetType) => {
    dispatch({ type: 'EDIT_BUDGET', payload: budget });
  };
  
  const deleteBudget = (id: string) => {
    dispatch({ type: 'DELETE_BUDGET', payload: id });
  };
  
  const addReport = (report: Omit<ReportType, 'id' | 'createdAt'>) => {
    const newReport: ReportType = {
      ...report,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_REPORT', payload: newReport });
  };
  
  const deleteReport = (id: string) => {
    dispatch({ type: 'DELETE_REPORT', payload: id });
  };

  // Filter functions
  const filterTransactionsByDate = (start?: Date, end?: Date) => {
    if (!start && !end) return state.transactions;

    return state.transactions.filter(t => {
      const transactionDate = new Date(t.date);
      if (start && end) {
        return transactionDate >= start && transactionDate <= end;
      }
      if (start) {
        return transactionDate >= start;
      }
      if (end) {
        return transactionDate <= end;
      }
      return true;
    });
  };

  const filterTransactionsByCategory = (categoryId: string) => {
    return state.transactions.filter(t => t.category === categoryId);
  };
  
  // Get spending for a specific category
  const getSpentByCategory = (categoryId: string, period?: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
    let filteredTransactions = state.transactions.filter(t => 
      t.type === 'expense' && (categoryId === '' || t.category === categoryId)
    );
    
    if (period) {
      const today = new Date();
      let startDate = new Date();
      
      switch(period) {
        case 'daily':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'weekly':
          startDate.setDate(today.getDate() - today.getDay());
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'monthly':
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          break;
        case 'yearly':
          startDate = new Date(today.getFullYear(), 0, 1);
          break;
      }
      
      filteredTransactions = filteredTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startDate && transactionDate <= today;
      });
    }
    
    return filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  };
  
  // Get budget status
  const getBudgetStatus = (budgetId: string) => {
    const budget = state.budgets.find(b => b.id === budgetId);
    
    if (!budget) {
      return { spent: 0, remaining: 0, percentage: 0 };
    }
    
    const percentage = (budget.spent / budget.amount) * 100;
    
    return {
      spent: budget.spent,
      remaining: budget.remaining,
      percentage
    };
  };
  
  // Check budget alerts
  const checkBudgetAlerts = () => {
    const alertBudgets: BudgetType[] = [];
    const messages: string[] = [];
    
    state.budgets.forEach(budget => {
      const { percentage } = getBudgetStatus(budget.id);
      
      // Alert when 80% or more of budget is used
      if (percentage >= 80 && percentage < 100) {
        const categoryName = budget.categoryId 
          ? state.categories.find(c => c.id === budget.categoryId)?.name || 'Category' 
          : 'Total';
        
        alertBudgets.push(budget);
        messages.push(`Warning: You've used ${percentage.toFixed(1)}% of your ${categoryName} budget`);
      }
      // Alert when budget is exceeded
      else if (percentage >= 100) {
        const categoryName = budget.categoryId 
          ? state.categories.find(c => c.id === budget.categoryId)?.name || 'Category' 
          : 'Total';
        
        alertBudgets.push(budget);
        messages.push(`Alert: You've exceeded your ${categoryName} budget by $${(-budget.remaining).toFixed(2)}`);
      }
    });
    
    return { alertBudgets, messages };
  };
  
  // Generate report (CSV or PDF)
  const generateReport = (format: 'csv' | 'pdf', period: 'weekly' | 'monthly' | 'yearly') => {
    // Filter transactions based on period
    const today = new Date();
    let startDate = new Date();
    let periodName = '';
    
    switch(period) {
      case 'weekly':
        startDate.setDate(today.getDate() - today.getDay());
        startDate.setHours(0, 0, 0, 0);
        periodName = `Week of ${startDate.toLocaleDateString()}`;
        break;
      case 'monthly':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        periodName = `${startDate.toLocaleString('default', { month: 'long' })} ${startDate.getFullYear()}`;
        break;
      case 'yearly':
        startDate = new Date(today.getFullYear(), 0, 1);
        periodName = `${startDate.getFullYear()}`;
        break;
    }
    
    const filteredTransactions = state.transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= today;
    });
    
    // Create report record
    const reportName = `${periodName} Report`;
    addReport({
      name: reportName,
      type: 'all',
      period,
      format,
    });
    
    // Generate actual report data
    if (format === 'csv') {
      // Create CSV data
      const csvData = [
        ['Date', 'Type', 'Category', 'Amount', 'Notes'].join(','),
        ...filteredTransactions.map(t => {
          const categoryName = state.categories.find(c => c.id === t.category)?.name || '';
          return [
            new Date(t.date).toLocaleDateString(),
            t.type,
            categoryName,
            t.amount.toFixed(2),
            `"${t.notes.replace(/"/g, '""')}"`
          ].join(',');
        })
      ].join('\n');
      
      // Create blob and download
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `smartspend_${periodName.replace(/\s+/g, '_').toLowerCase()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`CSV report for ${periodName} has been downloaded`);
    } else if (format === 'pdf') {
      // For PDF, we'll show a toast that it would normally generate a PDF
      // In a real app, you would use a library like jsPDF or pdfmake
      toast.info(`PDF report for ${periodName} would be generated in a production app`);
    }
    
    return filteredTransactions;
  };

  const value = {
    ...state,
    addTransaction,
    editTransaction,
    deleteTransaction,
    addCategory,
    editCategory,
    deleteCategory,
    addBudget,
    editBudget,
    deleteBudget,
    addReport,
    deleteReport,
    totalIncome,
    totalExpenses,
    balance,
    filterTransactionsByDate,
    filterTransactionsByCategory,
    getSpentByCategory,
    getBudgetStatus,
    checkBudgetAlerts,
    generateReport,
    processRecurringTransactions,
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};
