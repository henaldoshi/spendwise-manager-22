
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

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
};

type TransactionState = {
  transactions: TransactionType[];
  categories: CategoryType[];
};

type TransactionAction =
  | { type: 'ADD_TRANSACTION'; payload: TransactionType }
  | { type: 'EDIT_TRANSACTION'; payload: TransactionType }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: CategoryType }
  | { type: 'EDIT_CATEGORY'; payload: CategoryType }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_INITIAL_DATA'; payload: TransactionState };

type TransactionContextType = {
  transactions: TransactionType[];
  categories: CategoryType[];
  addTransaction: (transaction: Omit<TransactionType, 'id'>) => void;
  editTransaction: (transaction: TransactionType) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<CategoryType, 'id'>) => void;
  editCategory: (category: CategoryType) => void;
  deleteCategory: (id: string) => void;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  filterTransactionsByDate: (start?: Date, end?: Date) => TransactionType[];
  filterTransactionsByCategory: (categoryId: string) => TransactionType[];
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

const initialState: TransactionState = {
  transactions: initialDefaultTransactions,
  categories: initialDefaultCategories,
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

  useEffect(() => {
    // Load data from localStorage
    const storedData = localStorage.getItem('smartspend_data');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        dispatch({ type: 'SET_INITIAL_DATA', payload: parsedData });
      } catch (error) {
        console.error('Failed to parse stored data:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('smartspend_data', JSON.stringify(state));
    }
  }, [state, isLoading]);

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
  };

  const editTransaction = (transaction: TransactionType) => {
    dispatch({ type: 'EDIT_TRANSACTION', payload: transaction });
  };

  const deleteTransaction = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
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

  const value = {
    ...state,
    addTransaction,
    editTransaction,
    deleteTransaction,
    addCategory,
    editCategory,
    deleteCategory,
    totalIncome,
    totalExpenses,
    balance,
    filterTransactionsByDate,
    filterTransactionsByCategory,
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
