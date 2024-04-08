// Plik: context/UserProfileContext.tsx
import React, { createContext, useContext, useState, ReactNode, FunctionComponent } from 'react';

interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  image: string;
}

interface UserProfileContextType {
  profile: Profile | null;
  updateProfile: (data: Profile) => void;
}

const UserProfileContext = createContext<UserProfileContextType | null>(null);

interface UserProfileProviderProps {
  children: ReactNode;
}

export const UserProfileProvider: FunctionComponent<UserProfileProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const updateProfile = (data: Profile) => {
    setProfile(data);
  };

  return (
    <UserProfileContext.Provider value={{ profile, updateProfile }}>
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
