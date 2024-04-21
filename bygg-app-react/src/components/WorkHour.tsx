import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Button, Accordion } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { FilterForm } from "./FilterForm";
import useGoBack from "../hooks/useGoBack";
import { convertUTCToLocalTime } from "../api/helper/ConvertTime";

interface Profile {
  id: number;
  full_name: string;
  personnummer: string;
}

interface Workplace {
  id: number;
  street: string;
  street_number: string;
  postal_code: string;
  city: string;
}

interface WorkSession {
  id: number;
  profile: Profile;
  workplace: Workplace;
  start_time: string;
  end_time: string;
  total_time: string;
}

const WorkHour: React.FC = () => {
  const navigate = useNavigate();
  const [workSessions, setWorkSessions] = useState<WorkSession[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    profile: "",
    workplace: "",
    start_min: "",
    start_max: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const goBack = useGoBack();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileResponse, workplaceResponse, sessionResponse] =
          await Promise.all([
            api.get<Profile[]>("/profile"),
            api.get<Workplace[]>("/workplace"),
            api.get<WorkSession[]>("/worksession/"),
          ]);
        setProfiles(profileResponse.data);
        setWorkplaces(workplaceResponse.data);
        const correctedSessions = sessionResponse.data.map(session => ({
          ...session,
          start_time: convertUTCToLocalTime(session.start_time),
          end_time: convertUTCToLocalTime(session.end_time)
        }));
        setWorkSessions(correctedSessions);
      } catch (error) {
        setError("Nie udało się załadować danych sesji pracy.");
      }
    };
    fetchData();
  }, []);

  const fetchWorkSessionsWithFilters = async () => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/worksession/?${queryParams}`);
      setWorkSessions(response.data);
    } catch (error) {
      setError("Nie udało się załadować danych sesji pracy z filtrami.");
    }
  };

  

  if (error) return <Alert variant="danger">Błąd: {error}</Alert>;

  if (!workSessions.length) {
    return (
      <Container>
        <Row>
          <Col>
            <h1 className="text-center">Sesje pracy</h1>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Button
              variant="outline-dark"
              onClick={() => navigate("/add-work-hour")}
              className="w-100 w-md-auto"
            >
              Dodaj sesje pracy
            </Button>
          </Col>
        </Row>

        <Row>
          <Col>
            <FilterForm
              profiles={profiles}
              workplaces={workplaces}
              filters={filters}
              setFilters={setFilters}
              fetchWorkSessionsWithFilters={fetchWorkSessionsWithFilters}
            />
          </Col>
        </Row>

        <Row lg={1} className="g-4">
          <Col>
            <p className="text-center">Brak rekordow. Nie pracowales wtedy.</p>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <Col>
          <h1 className="text-center">Sesje pracy</h1>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Button
            variant="outline-dark"
            onClick={() => navigate("/add-work-hour")}
            className="w-100 w-md-auto"
          >
            Dodaj sesje pracy
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <FilterForm
            profiles={profiles}
            workplaces={workplaces}
            filters={filters}
            setFilters={setFilters}
            fetchWorkSessionsWithFilters={fetchWorkSessionsWithFilters}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Accordion defaultActiveKey="0">
            {workSessions.map((session, index) => (
              <Accordion.Item eventKey={String(index)} key={session.id}>
                <Accordion.Header>
                  <Container>
                    <Row>
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
                        <span className="time-span text-muted">
                          <i
                            className="bi bi-clock-fill"
                            style={{ marginRight: "8px" }}
                          ></i>
                          {session.total_time}
                        </span>
                      </Col>
                    </Row>
                  </Container>
                </Accordion.Header>

                <Accordion.Body>
                  <Container>
                    <Row className="align-items-center">
                      <Col className="text-center">
                        <div>
                          <i
                            className="bi bi-clock-fill"
                            style={{ fontSize: "1.5rem" }}
                          ></i>
                          <div>{session.start_time.split(" ")[1]}</div>
                        </div>
                      </Col>
                      <Col className="text-center d-flex align-items-center justify-content-center">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() =>
                            navigate(`/edit-work-hour/${session.id}`)
                          }
                        >
                          Edytuj
                        </Button>
                      </Col>
                      <Col className="text-center">
                        <div>
                          <i
                            className="bi bi-clock-history"
                            style={{ fontSize: "1.5rem" }}
                          ></i>
                          <div>{session.end_time.split(" ")[1]}</div>
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
};

export default WorkHour;
