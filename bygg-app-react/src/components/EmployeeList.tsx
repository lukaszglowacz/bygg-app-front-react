import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import api from '../api/api'; // Zaimportuj konfigurację Axios
import { Profile } from '../api/interfaces/types'; // Załóżmy, że interfejs profilu jest już zdefiniowany

const EmployeeList: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await api.get<Profile[]>('/profile');
        setProfiles(response.data); // Zakładamy, że odpowiedź API to bezpośrednio lista profili
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching profiles:", err);
        setError('Failed to fetch profiles');
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Employee List
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {profiles.map(profile => (
          <Dropdown.Item key={profile.id} href={`/profile/${profile.id}`}>
            {profile.first_name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default EmployeeList;
