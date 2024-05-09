import React, { useState, useEffect } from "react";
import { Button, Form, Alert, Container, Row, Col } from "react-bootstrap";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import ClockUpdate from "./ClockUpdate";
import WorkplaceSelector from "./WorkplaceSelector";
import { FaLess } from "react-icons/fa";

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
        const userActiveSession = sessionResponse.data.find(
          (session: Session) => session.profile.id === Number(profileId)
        );
        if (userActiveSession) {
          setActiveSession(userActiveSession);
          setIsActiveSession(true);
          setSelectedWorkplaceId(userActiveSession.workplace.id);
          setAlertInfo("Praca wre :) Kliknij Koniec jak skonczyles");
        } else {
          setActiveSession(null);
          setIsActiveSession(false);
          setSelectedWorkplaceId(0);
          setAlertInfo("Brak aktywnej sesji dla tego użytkownika");
        }
      } else {
        setActiveSession(null);
        setIsActiveSession(false);
        setSelectedWorkplaceId(0);
        setAlertInfo("Kliknij Start pracy aby zaczac prace");
      }
    };

    fetchWorkplacesAndSession();
  }, [profileId]);

  const handleStartSession = async () => {
    if (!profileId || selectedWorkplaceId <= 0 || activeSession) {
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

  const formatDate = (date: Date) => {
    const weekday = new Date(date).toLocaleDateString("sv-SE", {
      weekday: "long", // nazwa dnia tygodnia
    });
    const restOfDate = new Date(date).toLocaleDateString("sv-SE", {
      day: "numeric", // numer dnia
      month: "long", // nazwa miesiąca
      year: "numeric", // rok
    });
  
    return `${weekday}, ${restOfDate}`;
  };
  

  // Użycie:
  const today = new Date();
  const formattedDate = formatDate(today); // przykładowo, 'söndag, 7 maj 2024'

  return (
    <Container>
      <Row className="justify-content-md-center mt-3">
        <Col md={6}>
          <Row className="mb-0" >
            <Col className="text-secondary text-center mb-0">
              <h2 style={{ fontSize: "20px" }}>{formattedDate}</h2>
            </Col>
          </Row>

          <Row>
            <Col className="text-center mb-4 mt-0">
              <ClockUpdate />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col md={4}>
          <WorkplaceSelector
            workplaces={workplaces}
            selectedWorkplaceId={selectedWorkplaceId}
            onSelect={handleSelectWorkplace}
            isActiveSession={isActiveSession}
          />
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col className="d-grid gap-2 my-3" md={4}>
          {!activeSession && (
            <Button
              variant="secondary"
              onClick={handleStartSession}
              disabled={!!activeSession}
              className="btn-lg"
              style={{ padding: "15px 25px", fontSize: "1rem" }}
            >
              Start pracy
            </Button>
          )}
          {activeSession && (
            <Button
              variant="success"
              onClick={handleEndSession}
              disabled={!activeSession}
              className="btn-lg"
              style={{ padding: "15px 25px", fontSize: "1rem" }}
            >
              Koniec pracy
            </Button>
          )}
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col md={4} className="text-center">{alertInfo && <Alert variant="info">{alertInfo}</Alert>}</Col>
      </Row>
    </Container>
  );
};

export default Home;
