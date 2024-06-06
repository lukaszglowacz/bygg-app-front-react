import React, { useState, useEffect } from "react";
import { Button, Alert, Container, Row, Col } from "react-bootstrap";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import ClockUpdate from "./ClockUpdate";
import WorkplaceSelector from "./WorkplaceSelector";
import ConfirmModal from "./ConfirmModal";
import Loader from "./Loader"; // Import the Loader component

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
  const [isActiveSession, setIsActiveSession] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalAction, setModalAction] = useState<() => void>(() => {});
  const [loading, setLoading] = useState(true); // Add loading state

  const { profileId } = useAuth();

  const handleSelectWorkplace = (id: number) => {
    setSelectedWorkplaceId(id);
  };

  useEffect(() => {
    const fetchWorkplacesAndSession = async () => {
      try {
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
            setAlertInfo("The work is in progress :) Click End when you're done");
          } else {
            setActiveSession(null);
            setIsActiveSession(false);
            setSelectedWorkplaceId(0);
            setAlertInfo("No active session for this user");
          }
        } else {
          setActiveSession(null);
          setIsActiveSession(false);
          setSelectedWorkplaceId(0);
          setAlertInfo("Click Start to get started");
        }
      } catch (error) {
        setAlertInfo("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchWorkplacesAndSession();
  }, [profileId]);

  const handleStartSession = () => {
    if (!profileId || selectedWorkplaceId <= 0 || activeSession) {
      setAlertInfo("Cool, but where are you working today?");
      return;
    }
    setModalText("Are you sure you want to start work at the selected location?");
    setModalAction(() => startSession);
    setShowModal(true);
  };

  const startSession = async () => {
    setShowModal(false);
    try {
      const response = await api.post("/livesession/start/", {
        workplace: selectedWorkplaceId,
        profile: profileId,
      });
      setActiveSession(response.data);
      setIsActiveSession(true);
      setAlertInfo("Work has begun. Click End to finish.");
    } catch (error) {
      console.error("Error starting session", error);
      setAlertInfo("The session failed to start. Please try again.");
    }
  };

  const handleEndSession = () => {
    if (!activeSession || !activeSession.id) {
      setAlertInfo("You are not working now. Click Start to get started.");
      return;
    }
    setModalText("Are you sure you want to end your work?");
    setModalAction(() => endSession);
    setShowModal(true);
  };

  const endSession = async () => {
    if (!activeSession) return; // Additional check to ensure activeSession is not null
    setShowModal(false);
    try {
      await api.patch(`/livesession/end/${activeSession.id}/`);
      setActiveSession(null);
      setIsActiveSession(false);
      setSelectedWorkplaceId(0);
      setAlertInfo("Congratulations! It was a good day's work.");
    } catch (error) {
      console.error("Error ending session", error);
      setAlertInfo("The session could not be ended. Please try again.");
    }
  };

  const formatDate = (date: Date) => {
    const weekday = new Date(date).toLocaleDateString("en-EN", {
      weekday: "long",
    });
    const restOfDate = new Date(date).toLocaleDateString("en-EN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return `${weekday}, ${restOfDate}`;
  };

  const today = new Date();
  const formattedDate = formatDate(today);

  if (loading) {
    return <Loader />; // Show Loader while data is being fetched
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Row className="mb-0">
            <Col className="text-secondary text-center mb-0">
              <h2 style={{ fontSize: "18px" }}>{formattedDate}</h2>
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
              Start
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
              End
            </Button>
          )}
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col md={4} className="text-center">
          {alertInfo && <Alert variant="info">{alertInfo}</Alert>}
        </Col>
      </Row>

      <ConfirmModal show={showModal} onHide={() => setShowModal(false)} onConfirm={modalAction}>
        {modalText}
      </ConfirmModal>
    </Container>
  );
};

export default Home;
