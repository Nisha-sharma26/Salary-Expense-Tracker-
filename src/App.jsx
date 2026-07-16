import React, { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import SearchBar from './components/SearchBar';
import LoadingIndicator from './components/LoadingIndicator';
import { logAnalyticsAction } from './utils/telemetry';

const mockData = [
  { id: 1, description: 'Client Lunch', amount: 45.50, category: 'Meals', date: '2026-07-15' },
  { id: 2, description: 'Taxi to Airport', amount: 30.00, category: 'Travel', date: '2026-07-16' }
];

function App() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initial load simulation
  useEffect(() => {
    const fetchExpenses = async () => {
      setIsLoading(true);
      // Simulate slow 3G connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setExpenses(mockData);
      setIsLoading(false);
      logAnalyticsAction('Loaded initial expenses');
    };

    fetchExpenses();
  }, []);

  const handleAddExpense = async (expenseData) => {
    setIsSubmitting(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newExpense = {
      ...expenseData,
      id: Date.now() // Simple ID generation
    };
    
    setExpenses(prev => [newExpense, ...prev]);
    setIsSubmitting(false);
    logAnalyticsAction('Added new expense');
  };

  const handleDeleteExpense = async (id) => {
    // Simulate network delay
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setExpenses(prev => prev.filter(exp => exp.id !== id));
    setIsLoading(false);
    logAnalyticsAction('Deleted expense');
  };

  const filteredExpenses = expenses.filter(expense => {
    const query = searchQuery.toLowerCase();
    return (
      expense.description.toLowerCase().includes(query) ||
      expense.category.toLowerCase().includes(query)
    );
  });

  return (
    <div className="container">
      <header className="header">
        <h1>Expense Tracker</h1>
      </header>
      
      <main>
        <ExpenseForm onAddExpense={handleAddExpense} isSubmitting={isSubmitting} />
        
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <ExpenseList expenses={filteredExpenses} onDelete={handleDeleteExpense} />
        )}
      </main>
    </div>
  );
}

export default App;
