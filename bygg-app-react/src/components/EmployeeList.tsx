import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import api from "../api/api"; // Upewnij się, że ścieżka do API jest poprawna
import { Employee } from "../api/interfaces/types"; // Upewnij się, że ten typ danych jest poprawnie zdefiniowany
import { Button, Container, Row, Col } from "react-bootstrap";
import {
  HourglassSplit,
  Person,
  GeoAlt,
  ClockHistory,
  InfoCircleFill,
} from "react-bootstrap-icons";
import moment from "moment-timezone"; // Importowanie moment i moment-timezone
import TimeElapsed from "./TimeElapsed";
import BackButton from "./NavigateButton";

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get<Employee[]>("/employee");
        setEmployees(response.data); // Zakładamy, że odpowiedź API to bezpośrednio lista pracowników
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching employees:", err);
        setError("Failed to fetch employees");
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleEmployee = (id: number) => {
    navigate(`/employees/${id}`); // Przekierowanie do formularza edycji z ID miejsca pracy
  };

  const formatTimeToStockholm = (time: string) => {
    return moment.utc(time).tz('Europe/Stockholm').format('YYYY.MM.DD HH:mm');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container>
      <BackButton backPath="/" />
      <Row className="justify-content-center my-3">
        <Col md={6}>
          <Accordion defaultActiveKey="0">
            {employees.map((employee, index) => (
              <Accordion.Item eventKey={String(index)} key={employee.id}>
                <Accordion.Header>
                  <Person className="me-2" /> {employee.full_name}
                </Accordion.Header>
                <Accordion.Body>
                  <div>
                    <InfoCircleFill
                      className="me-2"
                      style={{ color: "blue" }}
                    />
                    <strong>Currently working: </strong>
                    {employee.current_session_status === "Trwa" ? (
                      <i className="bi bi-check-circle-fill text-success"></i>
                    ) : (
                      <i className="bi bi-x-circle-fill text-danger"></i>
                    )}
                  </div>
                  {employee.current_session_status === "Trwa" && (
                    <>
                      <div>
                        <GeoAlt className="me-2" />
                        <strong>Workplace: </strong>
                        {employee.current_workplace}
                      </div>
                      <div>
                        <i className="bi bi-clock-fill me-2"></i>
                        <strong>Start: </strong>
                        {formatTimeToStockholm(employee.current_session_start_time)}
                      </div>
                      <div>
                        <HourglassSplit className="me-2" />
                        <strong>Expired: </strong>
                        <TimeElapsed
                          startTime={employee.current_session_start_time}
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <Button
                      variant="outline-success"
                      className="btn-sm mt-3"
                      onClick={() => handleEmployee(employee.id)}
                    >
                      <i className="bi bi-person-exclamation me-1"></i> Show
                      more
                    </Button>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
};

export default EmployeeList;
