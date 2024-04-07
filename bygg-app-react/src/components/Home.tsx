import React, { useState, useEffect } from 'react';
import { Button, Form, Alert, Container, Row, Col } from 'react-bootstrap';
import api from '../api/api';
import { useAuth } from '../context/AuthContext'; // Załóżmy, że ścieżka do kontekstu to '../context/AuthContext'

interface Workplace {
    id: number;
    street: string;
    street_number: string;
    postal_code: string;
    city: string;
}

interface Session {
    id: number;
    user: number;
    workplace: number;
    start_time: string;
    status: string;
}

const Home: React.FC = () => {
    const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
    const [selectedWorkplaceId, setSelectedWorkplaceId] = useState<number>(-1);
    const [session, setSession] = useState<Session | null>(null);
    const [alertInfo, setAlertInfo] = useState<string>('');

    const { userId } = useAuth(); // Pobranie userId z kontekstu

    useEffect(() => {
        const fetchWorkplaces = async () => {
            try {
                const response = await api.get('/workplace/');
                setWorkplaces(response.data);
            } catch (error) {
                console.error('Error fetching workplaces', error);
                setAlertInfo('Failed to fetch workplaces.');
            }
        };
        fetchWorkplaces();
    }, []);

    const handleStartSession = async () => {
        if (selectedWorkplaceId === -1 || !userId) {
            setAlertInfo('Please select a workplace and ensure you are logged in!');
            return;
        }
        try {
            const response = await api.post('/livesession/start/', { workplace: selectedWorkplaceId, user: userId });
            setSession({ id: response.data.id, user: parseInt(userId), workplace: selectedWorkplaceId, start_time: response.data.start_time, status: 'Active' });
            setAlertInfo('Session started successfully.');
        } catch (error) {
            console.error('Error starting session', error);
            setAlertInfo('Failed to start session.');
        }
    };

    const handleEndSession = async () => {
        if (!session || !session.id) {
            setAlertInfo('No active session to end!');
            return;
        }
        try {
            // Przygotowanie danych do wysłania
            const requestData = {
                user: session.user,         // ID użytkownika z sesji
                workplace: session.workplace // ID miejsca pracy z sesji
            };
    
            await api.put(`/livesession/end/${session.id}/`, requestData);
            setSession(null); // Resetowanie sesji po jej zakończeniu
            setAlertInfo('Session ended successfully.');
        } catch (error) {
            console.error('Error ending session', error);
            setAlertInfo('Failed to end session.');
        }
    };
    

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md={6}>
                    {alertInfo && <Alert variant="info">{alertInfo}</Alert>}
                    <Form.Group controlId="workplaceSelect">
                        <Form.Label>Select Workplace</Form.Label>
                        <Form.Control as="select" value={selectedWorkplaceId.toString()} onChange={e => setSelectedWorkplaceId(parseInt(e.target.value))}>
                            <option value="-1">Choose...</option>
                            {workplaces.map(workplace => (
                                <option key={workplace.id} value={workplace.id}>
                                    {`${workplace.street} ${workplace.street_number}, ${workplace.postal_code} ${workplace.city}`}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <div className="d-grid gap-2">
                        <Button variant="primary" onClick={handleStartSession}>Start</Button>
                        <Button variant="secondary" onClick={handleEndSession} disabled={!session || session.status !== 'Active'}>End</Button>
                    </div>
                    <Alert variant="success" className="mt-3">Session Status: {session ? `${session.status} since ${session.start_time}` : 'No active session'}</Alert>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;
