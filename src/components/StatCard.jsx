import React from 'react';

const StatCard = ({ title, value, icon, trend, trendValue, className = '', onClick }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const getTrendColor = () => {
    if (!trend) return '';
    return trend === 'up' 
      ? 'text-green-500' 
      : trend === 'down' 
        ? 'text-red-500' 
        : '';
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend === 'up' ? (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : trend === 'down' ? (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    ) : null;
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className} ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow duration-200' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
            {typeof value === 'number' ? formatCurrency(value) : value}
          </p>
          {onClick && (
            <p className="mt-2 text-xs text-blue-500 dark:text-blue-400 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Click for details
            </p>
          )}
        </div>
        {icon && <div className="text-blue-500 dark:text-blue-400">{icon}</div>}
      </div>
      
      {trend && trendValue && (
        <div className="mt-4 flex items-center">
          <span className={`flex items-center ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="ml-1 text-sm font-medium">{trendValue}</span>
          </span>
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">from last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
