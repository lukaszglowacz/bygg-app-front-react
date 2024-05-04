import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import { Employee, WorkSession } from "../api/interfaces/types";
import useGoBack from "../hooks/useGoBack";
import { Button, Image, Container, Row, Col } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import { sumTotalTime } from "../api/helper/timeUtils";

const EmployeeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [sessions, setSessions] = useState<WorkSession[]>([]);
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
      updateFilteredSessions(response.data.work_session);
    } catch (err: any) {
      console.error("Error fetching employee details:", err);
      setError("Failed to fetch employee details");
      setLoading(false);
    }
  };

  const updateFilteredSessions = (workSessions: WorkSession[]) => {
    const filteredSessions = filterSessionsByMonth(workSessions);
    setSessions(filteredSessions);
    const totalTimeCalculated = sumTotalTime(filteredSessions);
    setTotalTime(totalTimeCalculated);
    setLoading(false);
  };

  const filterSessionsByMonth = (sessions: WorkSession[]): WorkSession[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    return sessions.filter(session => {
      const sessionDate = new Date(session.start_time);
      return sessionDate.getFullYear() === year && sessionDate.getMonth() + 1 === month;
    });
  };

  const handleMonthChange = (offset: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
  };

  useEffect(() => {
    if (employee) {
      updateFilteredSessions(employee.work_session);
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
          <h1 className="mt-3">{employee?.full_name}</h1>
        </Col>
      </Row>
      <Row className="justify-content-center mt-3">
        <Col md={6}>
          <p>
            <strong>Personnummer:</strong> {employee?.personnummer}
          </p>
          <p>
            <strong>E-mail:</strong> {employee?.user_email}
          </p>
        </Col>
      </Row>
      <Row className="justify-content-center mt-3">
        <Col md={6} className="text-center">
          <Button onClick={() => handleMonthChange(-1)} variant="outline-secondary">
            <ChevronLeft />
          </Button>
          <span className="mx-3">
            {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
          </span>
          <Button onClick={() => handleMonthChange(1)} variant="outline-secondary">
            <ChevronRight />
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>
            <strong>Laczny czas pracy w miesiacu:</strong> {totalTime}
          </p>
        </Col>
      </Row>
      <Row className="justify-content-center mt-3">
        <Col md={6}>
          {sessions.map(session => (
            <div key={session.id}>
              <p>{session.workplace}: {session.start_time} - {session.end_time} ({session.total_time})</p>
            </div>
          ))}
        </Col>
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

export default EmployeeDetails;
