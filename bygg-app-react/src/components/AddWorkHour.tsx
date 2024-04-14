import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Alert,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import useGoBack from "../hooks/useGoBack";

interface Workplace {
  id: number;
  street: string;
  street_number: string;
  postal_code: string;
  city: string;
}

interface WorkSession {
  workplaceId: number | null;
  start_time: string;
  end_time: string;
}

const AddWorkHour: React.FC = () => {
  const navigate = useNavigate();
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
  const { profileId, isAuthenticated } = useAuth();
  const [newSession, setNewSession] = useState<WorkSession>({
    workplaceId: null,
    start_time: "",
    end_time: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const goBack = useGoBack();

  useEffect(() => {
    const fetchWorkplaces = async () => {
      try {
        const response = await api.get("/workplace/");
        setWorkplaces(response.data);
      } catch (error) {
        setError("Nie udało się załadować danych.");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkplaces();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAuthenticated || !profileId || !newSession.workplaceId) {
      setError("Musisz być zalogowany i wybrać miejsce pracy.");
      return;
    }
    try {
      const response = await api.post("/worksession/", {
        workplace: newSession.workplaceId,
        profile: profileId,
        start_time: newSession.start_time,
        end_time: newSession.end_time,
      });
      navigate("/work-hours");
    } catch (error) {
      if (error instanceof Error) {
        setError("Nie udało się dodać sesji pracy. Błąd: " + error.message);
      } else {
        setError("Nie udało się dodać sesji pracy z nieznanego powodu.");
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLElement>) => {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const name = target.name;
    const value = target.value;
    const updatedValue =
      name === "profile" || name === "workplace" ? parseInt(value, 10) : value;

    setNewSession((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container>
      <Row>
        <Col className="text-center">
          <h1>Dodaj czas pracy</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} className="mb-3" controlId="workplaceSelect">
              <Col md={6} className="mx-auto">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="bi bi-geo-alt-fill"></i>
                    </span>
                  </div>
                  <Form.Control
                    as="select"
                    name="workplaceId"
                    value={newSession.workplaceId || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Wybierz miejsce pracy</option>
                    {workplaces.map((workplace) => (
                      <option key={workplace.id} value={workplace.id}>
                        {workplace.street} {workplace.street_number},{" "}
                        {workplace.postal_code} {workplace.city}
                      </option>
                    ))}
                  </Form.Control>
                </div>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="startDateTime">
              <Col md={6} className="mx-auto">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="bi bi-calendar-event"></i>
                    </span>
                  </div>
                  <Form.Control
                    type="datetime-local"
                    name="start_time"
                    value={newSession.start_time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="endDateTime">
              <Col md={6} className="mx-auto">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="bi bi-calendar2-check"></i>
                    </span>
                  </div>
                  <Form.Control
                    type="datetime-local"
                    name="end_time"
                    value={newSession.end_time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </Col>
            </Form.Group>

            <Row className="mb-3">
              <Col md={6} className="mx-auto">
                <Button
                  variant="success"
                  type="submit"
                  className="w-100 w-md-auto"
                >
                  Dodaj
                </Button>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6} className="mx-auto">
                <Button
                  variant="outline-secondary"
                  onClick={goBack}
                  className="w-100 w-md-auto"
                >
                  Cofnij
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddWorkHour;
