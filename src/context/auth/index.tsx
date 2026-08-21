'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { api, socketService } from '@/lib';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (phone: string, name: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Restore session from localStorage on initial load
  useEffect(() => {
    async function restoreSession() {
      const storedToken = localStorage.getItem('nexachat_token');
      const storedUser = localStorage.getItem('nexachat_user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          socketService.connect(storedToken);

          // Verify with /auth/me in background
          const verifiedUser = await api.getMe();
          setUser(verifiedUser);
          localStorage.setItem('nexachat_user', JSON.stringify(verifiedUser));
        } catch (err: unknown) {
          console.warn('Session verification failed, clearing auth cache:', err);
          logout();
        }
      }
      setIsLoading(false);
    }

    restoreSession();
  }, []);

  const login = async (phone: string, name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.login(phone.trim(), name.trim());
      setToken(response.token);
      setUser(response.user);

      localStorage.setItem('nexachat_token', response.token);
      localStorage.setItem('nexachat_user', JSON.stringify(response.user));

      // Connect socket
      socketService.connect(response.token);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('nexachat_token');
    localStorage.removeItem('nexachat_user');
    socketService.disconnect();
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
