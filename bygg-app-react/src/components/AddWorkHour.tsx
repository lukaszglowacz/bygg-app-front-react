import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Alert,
  Spinner,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import {
  GeoAltFill,
  CalendarEventFill,
  Calendar2CheckFill,
} from "react-bootstrap-icons";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import useGoBack from "../hooks/useGoBack";
import ToastNotification from "./ToastNotification";
import { Employee } from "../api/interfaces/types";

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
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get("date");
  const employeeId = queryParams.get("employeeId");
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
  const { isAuthenticated } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [newSession, setNewSession] = useState<WorkSession>({
    workplaceId: null,
    start_time: "",
    end_time: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const goBack = useGoBack();

  useEffect(() => {
    const fetchWorkplacesAndEmployee = async () => {
      try {
        const responseWorkplaces = await api.get("/workplace/");
        setWorkplaces(responseWorkplaces.data);
        if (employeeId) {
          const responseEmployee = await api.get<Employee>(`/employee/${employeeId}`);
          setEmployee(responseEmployee.data);
        }
      } catch (error) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkplacesAndEmployee();
  }, [employeeId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!isAuthenticated || !employeeId || !newSession.workplaceId) {
      setError("You must be logged in and select a workplace.");
      return;
    }

    if (!newSession.start_time || !newSession.end_time) {
      setError("All fields are required.");
      return;
    }

    if (new Date(newSession.end_time) < new Date(newSession.start_time)) {
      setError("End time cannot be earlier than start time.");
      return;
    }

    try {
      await api.post("/worksession/", {
        workplace: newSession.workplaceId,
        profile: employeeId, // Zaktualizowane, aby używać ID użytkownika przeglądanego widoku
        start_time: newSession.start_time,
        end_time: newSession.end_time,
      });
      setToastMessage("Work session added successfully.");
      setShowToast(true);
      setTimeout(() => {
        navigate(`/employee/${employeeId}/day/${date}`);
      }, 3000);
    } catch (error) {
      if (error instanceof Error) {
        setError("Failed to add a work session. Error: " + error.message);
      } else {
        setError("Failed to add a work session for an unknown reason.");
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLElement>) => {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const name = target.name;
    const value = target.value;
    const updatedValue = name === "workplaceId" ? parseInt(value, 10) : value;

    setNewSession((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <Container>
      <Row>
        <Col>
          {employee && (
            <Alert variant="info" className="text-center">
              Adding work session for: <strong>{employee.full_name}</strong>
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} className="mb-3" controlId="workplaceSelect">
              <Col md={6} className="mx-auto">
                <InputGroup>
                  <InputGroup.Text>
                    <GeoAltFill />
                  </InputGroup.Text>
                  <Form.Control
                    as="select"
                    name="workplaceId"
                    value={newSession.workplaceId || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose your workplace</option>
                    {workplaces.map((workplace) => (
                      <option key={workplace.id} value={workplace.id}>
                        {workplace.street} {workplace.street_number},{" "}
                        {workplace.postal_code} {workplace.city}
                      </option>
                    ))}
                  </Form.Control>
                </InputGroup>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="startDateTime">
              <Col md={6} className="mx-auto">
                <InputGroup>
                  <InputGroup.Text>
                    <CalendarEventFill />
                  </InputGroup.Text>
                  <Form.Control
                    type="datetime-local"
                    name="start_time"
                    value={newSession.start_time || `${date}T00:00`}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-5" controlId="endDateTime">
              <Col md={6} className="mx-auto">
                <InputGroup>
                  <InputGroup.Text>
                    <Calendar2CheckFill />
                  </InputGroup.Text>
                  <Form.Control
                    type="datetime-local"
                    name="end_time"
                    value={newSession.end_time || `${date}T00:00`}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </Col>
            </Form.Group>

            {error && (
              <Row className="mb-3">
                <Col md={6} className="mx-auto">
                  <Alert variant="danger" className="text-center">
                    {error}
                  </Alert>
                </Col>
              </Row>
            )}

            <Row className="mb-3">
              <Col md={6} className="mx-auto">
                <Button
                  variant="success"
                  size="sm"
                  type="submit"
                  className="w-100"
                >
                  Add
                </Button>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6} className="mx-auto">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={goBack}
                  className="w-100"
                >
                  Back
                </Button>
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

export default AddWorkHour;
