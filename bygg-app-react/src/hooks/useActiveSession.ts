import { useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Session } from '../api/interfaces/types';

const useActiveSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const { userId } = useAuth(); // Pobranie ID zalogowanego użytkownika

  useEffect(() => {
    const fetchActiveSession = async () => {
      if (!userId) {
        setSession(null);
        return;
      }
      try {
        const response = await api.get('/livesession/active/');
        if (response.data.length > 0) {
          const activeSession = response.data.find((s: Session) => s.user === parseInt(userId));
          setSession(activeSession || null);
        } else {
          setSession(null);
        }
      } catch (error) {
        console.error('Error fetching active session:', error);
        setSession(null); // Możesz również ustawiać komunikaty błędów, jeśli to konieczne
      }
    };

    fetchActiveSession();

    const intervalId = setInterval(fetchActiveSession, 5000); // Odświeżanie sesji co 5 sekund

    return () => clearInterval(intervalId); // Czyszczenie interwału przy odmontowywaniu komponentu
  }, [userId]);

  return session;
};

export default useActiveSession;
