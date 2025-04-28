import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../components/Card';
import { formatCurrency, calculateFutureValue } from '../utils/helpers';

const SavingsCalculator = () => {
  const [formData, setFormData] = useState({
    principal: 1000,
    rate: 3.5,
    months: 12,
    monthlyContribution: 0,
  });
  const [results, setResults] = useState({
    futureValue: 0,
    interestEarned: 0,
    monthlyEarnings: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [compareMode, setCompareMode] = useState(false);
  const [compareRate, setCompareRate] = useState(4.5);

  // Calculate results when form data changes
  useEffect(() => {
    calculateResults();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value) || 0,
    });
  };

  const handleCompareRateChange = (e) => {
    setCompareRate(parseFloat(e.target.value) || 0);
  };

  const calculateResults = () => {
    const { principal, rate, months, monthlyContribution } = formData;
    
    // Calculate future value
    const futureValue = calculateFutureValue(principal, rate, months, monthlyContribution);
    
    // Calculate interest earned
    const totalContributions = principal + (monthlyContribution * months);
    const interestEarned = futureValue - totalContributions;
    
    // Calculate average monthly earnings
    const monthlyEarnings = interestEarned / months;
    
    setResults({
      futureValue,
      interestEarned,
      monthlyEarnings,
    });
    
    // Generate chart data
    generateChartData();
  };

  const generateChartData = () => {
    const { principal, rate, months, monthlyContribution } = formData;
    const data = [];
    
    // Generate data points for each month
    for (let i = 0; i <= months; i++) {
      const primaryValue = calculateFutureValue(principal, rate, i, monthlyContribution);
      const totalContributions = principal + (monthlyContribution * i);
      
      const dataPoint = {
        month: i,
        value: primaryValue,
        contributions: totalContributions,
      };
      
      // Add compare value if in compare mode
      if (compareMode) {
        dataPoint.compareValue = calculateFutureValue(principal, compareRate, i, monthlyContribution);
      }
      
      data.push(dataPoint);
    }
    
    setChartData(data);
  };

  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
    // Regenerate chart data with compare values
    generateChartData();
  };

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">Month {label}</p>
          <p className="text-blue-600 dark:text-blue-400">
            Balance: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Contributions: {formatCurrency(payload[1].value)}
          </p>
          {compareMode && (
            <p className="text-green-600 dark:text-green-400">
              Compare ({compareRate}%): {formatCurrency(payload[2].value)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Savings Interest Calculator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calculator Form */}
        <div className="lg:col-span-1">
          <Card title="Calculator Inputs">
            <form className="space-y-4">
              {/* Principal Amount */}
              <div>
                <label htmlFor="principal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Savings Amount
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="principal"
                    name="principal"
                    value={formData.principal}
                    onChange={handleChange}
                    className="block w-full pl-7 pr-12 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    step="100"
                    min="0"
                  />
                </div>
              </div>
              
              {/* Interest Rate */}
              <div>
                <label htmlFor="rate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Annual Interest Rate (APY)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="number"
                    id="rate"
                    name="rate"
                    value={formData.rate}
                    onChange={handleChange}
                    className="block w-full pr-12 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">%</span>
                  </div>
                </div>
              </div>
              
              {/* Monthly Contribution */}
              <div>
                <label htmlFor="monthlyContribution" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Monthly Contribution (Optional)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="monthlyContribution"
                    name="monthlyContribution"
                    value={formData.monthlyContribution}
                    onChange={handleChange}
                    className="block w-full pl-7 pr-12 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    step="10"
                    min="0"
                  />
                </div>
              </div>
              
              {/* Time Period */}
              <div>
                <label htmlFor="months" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Time Period (Months)
                </label>
                <input
                  type="number"
                  id="months"
                  name="months"
                  value={formData.months}
                  onChange={handleChange}
                  className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="12"
                  step="1"
                  min="1"
                  max="600"
                />
              </div>
              
              {/* Compare Mode Toggle */}
              <div className="pt-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="compareMode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Compare with different rate
                  </label>
                  <button
                    type="button"
                    onClick={toggleCompareMode}
                    className={`${
                      compareMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900`}
                    role="switch"
                    aria-checked={compareMode}
                  >
                    <span className="sr-only">Compare mode</span>
                    <span
                      aria-hidden="true"
                      className={`${
                        compareMode ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                    ></span>
                  </button>
                </div>
                
                {compareMode && (
                  <div className="mt-3">
                    <label htmlFor="compareRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Compare Rate (APY)
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="number"
                        id="compareRate"
                        name="compareRate"
                        value={compareRate}
                        onChange={handleCompareRateChange}
                        className="block w-full pr-12 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0.00"
                        step="0.1"
                        min="0"
                        max="100"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 dark:text-gray-400 sm:text-sm">%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </Card>
          
          {/* Results Summary */}
          <Card title="Results" className="mt-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Future Value</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(results.futureValue)}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Interest Earned</p>
                <p className="mt-1 text-2xl font-semibold text-green-600 dark:text-green-400">
                  {formatCurrency(results.interestEarned)}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Monthly Earnings</p>
                <p className="mt-1 text-2xl font-semibold text-blue-600 dark:text-blue-400">
                  {formatCurrency(results.monthlyEarnings)}
                </p>
              </div>
              
              <div className="pt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Monthly Rate: {(formData.rate / 12).toFixed(4)}%
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Contributions: {formatCurrency(formData.principal + (formData.monthlyContribution * formData.months))}
                </p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Chart */}
        <div className="lg:col-span-2">
          <Card title="Growth Projection">
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    label={{ 
                      value: 'Months', 
                      position: 'insideBottomRight', 
                      offset: -10 
                    }} 
                  />
                  <YAxis 
                    tickFormatter={(value) => formatCurrency(value, 'USD', 0)}
                    label={{ 
                      value: 'Balance', 
                      angle: -90, 
                      position: 'insideLeft',
                    }} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name={`Balance (${formData.rate}%)`}
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="contributions" 
                    name="Contributions" 
                    stroke="#6B7280" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                  {compareMode && (
                    <Line 
                      type="monotone" 
                      dataKey="compareValue" 
                      name={`Compare (${compareRate}%)`}
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={false}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Information Section */}
      <Card title="About Savings Interest">
        <div className="prose dark:prose-invert max-w-none">
          <p>
            This calculator helps you project growth for both regular savings accounts and high-yield savings accounts.
            High-yield accounts typically offer higher interest rates than traditional savings accounts, 
            allowing your money to grow faster over time. Most savings accounts are FDIC-insured up to $250,000 per 
            depositor, per bank.
          </p>
          
          <h3>How the Calculator Works</h3>
          <p>
            This calculator uses the compound interest formula to project your savings growth:
          </p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
            Future Value = Principal × (1 + Monthly Rate)^Months
          </pre>
          <p>
            If you include monthly contributions, the formula becomes more complex, accounting for the 
            regular deposits and their compound growth over time.
          </p>
          
          <h3>Regular vs. High-Yield Savings</h3>
          <p>
            Regular savings accounts typically offer lower interest rates (often 0.01% to 0.1% APY), while 
            high-yield savings accounts can offer significantly higher rates (often 3% to 5% APY or more). 
            Use the compare feature to see how different interest rates affect your savings over time.
          </p>
          
          <h3>Tips for Maximizing Your Savings</h3>
          <ul>
            <li>Start early - the power of compound interest grows significantly over time</li>
            <li>Make regular contributions to accelerate your savings growth</li>
            <li>Shop around for the best APY rates, which can vary significantly between banks</li>
            <li>Consider laddering CDs (Certificates of Deposit) for potentially higher returns</li>
            <li>Remember that inflation can erode purchasing power over time</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default SavingsCalculator;
