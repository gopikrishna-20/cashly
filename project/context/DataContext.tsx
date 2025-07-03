import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Order {
  id: string;
  clientName: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  date: Date;
  description: string;
  invoiceNumber: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: Date;
  description: string;
}

interface DataContextType {
  orders: Order[];
  expenses: Expense[];
  addOrder: (order: Omit<Order, 'id'>) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  getFilteredData: (startDate?: Date, endDate?: Date) => { orders: Order[]; expenses: Expense[] };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    // Initialize with sample data
    const sampleOrders: Order[] = [
      {
        id: '1',
        clientName: 'Acme Corp',
        amount: 2500,
        status: 'paid',
        date: new Date('2024-01-15'),
        description: 'Website development',
        invoiceNumber: 'INV-001',
      },
      {
        id: '2',
        clientName: 'TechStart Inc',
        amount: 1800,
        status: 'pending',
        date: new Date('2024-01-20'),
        description: 'Mobile app design',
        invoiceNumber: 'INV-002',
      },
      {
        id: '3',
        clientName: 'Global Solutions',
        amount: 3200,
        status: 'overdue',
        date: new Date('2024-01-10'),
        description: 'E-commerce platform',
        invoiceNumber: 'INV-003',
      },
    ];

    const sampleExpenses: Expense[] = [
      {
        id: '1',
        title: 'Office Supplies',
        amount: 150,
        category: 'Office',
        date: new Date('2024-01-18'),
        description: 'Stationery and supplies',
      },
      {
        id: '2',
        title: 'Software License',
        amount: 299,
        category: 'Software',
        date: new Date('2024-01-12'),
        description: 'Adobe Creative Suite',
      },
      {
        id: '3',
        title: 'Business Lunch',
        amount: 85,
        category: 'Meals',
        date: new Date('2024-01-22'),
        description: 'Client meeting lunch',
      },
    ];

    setOrders(sampleOrders);
    setExpenses(sampleExpenses);
  }, []);

  const addOrder = (order: Omit<Order, 'id'>) => {
    const newOrder = {
      ...order,
      id: Date.now().toString(),
    };
    setOrders(prev => [...prev, newOrder]);
  };

  const updateOrder = (id: string, orderUpdate: Partial<Order>) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, ...orderUpdate } : order
    ));
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(order => order.id !== id));
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const updateExpense = (id: string, expenseUpdate: Partial<Expense>) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === id ? { ...expense, ...expenseUpdate } : expense
    ));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const getFilteredData = (startDate?: Date, endDate?: Date) => {
    if (!startDate || !endDate) {
      return { orders, expenses };
    }

    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate >= startDate && orderDate <= endDate;
    });

    const filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });

    return { orders: filteredOrders, expenses: filteredExpenses };
  };

  return (
    <DataContext.Provider value={{
      orders,
      expenses,
      addOrder,
      updateOrder,
      deleteOrder,
      addExpense,
      updateExpense,
      deleteExpense,
      getFilteredData,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}