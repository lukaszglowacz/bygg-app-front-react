import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import api from '../api/api';
import useGoBack from '../hooks/useGoBack';
import { useWorkPlaceData } from '../hooks/useWorkplaceData';

interface IWorkTimeData {
    id: number;
    user: number;
    user_first_name: string;
    user_last_name: string;
    user_personnummer: string;
    workplace: number;
    workplace_detail: string;
    start_time: string;
    end_time: string;
    total_time: string;
}

const fetchData = async (id: string): Promise<IWorkTimeData> => {
    try {
        const response = await api.get<IWorkTimeData>(`/worksession/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch data');
    }
};

const updateData = async (id: string, data: IWorkTimeData): Promise<void> => {
    try {
        await api.put(`/worksession/${id}`, data);
        console.error('Błąd podczas aktualizacji danych:', Error);
    } catch (error) {
        throw new Error('Failed to update data');
    }
};

const EditWorkHour: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const [workTime, setWorkTime] = useState<IWorkTimeData | null>(null);
    const [selectedWorkplaceDetail, setSelectedWorkplaceDetail] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const goBack = useGoBack()
    const workplaces = useWorkPlaceData();

    useEffect(() => {
        if (id) {
            fetchData(id)
                .then((data) => {
                    setWorkTime(data);
                    setSelectedWorkplaceDetail(data.workplace_detail);
                })
                
                .catch(() => setError('Nie udało się załadować danych.'));
        }
    }, [id]);

    const handleChange: React.ChangeEventHandler<HTMLElement> = (e) => {
        const value = (e.target as HTMLSelectElement).value;
        setSelectedWorkplaceDetail(value);
    };
    

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (workTime) {
            try {
                await updateData(workTime.id.toString(), { ...workTime, workplace_detail: selectedWorkplaceDetail });
                navigate('/work-hours');
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
                    <Form.Control type="text" name="user_first_name" value={workTime?.user_first_name || ''} onChange={(e: ChangeEvent<HTMLInputElement>) => setWorkTime({...workTime, user_first_name: e.target.value })} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Nazwisko</Form.Label>
                    <Form.Control type="text" name="user_last_name" value={workTime?.user_last_name || ''} onChange={(e: ChangeEvent<HTMLInputElement>) => setWorkTime({...workTime, user_last_name: e.target.value })} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Personnummer</Form.Label>
                    <Form.Control type="text" name="user_personnummer" value={workTime?.user_personnummer || ''} onChange={(e: ChangeEvent<HTMLInputElement>) => setWorkTime({...workTime, user_personnummer: e.target.value })} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Miejsce pracy</Form.Label>
                    <Form.Control as="select" value={selectedWorkplaceDetail} onChange={handleChange}>
                        {workplaces.map((place) => (
                            <option key={place.id} value={place.id}>
                                {`${place.street} ${place.street_number}, ${place.postal_code} ${place.city}`}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Czas rozpoczęcia</Form.Label>
                    <Form.Control type="text" name="start_time" value={workTime?.start_time || ''} onChange={(e: ChangeEvent<HTMLInputElement>) => setWorkTime({...workTime, start_time: e.target.value })} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Czas zakończenia</Form.Label>
                    <Form.Control type="text" name="end_time" value={workTime?.end_time || ''} onChange={(e: ChangeEvent<HTMLInputElement>) => setWorkTime({...workTime, end_time: e.target.value })} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Całkowity czas pracy</Form.Label>
                    <Form.Control type="text" name="total_time" value={workTime?.total_time || ''} onChange={(e: ChangeEvent<HTMLInputElement>) => setWorkTime({...workTime, total_time: e.target.value })} />
                </Form.Group>
                <Button variant="primary" type="submit">Zapisz zmiany</Button>
                <Button variant="danger" onClick={goBack}>Wroc</Button>
            </Form>
        </Container>
    );
};

export default EditWorkHour;