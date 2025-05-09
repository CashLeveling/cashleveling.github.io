import React, { useState } from 'react';
import { formatCurrency, formatDate } from '../utils/helpers';

const CategoryBreakdown = ({ title, entries, onClose }) => {
  const [activeTab, setActiveTab] = useState(title === 'Balance' ? 'income' : 'all');
  
  // Filter entries based on active tab for Balance view
  const filteredEntries = title === 'Balance' && activeTab !== 'all'
    ? entries.filter(entry => entry.type === activeTab)
    : entries;
  
  // Group entries by category
  const groupedEntries = filteredEntries.reduce((acc, entry) => {
    const category = entry.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(entry);
    return acc;
  }, {});

  // Calculate total for each category
  const categoryTotals = Object.entries(groupedEntries).map(([category, entries]) => {
    const total = entries.reduce((sum, entry) => sum + Number(entry.amount), 0);
    return { category, total, entries };
  }).sort((a, b) => b.total - a.total); // Sort by total amount descending

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title} Breakdown</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Tabs for Balance view */}
        {title === 'Balance' && (
          <div className="px-6 pt-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-4">
              <button
                className={`pb-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'all'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button
                className={`pb-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'income'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('income')}
              >
                Income
              </button>
              <button
                className={`pb-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'expense'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('expense')}
              >
                Expenses
              </button>
            </div>
          </div>
        )}
        
        <div className="p-6 overflow-y-auto flex-grow">
          {categoryTotals.length > 0 ? (
            <div className="space-y-6">
              {categoryTotals.map(({ category, total, entries }) => (
                <div key={category} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 flex justify-between items-center">
                    <h3 className="font-medium text-gray-900 dark:text-white">{category}</h3>
                    <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(total)}</span>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {entries.map(entry => (
                      <div key={entry.id} className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{entry.notes || `${entry.category} transaction`}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(entry.date)}
                            {title === 'Balance' && (
                              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                                entry.type === 'income' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}>
                                {entry.type === 'income' ? 'Income' : 'Expense'}
                              </span>
                            )}
                          </p>
                        </div>
                        <span className={`font-medium ${
                          title === 'Balance' && entry.type === 'expense'
                            ? 'text-red-600 dark:text-red-400'
                            : title === 'Balance' && entry.type === 'income'
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-gray-900 dark:text-white'
                        }`}>
                          {entry.type === 'expense' && title === 'Balance' ? '- ' : ''}
                          {formatCurrency(entry.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No entries found
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryBreakdown;
