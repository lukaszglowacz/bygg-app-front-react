import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import api from "../api/api"; // Import konfiguracji API
import { AxiosError } from "axios";
import { format } from "date-fns";

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

interface ErrorData {
  detail: string;
}

interface ErrorResponse {
  data: ErrorData;
}

const EditWorkHour: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<WorkSession | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionRes = await api.get<WorkSession>(`/worksession/${id}`);
        const profilesRes = await api.get<Profile[]>("/profile");
        const workplacesRes = await api.get<Workplace[]>("/workplace");
        setSession(sessionRes.data);
        setProfiles(profilesRes.data);
        setWorkplaces(workplacesRes.data);
      } catch (error) {
        setError("Failed to fetch data");
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (session) {
      const formattedStart = format(
        new Date(session.start_time),
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      );
      const formattedEnd = format(
        new Date(session.end_time),
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      );

      const updateData = {
        profile_id: session.profile.id, // wysyłamy tylko ID profilu
        workplace_id: session.workplace.id, // wysyłamy tylko ID miejsca pracy
        start_time: formattedStart,
        end_time: formattedEnd,
      };

      try {
        await api.put(`/worksession/${id}`, updateData);
        navigate("/work-hours"); // Przekierowanie do listy sesji pracy po zapisie
      } catch (error: unknown) {
        const axiosError = error as AxiosError<{
          detail?: string;
          errors?: Record<string, string[]>;
        }>;
        if (axiosError.response) {
          // Logowanie całego obiektu błędu do konsoli
          console.error("Error Response:", axiosError.response);

          // Wydobycie konkretnego komunikatu błędu
          let errorMessage = "Failed to save changes due to server error.";
          if (axiosError.response.data.detail) {
            errorMessage = axiosError.response.data.detail;
          } else if (axiosError.response.data.errors) {
            // Może być wiele błędów, dołączamy je wszystkie
            const errorDetails = Object.entries(axiosError.response.data.errors)
              .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
              .join("; ");
            errorMessage = `Failed to save changes: ${errorDetails}`;
          }

          setError(errorMessage);
        } else {
          setError("Failed to save changes due to network error.");
        }
      }
    }
  };

  if (!session) return <div>Loading...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  const handleProfileChange = (profileId: string) => {
    const newProfile = profiles.find(
      (profile) => profile.id.toString() === profileId
    );
    if (newProfile && session) {
      setSession({ ...session, profile: newProfile });
    }
  };

  return (
    <Container>
      <h1>Edit Work Session</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Employee Full Name</Form.Label>
          <Form.Control
            as="select"
            value={session.profile.id.toString()}
            onChange={(e) => handleProfileChange(e.target.value)}
          >
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.full_name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Workplace</Form.Label>
          <Form.Control
            as="select"
            value={session.workplace.id.toString()}
            onChange={(e) => {
              const newWorkplace = workplaces.find(
                (wp) => wp.id.toString() === e.target.value
              )!; // Asserting non-null
              setSession((prev) => ({
                ...prev!,
                workplace: newWorkplace,
              }));
            }}
          >
            {workplaces.map((wp) => (
              <option key={wp.id} value={wp.id}>
                {`${wp.street} ${wp.street_number}, ${wp.city}`}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Start Time</Form.Label>
          <Form.Control
            type="datetime-local"
            value={session.start_time.slice(0, 16)} // Odcinamy zbędne części daty
            onChange={(e) =>
              setSession({
                ...session,
                start_time: new Date(e.target.value).toISOString(),
              })
            }
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>End Time</Form.Label>
          <Form.Control
            type="datetime-local"
            value={session.end_time.slice(0, 16)} // Odcinamy zbędne części daty
            onChange={(e) =>
              setSession({
                ...session,
                end_time: new Date(e.target.value).toISOString(),
              })
            }
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Total Time Worked</Form.Label>
          <Form.Control type="text" value={session.total_time} readOnly />
        </Form.Group>
        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </Form>
    </Container>
  );
};

export default EditWorkHour;
