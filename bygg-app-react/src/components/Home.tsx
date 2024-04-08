import React, { useState, useEffect } from "react";
import { Button, Form, Alert, Container, Row, Col } from "react-bootstrap";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import useActiveSession from "../hooks/useActiveSession";
import ConfirmModal from "./ConfirmModal";

interface Workplace {
  id: number;
  street: string;
  street_number: string;
  postal_code: string;
  city: string;
}

interface Session {
  id: number;
  user: number;
  workplace: number;
  start_time: string;
  status: string;
}

const Home: React.FC = () => {
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
  const [selectedWorkplaceId, setSelectedWorkplaceId] = useState<number>(-1);
  const [session, setSession] = useState<Session | null>(null);
  const [alertInfo, setAlertInfo] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEndModal, setShowEndModal] = useState(false);

  const { userId } = useAuth(); // Pobranie userId z kontekstu
  const activeSession = useActiveSession();

  useEffect(() => {
    const fetchWorkplaces = async () => {
      try {
        const response = await api.get("/workplace/");
        setWorkplaces(response.data);
      } catch (error) {
        console.error("Error fetching workplaces", error);
        setAlertInfo("Nie mozna pobrac miejsc pracy. Zaloguj sie ponownie.");
      }
    };
    fetchWorkplaces();
  }, []);

  useEffect(() => {
    setSession(activeSession); // Aktualizacja stanu sesji po załadowaniu przez hook useActiveSession
  }, [activeSession]);

  const confirmStartSession = () => {
    handleStartSession();
    setShowModal(false);
  };

  const handleStartButtonClick = () => {
    if (selectedWorkplaceId === -1 || !userId) {
      setAlertInfo("Zaznacz miejsce pracy i upewnij sie czy jestes zalogowany");
      return;
    }
    setShowModal(true);
  };

  const handleStartSession = async () => {
    if (userId === null) {
      setAlertInfo("Musisz być zalogowany, aby rozpocząć sesję.");
      return;
    }
    try {
      const response = await api.post("/livesession/start/", {
        workplace: selectedWorkplaceId,
        user: userId,
      });
      setSession({
        id: response.data.id,
        user: parseInt(userId, 10),
        workplace: selectedWorkplaceId,
        start_time: response.data.start_time,
        status: "Trwa",
      });
      setAlertInfo("Praca rozpoczeta");
    } catch (error) {
      console.error("Error starting session", error);
      setAlertInfo("Nie udalo sie rozpoczac sesji. Zaloguj sie ponownie.");
    }
  };

  const handleEndButtonClick = () => {
    if (!session || session.status !== "Trwa") {
      setAlertInfo("Nie ma aktuwnej sesji do zakonczenia");
      return;
    }
    setShowEndModal(true);
  };

  const confirmEndSession = async () => {
    if (!session || !session.id) {
      setAlertInfo("Brak sesji do zakonczenia. Mozesz rozpoczac nowa sesje.");
      return;
    }
    try {
      const requestData = {
        user: session.user, // ID użytkownika z sesji
        workplace: session.workplace, // ID miejsca pracy z sesji
      };
      await api.put(`/livesession/end/${session.id}/`, requestData);
      setSession(null); // Resetowanie sesji po jej zakończeniu
      setAlertInfo("Gratulacje! To byl dobry dzien!");
      setShowEndModal(false); // Zamknij modal
    } catch (error) {
      console.error("Error ending session", error);
      setAlertInfo("Nie udalo sie zakonczyc sesji. Zaloguj sie ponownie.");
      setShowEndModal(false); // Zamknij modal
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={6}>
          {alertInfo && <Alert variant="info">{alertInfo}</Alert>}
          <Form.Group controlId="workplaceSelect">
            <Form.Label>Zaznacz miejsce pracy</Form.Label>
            <Form.Control
              as="select"
              value={selectedWorkplaceId.toString()}
              onChange={(e) => setSelectedWorkplaceId(parseInt(e.target.value))}
            >
              <option value="-1">Wybierz...</option>
              {workplaces.map((workplace) => (
                <option key={workplace.id} value={workplace.id}>
                  {`${workplace.street} ${workplace.street_number}, ${workplace.postal_code} ${workplace.city}`}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <div className="d-grid gap-2">
            <Button
              variant="primary"
              onClick={handleStartButtonClick}
              disabled={!!(session && session.status === "Trwa")}
            >
              Start pracy
            </Button>
            <Button
              variant="danger"
              onClick={handleEndButtonClick}
              disabled={!session || session.status !== "Trwa"}
            >
              Koniec pracy
            </Button>
          </div>
          <Alert variant="success" className="mt-3">
            Status{" "}
            {session
              ? `${session.status} since ${session.start_time}`
              : "Brak aktywnych sesji pracy"}
          </Alert>
          <ConfirmModal
            show={showModal}
            onHide={() => setShowModal(false)}
            onConfirm={confirmStartSession}
            title="Potwierdz poczatek sesji pracy"
            children={
              <>
                <p>Czy na pewno chcesz rozpoczac prace w miejscu:</p>
                <p>
                  <strong>
                    {
                      workplaces.find((w) => w.id === selectedWorkplaceId)
                        ?.street
                    }{" "}
                    {
                      workplaces.find((w) => w.id === selectedWorkplaceId)
                        ?.street_number
                    }
                    ,{" "}
                    {
                      workplaces.find((w) => w.id === selectedWorkplaceId)
                        ?.postal_code
                    }{" "}
                    {workplaces.find((w) => w.id === selectedWorkplaceId)?.city}
                    ?
                  </strong>
                </p>
              </>
            }
          />
          <ConfirmModal
            show={showEndModal}
            onHide={() => setShowEndModal(false)}
            onConfirm={confirmEndSession}
            title="Potwierdz zakończenie sesji pracy"
            children={
              <>
                <p>Czy na pewno chcesz zakonczyc prace w miejscu:</p>
                <p>
                  <strong>
                    {
                      workplaces.find((w) => w.id === selectedWorkplaceId)
                        ?.street
                    }{" "}
                    {
                      workplaces.find((w) => w.id === selectedWorkplaceId)
                        ?.street_number
                    }
                    ,{" "}
                    {
                      workplaces.find((w) => w.id === selectedWorkplaceId)
                        ?.postal_code
                    }{" "}
                    {workplaces.find((w) => w.id === selectedWorkplaceId)?.city}
                    ?
                  </strong>
                </p>
              </>
            }
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
