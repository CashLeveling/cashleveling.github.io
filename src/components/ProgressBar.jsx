import React from 'react';

const ProgressBar = ({ current, target, label, className = '' }) => {
  // Calculate percentage with a maximum of 100%
  const percentage = Math.min(Math.round((current / target) * 100), 100);
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {formatCurrency(current)} / {formatCurrency(target)}
          </span>
        </div>
      )}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div 
          className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="mt-1 text-right">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          {percentage}% Complete
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
