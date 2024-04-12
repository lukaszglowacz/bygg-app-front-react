import React, { useState, useEffect } from 'react';
import { Table, Container, Alert, Button } from 'react-bootstrap';
import api from '../api/api'; // Twoje API
import { Link } from 'react-router-dom';

interface WorkSession {
  id: number;
  profile: {
    id: number;
    user_email: string;
    user_id: number;
    full_name: string;
    first_name: string;
    last_name: string;
    personnummer: string;
    created_at: string;
    updated_at: string;
    image: string;
  };
  workplace: {
    id: number;
    street: string;
    street_number: string;
    postal_code: string;
    city: string;
  };
  start_time: string;
  end_time: string;
  total_time: string;
}

const WorkHoursList: React.FC = () => {
  const [workSessions, setWorkSessions] = useState<WorkSession[]>([]);
  const [error, setError] = useState<string>('');

  const fetchWorkSessions = async () => {
    try {
      const response = await api.get<WorkSession[]>('/worksession/');
      setWorkSessions(response.data);
    } catch (error) {
      console.error('Failed to fetch work sessions', error);
      setError('Failed to load data. Please try again later.');
    }
  };

  useEffect(() => {
    fetchWorkSessions();
  }, []);

  return (
    <Container>
      <h2>Work Sessions List</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Employee</th>
            <th>Workplace</th>
            <th>Date</th>
            <th>Total Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {workSessions.map((session, index) => (
            <tr key={session.id}>
              <td>{index + 1}</td>
              <td>{session.profile.full_name}</td>
              <td>{`${session.workplace.street} ${session.workplace.street_number}, ${session.workplace.postal_code} ${session.workplace.city}`}</td>
              <td>{new Date(session.start_time).toLocaleDateString()}</td>
              <td>{session.total_time}</td>
              <td>
                <Link to={`/edit-work-hour/${session.id}`}>
                  <Button variant="outline-primary">Szczegóły</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default WorkHoursList;
