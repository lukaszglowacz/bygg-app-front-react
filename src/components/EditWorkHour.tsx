import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Container, Form, Col, Row, Alert, InputGroup,
} from "react-bootstrap";
import {
  GeoAltFill, CalendarEventFill, Calendar2CheckFill, Save2,
} from "react-bootstrap-icons";
import api from "../api/api";
import { AxiosError } from "axios";
import ToastNotification from "./ToastNotification";
import Loader from "./Loader";
import LoadingButton from "./LoadingButton";

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
  workplace: string;
  start_time: string;
  end_time: string;
}

const formatDateTimeLocal = (date: string) => {
  const d = new Date(date);
  const pad = (num: number) => (num < 10 ? `0${num}` : num);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const EditWorkHour: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get("date");

  const navigate = useNavigate();
  const [workSession, setWorkSession] = useState<WorkSession | null>(null);
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionRes = await api.get<WorkSession>(`/worksession/${id}`);
        const workplacesRes = await api.get<Workplace[]>("/workplace");
        setWorkSession(sessionRes.data);
        setWorkplaces(workplacesRes.data);
      } catch (error) {
        setError("Error loading data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    setError(null);

    if (workSession) {
      if (new Date(workSession.end_time) < new Date(workSession.start_time)) {
        setError("End time must be after start time");
        return;
      }

      try {
        const { id, profile, workplace, start_time, end_time } = workSession;
        const updatedSession = {
          id,
          profile: profile.id,
          workplace: workplace,
          start_time: new Date(start_time).toISOString(),
          end_time: new Date(end_time).toISOString(),
        };
        console.log("Updated session data:", updatedSession); // Debugowanie danych
        const response = await api.put(`/worksession/${id}`, updatedSession);
        console.log('API response:', response); // Logowanie odpowiedzi API
        setToastMessage("Work session updated");
        setShowToast(true);
        setTimeout(() => {
          navigate(`/employee/${profile.id}/day/${date}`);
        }, 3000);
      } catch (err) {
        const error = err as AxiosError;
        console.error("Error updating session:", error.response?.data || error.message);
        const errorMessage = error.response?.data
          ? JSON.stringify(error.response.data, null, 2) // Lepsze formatowanie błędów
          : error.message;
        setError(`Error updating session: ${errorMessage}`);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<any>) => {
    const { name, value } = event.target;
    console.log(`Field changed: ${name}, Value: ${value}`); // Debugowanie wartości pól formularza
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

  if (loading) return <Loader />;

  return (
    <Container className="mt-4">
      {workSession && (
        <Row className="justify-content-center mt-3">
          <Col md={6}>
            <Alert variant="info" className="text-center">
              Editing work session for: <br />
              <strong>{workSession.profile.full_name}</strong>
            </Alert>
          </Col>
        </Row>
      )}
      <Row>
        <Col md={6} className="mx-auto">
          <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <InputGroup className="mb-3">
              <InputGroup.Text>
                <GeoAltFill />
              </InputGroup.Text>
              <Form.Select
                name="workplace"
                value={workSession?.workplace || ""}
                onChange={handleChange}
                required
              >
                <option value="">Choose your workplace</option>
                {workplaces.map((workplace) => (
                  <option key={workplace.id} value={workplace.id}>
                    {`${workplace.street} ${workplace.street_number}, ${workplace.postal_code} ${workplace.city}`}
                  </option>
                ))}
              </Form.Select>
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text>
                <CalendarEventFill />
              </InputGroup.Text>
              <Form.Control
                type="datetime-local"
                name="start_time"
                value={workSession ? formatDateTimeLocal(workSession.start_time) : ""}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <InputGroup className="mb-5">
              <InputGroup.Text>
                <Calendar2CheckFill />
              </InputGroup.Text>
              <Form.Control
                type="datetime-local"
                name="end_time"
                value={workSession ? formatDateTimeLocal(workSession.end_time) : ""}
                onChange={handleChange}
                required
              />
            </InputGroup>
            {error && (
              <Alert variant="danger" className="mt-3 text-center">
                {error}
              </Alert>
            )}

            <Row className="mb-3">
              <Col>
                <div className="d-flex justify-content-around mt-3">
                  <div className="text-center">
                    <LoadingButton
                      variant="success"
                      onClick={handleSubmit}
                      icon={Save2}
                      title="Save"
                      size={24}
                    />
                    <div>Save</div>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <ToastNotification
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        variant="dark"
      />
    </Container>
  );
};

export default EditWorkHour;
