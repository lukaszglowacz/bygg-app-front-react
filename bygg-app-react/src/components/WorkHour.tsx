import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import BackButton from "./NavigateButton";
import moment from "moment-timezone";
import { extendMoment } from "moment-range";
import { DateRange } from "moment-range";

const Moment = extendMoment(moment);

const WorkHour: React.FC = () => {
  const [sessionsByDay, setSessionsByDay] = useState<Map<string, ProfileWorksession[]>>(new Map());
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
      const response = await api.get<ProfileWorksession[]>("/profile/worksessions");
      const sessions = response.data;
      const splitSessions = splitSessionsByDay(sessions);
      const sessionsMap = groupSessionsByDay(splitSessions);
      if (sessions.length > 0) {
        setProfile(sessions[0].profile); // Set profile data from the first session
      }

      setSessionsByDay(sessionsMap);
      const totalTimeCalculated = sumTotalTimeForProfile(splitSessions);
      setTotalTime(totalTimeCalculated);
      setLoading(false);
    } catch (error: any) {
      setError("Failed to fetch work sessions");
      setLoading(false);
    }
  };

  const splitSessionsByDay = (sessions: ProfileWorksession[]): ProfileWorksession[] => {
    const splitSessions: ProfileWorksession[] = [];

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
    const minutes = Math.floor(duration.minutes());
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
              onClick={() => navigate(`/work-hours/day/${day}`)}
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
              <small>No work session</small>
            </Col>
          )}
        </Row>
      );
    });
  };

  const groupSessionsByDay = (
    sessions: ProfileWorksession[]
  ): Map<string, ProfileWorksession[]> => {
    const map = new Map<string, ProfileWorksession[]>();
    sessions.forEach((session) => {
      const startDay = moment.utc(session.start_time).tz("Europe/Stockholm").format("YYYY-MM-DD");
      const endDay = moment.utc(session.end_time).tz("Europe/Stockholm").format("YYYY-MM-DD");

      if (startDay !== endDay) {
        const range = Moment.range(
          moment(startDay).add(1, 'day'),
          moment(endDay).subtract(1, 'day')
        );

        for (let day of Array.from(range.by('day'))) {
          const middleSession = {
            ...session,
            start_time: day.startOf('day').toISOString(),
            end_time: day.endOf('day').toISOString(),
            total_time: calculateTotalTime(day.startOf('day'), day.endOf('day')),
          };
          const existing = map.get(day.format("YYYY-MM-DD")) || [];
          existing.push(middleSession);
          map.set(day.format("YYYY-MM-DD"), existing);
        }

        const startSession = {
          ...session,
          end_time: moment(startDay).endOf('day').toISOString(),
          total_time: calculateTotalTime(moment(startDay).startOf('day'), moment(startDay).endOf('day')),
        };
        const existingStart = map.get(startDay) || [];
        existingStart.push(startSession);
        map.set(startDay, existingStart);

        const endSession = {
          ...session,
          start_time: moment(endDay).startOf('day').toISOString(),
          total_time: calculateTotalTime(moment(endDay).startOf('day'), moment(endDay).endOf('day')),
        };
        const existingEnd = map.get(endDay) || [];
        existingEnd.push(endSession);
        map.set(endDay, existingEnd);
      } else {
        const existing = map.get(startDay) || [];
        existing.push(session);
        map.set(startDay, existing);
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
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container className="my-5">
      <BackButton backPath="/" />
      {profile && (
        <Row className="justify-content-center mt-3">
          <Col md={6}>
            <Card className="mt-3 mb-3">
            <Card.Header
                as="h6"
                className="d-flex justify-content-center align-items-center"
              >
                Monthly statement
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
