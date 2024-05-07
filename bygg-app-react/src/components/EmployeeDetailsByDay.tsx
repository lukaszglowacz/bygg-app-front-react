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
        setError("Nie udało się pobrać danych sesji pracy.");
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

  return (
    <Container className="mt-4">
      <Row className="justify-content-center mt-3">
        <Col md={6}>
          <Card className="mt-3 mb-3">
            <Card.Header
              as="h6"
              className="d-flex justify-content-between align-items-center"
            >
              Zestawienie dzienne <FaDownload style={{ color: "grey" }} />
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
        <Col md={6} className="text-center">
          <Button onClick={() => changeDay(-1)} variant="outline-secondary">
            <ChevronLeft />
          </Button>
          <span className="mx-3">{date}</span>
          <Button
            onClick={() => changeDay(1)}
            variant="outline-secondary"
            className="ms-2"
          >
            <ChevronRight />
          </Button>
        </Col>
      </Row>
      {loading ? (
        <Alert variant="info">Ładowanie danych...</Alert>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
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
                  </ListGroup.Item>
                </Col>
              </Row>
            ))
          ) : (
            <Alert variant="warning">Brak sesji pracy dla tego dnia.</Alert>
          )}
        </ListGroup>
      )}
    </Container>
  );
};

export default EmployeeDetailsByDay;
