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

interface WorkSession {
  id: number;
  profile: number;
  workplace: number;
  start_time: string;
  end_time: string;
  total_time?: string;
}

interface Employee {
  id: number;
  full_name: string;
  user_email: string;
  personnummer: string;
  current_session_start_time: string | null;
  current_session_status: string;
  current_workplace: string;
  current_session_id: number | null;
  image: string;
  work_session: WorkSession[];
}

interface Workplace {
  id: number;
  street: string;
  street_number: string;
  postal_code: string;
  city: string;
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
  const employeeId = queryParams.get("employeeId");
  const date = queryParams.get("date");

  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workSession, setWorkSession] = useState<WorkSession | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showWorkplaceWarning, setShowWorkplaceWarning] = useState(false);

  useEffect(() => {
    console.log("Params: ", { id, employeeId, date });

    const fetchData = async () => {
      try {
        if (!id || !employeeId) {
          throw new Error("Missing id or employeeId");
        }

        console.log("Fetching data with id:", id, "and employeeId:", employeeId);
        const employeeRes = await api.get<Employee>(`/employee/${employeeId}`);
        const session = employeeRes.data.work_session.find(ws => ws.id === parseInt(id, 10));
        const workplacesRes = await api.get<Workplace[]>('/workplace');
        setEmployee(employeeRes.data);
        setWorkplaces(workplacesRes.data);

        if (session) {
          setWorkSession({
            ...session,
            workplace: session.workplace, // Use the workplace ID from the session directly
          });
        } else {
          setWorkSession(null);
        }
        console.log("Data fetched successfully:", { employee: employeeRes.data, session, workplaces: workplacesRes.data });
      } catch (error) {
        setError("Error loading data");
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id && employeeId) {
      fetchData();
    } else {
      setLoading(false);
      setError("Missing id or employeeId");
    }
  }, [id, employeeId]);

  const handleSubmit = async () => {
    setError(null);
    setShowWorkplaceWarning(false);

    if (workSession) {
      if (!workSession.workplace) {
        setShowWorkplaceWarning(true);
        return;
      }

      if (new Date(workSession.end_time) < new Date(workSession.start_time)) {
        setError("End time must be after start time");
        return;
      }

      try {
        const updatedSession = {
          ...workSession,
          profile: employee!.id,
          start_time: new Date(workSession.start_time).toISOString(),
          end_time: new Date(workSession.end_time).toISOString(),
        };
        console.log("Updated session data:", updatedSession);
        const response = await api.put(`/worksession/${id}`, updatedSession);
        console.log('API response:', response);
        setToastMessage("Work session updated");
        setShowToast(true);
        setTimeout(() => {
          navigate(`/employee/${employeeId}/day/${date}`);
        }, 3000);
      } catch (err) {
        const error = err as AxiosError;
        console.error("Error updating session:", error.response?.data || error.message);
        const errorMessage = error.response?.data
          ? JSON.stringify(error.response.data, null, 2)
          : error.message;
        setError(`Error updating session: ${errorMessage}`);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<any>) => {
    const { name, value } = event.target;
    console.log(`Field changed: ${name}, Value: ${value}`);
    setWorkSession((prev) => {
      if (!prev) return null;

      const updatedSession: any = { ...prev };

      switch (name) {
        case "workplace":
        case "profile":
          updatedSession[name] = parseInt(value, 10); // Ensure the value is treated as a number
          break;
        case "start_time":
        case "end_time":
          updatedSession[name] = value;
          break;
        default:
          updatedSession[name] = value;
      }

      return updatedSession;
    });
  };

  if (loading) return <Loader />;

  if (!employee || !workSession) {
    return (
      <Container className="mt-4">
        <Alert variant="danger" className="text-center">
          Error loading data. Please try again.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center mt-3">
        <Col md={6}>
          <Alert variant="info" className="text-center">
            Editing work session for: <br />
            <strong>{employee.full_name}</strong>
          </Alert>
        </Col>
      </Row>
      <Row>
        <Col md={6} className="mx-auto">
          <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <InputGroup className="mb-3">
              <InputGroup.Text>
                <GeoAltFill />
              </InputGroup.Text>
              <Form.Select
                name="workplace"
                value={String(workSession.workplace)}
                onChange={handleChange}
                required
              >
                <option value="">Choose your workplace</option>
                {workplaces.map((workplace) => (
                  <option 
                    key={workplace.id} 
                    value={String(workplace.id)} // Use workplace ID as value
                  >
                    {`${workplace.street} ${workplace.street_number}, ${workplace.postal_code} ${workplace.city}`}
                  </option>
                ))}
              </Form.Select>
            </InputGroup>
            {showWorkplaceWarning && (
              <Alert variant="warning" className="mt-3 text-center">
                Please select a workplace.
              </Alert>
            )}

            <InputGroup className="mb-3">
              <InputGroup.Text>
                <CalendarEventFill />
              </InputGroup.Text>
              <Form.Control
                type="datetime-local"
                name="start_time"
                value={formatDateTimeLocal(workSession.start_time)}
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
                value={formatDateTimeLocal(workSession.end_time)}
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
