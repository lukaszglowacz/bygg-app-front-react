import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import api from "../api/api"; // Import konfiguracji API
import { AxiosError } from "axios";

interface WorkSession {
  id: number;
  profile: Profile;
  workplace: Workplace;
  start_time: string;
  end_time: string;
  total_time: string;
}

interface Profile {
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
}

interface Workplace {
  id: number;
  street: string;
  street_number: string;
  postal_code: string;
  city: string;
}

const EditWorkHour: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<WorkSession | null>(null);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionRes = await api.get<WorkSession>(`/worksession/${id}`);
        setSession(sessionRes.data);
      } catch (error) {
        const axiosError = error as AxiosError<{ detail?: string }>;
        if (axiosError.response?.data.detail) {
          setError(axiosError.response.data.detail);
        } else {
          setError("Failed to fetch data");
        }
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Data submission logic can be adjusted here if needed
    navigate("/work-hours"); // Redirect after submit, if desired
  };

  if (!session) return <div>Loading...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container>
      <h1>Work Session Details</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Employee Full Name</Form.Label>
          <Form.Control type="text" value={session.profile.full_name} readOnly />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Workplace Address</Form.Label>
          <Form.Control
            type="text"
            value={`${session.workplace.street} ${session.workplace.street_number}, ${session.workplace.city}`}
            readOnly
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Start Time</Form.Label>
          <Form.Control type="text" value={session.start_time} readOnly />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>End Time</Form.Label>
          <Form.Control type="text" value={session.end_time} readOnly />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Total Time Worked</Form.Label>
          <Form.Control type="text" value={session.total_time} readOnly />
        </Form.Group>
        <Button variant="primary" type="submit">
          Back to List
        </Button>
      </Form>
    </Container>
  );
};

export default EditWorkHour;
