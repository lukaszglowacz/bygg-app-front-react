// plik: AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  profileId: string | null; // Dodajemy profileId
  isLoading: boolean;
  login: (token: string, refreshToken: string, userId: string, profileId: string, expiresAt: number) => void;
  logout: () => void;
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
  const [profileId, setProfileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sprawdzanie lokalnego przechowywania przy montowaniu komponentu
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const expiration = localStorage.getItem("expiresAt");
    const storedUserId = localStorage.getItem("userId");
    const storedProfileId = localStorage.getItem("profileId");
    if (token && expiration && new Date().getTime() < parseInt(expiration)) {
      setIsAuthenticated(true);
      setUserId(storedUserId);
      setProfileId(storedProfileId); 
    }
    setIsLoading(false); 
  }, []);

  // Funkcja logowania zapisująca dane w localStorage i aktualizująca stan
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

  // Funkcja wylogowania czyszcząca localStorage i stan
  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUserId(null);
    setProfileId(null);
    setIsLoading(false); 
  };

  // Dostarczanie kontekstu do dzieci komponentu
  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, profileId, isLoading, login, logout }}>
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
