import { createContext, useContext, useState, ReactNode, FunctionComponent } from 'react';
import { Profile } from '../api/interfaces/types';
import api from '../api/api'; 

interface UserProfileContextType {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
  loadProfile: () => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

interface UserProfileProviderProps {
  children: ReactNode;
}

export const UserProfileProvider: FunctionComponent<UserProfileProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const loadProfile = async () => {
    try {
      const response = await api.get('/profile');
      const profileData = Array.isArray(response.data) ? response.data[0] : response.data;
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to load profile', error);
    }
  };

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
