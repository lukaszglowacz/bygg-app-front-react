import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import api from '../api/api';
import useGoBack from '../hooks/useGoBack';

interface WorkTimeData {
    user_first_name: string;
    user_last_name: string;
    user_personnummer: string;
    workplace_detail: string;
    start_time: string;
    end_time: string;
    total_time: string;
    id: string;
}

const fetchData = async (id: string): Promise<WorkTimeData> => {
    try {
        const response = await api.get<WorkTimeData>(`/worksession/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch data');
    }
};

const updateData = async (id: string, data: WorkTimeData): Promise<void> => {
    try {
        await api.put(`/worksession/${id}`, data);
    } catch (error) {
        throw new Error('Failed to update data');
    }
};

const EditWorkHour: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const [workTime, setWorkTime] = useState<WorkTimeData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const goBack = useGoBack()

    useEffect(() => {
        if (id) {
            fetchData(id)
                .then(setWorkTime)
                .catch(() => setError('Nie udało się załadować danych.'));
        }
    }, [id]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setWorkTime(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (workTime) {
            try {
                await updateData(workTime.id, workTime);
                navigate('/success-page');
            } catch {
                setError('Nie udało się zaktualizować danych.');
            }
        }
    };

    if (!workTime) return <div>Loading...</div>;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container>
            <h1>Edytuj Rekord Pracy</h1>
            <Form onSubmit={handleSubmit}>
                {/* Formularz edycji danych */}
                <Form.Group>
                    <Form.Label>Imię</Form.Label>
                    <Form.Control type="text" name="user_first_name" value={workTime?.user_first_name || ''} onChange={handleChange} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Nazwisko</Form.Label>
                    <Form.Control type="text" name="user_last_name" value={workTime?.user_last_name || ''} onChange={handleChange} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Personnummer</Form.Label>
                    <Form.Control type="text" name="user_personnummer" value={workTime?.user_personnummer || ''} onChange={handleChange} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Miejsce pracy</Form.Label>
                    <Form.Control type="text" name="workplace_detail" value={workTime?.workplace_detail || ''} onChange={handleChange} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Czas rozpoczęcia</Form.Label>
                    <Form.Control type="text" name="start_time" value={workTime?.start_time || ''} onChange={handleChange} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Czas zakończenia</Form.Label>
                    <Form.Control type="text" name="end_time" value={workTime?.end_time || ''} onChange={handleChange} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Całkowity czas pracy</Form.Label>
                    <Form.Control type="text" name="total_time" value={workTime?.total_time || ''} onChange={handleChange} />
                </Form.Group>
                <Button variant="primary" type="submit">Zapisz zmiany</Button>
                <Button variant="danger" onClick={goBack}>Wroc</Button>
            </Form>
        </Container>
    );
};

export default EditWorkHour;
