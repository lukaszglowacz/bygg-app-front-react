import { useState, useEffect } from "react";
import api from "../api/api";
import { IProfileData } from "../api/interfaces/types";

export const useProfileData = (): IProfileData[] => {
  const [profiles, setProfiles] = useState<IProfileData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<IProfileData[]>("/profile/");
        setProfiles(response.data.map(profile => ({
          ...profile,
          user_id: profile.user_id  // Upewnij się, że backend faktycznie zwraca to pole
        })));
      } catch (error) {
        console.error("Wystąpił błąd podczas pobierania danych o profilach użytkowników", error);
      }
    };
    fetchData();
  }, []);

  return profiles;
};

