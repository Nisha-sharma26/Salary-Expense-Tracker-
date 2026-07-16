import React, { useState } from 'react';
import { sanitizeInput } from '../utils/security';
import { logAnalyticsAction } from '../utils/telemetry';

const ExpenseForm = ({ onAddExpense, isSubmitting }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: ''
  });
  
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      logAnalyticsAction('Attempted to add expense');
      const sanitizedData = {
        description: sanitizeInput(formData.description),
        amount: parseFloat(formData.amount),
        category: sanitizeInput(formData.category),
        date: formData.date
      };
      
      onAddExpense(sanitizedData);
      
      // Reset form
      setFormData({
        description: '',
        amount: '',
        category: '',
        date: ''
      });
    } else {
      logAnalyticsAction('Failed validation on expense add');
    }
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit} noValidate aria-label="Add Expense Form">
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            id="description"
            name="description"
            type="text"
            className={`form-control ${errors.description ? 'error' : ''}`}
            value={formData.description}
            onChange={handleChange}
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? "description-error" : null}
            disabled={isSubmitting}
          />
          {errors.description && <p id="description-error" className="error-text" role="alert">{errors.description}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount (₹)</label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            className={`form-control ${errors.amount ? 'error' : ''}`}
            value={formData.amount}
            onChange={handleChange}
            aria-invalid={!!errors.amount}
            aria-describedby={errors.amount ? "amount-error" : null}
            disabled={isSubmitting}
          />
          {errors.amount && <p id="amount-error" className="error-text" role="alert">{errors.amount}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            id="category"
            name="category"
            type="text"
            className={`form-control ${errors.category ? 'error' : ''}`}
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Travel, Meals, Supplies"
            aria-invalid={!!errors.category}
            aria-describedby={errors.category ? "category-error" : null}
            disabled={isSubmitting}
          />
          {errors.category && <p id="category-error" className="error-text" role="alert">{errors.category}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            name="date"
            type="date"
            className={`form-control ${errors.date ? 'error' : ''}`}
            value={formData.date}
            onChange={handleChange}
            aria-invalid={!!errors.date}
            aria-describedby={errors.date ? "date-error" : null}
            disabled={isSubmitting}
          />
          {errors.date && <p id="date-error" className="error-text" role="alert">{errors.date}</p>}
        </div>

        <button 
          type="submit" 
          className="btn" 
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
