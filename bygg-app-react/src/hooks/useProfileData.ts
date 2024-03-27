import { useState, useEffect } from "react";
import api from "../api/api";
import { IProfileData } from "../api/interfaces/types";

export const useProfileData = (): IProfileData[] => {
  const [profiles, setProfiles] = useState<IProfileData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<IProfileData[]>("profile/");
        setProfiles(response.data);
      } catch (error) {
        console.error(
          "Wystapil blad podczas pobierania danych o profilach uzytkownikow",
          error
        );
      }
    };
    fetchData();
  }, []);

  return profiles
};
