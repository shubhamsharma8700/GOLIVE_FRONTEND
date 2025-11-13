import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authUtils } from '@/utils/auth';
import type { User } from '@/utils/auth';
import { adminApi } from '@/utils/api';

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasEventAccess: (eventId: string) => boolean;
  grantEventAccess: (eventId: string) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount
    const authData = authUtils.getAuthData();
    if (authData) {
      setUser(authData.user);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await adminApi.login(email, password);
      const userData: User = {
        id: response.userId,
        email: response.email,
        name: response.name,
        role: 'admin',
      };
      
      authUtils.setToken(response.token, userData, response.expiresIn);
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    authUtils.clearToken();
    setUser(null);
  };

  const hasEventAccess = (eventId: string): boolean => {
    // Check if user is admin (admins have access to all events)
    if (authUtils.isAdmin()) {
      return true;
    }
    
    // Check stored access
    const accessData = localStorage.getItem(`eventAccess_${eventId}`);
    if (!accessData) return false;

    try {
      const access = JSON.parse(accessData);
      if (access.expiresAt && access.expiresAt < Date.now()) {
        localStorage.removeItem(`eventAccess_${eventId}`);
        return false;
      }
      return access.granted === true;
    } catch {
      return false;
    }
  };

  const grantEventAccess = (eventId: string) => {
    const accessData = {
      granted: true,
      grantedAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };
    localStorage.setItem(`eventAccess_${eventId}`, JSON.stringify(accessData));
  };

  const value: UserContextType = {
    user,
    isAuthenticated: authUtils.isAuthenticated(),
    isAdmin: authUtils.isAdmin(),
    login,
    logout,
    hasEventAccess,
    grantEventAccess,
    loading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

