import React, { useState, useEffect } from 'react';
import { useBudget } from '../contexts/BudgetContext';
import Card from '../components/Card';

const AddEntry = () => {
  const { addEntry, accounts } = useBudget();
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    accountId: '',
    isRecurring: false,
    frequency: 'monthly',
    nextPayDate: new Date().toISOString().split('T')[0],
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  // Predefined categories based on entry type
  const categories = {
    income: ['Salary', 'Freelance', 'Investments', 'Gifts', 'Other'],
    expense: ['Housing', 'Food', 'Transportation', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Personal', 'Education', 'Other'],
    saving: ['Emergency Fund', 'Retirement', 'Vacation', 'Down Payment', 'Education', 'Other'],
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked,
      });
      return;
    }
    
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

  // Calculate next pay date based on frequency when frequency changes
  useEffect(() => {
    if (formData.isRecurring && formData.type === 'income') {
      updateNextPayDate();
    }
  }, [formData.frequency, formData.date]);

  // Function to calculate the next pay date based on frequency
  const updateNextPayDate = () => {
    const currentDate = new Date(formData.date);
    let nextDate = new Date(currentDate);
    
    switch (formData.frequency) {
      case 'biweekly':
        // Bi-weekly: Add 14 days
        nextDate.setDate(currentDate.getDate() + 14);
        break;
      case 'semimonthly':
        // Semi-monthly: If date is before 15th, set to 15th, otherwise set to 1st of next month
        if (currentDate.getDate() < 15) {
          nextDate.setDate(15);
        } else {
          nextDate.setMonth(currentDate.getMonth() + 1, 1);
        }
        break;
      case 'monthly':
        // Monthly: Add 1 month
        nextDate.setMonth(currentDate.getMonth() + 1);
        break;
      default:
        // Default to monthly
        nextDate.setMonth(currentDate.getMonth() + 1);
    }
    
    setFormData({
      ...formData,
      nextPayDate: nextDate.toISOString().split('T')[0],
    });
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
    
    // Additional validation for recurring income
    if (formData.isRecurring && formData.type === 'income' && !formData.nextPayDate) {
      setMessage({
        text: 'Please provide the next pay date for recurring income',
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
      accountId: '',
      isRecurring: false,
      frequency: 'monthly',
      nextPayDate: new Date().toISOString().split('T')[0],
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
          
          {/* Account */}
          <div className="mb-6">
            <label htmlFor="accountId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Account
            </label>
            <select
              id="accountId"
              name="accountId"
              value={formData.accountId}
              onChange={handleChange}
              className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
            >
              <option value="">No specific account</option>
              {accounts && accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} ({account.type.charAt(0).toUpperCase() + account.type.slice(1)})
                </option>
              ))}
            </select>
          </div>
          
          {/* Recurring Income Options (only shown for income type) */}
          {formData.type === 'income' && (
            <div className="mb-6 border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <div className="flex items-center mb-4">
                <input
                  id="isRecurring"
                  name="isRecurring"
                  type="checkbox"
                  checked={formData.isRecurring}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 dark:text-blue-500 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                />
                <label htmlFor="isRecurring" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  This is recurring income
                </label>
              </div>
              
              {formData.isRecurring && (
                <>
                  {/* Frequency Selection */}
                  <div className="mb-4">
                    <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Payment Frequency
                    </label>
                    <select
                      id="frequency"
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleChange}
                      className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="semimonthly">Semi-monthly (Twice a month)</option>
                      <option value="biweekly">Bi-weekly (Every two weeks)</option>
                    </select>
                  </div>
                  
                  {/* Next Pay Date */}
                  <div className="mb-4">
                    <label htmlFor="nextPayDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Next Pay Date
                    </label>
                    <input
                      type="date"
                      id="nextPayDate"
                      name="nextPayDate"
                      value={formData.nextPayDate}
                      onChange={handleChange}
                      className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {formData.frequency === 'biweekly' && 'Payments occur every 14 days'}
                      {formData.frequency === 'semimonthly' && 'Payments typically occur on the 1st and 15th of each month'}
                      {formData.frequency === 'monthly' && 'Payments occur on the same date each month'}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
          
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
