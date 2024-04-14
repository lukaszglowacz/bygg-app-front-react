import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Col,
  Row,
  Alert,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import api from "../api/api";
import { BiBuildings, BiTimeFive, BiCalendar } from "react-icons/bi";
import { AxiosError } from "axios";
import useGoBack from "../hooks/useGoBack";

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
}

const EditWorkHour: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workSession, setWorkSession] = useState<WorkSession | null>(null);
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const goBack = useGoBack();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionRes = await api.get<WorkSession>(`/worksession/${id}`);
        const workplacesRes = await api.get<Workplace[]>("/workplace");
        setWorkSession(sessionRes.data);
        setWorkplaces(workplacesRes.data);
      } catch (error) {
        setError("Nie udało się załadować danych.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (workSession) {
      try {
        const { id, profile, workplace, start_time, end_time } = workSession;
        const updatedSession = {
          id,
          profile: profile.id,
          workplace: workplace.id,
          start_time,
          end_time,
        };
        await api.put(`/worksession/${id}`, updatedSession);
        navigate("/work-hours");
      } catch (err) {
        const error = err as AxiosError; // Asercja typu
        setError(
          `Failed to update session. ${error.response?.data || error.message}`
        );
        console.error(error);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<any>) => {
    const { name, value } = event.target;
    setWorkSession((prev: any) => {
      if (!prev) return null;

      let updatedSession: any = { ...prev };

      switch (name) {
        case "workplace":
          updatedSession.workplace = {
            ...prev.workplace,
            id: parseInt(value, 10),
          };
          break;
        case "start_time":
        case "end_time":
          updatedSession[name] = value;
          break;
      }

      return updatedSession;
    });
  };

  const handleDeleteClick = async (sessionId: number) => {
    try {
      await api.delete(`/worksession/${sessionId}`);
      navigate("/work-hours"); // Redirects to the work hours page after deletion
    } catch (err) {
      const error = err as AxiosError;
      setError(
        `Failed to delete session. ${error.response?.data || error.message}`
      );
      console.error(error);
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container>
      <Row>
        <Col className="text-center">
          <h1>Edycja sesji pracy</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            <InputGroup className="mb-3">
              <InputGroup.Text>
                <BiBuildings />
              </InputGroup.Text>
              <Form.Select
                name="workplace"
                value={workSession?.workplace.id || ""}
                onChange={handleChange}
                required
              >
                {workplaces.map((workplace) => (
                  <option key={workplace.id} value={workplace.id}>
                    {`${workplace.street} ${workplace.street_number}, ${workplace.postal_code} ${workplace.city}`}
                  </option>
                ))}
              </Form.Select>
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text>
                <BiCalendar />
              </InputGroup.Text>
              <Form.Control
                type="datetime-local"
                name="start_time"
                value={workSession?.start_time || ""}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text>
                <BiTimeFive />
              </InputGroup.Text>
              <Form.Control
                type="datetime-local"
                name="end_time"
                value={workSession?.end_time || ""}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <Button variant="primary" type="submit">
              Zapisz zmiany
            </Button>
            <Button
              variant="danger"
              onClick={() => workSession && handleDeleteClick(workSession.id)}
            >
              Usuń
            </Button>
            <Button variant="secondary" onClick={goBack} className="ml-2">
              Powrot
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditWorkHour;
