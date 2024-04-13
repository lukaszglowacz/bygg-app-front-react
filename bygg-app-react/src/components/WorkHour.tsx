import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
  Button,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

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
      <h1 className="my-4">Sesje pracy</h1>
      <Button
        variant="success"
        onClick={() => navigate("/add-work-hour")}
        className="mb-4"
      >
        Dodaj
      </Button>
      <Form>
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Profil</Form.Label>
              <Form.Control
                as="select"
                value={filters.profile}
                onChange={(e) =>
                  setFilters({ ...filters, profile: e.target.value })
                }
              >
                <option value="">Wybierz profil</option>
                {profiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.full_name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Miejsce pracy</Form.Label>
              <Form.Control
                as="select"
                value={filters.workplace}
                onChange={(e) =>
                  setFilters({ ...filters, workplace: e.target.value })
                }
              >
                <option value="">Wybierz miejsce pracy</option>
                {workplaces.map((workplace) => (
                  <option key={workplace.id} value={workplace.id}>
                    {workplace.street}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Data rozpoczęcia (Od)</Form.Label>
              <Form.Control
                type="date"
                value={filters.start_min}
                onChange={(e) =>
                  setFilters({ ...filters, start_min: e.target.value })
                }
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Data rozpoczęcia (Do)</Form.Label>
              <Form.Control
                type="date"
                value={filters.start_max}
                onChange={(e) =>
                  setFilters({ ...filters, start_max: e.target.value })
                }
              />
            </Form.Group>
          </Col>
        </Row>
        <Button onClick={fetchWorkSessionsWithFilters} variant="primary">
          Filtruj
        </Button>
      </Form>

      <Row lg={1} className="g-4">
          <Col>
            <p className="text-center">Brak rekordow. Nikt nie pracowal.</p>
          </Col>
      </Row>
    </Container>
    );
  }

  return (
    <Container>
      <h1 className="my-4">Sesje pracy</h1>
      <Button
        variant="success"
        onClick={() => navigate("/add-work-hour")}
        className="mb-4"
      >
        Dodaj
      </Button>
      <Form>
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Profil</Form.Label>
              <Form.Control
                as="select"
                value={filters.profile}
                onChange={(e) =>
                  setFilters({ ...filters, profile: e.target.value })
                }
              >
                <option value="">Wybierz profil</option>
                {profiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.full_name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Miejsce pracy</Form.Label>
              <Form.Control
                as="select"
                value={filters.workplace}
                onChange={(e) =>
                  setFilters({ ...filters, workplace: e.target.value })
                }
              >
                <option value="">Wybierz miejsce pracy</option>
                {workplaces.map((workplace) => (
                  <option key={workplace.id} value={workplace.id}>
                    {workplace.street}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Data rozpoczęcia (Od)</Form.Label>
              <Form.Control
                type="date"
                value={filters.start_min}
                onChange={(e) =>
                  setFilters({ ...filters, start_min: e.target.value })
                }
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Data rozpoczęcia (Do)</Form.Label>
              <Form.Control
                type="date"
                value={filters.start_max}
                onChange={(e) =>
                  setFilters({ ...filters, start_max: e.target.value })
                }
              />
            </Form.Group>
          </Col>
        </Row>
        <Button onClick={fetchWorkSessionsWithFilters} variant="primary">
          Filtruj
        </Button>
      </Form>

      <Row xs={1} md={2} lg={3} className="g-4">
        {workSessions.map((session) => (
          <Col key={session.id}>
            <Card>
              <Card.Header as="h5">Sesja #{session.id}</Card.Header>
              <Card.Body>
                <Card.Title>{session.profile.full_name}</Card.Title>
                <Card.Text>
                  Personnummer: {session.profile.personnummer}
                </Card.Text>
                <Card.Text>
                  Miejsce pracy:{" "}
                  {`${session.workplace.street} ${session.workplace.street_number}, ${session.workplace.city}`}
                </Card.Text>
                <Card.Text>Czas rozpoczęcia: {session.start_time}</Card.Text>
                <Card.Text>Czas zakończenia: {session.end_time}</Card.Text>
                <Card.Text>Łączny czas: {session.total_time}</Card.Text>
                <Button
                  variant="primary"
                  onClick={() => navigate(`/edit-work-hour/${session.id}`)}
                >
                  Edytuj sesję
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default WorkHour;
