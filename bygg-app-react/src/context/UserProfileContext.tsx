// Plik: context/UserProfileContext.tsx
import React, { createContext, useContext, useState, ReactNode, FunctionComponent } from 'react';
import { Profile } from '../api/interfaces/types';


interface UserProfileContextType {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

interface UserProfileProviderProps {
  children: ReactNode;
}

export const UserProfileProvider: FunctionComponent<UserProfileProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const updateProfile = (newProfile: Profile) => {
    setProfile(newProfile);
  };

  return (
    <UserProfileContext.Provider value={{ profile, setProfile: updateProfile }}>
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
