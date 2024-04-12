import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import api from '../api/api'; // Import konfiguracji API

interface WorkSession {
  id: number;
  profile: Profile;
  workplace: {
    id: number;
    street: string;
    street_number: string;
    postal_code: string;
    city: string;
  };
  start_time: string;
  end_time: string;
  total_time: string;
}

interface Profile {
    id: number;
    user_email: string;
    user_id: number;
    full_name: string;
    first_name: string;
    last_name: string;
    personnummer: string;
    created_at: string;
    updated_at: string;
    image: string;
  }
  

const EditWorkHour: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<WorkSession | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const fetchSession = async () => {
    try {
      const sessionResponse = await api.get<WorkSession>(`/worksession/${id}`);
      setSession(sessionResponse.data);
      const profileResponse = await api.get<Profile[]>('/profile'); // Używam odpowiedniego endpointu
      setProfiles(profileResponse.data);
    } catch (error) {
      setError('Failed to fetch data.');
    }
  };

  useEffect(() => {
    fetchSession();
  }, [id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (session) {
      try {
        await api.put(`/worksession/${id}`, session);
        navigate('/work-hours'); // Navigate back to the list of work sessions
      } catch (error) {
        setError('Failed to save changes.');
      }
    }
  };

  if (!session) return <div>Loading...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  const handleProfileChange = (profileId: string) => {
    const newProfile = profiles.find(profile => profile.id.toString() === profileId);
    if (newProfile && session) {
      setSession({ ...session, profile: newProfile });
    }
  };

  return (
    <Container>
      <h1>Edit Work Session</h1>
      <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
          <Form.Label>Employee Full Name</Form.Label>
          <Form.Control
            as="select"
            value={session.profile.id.toString()}
            onChange={(e) => handleProfileChange(e.target.value)}
          >
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>{profile.full_name}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Workplace Address</Form.Label>
          <Form.Control
            type="text"
            value={`${session.workplace.street} ${session.workplace.street_number}, ${session.workplace.city} ${session.workplace.postal_code}`}
            readOnly
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Start Time</Form.Label>
          <Form.Control
            type="datetime-local"
            value={new Date(session.start_time).toISOString().substring(0, 16)}
            onChange={(e) => setSession({...session, start_time: e.target.value})}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>End Time</Form.Label>
          <Form.Control
            type="datetime-local"
            value={new Date(session.end_time).toISOString().substring(0, 16)}
            onChange={(e) => setSession({...session, end_time: e.target.value})}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Total Time Worked</Form.Label>
          <Form.Control type="text" value={session.total_time} readOnly />
        </Form.Group>
        <Button variant="primary" type="submit">Save Changes</Button>
      </Form>
    </Container>
  );
};

export default EditWorkHour;
