import React, { useState, useEffect } from "react";
import { Button, Form, Alert, Container, Row, Col } from "react-bootstrap";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import ClockUpdate from "./ClockUpdate";
import WorkplaceSelector from "./WorkplaceSelector";

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
  const [selectedWorkplaceId, setSelectedWorkplaceId] = useState<string>("");
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [alertInfo, setAlertInfo] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const { profileId } = useAuth();

  // Funkcja do aktualizacji wybranego miejsca pracy
  const handleSelectWorkplace = (id: string) => {
    setSelectedWorkplaceId(id); // Aktualizujemy stan z wybranym ID
  };

  useEffect(() => {
    const fetchWorkplaces = async () => {
      const response = await api.get("/workplace/");
      setWorkplaces(response.data);
    };
    fetchWorkplaces();

    const fetchActiveSession = async () => {
      try {
        const response = await api.get("/livesession/active/");
        if (response.data.length > 0) {
          setActiveSession(response.data[0]);
          setAlertInfo("Praca wre :) Kliknij Koniec jak skonczyles"); // Ustawienie pierwszego elementu tablicy jako aktywną sesję
        } else {
          setActiveSession(null); // Jeśli tablica jest pusta, nie ma aktywnej sesji
          setAlertInfo("Kliknij Start aby zaczac prace");
        }
      } catch (error) {
        console.error("Error fetching active session:", error);
        setActiveSession(null);
      }
      setIsLoading(false);
    };

    fetchActiveSession();
  }, []);

  const handleStartSession = async () => {
    if (!profileId || selectedWorkplaceId === "" || activeSession) {
      setAlertInfo("Fajnie, ale gdzie dzisiaj pracujesz?");
      return;
    }
    try {
      const response = await api.post("/livesession/start/", {
        workplace: selectedWorkplaceId,
        profile: profileId,
      });
      setActiveSession(response.data);
      setAlertInfo("Praca rozpoczęta.");
    } catch (error) {
      console.error("Error starting session", error);
      setAlertInfo("Nie udało się rozpocząć sesji. Sprobuj ponownie.");
    }
  };

  const handleEndSession = async () => {
    if (!activeSession || !activeSession.id) {
      // Upewnienie się, że 'id' istnieje
      setAlertInfo("Teraz nie pracujesz. Kliknij Start aby zaczac.");
      return;
    }
    try {
      await api.patch(`/livesession/end/${activeSession.id}/`);
      setActiveSession(null); // Resetowanie stanu aktywnej sesji
      setAlertInfo("Gratulacje! To byl dobry dzien pracy.");
    } catch (error) {
      console.error("Error ending session", error);
      setAlertInfo("Nie udało się zakończyć sesji. Sprobuj ponownie.");
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <ClockUpdate />
          <h2
            style={{
              fontSize: "24px",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            {new Date().toLocaleDateString("pl-PL")}
          </h2>
          <WorkplaceSelector
            workplaces={workplaces}
            onSelect={handleSelectWorkplace}
          />
          <div className="d-grid gap-2 my-3">
            <Button
              variant="primary"
              onClick={handleStartSession}
              disabled={!!activeSession}
            >
              Start pracy
            </Button>
            <Button
              variant="danger"
              onClick={handleEndSession}
              disabled={!activeSession}
            >
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
