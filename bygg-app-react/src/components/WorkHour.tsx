import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

interface Profile {
  id: number;
  full_name: string;
  personnummer: string;
}

interface Workplace {
  id: number;
  street: string;
  street_number: string;
  postal_code: string;
  city: string;
}

interface WorkSession {
  id: number;
  profile: Profile;
  workplace: Workplace;
  start_time: string;
  end_time: string;
  total_time: string;
}

const WorkHour: React.FC = () => {
  const navigate = useNavigate();
  const [workSessions, setWorkSessions] = useState<WorkSession[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkSessions = async () => {
      try {
        const response = await api.get<WorkSession[]>('/worksession/');
        setWorkSessions(response.data);
      } catch (error) {
        setError('Nie udało się załadować danych sesji pracy.');
        console.error(error);
      }
    };

    fetchWorkSessions();
  }, []);

  if (error) return <Alert variant="danger">Błąd: {error}</Alert>;
  if (!workSessions.length) return <Spinner animation="border" role="status"><span className="visually-hidden">Ładowanie...</span></Spinner>;

  return (
    <Container>
      <h1 className="my-4">Sesje pracy</h1>
      <Button variant="success" onClick={() => navigate('/add-work-hour')} className="mb-4">Dodaj</Button>
      <Row xs={1} md={2} lg={3} className="g-4">
        {workSessions.map((session) => (
          <Col key={session.id}>
            <Card>
              <Card.Header as="h5">Sesja #{session.id}</Card.Header>
              <Card.Body>
                <Card.Title>{session.profile.full_name}</Card.Title>
                <Card.Text>
                  Personnummer: {session.profile.personnummer}
                </Card.Text>
                <Card.Text>
                  Miejsce pracy: {`${session.workplace.street} ${session.workplace.street_number}, ${session.workplace.city}`}
                </Card.Text>
                <Card.Text>
                  Czas rozpoczęcia: {session.start_time}
                </Card.Text>
                <Card.Text>
                  Czas zakończenia: {session.end_time}
                </Card.Text>
                <Card.Text>
                  Łączny czas: {session.total_time}
                </Card.Text>
                <Button variant="primary" onClick={() => navigate(`/edit-work-hour/${session.id}`)}>Edytuj sesję</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default WorkHour;
