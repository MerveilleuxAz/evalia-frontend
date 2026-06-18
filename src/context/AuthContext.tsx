import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import type { User, UserRole } from '@/types';
import { api } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (name: string, username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  updateProfile: (data: { name?: string; username?: string; email?: string; password?: string; current_password?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Initialiser la session via localStorage
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await api.auth.me();
          if (userData) {
            setUser({
              id: userData.id,
              email: userData.email,
              name: userData.name,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
              role: userData.is_admin ? 'administrateur' : 'utilisateur',
              createdAt: userData.created_at,
            });
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setIsInitialLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.login({ username, password });
      
      const token = res.token || res.access_token;
      if (token) {
        localStorage.setItem('token', token);
        const userData = await api.auth.me();
        if (userData) {
          setUser({
            id: userData.id,
            email: userData.email,
            name: userData.name,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
            role: userData.is_admin ? 'administrateur' : 'utilisateur',
            createdAt: userData.created_at,
          });
        }
      } else {
        throw new Error("Token manquant dans la réponse.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await api.auth.register({ name, username, email, password });
      
      // Auto-login après inscription
      await login(username, password);
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (data: { name?: string; username?: string; email?: string; password?: string; current_password?: string }) => {
    setIsLoading(true);
    try {
      const res = await api.auth.updateMe(data);
      if (res) {
        setUser((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            name: res.name || prev.name,
            email: res.email || prev.email,
            avatar: res.username ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${res.username}` : prev.avatar,
          };
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const hasRole = useCallback((role: UserRole) => {
    if (!user) return false;
    // L'administrateur satisfait tous les rôles
    if (user.role === 'administrateur') return true;
    // Si on demande le rôle administrateur mais que l'utilisateur ne l'est pas
    if (role === 'administrateur') return false;
    // Par défaut, un utilisateur connecté possède le rôle 'utilisateur'
    return true;
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
        updateProfile,
      }}
    >
      {!isInitialLoading && children}
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
