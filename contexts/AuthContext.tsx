import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserData {
  uid: string;
  email: string;
  name?: string;
  picture?: string;
  provider: string;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  signIn: (idToken: string, provider: 'google' | 'apple') => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:3000/api';

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthState = async () => {
      try {
        const isAuthenticated = await AsyncStorage.getItem('isAuthenticated');
        const userData = await AsyncStorage.getItem('userData');
        
        if (isAuthenticated === 'true' && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const signIn = async (idToken: string, provider: 'google' | 'apple') => {
    try {
      // Send token to backend for verification
      const response = await fetch(`${API_BASE_URL}/auth/${provider}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (data.success) {
        // Store user data locally
        await AsyncStorage.setItem('isAuthenticated', 'true');
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        setUser(data.user);
      } else {
        throw new Error(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await AsyncStorage.removeItem('isAuthenticated');
      await AsyncStorage.removeItem('userData');
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signOutUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};