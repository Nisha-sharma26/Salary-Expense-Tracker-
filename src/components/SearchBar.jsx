import React from 'react';
import { sanitizeInput } from '../utils/security';
import { logAnalyticsAction } from '../utils/telemetry';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const handleChange = (e) => {
    const value = sanitizeInput(e.target.value);
    setSearchQuery(value);
  };

  const handleBlur = () => {
    if (searchQuery) {
      logAnalyticsAction('Searched for expenses');
    }
  };

  return (
    <div className="card">
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label htmlFor="search-input" className="visually-hidden">Search Expenses</label>
        <input
          id="search-input"
          type="text"
          className="form-control"
          placeholder="Search by description or category..."
          value={searchQuery}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-label="Search Expenses"
        />
      </div>
    </div>
  );
};

export default SearchBar;
