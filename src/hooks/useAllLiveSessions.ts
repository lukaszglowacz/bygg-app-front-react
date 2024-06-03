// Plik: hooks/useAllLiveSessions.ts
import { useState, useEffect } from 'react';
import api from '../api/api';
import { Session } from '../api/interfaces/types';

const useAllLiveSessions = (): Session[] => {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const fetchAllLiveSessions = async () => {
      try {
        const response = await api.get<Session[]>('/livesession/active/');
        setSessions(response.data || []);
      } catch (error) {
        console.error('Error fetching all live sessions:', error);
        setSessions([]); // Resetujemy sesje w przypadku błędu
      }
    };

    fetchAllLiveSessions();
    const intervalId = setInterval(fetchAllLiveSessions, 10000); // Odświeżamy dane co 10 sekund

    return () => clearInterval(intervalId); // Czyszczenie interwału przy odmontowywaniu komponentu
  }, []);

  return sessions;
};

export default useAllLiveSessions;
