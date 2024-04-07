import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  login: (token: string, refreshToken: string, userId: string, expiresAt: number) => void;  // Update this line
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");
    const expiresAt = localStorage.getItem("expiresAt");

    if (accessToken && storedUserId && expiresAt && new Date().getTime() < parseInt(expiresAt)) {
      setIsAuthenticated(true);
      setUserId(storedUserId);
    }
  }, []);

  const login = (token: string, refreshToken: string, userId: string, expiresAt: number) => {  // Update this line
    console.log("Logging in with userID:", userId); 
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userId", userId);
    localStorage.setItem("expiresAt", expiresAt.toString());
    setIsAuthenticated(true);
    setUserId(userId);
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
