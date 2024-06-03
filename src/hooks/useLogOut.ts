// Plik: hooks/useLogout.ts
import { useAuth } from '../context/AuthContext';  // Załóżmy, że ścieżka do AuthContext jest prawidłowa

const useLogout = () => {
  const { logout } = useAuth();  // Używamy hooka useAuth, aby pobrać funkcję logout

  return logout;  // Zwracamy funkcję logout, aby można było jej użyć w komponentach
};

export default useLogout;
