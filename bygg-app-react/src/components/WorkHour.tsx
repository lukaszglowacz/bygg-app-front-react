import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { ProfileWorksession } from '../api/interfaces/types';
import useGoBack from '../hooks/useGoBack';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';

const WorkHour: React.FC = () => {
  const [sessionsByDay, setSessionsByDay] = useState<Map<string, ProfileWorksession[]>>(new Map());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const goBack = useGoBack();

  useEffect(() => {
    fetchWorkSessions();
  }, [currentDate]);

  const fetchWorkSessions = async () => {
    try {
      const response = await api.get<ProfileWorksession[]>('/profile/worksessions');
      const filteredSessions = filterSessionsByMonth(response.data);
      const sessionsMap = groupSessionsByDay(filteredSessions);
      setSessionsByDay(sessionsMap);
      setLoading(false);
    } catch (error: any) {
      setError('Failed to fetch work sessions');
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
      console.log(`Displaying sessions on: ${day}, found: ${daySessions.length}`);
      return (
        <Row key={day} className="mb-3">
          <Col
            xs={12}
            className="d-flex justify-content-between align-items-center bg-light p-2"
          >
            <div>{day}</div>
            <ChevronRight onClick={() => navigate(`/work-hours/day/${day}`)}/>
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
                    <small>{session.workplace.street}, {session.workplace.street_number}</small>
                  </div>
                  <small className="text-muted">
                    {session.workplace.city}, {session.workplace.postal_code}
                  </small>
                </div>
                <div>
                  <small>{session.total_time}</small>
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

  const filterSessionsByMonth = (sessions: ProfileWorksession[]): ProfileWorksession[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // JavaScript month is 0-indexed
    return sessions.filter((session) => {
      const sessionDate = new Date(session.start_time); // Directly use the ISO-like format
      console.log(`Session date: ${sessionDate.toISOString()} | Session year: ${sessionDate.getFullYear()} and month: ${sessionDate.getMonth() + 1}`);
      return (
        sessionDate.getFullYear() === year &&
        sessionDate.getMonth() === month
      );
    });
  };
  
  
  const groupSessionsByDay = (sessions: ProfileWorksession[]): Map<string, ProfileWorksession[]> => {
    const map = new Map<string, ProfileWorksession[]>();
    sessions.forEach((session) => {
      const day = session.start_time.split(" ")[0]; // Split and take the date part directly
      console.log(`Grouping session for: ${day}`); // Debug log
      const existing = map.get(day) || [];
      existing.push(session);
      map.set(day, existing);
    });
    return map;
  };
  

  const handleMonthChange = (offset: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container className="my-5">
      <Row className="justify-content-center mt-3">
        <Col md={6} className="text-center">
          <Button onClick={() => handleMonthChange(-1)} variant="outline-secondary">
            <ChevronLeft />
          </Button>
          <span className="mx-3">
            {currentDate.toLocaleString("default", { month: "long" })}{" "}
            {currentDate.getFullYear()}
          </span>
          <Button onClick={() => handleMonthChange(1)} variant="outline-secondary">
            <ChevronRight />
          </Button>
        </Col>
      </Row>

      <Row className="justify-content-center mt-3">
        <Col md={6}>{displayDaysWithSessions()}</Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={6} className="text-center">
          <Button onClick={goBack} variant="outline-danger">
            Cofnij
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default WorkHour;
