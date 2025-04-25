import React, { useState } from 'react';
import { useBudget } from '../contexts/BudgetContext';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { formatCurrency } from '../utils/helpers';

const GoalTracker = () => {
  const { goals, addGoal, updateGoal, deleteGoal } = useBudget();
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    notes: '',
  });
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

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
    if (!formData.name || !formData.targetAmount) {
      setMessage({
        text: 'Please fill in all required fields',
        type: 'error',
      });
      return;
    }
    
    // Convert amounts to numbers
    const goalData = {
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: formData.currentAmount ? parseFloat(formData.currentAmount) : 0,
    };
    
    if (editingGoalId) {
      // Update existing goal
      updateGoal(editingGoalId, goalData);
      setEditingGoalId(null);
      setMessage({
        text: 'Goal updated successfully!',
        type: 'success',
      });
    } else {
      // Add new goal
      addGoal(goalData);
      setMessage({
        text: 'Goal added successfully!',
        type: 'success',
      });
    }
    
    // Reset form
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '',
      targetDate: '',
      notes: '',
    });
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };

  const handleEdit = (goal) => {
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      targetDate: goal.targetDate || '',
      notes: goal.notes || '',
    });
    setEditingGoalId(goal.id);
    
    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '',
      targetDate: '',
      notes: '',
    });
    setEditingGoalId(null);
  };

  const handleContribution = (goalId, amount) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    
    const newAmount = goal.currentAmount + parseFloat(amount);
    updateGoal(goalId, { currentAmount: newAmount });
  };

  // Calculate days remaining for a goal
  const getDaysRemaining = (targetDate) => {
    if (!targetDate) return null;
    
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Sort goals by completion percentage
  const sortedGoals = [...goals].sort((a, b) => {
    const aPercentage = (a.currentAmount / a.targetAmount) * 100;
    const bPercentage = (b.currentAmount / b.targetAmount) * 100;
    return bPercentage - aPercentage;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Goal Tracker</h1>
      
      {/* Add/Edit Goal Form */}
      <Card title={editingGoalId ? 'Edit Goal' : 'Add New Goal'}>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Goal Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Goal Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                placeholder="e.g., Emergency Fund, New Car, etc."
                required
              />
            </div>
            
            {/* Target Amount */}
            <div>
              <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Amount*
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="targetAmount"
                  name="targetAmount"
                  value={formData.targetAmount}
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
            
            {/* Current Amount */}
            <div>
              <label htmlFor="currentAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Amount
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="currentAmount"
                  name="currentAmount"
                  value={formData.currentAmount}
                  onChange={handleChange}
                  className="block w-full pl-7 pr-12 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 sm:text-sm">USD</span>
                </div>
              </div>
            </div>
            
            {/* Target Date */}
            <div>
              <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Date
              </label>
              <input
                type="date"
                id="targetDate"
                name="targetDate"
                value={formData.targetDate}
                onChange={handleChange}
                className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
              />
            </div>
            
            {/* Notes */}
            <div className="md:col-span-2">
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
          </div>
          
          {/* Submit Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            {editingGoalId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-900"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
            >
              {editingGoalId ? 'Update Goal' : 'Add Goal'}
            </button>
          </div>
        </form>
      </Card>
      
      {/* Goals List */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Savings Goals</h2>
        
        {sortedGoals.length > 0 ? (
          sortedGoals.map((goal) => {
            const daysRemaining = goal.targetDate ? getDaysRemaining(goal.targetDate) : null;
            
            return (
              <Card key={goal.id} className="relative">
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => handleEdit(goal)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{goal.name}</h3>
                  {goal.notes && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{goal.notes}</p>
                  )}
                </div>
                
                <ProgressBar 
                  current={goal.currentAmount} 
                  target={goal.targetAmount} 
                  label={goal.name}
                  className="mb-4"
                />
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Remaining: <span className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(goal.targetAmount - goal.currentAmount)}
                      </span>
                    </p>
                    {daysRemaining !== null && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Time remaining: <span className="font-medium text-gray-900 dark:text-white">
                          {daysRemaining > 0 ? `${daysRemaining} days` : 'Overdue'}
                        </span>
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-end justify-end space-x-2">
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        id={`contribution-${goal.id}`}
                        className="block w-24 pl-7 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const input = document.getElementById(`contribution-${goal.id}`);
                        if (input && input.value) {
                          handleContribution(goal.id, input.value);
                          input.value = '';
                        }
                      }}
                      className="px-3 py-2 bg-green-600 dark:bg-green-500 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              You haven't set any savings goals yet. Add one above to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalTracker;
