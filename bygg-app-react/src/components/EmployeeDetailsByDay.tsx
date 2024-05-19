import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import { WorkSession, Employee } from "../api/interfaces/types";
import {
  Container,
  Row,
  Col,
  Alert,
  ListGroup,
  Button,
  Card,
} from "react-bootstrap";
import {
  House,
  ClockHistory,
  ClockFill,
  HourglassSplit,
  PersonBadge,
  Envelope,
  PersonCircle,
  ChevronLeft,
  ChevronRight,
} from "react-bootstrap-icons";
import useGoBack from "../hooks/useGoBack";
import { FaDownload } from "react-icons/fa";
import { sumTotalTime } from "../api/helper/timeUtils";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import BackButton from "./NavigateButton";

const EmployeeDetailsByDay: React.FC = () => {
  const { id, date } = useParams<{ id: string; date?: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [sessions, setSessions] = useState<WorkSession[]>([]);
  const [totalTime, setTotalTime] = useState<string>("0 h, 0 min");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const goBack = useGoBack();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployeeAndSessions = async () => {
      try {
        setLoading(true);
        const response = await api.get<Employee>(`/employee/${id}`);
        setEmployee(response.data);
        const daySessions = response.data.work_session.filter(
          (session) =>
            new Date(session.start_time).toISOString().split("T")[0] === date
        );
        setSessions(daySessions);
        setTotalTime(sumTotalTime(daySessions)); // Calculate the total time of the filtered sessions
        setLoading(false);
      } catch (err) {
        setError("Failed to retrieve work session data.");
        setLoading(false);
      }
    };

    fetchEmployeeAndSessions();
  }, [id, date]);

  const formatTime = (dateTime: string) => {
    return dateTime.split(" ")[1].slice(0, 5); // Only displaying HH:MM
  };

  const changeDay = (offset: number): void => {
    if (!date) {
      console.error("Date is undefined");
      return;
    }
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + offset);
    const newDate = currentDate.toISOString().split("T")[0];
    navigate(`/employee/${id}/day/${newDate}`);
  };

  const handleEditSession = (sessionId: number) => {
    navigate(`/edit-work-hour/${sessionId}?date=${date}`); // Zakładając, że 'date' jest dostępne w tym zakresie
  };

  const handleDeleteSession = async (sessionId: number) => {
    try {
      await api.delete(`/worksession/${sessionId}`);
      const updatedSessions = sessions.filter(
        (session) => session.id !== sessionId
      );
      setSessions(updatedSessions);
      setTotalTime(sumTotalTime(updatedSessions));
    } catch (error) {
      console.error("Failed to delete the session", error);
      setError("Failed to delete the session.");
    }
  };

  return (
    <Container className="mt-4">
      <BackButton backPath={`/employees/${id}`} />
      <Row className="justify-content-center mt-3">
        <Col md={6}>
          <Card className="mt-3 mb-3">
            <Card.Header
              as="h6"
              className="d-flex justify-content-between align-items-center"
            >
              Daily summary <FaDownload style={{ color: "grey" }} />
            </Card.Header>
            <Card.Body>
              <Card.Text className="small text-muted">
                <PersonCircle className="me-2" />
                {employee?.full_name}
              </Card.Text>
              <Card.Text className="small text-muted">
                <PersonBadge className="me-2" />
                {employee?.personnummer}
              </Card.Text>
              <Card.Text className="small text-muted">
                <Envelope className="me-2" />
                {employee?.user_email}
              </Card.Text>
              <Card.Text className="small text-muted">
                <HourglassSplit className="me-2" />
                <strong>{totalTime}</strong>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="justify-content-center my-3">
        <Col md={6}>
          <Row className="justify-content-between">
            <Col className="text-start">
              <Button onClick={() => changeDay(-1)} variant="success">
                <ChevronLeft />
              </Button>
            </Col>

            <Col className="text-center">
              {date ? (
                <>
                  <div
                    className="font-weight-bold"
                    style={{ fontSize: "15px" }}
                  >
                    {new Date(date).toLocaleDateString("en-EN", {
                      day: "numeric", // numer dnia
                      month: "long", // nazwa miesiąca
                      year: "numeric", // rok
                    })}
                  </div>
                  <small className="text-muted">
                    {new Date(date).toLocaleDateString("en-EN", {
                      weekday: "long", // nazwa dnia tygodnia
                    })}
                  </small>
                </>
              ) : (
                <span>Date not available</span>
              )}
            </Col>

            <Col className="text-end">
              <Button onClick={() => changeDay(1)} variant="success">
                <ChevronRight />
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="justify-content-center my-3">
        <Col md={6} className="d-flex justify-content-end">
          <Button
            onClick={() =>
              navigate(`/add-work-hour?date=${date}&employeeId=${id}`)
            }
            variant="outline-secondary"
            size="sm"
          >
            Add
          </Button>
        </Col>
      </Row>

      {loading ? (
        <Row className="justify-content-center my-3">
          <Col md={6} className="text-center">
            <Alert variant="info">Loading data...</Alert>
          </Col>
        </Row>
      ) : error ? (
        <Row className="justify-content-center my-3">
          <Col md={6} className="text-center">
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      ) : (
        <ListGroup className="mb-4">
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <Row className="justify-content-center">
                <Col md={6}>
                  <ListGroup.Item key={session.id} className="mb-2 small">
                    <Row className="align-items-center">
                      <Col xs={12}>
                        <House className="me-2" /> {session.workplace}
                      </Col>
                      <Col xs={12}>
                        <ClockFill className="me-2" />{" "}
                        {formatTime(session.start_time)}
                      </Col>
                      <Col xs={12}>
                        <ClockHistory className="me-2" />{" "}
                        {formatTime(session.end_time)}
                      </Col>
                      <Col xs={12}>
                        <HourglassSplit className="me-2" /> {session.total_time}
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12} className="d-flex justify-content-end">
                        <Button
                          onClick={() => handleEditSession(session.id)}
                          variant="outline-success"
                          size="sm"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteSession(session.id)}
                          variant="outline-danger"
                          size="sm"
                          className="ms-2"
                        >
                          Delete
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </Col>
              </Row>
            ))
          ) : (
            <Row className="justify-content-center my-3">
              <Col md={6} className="text-center">
                <Alert variant="warning">
                  There are no work sessions for this day.
                </Alert>
              </Col>
            </Row>
          )}
        </ListGroup>
      )}
    </Container>
  );
};

export default EmployeeDetailsByDay;
