// plik: AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;  // Stan określający, czy użytkownik jest zalogowany
  userId: string | null;
  isLoading: boolean;     // ID zalogowanego użytkownika
  login: (token: string, refreshToken: string, userId: string, expiresAt: number) => void;  // Funkcja logowania
  logout: () => void;         // Funkcja wylogowania
}

// Tworzenie kontekstu AuthContext z domyślną wartością `null!` (assertion that it will not be null)
const AuthContext = createContext<AuthContextType | null>(null);

// Typy propsów dla komponentu AuthProvider
interface AuthProviderProps {
  children: ReactNode;  // Dzieci, które będą miały dostęp do kontekstu
}

// Komponent AuthProvider zarządzający stanem uwierzytelnienia
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sprawdzanie lokalnego przechowywania przy montowaniu komponentu
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const expiration = localStorage.getItem("expiresAt");
    const storedUserId = localStorage.getItem("userId");
    if (token && expiration && new Date().getTime() < parseInt(expiration)) {
      setIsAuthenticated(true);
      setUserId(storedUserId);
    }
    setIsLoading(false); 
  }, []);

  // Funkcja logowania zapisująca dane w localStorage i aktualizująca stan
  const login = (token: string, refreshToken: string, userId: string, expiresAt: number) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userId", userId);
    localStorage.setItem("expiresAt", expiresAt.toString());
    setIsAuthenticated(true);
    setUserId(userId);
    setIsLoading(false);
  };

  // Funkcja wylogowania czyszcząca localStorage i stan
  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUserId(null);
    setIsLoading(false); 
  };

  // Dostarczanie kontekstu do dzieci komponentu
  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Customowy hook useAuth do łatwego dostępu do kontekstu AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
