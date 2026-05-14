import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { API_ROUTES, STORAGE_KEYS, THEMES } from '../utils/constants';
import { Spinner } from '../components/ui/Feedback';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [isInitializing, setIsInitializing] = useState(true);

  // Use React Query for profile fetching
  const { 
    data: user, 
    isLoading: isProfileLoading, 
    refetch,
    remove: removeUserQuery 
  } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (!token) return null;
      const response = await api.get(API_ROUTES.AUTH.PROFILE);
      return response.data;
    },
    enabled: !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
    retry: false,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  useEffect(() => {
    // Initial theme setup
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedTheme === THEMES.DARK || (user?.theme === THEMES.DARK)) {
      document.documentElement.classList.add(THEMES.DARK);
    }

    if (!isProfileLoading) {
      setIsInitializing(false);
    }
  }, [user, isProfileLoading]);

  const login = async (email, password) => {
    const response = await api.post(API_ROUTES.AUTH.LOGIN, { email, password });
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.access);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refresh);
    
    // Seed the cache with the user data returned from login
    queryClient.setQueryData(['profile'], response.data.user);
    
    if (response.data.user.theme === THEMES.DARK) {
      document.documentElement.classList.add(THEMES.DARK);
    }
    
    return response.data;
  };

  const signup = async (userData) => {
    const response = await api.post(API_ROUTES.AUTH.SIGNUP, userData);
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.tokens.access);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.tokens.refresh);
    
    queryClient.setQueryData(['profile'], response.data.user);
    
    if (response.data.user.theme === THEMES.DARK) {
      document.documentElement.classList.add(THEMES.DARK);
    }
    
    return response.data;
  };

  const logout = async () => {
    try {
      const refresh = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (refresh) {
        await api.post(API_ROUTES.AUTH.LOGOUT, { refresh });
      }
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      removeUserQuery();
      queryClient.clear();
      document.documentElement.classList.remove(THEMES.DARK);
    }
  };

  const updateProfile = async (data) => {
    const response = await api.patch(API_ROUTES.AUTH.PROFILE, data);
    queryClient.setQueryData(['profile'], response.data);
    
    if (response.data.theme === THEMES.DARK) {
      document.documentElement.classList.add(THEMES.DARK);
    } else {
      document.documentElement.classList.remove(THEMES.DARK);
    }
    
    return response.data;
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-surface-dark">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading: isProfileLoading, 
      login, 
      signup, 
      logout, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
