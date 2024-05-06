import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { ProfileWorksession, Profile } from "../api/interfaces/types";
import useGoBack from "../hooks/useGoBack";
import { Container, Row, Col, Card, Alert, Button, ListGroup } from "react-bootstrap";
import { House, ClockHistory, ClockFill, HourglassSplit, PersonBadge, Envelope, PersonCircle } from "react-bootstrap-icons";
import { sumTotalTimeForProfile } from "../api/helper/timeUtils";

const WorkHourByDay: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const [sessions, setSessions] = useState<ProfileWorksession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const goBack = useGoBack();
  const [totalTime, setTotalTime] = useState<string>("0 h, 0 min");

  useEffect(() => {
    const fetchSessionsByDay = async () => {
      try {
        setLoading(true);
        const response = await api.get<ProfileWorksession[]>("/profile/worksessions");
        const daySessions = response.data.filter(
          (session) => new Date(session.start_time).toISOString().split("T")[0] === date
        );
        if (daySessions.length > 0) {
          setProfile(daySessions[0].profile); // Set profile data from the first session
        }
        setSessions(daySessions);
        setTotalTime(sumTotalTimeForProfile(daySessions));
        setLoading(false);
      } catch (error: any) {
        setError("Nie udało się pobrać sesji pracy dla tego dnia.");
        setLoading(false);
      }
    };

    fetchSessionsByDay();
  }, [date]);

  const formatTime = (dateTime: string) => {
    return dateTime.split(" ")[1].slice(0, 5); // Display only HH:MM
  };

  if (loading) return <Alert variant="info">Ładowanie danych...</Alert>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!sessions.length) return <Alert variant="warning">Brak sesji pracy dla tego dnia.</Alert>;

  return (
    <Container className="mt-4">
      <h2 className="mb-3 text-center">{date}</h2>
      {profile && (
        <Row className="justify-content-center mt-3">
          <Col md={6}>
            <Card className="mt-3 mb-3">
              <Card.Header as="h6" className="d-flex justify-content-between align-items-center">
                Zestawienie dzienne
              </Card.Header>
              <Card.Body>
                <Card.Text className="small text-muted"><PersonCircle className="me-2"/>{profile.full_name}</Card.Text>
                <Card.Text className="small text-muted"><PersonBadge className="me-2"/>{profile.personnummer}</Card.Text>
                <Card.Text className="small text-muted"><Envelope className="me-2"/>{profile.user_email}</Card.Text>
                <Card.Text className="small text-muted"><HourglassSplit className="me-2"/><strong>{totalTime}</strong></Card.Text>

              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      <ListGroup className="mb-4">
        {sessions.map((session) => (
          <Row className="justify-content-center" key={session.id}>
            <Col md={6}>
              <ListGroup.Item className="mb-2 small">
                <Row className="align-items-center">
                  <Col xs={12}>
                    <House className="me-2" /> {session.workplace.street} {session.workplace.street_number}
                  </Col>
                  <Col xs={12}>
                    <ClockFill className="me-2" /> {formatTime(session.start_time)}
                  </Col>
                  <Col xs={12}>
                    <ClockHistory className="me-2" /> {formatTime(session.end_time)}
                  </Col>
                  <Col xs={12}>
                    <HourglassSplit className="me-2" /> {session.total_time}
                  </Col>
                </Row>
              </ListGroup.Item>
            </Col>
          </Row>
        ))}
      </ListGroup>
      <Row>
        <Col md={{ span: 4, offset: 4 }} className="text-center">
          <Button onClick={goBack} variant="outline-secondary">Cofnij</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default WorkHourByDay;
