import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from "../api/api";
import { Profile } from '../api/interfaces/types';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  profileId: string | null;
  isLoading: boolean;
  login: (token: string, refreshToken: string, userId: string, profileId: string, expiresAt: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const expiration = localStorage.getItem("expiresAt");
    const storedUserId = localStorage.getItem("userId");
    const storedProfileId = localStorage.getItem("profileId");

    if (token && expiration && new Date().getTime() < parseInt(expiration)) {
      setIsAuthenticated(true);
      setUserId(storedUserId || null);
      setProfileId(storedProfileId || null);
    } else {
      logout();
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, refreshToken: string, userId: string, profileId: string, expiresAt: number) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userId", userId);
    localStorage.setItem("profileId", profileId);
    localStorage.setItem("expiresAt", expiresAt.toString());
    setIsAuthenticated(true);
    setUserId(userId);
    setProfileId(profileId);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUserId(null);
    setProfileId(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, profileId, isLoading, login, logout }}>
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
