import React, { createContext, useContext, useState, ReactNode, FunctionComponent, useEffect } from 'react';
import { Profile } from '../api/interfaces/types';
import api from '../api/api'; // załóżmy, że mamy tutaj funkcję do wywołania API

interface UserProfileContextType {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
  loadProfile: () => void; // dodajemy funkcję do ładowania profilu
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

interface UserProfileProviderProps {
  children: ReactNode;
}

export const UserProfileProvider: FunctionComponent<UserProfileProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  // Funkcja do ładowania profilu użytkownika
  const loadProfile = async () => {
    try {
      const response = await api.get('/profile'); // dostosuj endpoint do Twojej specyfikacji API
      // Sprawdź, czy odpowiedź jest tablicą i użyj pierwszego elementu
      const profileData = Array.isArray(response.data) ? response.data[0] : response.data;
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to load profile', error);
    }
  };
  

  // Ładujemy profil przy montowaniu komponentu
  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <UserProfileContext.Provider value={{ profile, setProfile, loadProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};
