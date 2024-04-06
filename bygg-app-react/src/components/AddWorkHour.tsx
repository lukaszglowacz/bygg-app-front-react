import React, { useState } from "react";
import { Button, Container, Form, Row, Col, Alert } from "react-bootstrap";
import { useProfileData } from "../hooks/useProfileData";
import { useWorkPlaceData } from "../hooks/useWorkplaceData";
import axios, { AxiosError } from "axios"; // Upewnij się, że zaimportowałeś AxiosError
import api from "../api/api";

const AddWorkHour: React.FC = () => {
  const [selectedProfile, setSelectedProfile] = useState<string>("");
  const [selectedWorkplace, setSelectedWorkplace] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const profiles = useProfileData();
  const workplaces = useWorkPlaceData();

  interface ErrorData {
    message: string;
    [key: string]: any; // Dla innych potencjalnych pól
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    const profile = profiles.find(p => p.id.toString() === selectedProfile);
    const user_id = profile ? profile.user_id : null; // Pobieranie user_id z profilu

    const workplaceId = Number(selectedWorkplace);

    if (!user_id || !workplaceId) {
      setError("Nieprawidłowy użytkownik lub miejsce pracy.");
      setSubmitting(false);
      return;
    }

    try {
      const postData = {
        user: user_id,
        workplace: workplaceId,
        start_time: startTime,
        end_time: endTime,
      };

      await api.post("/worksession/", postData);
      setSuccess("Sesja pracy została pomyślnie dodana.");
      setSelectedProfile("");
      setSelectedWorkplace("");
      setStartTime("");
      setEndTime("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
          const errorData = error.response.data as ErrorData;
          setError(`Wystąpił błąd: ${errorData.message || "Nieznany błąd"}`);
      } else {
          setError("Wystąpił nieoczekiwany błąd.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <Row>
        <Col md={8}>
          <h2>Dodaj sesję pracy</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Użytkownik</Form.Label>
              <Form.Select
                value={selectedProfile}
                onChange={(e) => setSelectedProfile(e.target.value)}
                required
              >
                <option value="">Wybierz użytkownika</option>
                {profiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.first_name} {profile.last_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Miejsce pracy</Form.Label>
              <Form.Select
                value={selectedWorkplace}
                onChange={(e) => setSelectedWorkplace(e.target.value)}
                required
              >
                <option value="">Wybierz miejsce pracy</option>
                {workplaces.map((workplace) => (
                  <option key={workplace.id} value={workplace.id}>
                    {workplace.street} {workplace.street_number},
                    {workplace.postal_code} {workplace.city}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Data rozpoczęcia</Form.Label>
              <Form.Control
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Data zakończenia</Form.Label>
              <Form.Control
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? "Dodawanie..." : "Dodaj"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddWorkHour;
