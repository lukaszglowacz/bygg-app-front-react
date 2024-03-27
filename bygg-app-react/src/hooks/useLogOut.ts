// hooks/useLogout.ts
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    // Czyszczenie localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // Możesz dodać tutaj więcej czynności związanych z wylogowaniem, np. czyszczenie stanu aplikacji

    // Przekierowanie do strony logowania
    navigate('/login');
  };

  return logout;
};

export default useLogout;
