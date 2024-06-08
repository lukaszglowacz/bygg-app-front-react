import React from "react";
import { Container, Alert, Row, Col, Card } from "react-bootstrap";
import useAllLiveSessions from "../hooks/useAllLiveSessions";
import { formatDate, formatTime } from "../utils/dateUtils";
import Loader from "./Loader";

const ActiveSessions: React.FC = () => {
  const [sessions, loading] = useAllLiveSessions();

  if (loading) {
    return <Loader />;
  }

  return (
    <Container className="mt-4">
      {sessions.length === 0 ? (
        <Row className="justify-content-center">
          <Col md={6}>
            <Alert className="text-center" variant="info">
              No active sessions
            </Alert>
          </Col>
        </Row>
      ) : (
        <Row className="justify-content-center">
          <Col md={6}>
            {sessions.map((session) => (
              <Card key={session.id} className="mb-4 shadow-sm">
                <Card.Body>
                  <Card.Title className="text-success mb-3 ">
                    {session.status === "Trwa" && (
                      <i className="bi bi-check-circle-fill me-2"></i>
                    )}
                    Currently working
                  </Card.Title>

                  <Card.Text className="mb-0 small">
                    <i className="bi bi-geo-alt-fill me-2"></i>
                    {`${session.workplace.street} ${session.workplace.street_number}, ${session.workplace.city}`}
                  </Card.Text>
                  <Card.Text className="mb-0 small">
                    <i className="bi bi-calendar-event-fill me-2"></i>
                    {formatDate(session.start_time)}
                  </Card.Text>
                  <Card.Text className="mb-0 small">
                    <i className="bi bi-clock-fill me-2"></i>
                    {formatTime(session.start_time)}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ActiveSessions;
