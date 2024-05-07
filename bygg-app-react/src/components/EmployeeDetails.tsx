import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { Employee, WorkSession } from "../api/interfaces/types";
import useGoBack from "../hooks/useGoBack";
import { Button, Image, Container, Row, Col, Card } from "react-bootstrap";
import {
  ChevronLeft,
  ChevronRight,
  PersonCircle,
  PersonBadge,
  Envelope,
  HourglassSplit,
} from "react-bootstrap-icons";
import { sumTotalTime } from "../api/helper/timeUtils";
import { FaDownload } from "react-icons/fa";

const EmployeeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [sessionsByDay, setSessionsByDay] = useState<
    Map<string, WorkSession[]>
  >(new Map());
  const [totalTime, setTotalTime] = useState<string>("0 h, 0 min");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const goBack = useGoBack();

  useEffect(() => {
    fetchEmployeeDetails();
  }, [id, currentDate]);

  const fetchEmployeeDetails = async () => {
    try {
      const response = await api.get<Employee>(`/employee/${id}`);
      setEmployee(response.data);
      const filteredSessions = filterSessionsByMonth(
        response.data.work_session
      );
      const sessionsMap = groupSessionsByDay(filteredSessions);
      setSessionsByDay(sessionsMap);
      const totalTimeCalculated = sumTotalTime(filteredSessions);
      setTotalTime(totalTimeCalculated);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching employee details:", err);
      setError("Failed to fetch employee details");
      setLoading(false);
    }
  };

  const daysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // JavaScript miesiące są od 0, więc +1
    return new Array(new Date(year, month, 0).getDate())
      .fill(null)
      .map(
        (_, i) =>
          `${year}-${month.toString().padStart(2, "0")}-${(i + 1)
            .toString()
            .padStart(2, "0")}`
      );
  };

  const displayDaysWithSessions = () => {
    const days = daysInMonth();
    return days.map((day) => {
      const daySessions = sessionsByDay.get(day) || [];
      return (
        <Row key={day} className="mb-3">
          <Col
            xs={12}
            className="d-flex justify-content-between align-items-center bg-light p-2"
          >
            <div>{day}</div>
            <Button
              onClick={() => navigate(`/employee/${id}/day/${day}`)}
              variant="outline-secondary"
              size="sm"
            >
              <ChevronRight />
            </Button>
          </Col>
          {daySessions.length > 0 ? (
            daySessions.map((session) => (
              <Col
                xs={12}
                className="d-flex justify-content-between align-items-center p-2"
                key={session.id}
              >
                <div>
                  <div>
                    <small>{session.workplace.split(",")[0]}</small>
                  </div>{" "}
                  {/* Ulica i numer */}
                  <small className="text-muted">
                    {session.workplace.split(",").slice(1).join(",")}
                  </small>{" "}
                  {/* Miasto i kod */}
                </div>
                <div>
                  <small style={{ color: "green" }}>{session.total_time}</small>
                </div>
              </Col>
            ))
          ) : (
            <Col xs={12} className="text-center p-2">
              <small>Brak pracy</small>
            </Col>
          )}
        </Row>
      );
    });
  };

  const filterSessionsByMonth = (sessions: WorkSession[]): WorkSession[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // JavaScript month is 0-indexed, add 1 for correct comparison
    return sessions.filter((session) => {
      const sessionStart = new Date(session.start_time);
      return (
        sessionStart.getFullYear() === year &&
        sessionStart.getMonth() + 1 === month
      );
    });
  };

  const groupSessionsByDay = (
    sessions: WorkSession[]
  ): Map<string, WorkSession[]> => {
    const map = new Map<string, WorkSession[]>();
    sessions.forEach((session) => {
      const day = session.start_time.split(" ")[0].replace(/\./g, "-"); // Assuming start_time is 'YYYY-MM-DD HH:MM'
      const existing = map.get(day) || [];
      existing.push(session);
      map.set(day, existing);
    });
    return map;
  };

  const handleMonthChange = (offset: number) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + offset,
      1
    );
    setCurrentDate(newDate);
    if (employee) {
      const newFilteredSessions = filterSessionsByMonth(employee.work_session);
      const newSessionsMap = groupSessionsByDay(newFilteredSessions);
      setSessionsByDay(newSessionsMap);
      const newTotalTime = sumTotalTime(newFilteredSessions);
      setTotalTime(newTotalTime);
    }
  };

  useEffect(() => {
    if (employee) {
      const filteredSessions = filterSessionsByMonth(employee.work_session);
      const sessionsMap = groupSessionsByDay(filteredSessions);
      setSessionsByDay(sessionsMap);
      const newTotalTime = sumTotalTime(filteredSessions);
      setTotalTime(newTotalTime);
    }
  }, [currentDate]); // This will trigger re-filtering and re-summing when currentDate changes.

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!employee) return <div>Brak znalezionego pracownika</div>;

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6} className="text-center">
          <Image
            src={employee?.image}
            roundedCircle
            fluid
            style={{ width: "200px", height: "200px", objectFit: "cover" }}
          />
        </Col>
      </Row>
      <Row className="justify-content-center mt-3">
        <Col md={6}>
          <Card className="mt-3 mb-3">
            <Card.Header
              as="h6"
              className="d-flex justify-content-between align-items-center"
            >
              Zestawienie miesięczne <FaDownload style={{ color: "grey" }} />
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

      <Row className="justify-content-center mt-3">
        <Col md={6} className="text-center">
          <Button
            onClick={() => handleMonthChange(-1)}
            variant="outline-secondary"
          >
            <ChevronLeft />
          </Button>
          <span className="mx-3">
            {currentDate.toLocaleString("default", { month: "long" })}{" "}
            {currentDate.getFullYear()}
          </span>
          <Button
            onClick={() => handleMonthChange(1)}
            variant="outline-secondary"
          >
            <ChevronRight />
          </Button>
        </Col>
      </Row>

      <Row className="justify-content-center mt-3">
        <Col md={6}>{displayDaysWithSessions()}</Col>
      </Row>
    </Container>
  );
};

export default EmployeeDetails;
