import React, { useState } from 'react';
import { useBudget } from '../contexts/BudgetContext';
import Card from './Card';
import { formatCurrency } from '../utils/helpers';

const AccountsManager = () => {
  const { accounts, addAccount, updateAccount, deleteAccount } = useBudget();
  const [formData, setFormData] = useState({
    name: '',
    type: 'checking',
    startingBalance: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Account types
  const accountTypes = [
    'checking',
    'savings',
    'credit',
    'investment',
    'cash',
    'other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.type || formData.startingBalance === '') {
      setMessage({
        text: 'Please fill in all required fields',
        type: 'error',
      });
      return;
    }
    
    // Convert startingBalance to number
    const accountData = {
      ...formData,
      startingBalance: parseFloat(formData.startingBalance),
    };
    
    if (isEditing && editId) {
      // Update existing account
      updateAccount(editId, accountData);
      setIsEditing(false);
      setEditId(null);
      setMessage({
        text: 'Account updated successfully!',
        type: 'success',
      });
    } else {
      // Add new account
      addAccount(accountData);
      setMessage({
        text: 'Account added successfully!',
        type: 'success',
      });
    }
    
    // Reset form
    setFormData({
      name: '',
      type: 'checking',
      startingBalance: '',
    });
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };

  const handleEdit = (account) => {
    setFormData({
      name: account.name,
      type: account.type,
      startingBalance: account.startingBalance.toString(),
    });
    setIsEditing(true);
    setEditId(account.id);
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      type: 'checking',
      startingBalance: '',
    });
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage Accounts</h2>
      
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Account Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Account Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                placeholder="e.g., Main Checking"
                required
              />
            </div>
            
            {/* Account Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Account Type*
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                required
              >
                {accountTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Starting Balance */}
            <div>
              <label htmlFor="startingBalance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Starting Balance*
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="startingBalance"
                  id="startingBalance"
                  value={formData.startingBalance}
                  onChange={handleChange}
                  className="block w-full pl-7 pr-12 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  step="0.01"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 sm:text-sm">USD</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end space-x-2">
            {isEditing && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-900"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
            >
              {isEditing ? 'Update Account' : 'Add Account'}
            </button>
          </div>
        </form>
      </Card>
      
      {/* Accounts List */}
      <Card title={`Your Accounts (${accounts ? accounts.length : 0})`}>
        <div className="overflow-x-auto">
          {accounts && accounts.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Account Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Starting Balance
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Current Balance
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {account.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(account.startingBalance)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(account.currentBalance || account.startingBalance)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(account)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteAccount(account.id)}
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
              No accounts added yet. Add your first account above.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AccountsManager;
