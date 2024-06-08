import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  PlusSquare,
  PencilSquare,
  Trash,
} from "react-bootstrap-icons";
import { sumTotalTime } from "../utils/timeUtils";
import { formatTime } from "../utils/dateUtils";
import Loader from "./Loader";
import moment from "moment-timezone";
import ConfirmModal from "./ConfirmModal";

const EmployeeDetailsByDay: React.FC = () => {
  const { id, date } = useParams<{ id: string; date?: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [sessions, setSessions] = useState<WorkSession[]>([]);
  const [totalTime, setTotalTime] = useState<string>("0 h, 0 min");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [sessionToDelete, setSessionToDelete] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployeeAndSessions = async () => {
      try {
        setLoading(true);
        const response = await api.get<Employee>(`/employee/${id}`);
        setEmployee(response.data);
        const allSessions = response.data.work_session;
        const daySessions = getSessionsForDate(allSessions, date);
        setSessions(daySessions);
        setTotalTime(sumTotalTime(daySessions));
        setLoading(false);
      } catch (err) {
        setError("Error retrieving work session data");
        setLoading(false);
      }
    };

    fetchEmployeeAndSessions();
  }, [id, date]);

  const getSessionsForDate = (sessions: WorkSession[], date?: string) => {
    if (!date) return [];
    const targetDate = moment.tz(date, "Europe/Stockholm");
    const sessionsForDate: WorkSession[] = [];

    sessions.forEach((session) => {
      const start = moment.utc(session.start_time).tz("Europe/Stockholm");
      const end = moment.utc(session.end_time).tz("Europe/Stockholm");

      let currentStart = start.clone();

      while (currentStart.isBefore(end)) {
        const sessionEndOfDay = currentStart.clone().endOf("day");
        const sessionEnd = end.isBefore(sessionEndOfDay)
          ? end
          : sessionEndOfDay;

        if (currentStart.isSame(targetDate, "day")) {
          sessionsForDate.push({
            ...session,
            start_time: currentStart.toISOString(),
            end_time: sessionEnd.toISOString(),
            total_time: calculateTotalTime(currentStart, sessionEnd),
          });
        } else if (
          currentStart.isBefore(targetDate) &&
          sessionEnd.isAfter(targetDate)
        ) {
          const fullDaySessionStart = targetDate.clone().startOf("day");
          const fullDaySessionEnd = targetDate.clone().endOf("day");

          sessionsForDate.push({
            ...session,
            start_time: fullDaySessionStart.toISOString(),
            end_time: fullDaySessionEnd.toISOString(),
            total_time: calculateTotalTime(
              fullDaySessionStart,
              fullDaySessionEnd
            ),
          });
        }

        currentStart = sessionEnd.clone().add(1, "second");
      }
    });

    return sessionsForDate;
  };

  const calculateTotalTime = (
    start: moment.Moment,
    end: moment.Moment
  ): string => {
    const duration = moment.duration(end.diff(start));
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    return `${hours} h, ${minutes} min`;
  };

  const changeDay = (offset: number): void => {
    if (!date) {
      console.error("Date not available");
      return;
    }
    const currentDate = moment.tz(date, "Europe/Stockholm").add(offset, "days");
    navigate(`/employee/${id}/day/${currentDate.format("YYYY-MM-DD")}`);
  };

  const handleEditSession = (sessionId: number) => {
    navigate(`/edit-work-hour/${sessionId}?date=${date}&employeeId=${id}`);
  };

  const handleDeleteSession = (sessionId: number) => {
    setShowModal(true);
    setSessionToDelete(sessionId);
  };

  const confirmDeleteSession = async () => {
    if (sessionToDelete !== null) {
      try {
        await api.delete(`/worksession/${sessionToDelete}`);
        const updatedSessions = sessions.filter(
          (session) => session.id !== sessionToDelete
        );
        setSessions(updatedSessions);
        setTotalTime(sumTotalTime(updatedSessions));
        setShowModal(false);
        setSessionToDelete(null);
      } catch (error) {
        console.error("Error deleting session: ", error);
        setError("Error deleting session");
        setShowModal(false);
        setSessionToDelete(null);
      }
    }
  };

  const handleAddSession = () => {
    navigate(`/add-work-hour?date=${date}&employeeId=${id}`);
  };

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container className="mt-4">
      <Row className="justify-content-center my-3">
        <Col md={6} className="d-flex justify-content-end">
          <div className="text-center">
            <Button
              variant="primary"
              className="btn-sm p-0"
              onClick={handleAddSession}
              title="Add"
            >
              <PlusSquare size={24} />
            </Button>
            <div>Add</div>
          </div>
        </Col>
      </Row>
      <Row className="justify-content-center mt-3">
        <Col md={6}>
          <Card className="mt-3 mb-3">
            <Card.Header
              as="h6"
              className="d-flex justify-content-center align-items-center"
            >
              Daily summary
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
                    {moment.tz(date, "Europe/Stockholm").format("D MMMM YYYY")}
                  </div>
                  <small className="text-muted">
                    {moment.tz(date, "Europe/Stockholm").format("dddd")}
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

      <ListGroup className="mb-4">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <Row key={session.id} className="justify-content-center">
              <Col md={6}>
                <ListGroup.Item className="mb-2 small">
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
                    <Col xs={12}>
                      <div className="d-flex justify-content-around mt-3">
                        <div className="text-center">
                          <Button
                            variant="outline-success"
                            className="btn-sm p-0"
                            onClick={() => handleEditSession(session.id)}
                            title="Edit"
                          >
                            <PencilSquare size={24} />
                          </Button>
                          <div>Edit</div>
                        </div>
                        <div className="text-center">
                          <Button
                            variant="danger"
                            className="btn-sm p-0"
                            onClick={() => handleDeleteSession(session.id)}
                            title="Delete"
                          >
                            <Trash size={24} />
                          </Button>
                          <div>Delete</div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </Col>
            </Row>
          ))
        ) : (
          <Row className="justify-content-center my-3">
            <Col md={6} className="text-center">
              <Alert variant="warning" className="text-center">No work sessions for this day</Alert>
            </Col>
          </Row>
        )}
      </ListGroup>

      <ConfirmModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={confirmDeleteSession}
      >
        Confirm deletion of this work session
      </ConfirmModal>
    </Container>
  );
};

export default EmployeeDetailsByDay;
