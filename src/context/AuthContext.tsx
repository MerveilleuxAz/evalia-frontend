import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo
const mockUsers: Record<string, User> = {
  'participant@evalia.com': {
    id: '1',
    email: 'participant@evalia.com',
    name: 'Jean Participant',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jean',
    role: 'participant',
    createdAt: '2025-01-01T00:00:00Z',
  },
  'organisateur@evalia.com': {
    id: '2',
    email: 'organisateur@evalia.com',
    name: 'Marie Organisatrice',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie',
    role: 'organisateur',
    createdAt: '2024-06-15T00:00:00Z',
  },
  'admin@evalia.com': {
    id: '3',
    email: 'admin@evalia.com',
    name: 'Admin EvalIA',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    role: 'administrateur',
    createdAt: '2024-01-01T00:00:00Z',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, _password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const mockUser = mockUsers[email];
    if (mockUser) {
      setUser(mockUser);
    } else {
      // Create a new participant user for any email
      setUser({
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        role: 'participant',
        createdAt: new Date().toISOString(),
      });
    }
    setIsLoading(false);
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string, role: UserRole = 'participant') => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setUser({
      id: Date.now().toString(),
      email,
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      role,
      createdAt: new Date().toISOString(),
    });
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const hasRole = useCallback((role: UserRole) => {
    if (!user) return false;
    if (user.role === 'administrateur') return true;
    if (role === 'organisateur' && user.role === 'organisateur') return true;
    return user.role === role;
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
