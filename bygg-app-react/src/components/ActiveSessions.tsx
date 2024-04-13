// Plik: components/ActiveSessions.tsx
import React from 'react';
import { Container, Table, Alert } from 'react-bootstrap';
import useAllLiveSessions from '../hooks/useAllLiveSessions'; // Założenie, że hook znajduje się w odpowiednim katalogu
import { Session } from '../api/interfaces/types'; // Założenie, że typ Session jest zdefiniowany

const ActiveSessions: React.FC = () => {
    const sessions = useAllLiveSessions();

    if (sessions.length === 0) {
        return (
            <Container>
                <Alert variant="info">Brak aktywnych sesji.</Alert>
            </Container>
        );
    }

    return (
        <Container>
            <h1>Aktualnie pracuja</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Lp</th>
                        <th>Pracownik</th>
                        <th>Miejsce pracy</th>
                        <th>Czas rozpoczęcia</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {sessions.map((session: Session, index: number) => (
                        <tr key={session.id}>
                            <td>{index + 1}</td>
                            <td>{`${session.profile.first_name} ${session.profile.last_name}`}</td>
                            <td>{session.workplace.street} {session.workplace.street_number}, {session.workplace.postal_code} {session.workplace.city}</td> {/* Zakładamy, że to ID lub nazwa miejsca pracy */}
                            <td>{session.start_time}</td>
                            <td>{session.status}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default ActiveSessions;
