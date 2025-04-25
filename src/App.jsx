import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import AddEntry from './pages/AddEntry';
import BudgetOverview from './pages/BudgetOverview';
import GoalTracker from './pages/GoalTracker';
import SavingsCalculator from './pages/SavingsCalculator';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';
import Profile from './components/auth/Profile';
import PrivateRoute from './components/auth/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import { BudgetProvider } from './contexts/BudgetContext';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for user preference in localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    
    // Apply dark mode class to html element
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <AuthProvider>
      <BudgetProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Layout toggleDarkMode={toggleDarkMode} isDarkMode={darkMode} />}>
              <Route index element={<Dashboard />} />
              <Route path="add-entry" element={<AddEntry />} />
              <Route path="budget-overview" element={<BudgetOverview />} />
              <Route path="goal-tracker" element={<GoalTracker />} />
              <Route path="savings-calculator" element={<SavingsCalculator />} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>
        </Routes>
      </BudgetProvider>
    </AuthProvider>
  );
}

export default App;
