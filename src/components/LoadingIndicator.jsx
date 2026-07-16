import React from 'react';

const LoadingIndicator = () => {
  return (
    <div className="loading-overlay" aria-live="polite" aria-busy="true">
      <div className="spinner" aria-hidden="true"></div>
      <p>Processing data...</p>
    </div>
  );
};

export default LoadingIndicator;
