import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { useBudget } from '../contexts/BudgetContext';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import CategoryBreakdown from '../components/CategoryBreakdown';
import { formatCurrency, getChartColor } from '../utils/helpers';

const Dashboard = () => {
  const { entries, getSummary, getEntriesByCategory, getMonthlyData, refreshData } = useBudget();
  const [summary, setSummary] = useState({ income: 0, expenses: 0, savings: 0, balance: 0 });
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [breakdownType, setBreakdownType] = useState(null);

  useEffect(() => {
    // Get summary data
    const summaryData = getSummary();
    setSummary(summaryData);

    // Get category data for pie chart
    const categories = getEntriesByCategory();
    const categoryArray = Object.entries(categories).map(([name, value]) => ({
      name,
      value,
    }));
    setCategoryData(categoryArray);

    // Get monthly data for line/bar chart
    const monthly = getMonthlyData();
    setMonthlyData(monthly);
  }, [getSummary, getEntriesByCategory, getMonthlyData]);

  // Icons for stat cards
  const incomeIcon = (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const expenseIcon = (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );

  const balanceIcon = (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );

  const savingsIcon = (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Function to handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
      // Update the dashboard data
      const summaryData = getSummary();
      setSummary(summaryData);

      const categories = getEntriesByCategory();
      const categoryArray = Object.entries(categories).map(([name, value]) => ({
        name,
        value,
      }));
      setCategoryData(categoryArray);

      const monthly = getMonthlyData();
      setMonthlyData(monthly);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 flex items-center"
        >
          {isRefreshing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Refreshing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Data
            </>
          )}
        </button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Income" 
          value={summary.income} 
          icon={incomeIcon}
          onClick={() => {
            setBreakdownType('income');
            setBreakdownOpen(true);
          }}
        />
        <StatCard 
          title="Total Expenses" 
          value={summary.expenses} 
          icon={expenseIcon}
          onClick={() => {
            setBreakdownType('expense');
            setBreakdownOpen(true);
          }}
        />
        <StatCard 
          title="Net Balance" 
          value={summary.balance} 
          icon={balanceIcon}
          onClick={() => {
            setBreakdownType('balance');
            setBreakdownOpen(true);
          }}
        />
        <StatCard 
          title="Total Savings" 
          value={summary.savings} 
          icon={savingsIcon}
          onClick={() => {
            setBreakdownType('saving');
            setBreakdownOpen(true);
          }}
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Categories Pie Chart */}
        <Card title="Expenses by Category">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getChartColor(index)} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
              No expense data available
            </div>
          )}
        </Card>
        
        {/* Monthly Trends Line Chart */}
        <Card title="Monthly Trends">
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={monthlyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#3B82F6" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="expenses" stroke="#EF4444" />
                <Line type="monotone" dataKey="savings" stroke="#10B981" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
              No monthly data available
            </div>
          )}
        </Card>
      </div>
      
      {/* Monthly Breakdown Bar Chart */}
      <Card title="Income vs. Expenses Breakdown">
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={monthlyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#3B82F6" />
              <Bar dataKey="expenses" name="Expenses" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
            No data available
          </div>
        )}
      </Card>
      {/* Category Breakdown Modal */}
      {breakdownOpen && (
        <CategoryBreakdown
          title={
            breakdownType === 'income' ? 'Income' :
            breakdownType === 'expense' ? 'Expenses' :
            breakdownType === 'saving' ? 'Savings' :
            breakdownType === 'balance' ? 'Balance' : ''
          }
          entries={
            breakdownType === 'balance' 
              ? entries.filter(entry => entry.type === 'income' || entry.type === 'expense')
              : entries.filter(entry => entry.type === breakdownType)
          }
          onClose={() => setBreakdownOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
