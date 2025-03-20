'use client'

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import Cookies from 'js-cookie';
import { User } from '@/data/@types/models/users/entities/user.entity';
import { userService } from '@/data/services/users/users.service';

export interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isLoadingUser: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setLoading] = useState<boolean>(false);

  const fetchUserData = useCallback(async () => {
    setLoading(true)
    const token = Cookies.get('access_token');
    if (token) {
      const user = await userService.find({ requiresAuth: true, subEndpoint: `/token/${token}` });
      setUser(user.data);
    }
    setLoading(false)
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const login = async (token: string) => {
    setLoading(true)
    Cookies.set('access_token', token, { expires: 7 });
    const user = await userService.find({ requiresAuth: true, subEndpoint: `/token/${token}` });
    setUser(user);
    setLoading(false)
  };

  const logout = () => {
    Cookies.remove('access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoadingUser }}>
      {children}
    </AuthContext.Provider>
  );
};
