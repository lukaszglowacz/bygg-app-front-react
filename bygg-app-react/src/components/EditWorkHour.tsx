import React, { ChangeEvent, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Card,
  Alert,
  Spinner,
  FormControlProps,
} from "react-bootstrap";
import api from "../api/api";

interface Profile {
    id: number;
    full_name: string;
    personnummer: string; // Dodano zgodnie z JSON
  }
  
  interface Workplace {
    id: number;
    street: string;
    street_number: string; // Dodano zgodnie z JSON
    postal_code: string; // Dodano zgodnie z JSON
    city: string;
  }
  
  interface WorkSession {
    id: number;
    profile: Profile; // Zmieniono z profile_id na obiekt Profile
    workplace: Workplace; // Zmieniono z workplace_id na obiekt Workplace
    start_time: string;
    end_time: string;
    total_time: string; // Dodano zgodnie z JSON, oznaczony jako string
  }
  

const EditWorkHour: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workSession, setWorkSession] = useState<WorkSession | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionRes = await api.get<WorkSession>(`/worksession/${id}`);
        const profilesRes = await api.get<Profile[]>("/profile");
        const workplacesRes = await api.get<Workplace[]>("/workplace");
        setWorkSession(sessionRes.data);
        setProfiles(profilesRes.data);
        setWorkplaces(workplacesRes.data);
        setLoading(false);
      } catch (error) {
        setError("Nie udało się załadować danych.");
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (workSession) {
        try {
            const updatedSession = {
                profile: workSession.profile.id, // upewnij się, że jest to liczba (id profilu)
                workplace: workSession.workplace.id, // upewnij się, że jest to liczba (id miejsca pracy)
                start_time: workSession.start_time,
                end_time: workSession.end_time
            };
            await api.put(`/worksession/${id}`, updatedSession);
            navigate('/work-sessions');
        } catch (err) {
            setError('Failed to update session.');
            console.error(err);
        }
    }
};

  

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setWorkSession(prev => prev ? { ...prev, [name]: value } : null);
  };
  

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container>
      <Card>
        <Card.Header as="h5">Edycja Sesji Pracy #{id}</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Profil</Form.Label>
              <Form.Control
                as="select"
                name="profile_id"
                value={workSession?.profile.id}
                onChange={handleChange}
              >
                {profiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.full_name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Miejsce pracy</Form.Label>
              <Form.Control
                as="select"
                name="workplace_id"
                value={workSession?.workplace.id}
                onChange={handleChange}
              >
                {workplaces.map((workplace) => (
                  <option key={workplace.id} value={workplace.id}>
                    {workplace.street} {workplace.street_number}, {workplace.postal_code} {workplace.city}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Czas rozpoczęcia</Form.Label>
              <Form.Control type="datetime-local" name="start_time" value={workSession?.start_time} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Czas zakończenia</Form.Label>
              <Form.Control type="datetime-local" name="end_time" value={workSession?.end_time} onChange={handleChange} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Zapisz zmiany
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditWorkHour;
