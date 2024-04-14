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
  const [selectedWorkplaceId, setSelectedWorkplaceId] = useState<number>(0);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [alertInfo, setAlertInfo] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isActiveSession, setIsActiveSession] = useState(false);

  const { profileId } = useAuth();

  // Funkcja do aktualizacji wybranego miejsca pracy
  const handleSelectWorkplace = (id: number) => {
    setSelectedWorkplaceId(id);
  };

  useEffect(() => {
    const fetchWorkplacesAndSession = async () => {
      const workplacesResponse = await api.get("/workplace/");
      setWorkplaces(workplacesResponse.data);

      const sessionResponse = await api.get("/livesession/active/");
      if (sessionResponse.data.length > 0) {
        const userActiveSession = sessionResponse.data.find((session: Session) => session.profile.id === Number(profileId));
        if (userActiveSession) {
          setActiveSession(userActiveSession);
          setIsActiveSession(true);
          setSelectedWorkplaceId(userActiveSession.workplace.id);
          setAlertInfo("Praca wre :) Kliknij Koniec jak skonczyles");
        } else {
          setActiveSession(null);
          setIsActiveSession(false);
          setSelectedWorkplaceId(0);
          setAlertInfo("Brak aktywnej sesji dla tego użytkownika.");
        }
      } else {
        setActiveSession(null);
        setIsActiveSession(false);
        setSelectedWorkplaceId(0);
        setAlertInfo("Kliknij Start aby zaczac prace");
      }
    };

    fetchWorkplacesAndSession();
  }, [profileId]);

  const handleStartSession = async () => {
    if (!profileId || selectedWorkplaceId <= 0  || activeSession) {
      setAlertInfo("Fajnie, ale gdzie dzisiaj pracujesz?");
      return;
    }
    try {
      const response = await api.post("/livesession/start/", {
        workplace: selectedWorkplaceId,
        profile: profileId,
      });
      setActiveSession(response.data);
      setIsActiveSession(true);
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
      setIsActiveSession(false);
      setSelectedWorkplaceId(0);
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
            selectedWorkplaceId={selectedWorkplaceId}
            onSelect={handleSelectWorkplace}
            isActiveSession={isActiveSession}
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
