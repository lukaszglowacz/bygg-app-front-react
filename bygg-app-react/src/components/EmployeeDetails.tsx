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
import { FaDownload } from "react-icons/fa";
import MonthYearDisplay from "./MonthYearDisplay";
import BackButton from "./NavigateButton";
import moment from "moment-timezone";
import { saveAs } from 'file-saver';

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
      const filteredSessions = filterSessionsByMonth(splitSessions, currentDate);
      const totalTimeCalculated = sumTotalTimeForMonth(filteredSessions);
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

  const filterSessionsByMonth = (sessions: WorkSession[], date: Date): WorkSession[] => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const filteredSessions: WorkSession[] = [];

    sessions.forEach((session) => {
      const sessionStart = moment.utc(session.start_time).tz("Europe/Stockholm");
      const sessionEnd = moment.utc(session.end_time).tz("Europe/Stockholm");

      if (sessionStart.month() === month && sessionStart.year() === year) {
        if (sessionEnd.month() !== month || sessionEnd.year() !== year) {
          const endOfMonth = sessionStart.clone().endOf('month');
          filteredSessions.push({
            ...session,
            end_time: endOfMonth.toISOString(),
            total_time: calculateTotalTime(sessionStart, endOfMonth),
          });
        } else {
          filteredSessions.push(session);
        }
      } else if (sessionEnd.month() === month && sessionEnd.year() === year) {
        const startOfMonth = sessionEnd.clone().startOf('month');
        filteredSessions.push({
          ...session,
          start_time: startOfMonth.toISOString(),
          total_time: calculateTotalTime(startOfMonth, sessionEnd),
        });
      }
    });

    return filteredSessions;
  };

  const sumTotalTimeForMonth = (sessions: WorkSession[]): string => {
    let totalMinutes = 0;

    sessions.forEach((session) => {
      const start = moment.utc(session.start_time).tz("Europe/Stockholm");
      const end = moment.utc(session.end_time).tz("Europe/Stockholm");
      totalMinutes += moment.duration(end.diff(start)).asMinutes();
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);

    return `${hours} h, ${minutes} min`;
  };

  const handleMonthChange = (offset: number) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + offset,
      1
    );
    setCurrentDate(newDate);
    if (employee) {
      const newFilteredSessions = filterSessionsByMonth(employee.work_session, newDate);
      const newSessionsMap = groupSessionsByDay(newFilteredSessions);
      setSessionsByDay(newSessionsMap);
      const newTotalTime = sumTotalTimeForMonth(newFilteredSessions);
      setTotalTime(newTotalTime);
    }
  };

  useEffect(() => {
    if (employee) {
      const filteredSessions = filterSessionsByMonth(employee.work_session, currentDate);
      const sessionsMap = groupSessionsByDay(filteredSessions);
      setSessionsByDay(sessionsMap);
      const newTotalTime = sumTotalTimeForMonth(filteredSessions);
      setTotalTime(newTotalTime);
    }
  }, [currentDate, employee]);

  const handleDownloadPDF = async () => {
    try {
      const response = await api.get(`/employee/${id}/monthly-summary-pdf/`, {
        responseType: 'blob',
        params: {
          year: currentDate.getFullYear(),
          month: currentDate.getMonth() + 1,
        },
      });

      // Extract profile data to generate the file name
      if (employee) {
        const year = currentDate.getFullYear();
        const monthName = moment.months()[currentDate.getMonth()];
        const personnummer = employee.personnummer;
        const fullName = employee.full_name.replace(" ", "_");
        const fileName = `${monthName}_${year}_${personnummer}_${fullName}.pdf`;

        const blob = new Blob([response.data], { type: 'application/pdf' });
        saveAs(blob, fileName);
      } else {
        console.error("Employee data not available.");
      }
    } catch (err: any) {
      console.error("Error downloading PDF:", err);
    }
  };

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
              Monthly summary
              <Button onClick={handleDownloadPDF} variant="link">
                <FaDownload style={{ color: "grey" }} />
              </Button>
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
