import React, { useState, useEffect } from "react";
import { Button, Form, Alert, Container, Row, Col } from "react-bootstrap";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import useActiveSession from "../hooks/useActiveSession";

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

interface Workplace {
  id: number;
  street: string;
  street_number: string;
  postal_code: string;
  city: string;
}

interface Session {
  id: number;
  profile: Profile;
  workplace: Workplace;
  start_time: string;
  status: string;
}

const Home: React.FC = () => {
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
  const [selectedWorkplaceId, setSelectedWorkplaceId] = useState<number>(-1);
  const [session, setSession] = useState<Session | null>(null);
  const [alertInfo, setAlertInfo] = useState<string>("");
  const [currentTime, setCurrentTime] = useState(new Date());

  const { profileId } = useAuth();

  useEffect(() => {
    const fetchWorkplaces = async () => {
      const response = await api.get("/workplace/");
      setWorkplaces(response.data);
    };
    fetchWorkplaces();

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStartSession = async () => {
    if (!profileId || selectedWorkplaceId === -1) {
      setAlertInfo("Zaznacz miejsce pracy i upewnij się, że jesteś zalogowany oraz że profil jest prawidłowo ustawiony.");
      return;
    }
    try {
      const response = await api.post("/livesession/start/", {
        workplace: selectedWorkplaceId,
        profile: profileId,
      });
      setSession(response.data);
      setAlertInfo("Praca rozpoczęta.");
    } catch (error) {
      console.error("Error starting session", error);
      setAlertInfo("Nie udało się rozpocząć sesji. Zaloguj się ponownie.");
    }
  };

  const handleEndSession = async () => {
    if (!session || session.status !== "Trwa") {
      setAlertInfo("Nie ma aktywnej sesji do zakończenia.");
      return;
    }
    try {
      const response = await api.post("/worksession/", {
        profile: session.profile.id,
        workplace: session.workplace.id,
        start_time: session.start_time,
        end_time: new Date().toISOString()  // Zakładając, że end_time jest bieżącym czasem
      });
      setSession(null);
      setAlertInfo("Sesja zakończona pomyślnie, rekord zapisany.");
    } catch (error) {
      console.error("Error ending session", error);
      setAlertInfo("Nie udało się zakończyć sesji. Zaloguj się ponownie.");
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h1 style={{ fontSize: "72px", fontWeight: "bold", textAlign: "center" }}>
            {currentTime.toLocaleTimeString()}
          </h1>
          <h2 style={{ fontSize: "24px", textAlign: "center", marginBottom: "20px" }}>
            {currentTime.toLocaleDateString('pl-PL')}
          </h2>
          <Form.Group controlId="workplaceSelect">
            <Form.Label>Wybierz miejsce pracy</Form.Label>
            <Form.Control as="select" value={selectedWorkplaceId.toString()}
              onChange={(e) => setSelectedWorkplaceId(parseInt(e.target.value))}>
              <option value="-1">Wybierz...</option>
              {workplaces.map((workplace) => (
                <option key={workplace.id} value={workplace.id}>
                  {`${workplace.street} ${workplace.street_number}, ${workplace.postal_code} ${workplace.city}`}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <div className="d-grid gap-2">
            <Button variant="primary" onClick={handleStartSession}
              disabled={!!(session && session.status === "Trwa")}>
              Start pracy
            </Button>
            <Button variant="danger" onClick={handleEndSession}
              disabled={!session || session.status !== "Trwa"}>
              Koniec pracy
            </Button>
          </div>
          {alertInfo && <Alert variant="info">{alertInfo}</Alert>}
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
