import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import api from '../api/api';
import { Employee, WorkSession } from '../api/interfaces/types';
import { Button, Image, Container, Row, Col, Card } from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import { FaDownload } from 'react-icons/fa';

const EmployeeDetailsByDay: React.FC = () => {
  const { id, date } = useParams<{ id: string; date: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [daySessions, setDaySessions] = useState<WorkSession[]>([]);
  const [totalTime, setTotalTime] = useState<string>('0 h, 0 min');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  useEffect(() => {
    fetchEmployeeDetailsByDay();
  }, [id, date]);

  const fetchEmployeeDetailsByDay = async () => {
    try {
      const response = await api.get<Employee>(`/employee/${id}/day/${date}`);
      setEmployee(response.data);
      setDaySessions(response.data.work_session);
      setTotalTime(response.data.total_time);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching employee day details:', err);
      setError('Failed to fetch employee day details');
      setLoading(false);
    }
  };

  const handleDayChange = (offset: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + offset);
    history.push(`/employee/${id}/${newDate.toISOString().split('T')[0]}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!employee) return <div>Brak znalezionego pracownika</div>;

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6} className="text-center">
          <Image src={employee?.image} roundedCircle fluid style={{ width: "200px", height: "200px", objectFit: "cover" }} />
        </Col>
      </Row>
      <Row className="justify-content-center mt-3">
        <Col md={6}>
          <Card className="text-center mt-4">
            <Card.Header as="h5" className="text-muted">Zestawienie dnia {date}</Card.Header>
            <Card.Body>
              {daySessions.map(session => (
                <Card.Text key={session.id} className="text-left">
                  <strong>Miejsce pracy:</strong> {session.workplace}
                  <br />
                  <strong>Rozpoczęcie:</strong> {session.start_time}
                  <br />
                  <strong>Zakończenie:</strong> {session.end_time}
                  <br />
                  <strong>Czas pracy:</strong> {session.total_time}
                </Card.Text>
              ))}
              <Card.Text>
                <strong>Suma godzin w dniu:</strong> {totalTime}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="justify-content-center mt-3">
        <Col md={6} className="text-center">
          <Button onClick={() => handleDayChange(-1)} variant="outline-secondary"><ChevronLeft /></Button>
          <Button onClick={() => handleDayChange(1)} variant="outline-secondary" className="ml-3"><ChevronRight /></Button>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={6} className="text-center">
          <Button onClick={() => history.goBack()} variant="outline-danger">Cofnij</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default EmployeeDetailsByDay;
