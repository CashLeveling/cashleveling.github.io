import React from 'react';
import AccountsManager from '../components/AccountsManager';

const AccountsPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Accounts Management</h1>
      <AccountsManager />
    </div>
  );
};

export default AccountsPage;
