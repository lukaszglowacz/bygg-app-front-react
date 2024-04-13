import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Button,
  Accordion,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { FilterForm } from "./FilterForm";

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
        setWorkSessions(sessionResponse.data);
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
            <h1 className="my-4">Sesje pracy</h1>
            <Button
              variant="success"
              onClick={() => navigate("/add-work-hour")}
              className="mb-4"
            >
              Dodaj
            </Button>
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
    <Container className="fluid">
      <Row>
        <Col>
          <h1 className="my-4">Sesje pracy</h1>
          <Button
            variant="success"
            onClick={() => navigate("/add-work-hour")}
            className="mb-4"
          >
            Dodaj
          </Button>
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
                  <p>
                    <strong>Personnummer:</strong>{" "}
                    {session.profile.personnummer}
                  </p>
                  <p>
                    <strong>Miejsce pracy:</strong>
                    {`${session.workplace.street} ${session.workplace.street_number}, ${session.workplace.city}`}
                  </p>
                  <p>
                    <strong>Czas rozpoczęcia:</strong> {session.start_time}
                  </p>
                  <p>
                    <strong>Czas zakończenia:</strong> {session.end_time}
                  </p>
                  <p>
                    <strong>Łączny czas:</strong> {session.total_time}
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/edit-work-hour/${session.id}`)}
                  >
                    Edytuj sesję
                  </Button>
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
