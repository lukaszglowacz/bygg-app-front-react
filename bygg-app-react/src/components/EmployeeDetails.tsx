import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import { Employee } from "../api/interfaces/types";
import useGoBack from "../hooks/useGoBack";
import { Button, Image, Container, Row, Col } from "react-bootstrap";

const EmployeeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const goBack = useGoBack();

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await api.get<Employee>(`/employee/${id}`);
        setEmployee(response.data);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching employee details:", err);
        setError("Failed to fetch employee details");
        setLoading(false);
      }
    };

    if (id) fetchEmployeeDetails();
  }, [id]);

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
