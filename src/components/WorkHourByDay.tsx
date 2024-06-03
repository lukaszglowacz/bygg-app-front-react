import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { ProfileWorksession, Profile } from "../api/interfaces/types";
import useGoBack from "../hooks/useGoBack";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Button,
  ListGroup,
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
import { sumTotalTimeForProfile } from "../api/helper/timeUtils";
import BackButton from "./NavigateButton";
import moment from "moment-timezone";

const WorkHourByDay: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<ProfileWorksession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const goBack = useGoBack();
  const [totalTime, setTotalTime] = useState<string>("0 h, 0 min");

  useEffect(() => {
    const fetchSessionsByDay = async () => {
      try {
        setLoading(true);
        const response = await api.get<ProfileWorksession[]>("/profile/worksessions");
        console.log("Raw sessions data:", response.data); // Logowanie surowych danych
        const daySessions = getSessionsForDate(response.data, date);
        if (daySessions.length > 0) {
          setProfile(daySessions[0].profile);
        } else if (response.data.length > 0) {
          setProfile(response.data[0].profile); // Ustaw profil, jeśli nie ma sesji, ale mamy dane
        }
        setSessions(daySessions);
        setTotalTime(sumTotalTimeForProfile(daySessions));
        setLoading(false);
      } catch (error: any) {
        setError("Failed to retrieve the work session for this day.");
        setLoading(false);
      }
    };

    fetchSessionsByDay();
  }, [date]);

  const getSessionsForDate = (sessions: ProfileWorksession[], date?: string) => {
    if (!date) return [];
    const targetDate = moment.tz(date, "Europe/Stockholm");
    const sessionsForDate: ProfileWorksession[] = [];

    sessions.forEach((session) => {
      const start = moment.utc(session.start_time).tz("Europe/Stockholm");
      const end = moment.utc(session.end_time).tz("Europe/Stockholm");

      let currentStart = start.clone();

      while (currentStart.isBefore(end)) {
        const sessionEndOfDay = currentStart.clone().endOf('day');
        const sessionEnd = end.isBefore(sessionEndOfDay) ? end : sessionEndOfDay;

        if (currentStart.isSame(targetDate, 'day')) {
          sessionsForDate.push({
            ...session,
            start_time: currentStart.toISOString(),
            end_time: sessionEnd.toISOString(),
            total_time: calculateTotalTime(currentStart, sessionEnd),
          });
        } else if (currentStart.isBefore(targetDate) && sessionEnd.isAfter(targetDate)) {
          const fullDaySessionStart = targetDate.clone().startOf('day');
          const fullDaySessionEnd = targetDate.clone().endOf('day');

          sessionsForDate.push({
            ...session,
            start_time: fullDaySessionStart.toISOString(),
            end_time: fullDaySessionEnd.toISOString(),
            total_time: calculateTotalTime(fullDaySessionStart, fullDaySessionEnd),
          });
        }

        currentStart = sessionEnd.clone().add(1, 'second');
      }
    });

    return sessionsForDate;
  };

  const calculateTotalTime = (start: moment.Moment, end: moment.Moment): string => {
    const duration = moment.duration(end.diff(start));
    const hours = Math.floor(duration.asHours());
    const minutes = Math.floor(duration.minutes());
    return `${hours} h, ${minutes} min`;
  };

  const formatTime = (dateTime: string) => {
    return moment.utc(dateTime).tz("Europe/Stockholm").format("HH:mm");
  };

  const changeDay = (offset: number): void => {
    if (!date) {
      console.error("Date is undefined");
      return;
    }
    const currentDate = moment.tz(date, "Europe/Stockholm").add(offset, 'days');
    navigate(`/work-hours/day/${currentDate.format("YYYY-MM-DD")}`);
  };

  return (
    <Container className="mt-4">
      <BackButton backPath="/work-hours" />
      {profile && (
        <Row className="justify-content-center mt-3">
          <Col md={6}>
            <Card className="mt-3 mb-3">
              <Card.Header
                as="h6"
                className="d-flex justify-content-center align-items-center"
              >
                Daily statement
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
                  <div className="font-weight-bold" style={{ fontSize: "14px" }}>
                    {moment.tz(date, "Europe/Stockholm").format("D MMMM YYYY")}
                  </div>
                  <small className="text-muted">
                    {moment.tz(date, "Europe/Stockholm").format("dddd")}
                  </small>
                </>
              ) : (
                <span>Data nie jest dostępna</span>
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

      {!loading && !error && !sessions.length && (
        <Row className="justify-content-center my-3">
          <Col md={6} className="text-center">
            <Alert variant="warning">
              There are no work sessions for this day.
            </Alert>
          </Col>
        </Row>
      )}
      {!loading && !error && sessions.length > 0 && (
        <ListGroup className="mb-4">
          {sessions.map((session) => (
            <Row className="justify-content-center" key={session.id}>
              <Col md={6}>
                <ListGroup.Item className="mb-2 small">
                  <Row className="align-items-center">
                    <Col xs={12}>
                      <House className="me-2" /> {session.workplace.street}{" "}
                      {session.workplace.street_number}, {session.workplace.postal_code}{" "}{session.workplace.city}
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
          ))}
        </ListGroup>
      )}
      {loading && (
        <Row className="justify-content-center my-3">
          <Col md={6} className="text-center">
            <Alert variant="info">Loading data...</Alert>
          </Col>
        </Row>
      )}
      {error && (
        <Row className="justify-content-center my-3">
          <Col md={6} className="text-center">
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default WorkHourByDay;
