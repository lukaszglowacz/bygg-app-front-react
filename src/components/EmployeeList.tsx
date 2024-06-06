import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import api from "../api/api";
import { Employee } from "../api/interfaces/types";
import { Container, Row, Col, Button } from "react-bootstrap";
import { HourglassSplit, Person, PersonFill, GeoAlt, CheckCircle, XCircle, Power, Clock, ClockHistory } from "react-bootstrap-icons";
import TimeElapsed from "./TimeElapsed";
import Loader from "./Loader";
import ConfirmModal from "./ConfirmModal";
import { formatDateTime } from "../utils/dateUtils"; // Importowanie funkcji formatujących

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get<Employee[]>("/employee");
        setEmployees(response.data);
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
    navigate(`/employees/${id}`);
  };

  const handleEndSession = async () => {
    if (selectedSessionId !== null) {
      try {
        await api.patch(`/livesession/end/${selectedSessionId}/`);
        const updatedEmployees = employees.map((employee) =>
          employee.current_session_id === selectedSessionId
            ? { ...employee, current_session_status: "Zakończona" }
            : employee
        );
        setEmployees(updatedEmployees);
        setShowModal(false);
      } catch (error) {
        console.error("Error ending session", error);
        setError("Failed to end session");
      }
    }
  };

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <Accordion>
            {employees.map((employee, index) => (
              <Accordion.Item eventKey={String(index)} key={employee.id}>
                <Accordion.Header>
                  {employee.current_session_status === "Trwa" ? (
                    <PersonFill className="me-2 text-success" />
                  ) : (
                    <Person className="me-2" />
                  )}
                  {employee.full_name}
                </Accordion.Header>
                <Accordion.Body style={{ fontSize: "0.9em", lineHeight: "1.6" }}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center">
                      {employee.current_session_status === "Trwa" ? (
                        <CheckCircle className="text-success me-2" />
                      ) : (
                        <XCircle className="text-danger me-2" />
                      )}
                      {employee.current_session_status === "Trwa"
                        ? "Currently working"
                        : "Not working"}
                    </div>
                  </div>
                  {employee.current_session_status === "Trwa" && (
                    <>
                      <div className="d-flex align-items-center mb-2">
                        <GeoAlt className="me-2" />
                        {employee.current_workplace}
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <Clock className="me-2" />
                        {formatDateTime(employee.current_session_start_time)}
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <HourglassSplit className="me-2" />
                        <TimeElapsed startTime={employee.current_session_start_time} />
                      </div>
                    </>
                  )}
                  <div className="d-flex justify-content-around mt-3">
                    <div className="text-center">
                      <Button
                        variant="primary"
                        className="btn-sm p-0"
                        onClick={() => handleEmployee(employee.id)}
                        title="Show More"
                      >
                        <ClockHistory size={24} />
                      </Button>
                      <div>Show Hours</div>
                    </div>
                    {employee.current_session_status === "Trwa" && (
                      <div className="text-center">
                        <Button
                          variant="danger"
                          className="btn-sm p-0"
                          onClick={() => {
                            setSelectedSessionId(employee.current_session_id);
                            setShowModal(true);
                          }}
                          title="End Session"
                        >
                          <Power size={24} />
                        </Button>
                        <div>End Session</div>
                      </div>
                    )}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
      </Row>

      <ConfirmModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={handleEndSession}
      >
        Are you sure you want to end this session?
      </ConfirmModal>
    </Container>
  );
};

export default EmployeeList;
