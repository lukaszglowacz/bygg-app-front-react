import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import api from "../api/api";
import useGoBack from "../hooks/useGoBack";

interface Profile {
  id: number;
  full_name: string;
  personnummer: string;
}

interface Workplace {
  id: number;
  street: string;
  street_number: string;
  postal_code: string;
  city: string;
}

interface WorkSession {
  profile: number | null;
  workplace: number | null;
  start_time: string;
  end_time: string;
}

const AddWorkHour: React.FC = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
  const [newSession, setNewSession] = useState<WorkSession>({
    profile: null,
    workplace: null,
    start_time: "",
    end_time: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const goBack = useGoBack();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [profilesRes, workplacesRes] = await Promise.all([
          api.get<Profile[]>("/profile"),
          api.get<Workplace[]>("/workplace"),
        ]);
        setProfiles(profilesRes.data);
        setWorkplaces(workplacesRes.data);
      } catch (error) {
        setError("Nie udało się załadować danych.");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await api.post("/worksession/", newSession);
      console.log("Response from server:", response);
      console.log("Dodano miejsce pracy");
      navigate("/work-hours");
    } catch (err) {
      setError("Nie udało się dodać sesji pracy.");
      console.error("Error details:", err);
    }
  };

  const handleChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
  > = (event) => {
    const target = event.target as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;
    const name = target.name;
    const value = target.value;
    // Przekonwertuj wartość na number jeśli to id profilu lub miejsca pracy
    const updatedValue =
      name === "profile" || name === "workplace" ? parseInt(value, 10) : value;
    setNewSession((prev) => ({ ...prev, [name]: updatedValue }));
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container>
      <Card>
        <Card.Header as="h5">Dodaj Nową Sesję Pracy</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {profiles.length > 0 && (
              <Form.Group className="mb-3">
                <Form.Label>Profil</Form.Label>
                <Form.Control
                  as="select"
                  name="profile"
                  value={newSession.profile || ""}
                  onChange={handleChange}
                  required
                >
                  {profiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.full_name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            )}
            {workplaces.length > 0 && (
              <Form.Group className="mb-3">
                <Form.Label>Miejsce pracy</Form.Label>
                <Form.Control
                  as="select"
                  name="workplace"
                  value={newSession.workplace || ""}
                  onChange={handleChange}
                  required
                >
                  {workplaces.map((workplace) => (
                    <option key={workplace.id} value={workplace.id}>
                      {workplace.street} {workplace.street_number},{" "}
                      {workplace.postal_code} {workplace.city}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Czas rozpoczęcia</Form.Label>
              <Form.Control
                type="datetime-local"
                name="start_time"
                value={newSession.start_time}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Czas zakończenia</Form.Label>
              <Form.Control
                type="datetime-local"
                name="end_time"
                value={newSession.end_time}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Dodaj Sesję
            </Button>
            <Button variant="secondary" onClick={goBack}>
              Wróć
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddWorkHour;
