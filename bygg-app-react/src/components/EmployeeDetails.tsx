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
import MonthYearDisplay from "./MonthYearDisplay";
import BackButton from "./NavigateButton";
import moment from "moment-timezone";

const EmployeeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [sessionsByDay, setSessionsByDay] = useState<Map<string, WorkSession[]>>(new Map());
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
      const sessions = response.data.work_session;
      const splitSessions = splitSessionsByDay(sessions);
      const sessionsMap = groupSessionsByDay(splitSessions);
      setSessionsByDay(sessionsMap);
      const totalTimeCalculated = sumTotalTime(splitSessions);
      setTotalTime(totalTimeCalculated);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching employee details:", err);
      setError("Failed to fetch employee details");
      setLoading(false);
    }
  };

  const splitSessionsByDay = (sessions: WorkSession[]): WorkSession[] => {
    const splitSessions: WorkSession[] = [];

    sessions.forEach((session) => {
      const start = moment.utc(session.start_time).tz("Europe/Stockholm");
      const end = moment.utc(session.end_time).tz("Europe/Stockholm");

      let currentStart = start.clone();

      while (currentStart.isBefore(end)) {
        const sessionEndOfDay = currentStart.clone().endOf('day');
        const sessionEnd = end.isBefore(sessionEndOfDay) ? end : sessionEndOfDay;

        splitSessions.push({
          ...session,
          start_time: currentStart.toISOString(),
          end_time: sessionEnd.toISOString(),
          total_time: calculateTotalTime(currentStart, sessionEnd),
        });

        currentStart = sessionEnd.clone().add(1, 'second');
      }
    });

    return splitSessions;
  };

  const calculateTotalTime = (start: moment.Moment, end: moment.Moment): string => {
    const duration = moment.duration(end.diff(start));
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    return `${hours} h, ${minutes} min`;
  };

  const daysInMonth = (): string[] => {
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

  const displayDaysWithSessions = (): JSX.Element[] => {
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
              variant="outline-success"
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
                    <small>{session.workplace}</small>
                  </div>
                  <small className="text-muted">{session.total_time}</small>
                </div>
              </Col>
            ))
          ) : (
            <Col xs={12} className="text-center p-2">
              <small>No work session</small>
            </Col>
          )}
        </Row>
      );
    });
  };

  const groupSessionsByDay = (sessions: WorkSession[]): Map<string, WorkSession[]> => {
    const map = new Map<string, WorkSession[]>();
    sessions.forEach((session) => {
      const start = moment.utc(session.start_time).tz("Europe/Stockholm");
      const end = moment.utc(session.end_time).tz("Europe/Stockholm");

      let currentStart = start.clone();
      while (currentStart.isBefore(end)) {
        const endOfDay = currentStart.clone().endOf('day');
        const sessionEnd = end.isBefore(endOfDay) ? end : endOfDay;

        const dayKey = currentStart.format("YYYY-MM-DD");
        const sessionCopy = {
          ...session,
          start_time: currentStart.toISOString(),
          end_time: sessionEnd.toISOString(),
          total_time: calculateTotalTime(currentStart, sessionEnd),
        };

        const existing = map.get(dayKey) || [];
        existing.push(sessionCopy);
        map.set(dayKey, existing);

        currentStart = sessionEnd.clone().add(1, 'second');
      }
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

  const filterSessionsByMonth = (sessions: WorkSession[]): WorkSession[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // JavaScript miesiące są od 0, więc +1
    return sessions.filter((session) => {
      const sessionStart = moment.utc(session.start_time).tz("Europe/Stockholm").toDate();
      return sessionStart.getFullYear() === year && sessionStart.getMonth() + 1 === month;
    });
  };

  useEffect(() => {
    if (employee) {
      const filteredSessions = filterSessionsByMonth(employee.work_session);
      const sessionsMap = groupSessionsByDay(filteredSessions);
      setSessionsByDay(sessionsMap);
      const newTotalTime = sumTotalTime(filteredSessions);
      setTotalTime(newTotalTime);
    }
  }, [currentDate, employee]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!employee) return <div>No employee found</div>;

  return (
    <Container className="my-5">
      <BackButton backPath="/employees" />
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
              Monthly summary <FaDownload style={{ color: "grey" }} />
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

      <Row className="justify-content-center mt-3 align-items-center">
        <Col md={6}>
          <Row className="align-items-center">
            <Col xs={2} className="text-start">
              <Button onClick={() => handleMonthChange(-1)} variant="success">
                <ChevronLeft />
              </Button>
            </Col>
            <Col xs={8} className="text-center">
              <MonthYearDisplay currentDate={currentDate} />
            </Col>
            <Col xs={2} className="text-end">
              <Button onClick={() => handleMonthChange(1)} variant="success">
                <ChevronRight />
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className="justify-content-center mt-3">
        <Col md={6}>{displayDaysWithSessions()}</Col>
      </Row>
    </Container>
  );
};

export default EmployeeDetails;
