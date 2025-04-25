import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';
import { auth } from '../firebase/firebase';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sign up function with persistence
  const signup = async (email, password, displayName) => {
    try {
      setError('');
      // Set persistence to LOCAL before signing up
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's profile with the display name
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      console.log("Signed up user:", userCredential.user.uid);
      return userCredential.user;
    } catch (err) {
      setError(err.message);
      console.error("Signup error:", err);
      throw err;
    }
  };

  // Login function with persistence
  const login = async (email, password) => {
    try {
      setError('');
      // Set persistence to LOCAL before signing in
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in user:", userCredential.user.uid);
      return userCredential.user;
    } catch (err) {
      setError(err.message);
      console.error("Login error:", err);
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setError('');
      await signOut(auth);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Password reset function
  const resetPassword = async (email) => {
    try {
      setError('');
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update user profile
  const updateUserProfile = async (profile) => {
    try {
      setError('');
      if (currentUser) {
        await updateProfile(currentUser, profile);
        // Force refresh the user to get the updated profile
        setCurrentUser({ ...currentUser });
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Subscribe to auth state changes when the component mounts
  useEffect(() => {
    console.log("Setting up auth state change listener");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? `User: ${user.uid}` : "No user");
      setCurrentUser(user);
      setLoading(false);
    });

    // Unsubscribe when the component unmounts
    return unsubscribe;
  }, []);

  // Value to be provided to consumers
  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
