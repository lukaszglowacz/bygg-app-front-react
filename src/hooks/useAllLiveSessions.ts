import { useState, useEffect } from 'react';
import api from '../api/api';
import { Session } from '../api/interfaces/types';

const useAllLiveSessions = (): [Session[], boolean] => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllLiveSessions = async () => {
      try {
        const response = await api.get<Session[]>('/livesession/active/');
        setSessions(response.data || []);
      } catch (error) {
        console.error('Unable to load live sessions:', error);
        setSessions([]); // Resetujemy sesje w przypadku błędu
      } finally {
        setLoading(false);
      }
    };

    fetchAllLiveSessions();
    const intervalId = setInterval(fetchAllLiveSessions, 10000); // Odświeżamy dane co 10 sekund

    return () => clearInterval(intervalId); // Czyszczenie interwału przy odmontowywaniu komponentu
  }, []);

  return [sessions, loading];
};

export default useAllLiveSessions;
