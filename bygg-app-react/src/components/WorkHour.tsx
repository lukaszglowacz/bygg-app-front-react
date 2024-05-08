import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { ProfileWorksession, Profile } from "../api/interfaces/types";
import useGoBack from "../hooks/useGoBack";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import {
  ChevronLeft,
  ChevronRight,
  PersonCircle,
  PersonBadge,
  Envelope,
  HourglassSplit,
} from "react-bootstrap-icons";
import { sumTotalTimeForProfile } from "../api/helper/timeUtils";
import MonthYearDisplay from "./MonthYearDisplay";

const WorkHour: React.FC = () => {
  const [sessionsByDay, setSessionsByDay] = useState<
    Map<string, ProfileWorksession[]>
  >(new Map());
  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [totalTime, setTotalTime] = useState<string>("0 h, 0 min");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const goBack = useGoBack();

  useEffect(() => {
    fetchWorkSessions();
  }, [currentDate]);

  const fetchWorkSessions = async () => {
    try {
      const response = await api.get<ProfileWorksession[]>(
        "/profile/worksessions"
      );
      const filteredSessions = filterSessionsByMonth(response.data);
      const sessionsMap = groupSessionsByDay(filteredSessions);
      const sessions = response.data;
      if (sessions.length > 0) {
        setProfile(sessions[0].profile); // Set profile data from the first session
      }

      setSessionsByDay(sessionsMap);
      const totalTimeCalculated = sumTotalTimeForProfile(filteredSessions);
      setTotalTime(totalTimeCalculated);
      setLoading(false);
    } catch (error: any) {
      setError("Failed to fetch work sessions");
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
            <Button onClick={() => navigate(`/work-hours/day/${day}`)} variant="outline-secondary" size="sm">
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
                    <small>
                      {session.workplace.street}{" "}
                      {session.workplace.street_number}
                    </small>
                  </div>
                  <small className="text-muted">
                    {session.workplace.postal_code} {session.workplace.city}
                  </small>
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

  const filterSessionsByMonth = (
    sessions: ProfileWorksession[]
  ): ProfileWorksession[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // JavaScript month is 0-indexed
    return sessions.filter((session) => {
      const sessionDate = new Date(session.start_time); // Directly use the ISO-like format
      return (
        sessionDate.getFullYear() === year && sessionDate.getMonth() === month
      );
    });
  };

  const groupSessionsByDay = (
    sessions: ProfileWorksession[]
  ): Map<string, ProfileWorksession[]> => {
    const map = new Map<string, ProfileWorksession[]>();
    sessions.forEach((session) => {
      const day = session.start_time.split(" ")[0]; // Split and take the date part directly
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
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container className="my-5">
      {profile && (
        <Row className="justify-content-center mt-3">
          <Col md={6}>
            <Card className="mt-3 mb-3">
              <Card.Header
                as="h6"
                className="d-flex justify-content-between align-items-center"
              >
                Zestawienie miesięczne
              </Card.Header>
              <Card.Body>
                <Card.Text className="small text-muted">
                  <PersonCircle className="me-2" />
                  {profile.full_name}
                </Card.Text>
                <Card.Text className="small text-muted">
                  <PersonBadge className="me-2" />
                  {profile.personnummer}
                </Card.Text>
                <Card.Text className="small text-muted">
                  <Envelope className="me-2" />
                  {profile.user_email}
                </Card.Text>
                <Card.Text className="small text-muted">
                  <HourglassSplit className="me-2" />
                  <strong>{totalTime}</strong>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      
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

export default WorkHour;
