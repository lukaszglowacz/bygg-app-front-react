import { useState, useEffect } from "react";
import api from "../api/api";
import { Profile } from "../api/interfaces/types";
import { useAuth } from "../context/AuthContext"; // Importujemy nasz hook do korzystania z kontekstu

export const useProfileData = (): Profile[] => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const { userId } = useAuth(); // Używamy naszego hooka useAuth do dostępu do danych kontekstu

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return; // Jeśli userId nie jest dostępne, nie wykonujemy zapytania

      try {
        // Zakładam, że endpoint '/profile/' może przyjąć userID jako parametr lub filtr
        const response = await api.get<Profile[]>(`/profile/?userId=${userId}`);
        setProfiles(response.data); // Zakładamy, że API zwraca bezpośrednio profil(y) użytkownika
      } catch (error) {
        console.error("An error occurred while retrieving user profile data", error);
      }
    };

    fetchData();
  }, [userId]); // Dodajemy userId jako zależność, aby re-fetchować dane przy zmianie userId

  return profiles;
};
