import React, { useState } from "react";
import { Button, Container, Form, Row, Col, Alert } from "react-bootstrap";
import { useProfileData } from "../hooks/useProfileData";
import { useWorkPlaceData } from "../hooks/useWorkplaceData";
import api from "../api/api";
import axios, { AxiosError } from "axios";

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    const profileId = Number(selectedProfile);
    const workplaceId = Number(selectedWorkplace);

    if (!profileId || !workplaceId) {
      setError("Nieprawidłowy profil użytkownika lub miejsce pracy.");
      setSubmitting(false);
      return;
    }

    try {
      // Przygotowanie danych do wysłania zgodnie z oczekiwanym formatem
      const postData = {
        user: profileId, // 'profileId' powinno być ID użytkownika, a nie profilu, jeśli to ma być zgodne z modelem `WorkSession`
        workplace: workplaceId,
        start_time: startTime,
        end_time: endTime,
      };
      

      console.log(postData); // Dla celów debugowania

      await api.post("/worksession/", postData);
      setSuccess("Sesja pracy została pomyślnie dodana.");
      // Resetowanie stanu formularza
      setSelectedProfile("");
      setSelectedWorkplace("");
      setStartTime("");
      setEndTime("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Błąd przy wysyłaniu danych:", error.response?.data);
        setError("Wystąpił błąd: " + (error.response?.data as any).message);
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
                    {workplace.street} {workplace.street_number},{" "}
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
