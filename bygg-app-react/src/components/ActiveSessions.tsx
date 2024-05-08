// Plik: components/ActiveSessions.tsx
import React from "react";
import { Container, Alert, Row, Col, Accordion } from "react-bootstrap";
import useAllLiveSessions from "../hooks/useAllLiveSessions"; // Założenie, że hook znajduje się w odpowiednim katalogu
import { useNavigate } from "react-router-dom";
import TimeElapsed from "./TimeElapsed";
import { Session } from "../api/interfaces/types";
import {
  HourglassSplit,
  InfoCircleFill,
  PlayFill,
  StopFill,
} from "react-bootstrap-icons";

const ActiveSessions: React.FC = () => {
  const sessions: Session[] = useAllLiveSessions();
  const navigate = useNavigate();

  if (sessions.length === 0) {
    return (
      <Container>
        <Row className="justify-content-center my-3">
          <Col md={6}>
            <Alert className="text-center" variant="warning">
              Aktualnie nie pracujesz
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-center my-3">
        <Col md={6}>
          <Accordion defaultActiveKey="0">
            {sessions.map((session, index) => (
              <Accordion.Item eventKey={String(index)} key={session.id}>
                <Accordion.Header>
                  <Container>
                    <Row>
                      <Col md={12}>
                        <span className="name-span">
                          <i
                            className="bi bi-person-fill"
                            style={{ marginRight: "8px" }}
                          ></i>
                          {session.profile.full_name}
                        </span>
                      </Col>
                      <Col md={12}>
                        <span className="location-span">
                          <i
                            className="bi bi-geo-alt-fill"
                            style={{ marginRight: "8px" }}
                          ></i>
                          {`${session.workplace.street} ${session.workplace.street_number}, ${session.workplace.city}`}
                        </span>
                      </Col>
                      <Col md={12}>
                        <span className="date-span">
                          <i
                            className="bi bi-calendar-event-fill"
                            style={{ marginRight: "8px" }}
                          ></i>
                          {session.start_time.split(" ")[0]}
                        </span>
                      </Col>
                      <Col md={6}>
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
                  <div>
                    <InfoCircleFill
                      className="me-2"
                      style={{ color: "blue" }}
                    />

                    <strong>Aktualnie pracuje: </strong>
                    {session.status === "Trwa" && (
                      <i className="bi bi-check-circle-fill text-success"></i>
                    )}
                  </div>
                  <div>
                    <HourglassSplit className="me-2" />
                    <strong>Uplynelo:</strong>{" "}
                    <TimeElapsed startTime={session.start_time} />
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
};

export default ActiveSessions;
