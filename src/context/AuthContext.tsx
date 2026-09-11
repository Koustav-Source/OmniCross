import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export type UserRole =
  | 'SUPER_ADMIN'
  | 'CITY_ADMIN'
  | 'TRAFFIC_OPERATOR'
  | 'EMERGENCY_OPERATOR'
  | 'ANALYST'
  | 'VIEWER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: 'user-default-1',
    name: 'Chief Traffic Operator',
    email: 'operator@omnicross.city',
    role: 'TRAFFIC_OPERATOR',
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('omnicross_token'));

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('omnicross_token', res.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('omnicross_token');
  };

  const switchRole = (role: UserRole) => {
    if (!user) return;
    const roleNames: Record<UserRole, string> = {
      SUPER_ADMIN: 'Command Centre Super Admin',
      CITY_ADMIN: 'City Operations Director',
      TRAFFIC_OPERATOR: 'Chief Traffic Operator',
      EMERGENCY_OPERATOR: 'EMS Response Commander',
      ANALYST: 'Transportation Data Analyst',
      VIEWER: 'Public Traffic Observer',
    };
    setUser({
      ...user,
      role,
      name: roleNames[role] || user.name,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        switchRole,
        isAuthenticated: !!user,
      }}
    >
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
