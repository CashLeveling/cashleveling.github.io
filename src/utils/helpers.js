/**
 * Format a number as currency
 * @param {number} value - The value to format
 * @param {string} currency - The currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value);
};

/**
 * Format a date string
 * @param {string} dateString - The date string to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  // Parse the date parts from the YYYY-MM-DD string to preserve local date
  const [year, month, day] = dateString.split('-').map(Number);
  // Create a date using local timezone (months are 0-indexed in JS Date)
  const date = new Date(year, month - 1, day);
  
  const defaultOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(date);
};

/**
 * Calculate future value with compound interest
 * @param {number} principal - Initial investment amount
 * @param {number} rate - Annual interest rate (as a percentage)
 * @param {number} months - Number of months
 * @param {number} monthlyContribution - Monthly contribution amount (default: 0)
 * @returns {number} Future value
 */
export const calculateFutureValue = (principal, rate, months, monthlyContribution = 0) => {
  const monthlyRate = (rate / 100) / 12;
  
  // Future value of principal
  const principalFV = principal * Math.pow(1 + monthlyRate, months);
  
  // Future value of monthly contributions (if any)
  let contributionFV = 0;
  if (monthlyContribution > 0 && monthlyRate > 0) {
    contributionFV = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  } else if (monthlyContribution > 0) {
    // If rate is 0, it's just the sum of contributions
    contributionFV = monthlyContribution * months;
  }
  
  return principalFV + contributionFV;
};

/**
 * Group entries by month and year
 * @param {Array} entries - Array of entry objects with date property
 * @returns {Object} Entries grouped by month/year
 */
export const groupEntriesByMonth = (entries) => {
  const grouped = {};
  
  entries.forEach(entry => {
    const date = new Date(entry.date);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    
    if (!grouped[monthYear]) {
      grouped[monthYear] = [];
    }
    
    grouped[monthYear].push(entry);
  });
  
  return grouped;
};

/**
 * Generate an array of months between two dates
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Array} Array of month/year strings
 */
export const generateMonthRange = (startDate, endDate) => {
  const months = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    months.push(`${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`);
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  return months;
};

/**
 * Get a random color from a predefined palette
 * @param {number} index - Optional index to get consistent colors
 * @returns {string} Hex color code
 */
export const getChartColor = (index) => {
  const colors = [
    '#3B82F6', // blue-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#EF4444', // red-500
    '#8B5CF6', // violet-500
    '#EC4899', // pink-500
    '#6366F1', // indigo-500
    '#14B8A6', // teal-500
    '#F97316', // orange-500
    '#84CC16', // lime-500
  ];
  
  if (typeof index === 'number') {
    return colors[index % colors.length];
  }
  
  return colors[Math.floor(Math.random() * colors.length)];
};
