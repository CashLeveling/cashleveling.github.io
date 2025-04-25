import React, { useState } from 'react';
import { useBudget } from '../contexts/BudgetContext';
import Card from '../components/Card';

const AddEntry = () => {
  const { addEntry } = useBudget();
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  // Predefined categories based on entry type
  const categories = {
    income: ['Salary', 'Freelance', 'Investments', 'Gifts', 'Other'],
    expense: ['Housing', 'Food', 'Transportation', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Personal', 'Education', 'Other'],
    saving: ['Emergency Fund', 'Retirement', 'Vacation', 'Down Payment', 'Education', 'Other'],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If changing type, reset category
    if (name === 'type') {
      setFormData({
        ...formData,
        [name]: value,
        category: '',
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.amount || !formData.category || !formData.date) {
      setMessage({
        text: 'Please fill in all required fields',
        type: 'error',
      });
      return;
    }
    
    // Convert amount to number
    const entry = {
      ...formData,
      amount: parseFloat(formData.amount),
    };
    
    // Add entry
    addEntry(entry);
    
    // Reset form
    setFormData({
      type: 'expense',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    
    // Show success message
    setMessage({
      text: 'Entry added successfully!',
      type: 'success',
    });
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Entry</h1>
      
      <Card>
        {message.text && (
          <div className={`mb-4 p-4 rounded ${
            message.type === 'success' 
              ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200' 
              : 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200'
          }`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Entry Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Entry Type*
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="income"
                  checked={formData.type === 'income'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 dark:text-blue-500 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Income</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="expense"
                  checked={formData.type === 'expense'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 dark:text-blue-500 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Expense</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="saving"
                  checked={formData.type === 'saving'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 dark:text-blue-500 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Saving</span>
              </label>
            </div>
          </div>
          
          {/* Amount */}
          <div className="mb-6">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount*
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                name="amount"
                id="amount"
                value={formData.amount}
                onChange={handleChange}
                className="block w-full pl-7 pr-12 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400 sm:text-sm">USD</span>
              </div>
            </div>
          </div>
          
          {/* Category */}
          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category*
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
              required
            >
              <option value="">Select a category</option>
              {categories[formData.type].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          {/* Date */}
          <div className="mb-6">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date*
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
              required
            />
          </div>
          
          {/* Notes */}
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
              placeholder="Add any additional details here..."
            ></textarea>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
            >
              Add Entry
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddEntry;
