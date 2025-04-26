import React, { useState, useEffect } from 'react';
import { useBudget } from '../contexts/BudgetContext';
import Card from '../components/Card';
import { formatCurrency, formatDate } from '../utils/helpers';

const BudgetOverview = () => {
  const { entries, deleteEntry } = useBudget();
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    startDate: '',
    endDate: '',
    searchTerm: '',
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc',
  });

  // Get unique categories from entries
  const categories = [...new Set(entries.map(entry => entry.category))];

  // Apply filters and sorting
  useEffect(() => {
    let result = [...entries];
    
    // Filter by type
    if (filters.type !== 'all') {
      result = result.filter(entry => entry.type === filters.type);
    }
    
    // Filter by category
    if (filters.category !== 'all') {
      result = result.filter(entry => entry.category === filters.category);
    }
    
    // Filter by date range
    if (filters.startDate) {
      result = result.filter(entry => new Date(entry.date) >= new Date(filters.startDate));
    }
    
    if (filters.endDate) {
      result = result.filter(entry => new Date(entry.date) <= new Date(filters.endDate));
    }
    
    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(entry => 
        entry.category.toLowerCase().includes(term) || 
        (entry.notes && entry.notes.toLowerCase().includes(term))
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredEntries(result);
  }, [entries, filters, sortConfig]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  // Calculate totals
  const totals = filteredEntries.reduce(
    (acc, entry) => {
      if (entry.type === 'income') {
        acc.income += Number(entry.amount);
      } else if (entry.type === 'expense') {
        acc.expenses += Number(entry.amount);
      } else if (entry.type === 'saving') {
        acc.savings += Number(entry.amount);
      }
      return acc;
    },
    { income: 0, expenses: 0, savings: 0 }
  );

  // Get type badge color
  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'income':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'expense':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'saving':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Overview</h1>
      
      {/* Filters */}
      <Card title="Filters">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Type Filter */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="saving">Saving</option>
            </select>
          </div>
          
          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          {/* Start Date Filter */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
            />
          </div>
          
          {/* End Date Filter */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
            />
          </div>
          
          {/* Search Filter */}
          <div>
            <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              id="searchTerm"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
              placeholder="Search by category or notes"
              className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </Card>
      
      {/* Summary */}
      <Card title="Summary">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-sm font-medium text-green-800 dark:text-green-300">Total Income</p>
            <p className="mt-1 text-2xl font-semibold text-green-900 dark:text-green-200">
              {formatCurrency(totals.income)}
            </p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <p className="text-sm font-medium text-red-800 dark:text-red-300">Total Expenses</p>
            <p className="mt-1 text-2xl font-semibold text-red-900 dark:text-red-200">
              {formatCurrency(totals.expenses)}
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Total Savings</p>
            <p className="mt-1 text-2xl font-semibold text-blue-900 dark:text-blue-200">
              {formatCurrency(totals.savings)}
            </p>
          </div>
        </div>
      </Card>
      
      {/* Entries Table */}
      <Card title={`Entries (${filteredEntries.length})`}>
        <div className="overflow-x-auto">
          {filteredEntries.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    Date {getSortIndicator('date')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('type')}
                  >
                    Type {getSortIndicator('type')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('category')}
                  >
                    Category {getSortIndicator('category')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('amount')}
                  >
                    Amount {getSortIndicator('amount')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Notes
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {filteredEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDate(entry.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(entry.type)}`}>
                        {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {entry.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(entry.amount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                      {entry.notes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              No entries found matching your filters.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default BudgetOverview;
