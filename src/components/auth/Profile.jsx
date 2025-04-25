import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../Card';

const Profile = () => {
  const { currentUser, updateUserProfile, logout } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setMessage('');
      setLoading(true);
      
      await updateUserProfile({ displayName });
      setMessage('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setError('');
      await logout();
      navigate('/login');
    } catch (err) {
      setError('Failed to log out: ' + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card title="Profile">
        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-900 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {message && (
          <div className="bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-900 text-green-700 dark:text-green-300 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}
        
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Email:</strong> {currentUser?.email}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-900"
          >
            Log Out
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
