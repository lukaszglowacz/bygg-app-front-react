import React, {useEffect, useState} from "react";
import api from "../api/api";
import { IProfileData } from "../api/interfaces/types";

//Interfejs dla danych, ktorych spodziewam sie otrzymac z API
const ProfileComponent: React.FC = () => {
    const [profiles, setProfiles] = useState<IProfileData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get<IProfileData[]>('profile/');
                setProfiles(response.data);
            } catch (error) {
                console.error('Wystapil blad podczas pobierania danych o profilach uzytkownikow', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
          {/* Renderowanie profili */}
          {profiles.map(profile => (
            <div key={profile.id}>
              <img src={profile.image} alt={`${profile.first_name} ${profile.last_name}`} />
              <p>Email: {profile.user_email}</p>
              <p>Imię: {profile.first_name}</p>
              <p>Nazwisko: {profile.last_name}</p>
              <p>Personnummer: {profile.personnummer}</p>
              <p>Utworzono: {profile.created_at}</p>
              <p>Zaktualizowano: {profile.updated_at}</p>
            </div>
          ))}
        </div>
      );
};

export default ProfileComponent