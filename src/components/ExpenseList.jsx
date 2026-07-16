import React from 'react';

const ExpenseList = ({ expenses, onDelete }) => {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="card">
        <div className="empty-state" role="status" aria-live="polite">
          <p>No data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <ul className="expense-list" aria-label="Expense List">
        {expenses.map((expense) => (
          <li key={expense.id} className="expense-item">
            <div className="expense-details">
              <h3>{expense.description}</h3>
              <div className="expense-meta">
                <span><strong>Category:</strong> {expense.category}</span>
                <span><strong>Date:</strong> {expense.date}</span>
              </div>
            </div>
            <div className="expense-amount">
              ₹{parseFloat(expense.amount).toFixed(2)}
            </div>
            <button 
              className="btn" 
              style={{ padding: '8px 16px', marginLeft: '16px', backgroundColor: 'var(--color-gray-800)' }}
              onClick={() => onDelete(expense.id)}
              aria-label={`Delete expense: ${expense.description}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;
