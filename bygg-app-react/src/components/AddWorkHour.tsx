import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

interface Workplace {
  id: number;
  street: string;
  street_number: string;
  postal_code: string;
  city: string;
}

interface WorkSession {
  workplaceId: number | null;  // Używamy typu number lub null dla ID miejsca pracy
  start_time: string;
  end_time: string;
}

const AddWorkHour: React.FC = () => {
  const navigate = useNavigate();
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
  const { profileId, isAuthenticated } = useAuth();
  const [newSession, setNewSession] = useState<WorkSession>({
    workplaceId: null,
    start_time: "",
    end_time: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWorkplaces = async () => {
      try {
        const response = await api.get("/workplace/");
        setWorkplaces(response.data);
      } catch (error) {
        setError("Nie udało się załadować danych.");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkplaces();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAuthenticated || !profileId || !newSession.workplaceId) {
        setError("Musisz być zalogowany i wybrać miejsce pracy.");
        return;
    }
    try {
        const response = await api.post("/worksession/", {
            workplace: newSession.workplaceId,
            profile: profileId,  // Dodajemy profileId zalogowanego użytkownika
            start_time: newSession.start_time,
            end_time: newSession.end_time
        });
        navigate("/work-hours");
    } catch (error: any) {
        console.error("Error starting session", error.response || error);
        setError(`Nie udało się dodać sesji pracy. Błąd: ${error.response ? error.response.data.message : error.message}`);
    }
};


  const handleChange = (event: React.ChangeEvent<HTMLElement>) => {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const name = target.name;
    const value = target.value;
    const updatedValue = name === "profile" || name === "workplace" ? parseInt(value, 10) : value;
  
    setNewSession((prev) => ({
      ...prev,
      [name]: updatedValue
    }));
  };
  
  

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container>
      <Card>
        <Card.Header as="h5">Dodaj Nową Sesję Pracy</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Miejsce pracy</Form.Label>
              <Form.Control
                as="select"
                name="workplaceId"
                value={newSession.workplaceId || ""}
                onChange={handleChange}
                required
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
            <Button variant="primary" type="submit">Dodaj Sesję</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddWorkHour;
