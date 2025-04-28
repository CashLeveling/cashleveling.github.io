import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from './AuthContext';

// Create the context
const BudgetContext = createContext();

// Custom hook to use the budget context
export const useBudget = () => {
  return useContext(BudgetContext);
};

// Provider component
export const BudgetProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);
  const [goals, setGoals] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [recurringIncomes, setRecurringIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Function to fetch data from Firestore
  const fetchData = async () => {
    console.log("fetchData called, currentUser:", currentUser ? currentUser.uid : "not logged in");
    
    if (!currentUser) {
      console.log("No user logged in, using localStorage data");
      // If no user is logged in, use localStorage data
      const savedEntries = localStorage.getItem('budgetEntries');
      const savedGoals = localStorage.getItem('savingsGoals');
      const savedAccounts = localStorage.getItem('accounts');
      
      setEntries(savedEntries ? JSON.parse(savedEntries) : []);
      setGoals(savedGoals ? JSON.parse(savedGoals) : []);
      setAccounts(savedAccounts ? JSON.parse(savedAccounts) : []);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("Fetching data for user:", currentUser.uid);
      
      // Fetch entries
      console.log("Building entries query for userId:", currentUser.uid);
      const entriesQuery = query(
        collection(db, 'entries'),
        where('userId', '==', currentUser.uid),
        orderBy('date', 'desc')
      );
      
      console.log("Executing entries query...");
      const entriesSnapshot = await getDocs(entriesQuery);
      console.log("Entries fetched:", entriesSnapshot.docs.length);
      
      if (entriesSnapshot.docs.length === 0) {
        console.log("No entries found for user:", currentUser.uid);
      } else {
        console.log("First entry userId:", entriesSnapshot.docs[0].data().userId);
        console.log("Current user uid:", currentUser.uid);
        console.log("Do they match?", entriesSnapshot.docs[0].data().userId === currentUser.uid);
      }
      
      const entriesList = entriesSnapshot.docs.map(doc => {
        const data = doc.data();
        console.log("Entry data:", { id: doc.id, ...data });
        return {
          id: doc.id,
          ...data,
          date: data.date.toDate().toISOString().split('T')[0]
        };
      });
      
      // Fetch goals
      const goalsQuery = query(
        collection(db, 'goals'),
        where('userId', '==', currentUser.uid)
      );
      
      const goalsSnapshot = await getDocs(goalsQuery);
      console.log("Goals fetched:", goalsSnapshot.docs.length);
      
      const goalsList = goalsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Fetch accounts
      const accountsQuery = query(
        collection(db, 'accounts'),
        where('userId', '==', currentUser.uid)
      );
      
      const accountsSnapshot = await getDocs(accountsQuery);
      console.log("Accounts fetched:", accountsSnapshot.docs.length);
      
      const accountsList = accountsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Filter out recurring income entries
      const recurringIncomesList = entriesList.filter(entry => 
        entry.type === 'income' && entry.isRecurring === true
      );
      
      setEntries(entriesList);
      setGoals(goalsList);
      setAccounts(accountsList);
      setRecurringIncomes(recurringIncomesList);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate the next pay date based on frequency and current date
  const calculateNextPayDate = useCallback((date, frequency) => {
    const currentDate = new Date(date);
    let nextDate = new Date(currentDate);
    
    switch (frequency) {
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
    
    return nextDate;
  }, []);

  // Get upcoming recurring income entries
  const getUpcomingRecurringIncomes = useCallback((daysAhead = 30) => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + daysAhead);
    
    return recurringIncomes.filter(income => {
      const nextPayDate = new Date(income.nextPayDate);
      return nextPayDate >= today && nextPayDate <= futureDate;
    }).sort((a, b) => new Date(a.nextPayDate) - new Date(b.nextPayDate));
  }, [recurringIncomes]);

  // Process due recurring income entries and create new entries
  const processDueRecurringIncomes = useCallback(async () => {
    if (!currentUser) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day for accurate comparison
    
    // Find recurring incomes that are due (nextPayDate <= today)
    const dueIncomes = recurringIncomes.filter(income => {
      const nextPayDate = new Date(income.nextPayDate);
      nextPayDate.setHours(0, 0, 0, 0);
      return nextPayDate <= today;
    });
    
    // Process each due income
    for (const income of dueIncomes) {
      try {
        // Create a new entry for this income
        const newEntryData = {
          type: 'income',
          amount: income.amount,
          category: income.category,
          date: new Date(income.nextPayDate),
          notes: `Auto-generated from recurring income: ${income.notes || ''}`,
          accountId: income.accountId || '',
          userId: currentUser.uid,
          createdAt: serverTimestamp(),
          isAutoGenerated: true,
        };
        
        // Add the new entry
        const docRef = await addDoc(collection(db, 'entries'), newEntryData);
        
        const newEntry = {
          ...newEntryData,
          id: docRef.id,
          date: newEntryData.date.toISOString().split('T')[0]
        };
        
        // Update entries state
        setEntries(prevEntries => [newEntry, ...prevEntries]);
        
        // Calculate the next pay date for this recurring income
        const nextDate = calculateNextPayDate(income.nextPayDate, income.frequency);
        
        // Update the recurring income with the new next pay date
        const incomeRef = doc(db, 'entries', income.id);
        await updateDoc(incomeRef, { 
          nextPayDate: nextDate 
        });
        
        // Update the recurring income in state
        setRecurringIncomes(prevIncomes => 
          prevIncomes.map(ri => 
            ri.id === income.id 
              ? { ...ri, nextPayDate: nextDate.toISOString().split('T')[0] } 
              : ri
          )
        );
        
        console.log(`Auto-generated entry for recurring income: ${income.id}`);
      } catch (error) {
        console.error(`Error processing recurring income ${income.id}:`, error);
      }
    }
  }, [currentUser, recurringIncomes, calculateNextPayDate]);

  // Fetch entries and goals when user changes
  useEffect(() => {
    fetchData();
  }, [currentUser]);
  
  // Check for due recurring incomes when the app loads or when recurringIncomes changes
  useEffect(() => {
    if (recurringIncomes.length > 0 && !loading) {
      processDueRecurringIncomes();
    }
  }, [recurringIncomes, loading, processDueRecurringIncomes]);

  // Add a new entry
  const addEntry = async (entry) => {
    console.log("Adding entry, current user:", currentUser ? currentUser.uid : "not logged in");
    
    if (!currentUser) {
      console.log("No user logged in, using localStorage");
      // Fallback to localStorage if no user is logged in
      const newEntry = {
        ...entry,
        id: Date.now().toString(),
        date: entry.date || new Date().toISOString().split('T')[0],
      };
      const updatedEntries = [...entries, newEntry];
      setEntries(updatedEntries);
      localStorage.setItem('budgetEntries', JSON.stringify(updatedEntries));
      return;
    }

    try {
      console.log("Adding entry to Firestore with userId:", currentUser.uid);
      const entryData = {
        ...entry,
        userId: currentUser.uid,
        date: new Date(entry.date || new Date()),
        createdAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, 'entries'), entryData);
      console.log("Entry added with ID:", docRef.id);
      
      const newEntry = {
        ...entryData,
        id: docRef.id,
        date: entryData.date.toISOString().split('T')[0]
      };
      
      // If it's a recurring income, add it to the recurring incomes list
      if (entryData.type === 'income' && entryData.isRecurring) {
        setRecurringIncomes([...recurringIncomes, newEntry]);
      }
      
      setEntries([newEntry, ...entries]);
    } catch (error) {
      console.error("Error adding entry:", error);
      throw error;
    }
  };

  // Delete an entry
  const deleteEntry = async (id) => {
    if (!currentUser) {
      // Fallback to localStorage if no user is logged in
      const updatedEntries = entries.filter(entry => entry.id !== id);
      setEntries(updatedEntries);
      localStorage.setItem('budgetEntries', JSON.stringify(updatedEntries));
      return;
    }

    try {
      await deleteDoc(doc(db, 'entries', id));
      
      // Remove from entries
      setEntries(entries.filter(entry => entry.id !== id));
      
      // If it's a recurring income, remove from recurring incomes as well
      if (recurringIncomes.some(ri => ri.id === id)) {
        setRecurringIncomes(recurringIncomes.filter(ri => ri.id !== id));
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      throw error;
    }
  };

  // Update an entry
  const updateEntry = async (id, updatedEntry) => {
    if (!currentUser) {
      // Fallback to localStorage if no user is logged in
      const updatedEntries = entries.map(entry => 
        entry.id === id ? { ...entry, ...updatedEntry } : entry
      );
      setEntries(updatedEntries);
      localStorage.setItem('budgetEntries', JSON.stringify(updatedEntries));
      return;
    }

    try {
      const entryRef = doc(db, 'entries', id);
      
      // If date is included, convert it to a Date object
      const dataToUpdate = { ...updatedEntry };
      if (dataToUpdate.date) {
        dataToUpdate.date = new Date(dataToUpdate.date);
      }
      
      await updateDoc(entryRef, dataToUpdate);
      
      const updatedEntryList = entries.map(entry => {
        if (entry.id === id) {
          const updated = { ...entry, ...updatedEntry };
          // Ensure date is in the correct format for the UI
          if (updated.date instanceof Date) {
            updated.date = updated.date.toISOString().split('T')[0];
          }
          return updated;
        }
        return entry;
      });
      
      setEntries(updatedEntryList);
      
      // Update recurring incomes if necessary
      if (updatedEntryList.find(e => e.id === id)?.type === 'income') {
        const entryToUpdate = updatedEntryList.find(e => e.id === id);
        
        // If the entry is now a recurring income or was a recurring income
        if (entryToUpdate.isRecurring || recurringIncomes.some(ri => ri.id === id)) {
          // Remove the old entry from recurring incomes if it exists
          const filteredRecurringIncomes = recurringIncomes.filter(ri => ri.id !== id);
          
          // If it's still a recurring income, add the updated version
          if (entryToUpdate.isRecurring) {
            setRecurringIncomes([...filteredRecurringIncomes, entryToUpdate]);
          } else {
            // Otherwise just remove it
            setRecurringIncomes(filteredRecurringIncomes);
          }
        }
      }
    } catch (error) {
      console.error("Error updating entry:", error);
      throw error;
    }
  };

  // Add a new goal
  const addGoal = async (goal) => {
    if (!currentUser) {
      // Fallback to localStorage if no user is logged in
      const newGoal = {
        ...goal,
        id: Date.now().toString(),
        currentAmount: goal.currentAmount || 0,
      };
      const updatedGoals = [...goals, newGoal];
      setGoals(updatedGoals);
      localStorage.setItem('savingsGoals', JSON.stringify(updatedGoals));
      return;
    }

    try {
      const goalData = {
        ...goal,
        userId: currentUser.uid,
        currentAmount: goal.currentAmount || 0,
        createdAt: serverTimestamp(),
      };
      
      if (goalData.targetDate) {
        goalData.targetDate = new Date(goalData.targetDate);
      }
      
      const docRef = await addDoc(collection(db, 'goals'), goalData);
      
      const newGoal = {
        ...goalData,
        id: docRef.id,
        targetDate: goalData.targetDate ? goalData.targetDate.toISOString().split('T')[0] : null
      };
      
      setGoals([...goals, newGoal]);
    } catch (error) {
      console.error("Error adding goal:", error);
      throw error;
    }
  };

  // Update a goal
  const updateGoal = async (id, updatedGoal) => {
    if (!currentUser) {
      // Fallback to localStorage if no user is logged in
      const updatedGoals = goals.map(goal => 
        goal.id === id ? { ...goal, ...updatedGoal } : goal
      );
      setGoals(updatedGoals);
      localStorage.setItem('savingsGoals', JSON.stringify(updatedGoals));
      return;
    }

    try {
      const goalRef = doc(db, 'goals', id);
      
      // If targetDate is included, convert it to a Date object
      const dataToUpdate = { ...updatedGoal };
      if (dataToUpdate.targetDate) {
        dataToUpdate.targetDate = new Date(dataToUpdate.targetDate);
      }
      
      await updateDoc(goalRef, dataToUpdate);
      
      setGoals(goals.map(goal => {
        if (goal.id === id) {
          const updated = { ...goal, ...updatedGoal };
          // Ensure targetDate is in the correct format for the UI
          if (updated.targetDate instanceof Date) {
            updated.targetDate = updated.targetDate.toISOString().split('T')[0];
          }
          return updated;
        }
        return goal;
      }));
    } catch (error) {
      console.error("Error updating goal:", error);
      throw error;
    }
  };

  // Delete a goal
  const deleteGoal = async (id) => {
    if (!currentUser) {
      // Fallback to localStorage if no user is logged in
      const updatedGoals = goals.filter(goal => goal.id !== id);
      setGoals(updatedGoals);
      localStorage.setItem('savingsGoals', JSON.stringify(updatedGoals));
      return;
    }

    try {
      await deleteDoc(doc(db, 'goals', id));
      setGoals(goals.filter(goal => goal.id !== id));
    } catch (error) {
      console.error("Error deleting goal:", error);
      throw error;
    }
  };

  // Add a new account
  const addAccount = async (account) => {
    if (!currentUser) {
      // Fallback to localStorage if no user is logged in
      const newAccount = {
        ...account,
        id: Date.now().toString(),
        currentBalance: account.startingBalance,
        createdAt: new Date().toISOString(),
      };
      const updatedAccounts = [...accounts, newAccount];
      setAccounts(updatedAccounts);
      localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
      return;
    }

    try {
      const accountData = {
        ...account,
        userId: currentUser.uid,
        currentBalance: account.startingBalance,
        createdAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, 'accounts'), accountData);
      
      const newAccount = {
        ...accountData,
        id: docRef.id,
      };
      
      setAccounts([...accounts, newAccount]);
    } catch (error) {
      console.error("Error adding account:", error);
      throw error;
    }
  };

  // Update an account
  const updateAccount = async (id, updatedAccount) => {
    if (!currentUser) {
      // Fallback to localStorage if no user is logged in
      const updatedAccounts = accounts.map(account => 
        account.id === id ? { ...account, ...updatedAccount } : account
      );
      setAccounts(updatedAccounts);
      localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
      return;
    }

    try {
      const accountRef = doc(db, 'accounts', id);
      await updateDoc(accountRef, updatedAccount);
      
      setAccounts(accounts.map(account => 
        account.id === id ? { ...account, ...updatedAccount } : account
      ));
    } catch (error) {
      console.error("Error updating account:", error);
      throw error;
    }
  };

  // Delete an account
  const deleteAccount = async (id) => {
    if (!currentUser) {
      // Fallback to localStorage if no user is logged in
      const updatedAccounts = accounts.filter(account => account.id !== id);
      setAccounts(updatedAccounts);
      localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
      return;
    }

    try {
      await deleteDoc(doc(db, 'accounts', id));
      setAccounts(accounts.filter(account => account.id !== id));
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  };

  // Calculate summary data
  const getSummary = () => {
    const income = entries
      .filter(entry => entry.type === 'income')
      .reduce((sum, entry) => sum + Number(entry.amount), 0);
    
    const expenses = entries
      .filter(entry => entry.type === 'expense')
      .reduce((sum, entry) => sum + Number(entry.amount), 0);
    
    const savings = entries
      .filter(entry => entry.type === 'saving')
      .reduce((sum, entry) => sum + Number(entry.amount), 0);
    
    // Calculate total starting balance from all accounts
    const startingBalance = accounts
      .reduce((sum, account) => sum + Number(account.startingBalance || 0), 0);
    
    return {
      income,
      expenses,
      savings,
      startingBalance,
      balance: startingBalance + income - expenses,
    };
  };

  // Get entries by category
  const getEntriesByCategory = () => {
    const categories = {};
    
    entries.forEach(entry => {
      if (entry.type === 'expense') {
        if (!categories[entry.category]) {
          categories[entry.category] = 0;
        }
        categories[entry.category] += Number(entry.amount);
      }
    });
    
    return categories;
  };

  // Get monthly data for charts
  const getMonthlyData = () => {
    const months = {};
    
    entries.forEach(entry => {
      const date = new Date(entry.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!months[monthYear]) {
        months[monthYear] = {
          income: 0,
          expenses: 0,
          savings: 0,
        };
      }
      
      if (entry.type === 'income') {
        months[monthYear].income += Number(entry.amount);
      } else if (entry.type === 'expense') {
        months[monthYear].expenses += Number(entry.amount);
      } else if (entry.type === 'saving') {
        months[monthYear].savings += Number(entry.amount);
      }
    });
    
    // Convert to array and sort by date
    return Object.entries(months)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => {
        const [aMonth, aYear] = a.month.split('/');
        const [bMonth, bYear] = b.month.split('/');
        return new Date(aYear, aMonth - 1) - new Date(bYear, bMonth - 1);
      });
  };

  // Value to be provided to consumers
  const value = {
    entries,
    goals,
    accounts,
    recurringIncomes,
    loading,
    addEntry,
    deleteEntry,
    updateEntry,
    addGoal,
    updateGoal,
    deleteGoal,
    addAccount,
    updateAccount,
    deleteAccount,
    getSummary,
    getEntriesByCategory,
    getMonthlyData,
    getUpcomingRecurringIncomes,
    calculateNextPayDate,
    processDueRecurringIncomes,
    refreshData: fetchData, // Expose the fetchData function to allow manual refresh
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
};
