import React from "react";
import { Container, Alert, Row, Col, Accordion } from "react-bootstrap";
import useAllLiveSessions from "../hooks/useAllLiveSessions";
import { useNavigate } from "react-router-dom";
import { Session } from "../api/interfaces/types";
import { HourglassSplit, InfoCircleFill } from "react-bootstrap-icons";
import BackButton from "./NavigateButton";

const ActiveSessions: React.FC = () => {
  const sessions: Session[] = useAllLiveSessions();
  const navigate = useNavigate();

  if (sessions.length === 0) {
    return (
      <Container>
        <BackButton backPath="/" />
        <Row className="justify-content-center my-3">
          <Col md={6}>
            <Alert className="text-center" variant="warning">
              You are not currently working.
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton backPath="/" />
      <Row className="justify-content-center my-3">
        <Col md={6}>
          <Accordion>
            {sessions.map((session, index) => (
              <Accordion.Item eventKey={String(index)} key={session.id}>
                <Accordion.Header>
                  <Container style={{ fontSize: "0.9rem" }}>
                    <Row>
                      <Col md={12}>
                        <span className="time-span">
                          {session.status === "Trwa" && (
                            <i
                              className="bi bi-check-circle-fill text-success"
                              style={{ marginRight: "8px" }}
                            ></i>
                          )}
                          Working now
                        </span>
                      </Col>
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
                      <Col md={12}>
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
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
};

export default ActiveSessions;
