// Plik: components/ActiveSessions.tsx
import React from "react";
import { Container, Alert, Row, Col, Accordion } from "react-bootstrap";
import useAllLiveSessions from "../hooks/useAllLiveSessions"; // Założenie, że hook znajduje się w odpowiednim katalogu
import { useNavigate } from "react-router-dom";
import TimeElapsed from "./TimeElapsed";
import { Session } from "../api/interfaces/types";

const ActiveSessions: React.FC = () => {
  const sessions: Session[] = useAllLiveSessions();
  const navigate = useNavigate();

  if (sessions.length === 0) {
    return (
      <Container>
        <Alert className="text-center" variant="info">
          Nie pracujesz.
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <h1>Aktualnie pracują</h1>
      <Accordion defaultActiveKey="0">
        {sessions.map((session, index) => (
          <Accordion.Item eventKey={String(index)} key={session.id}>
            <Accordion.Header>
              <Container>
                <Row>
                  <Col xs={12} md={3}>
                    <span className="name-span">
                      <i
                        className="bi bi-person-fill"
                        style={{ marginRight: "8px" }}
                      ></i>
                      {session.profile.full_name}
                    </span>
                  </Col>
                  <Col xs={12} md={3}>
                    <span className="location-span">
                      <i
                        className="bi bi-geo-alt-fill"
                        style={{ marginRight: "8px" }}
                      ></i>
                      {`${session.workplace.street} ${session.workplace.street_number}, ${session.workplace.city}`}
                    </span>
                  </Col>
                  <Col xs={12} md={3}>
                    <span className="date-span">
                      <i
                        className="bi bi-calendar-event-fill"
                        style={{ marginRight: "8px" }}
                      ></i>
                      {session.start_time.split(" ")[0]}
                    </span>
                  </Col>
                  <Col xs={12} md={3}>
                    <span className="time-span">
                      <i
                        className="bi bi-clock-fill"
                        style={{ marginRight: "8px" }}
                      ></i>
                      {session.start_time.split(" ")[1]}
                    </span>
                  </Col>
                </Row>
              </Container>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <strong>Status:</strong> {session.status}
                {session.status === "Trwa" && (
                  <i
                    className="bi bi-check-circle-fill text-success"
                    style={{ marginLeft: "10px" }}
                  ></i>
                )}
              </p>
              <p>
                <strong>Uplynelo:</strong>{" "}
                <TimeElapsed startTime={session.start_time} />
              </p>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
};

export default ActiveSessions;
