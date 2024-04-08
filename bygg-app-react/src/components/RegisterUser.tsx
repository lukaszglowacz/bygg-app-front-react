import React, { useState } from "react";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import api from "../api/api"; // Zakładam, że ten plik istnieje i jest skonfigurowany
import { useNavigate } from "react-router-dom";
import useGoBack from "../hooks/useGoBack";

interface RegistrationFormData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  personnummer: string;
}

const RegisterUser: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    personnummer: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const navigate = useNavigate();
  const goBack = useGoBack();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/register/", formData);
      if (response.status === 201) {
        setSuccess(
          "Rejestracja zakończona sukcesem. Możesz się teraz zalogować."
        );
        setFormData({
          email: "",
          password: "",
          first_name: "",
          last_name: "",
          personnummer: "",
        });
        setTimeout(() => navigate('/login'), 1000);
      } else {
        throw new Error('Nieudana proba rejestracji');
      }
    } catch (error) {
      setError(
        "Rejestracja nie powiodła się. Sprawdź dane i spróbuj ponownie."
      );
    }
  };

  return (
    <Container>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <h2>Rejestracja</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Wpisz email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Hasło</Form.Label>
              <Form.Control
                type="password"
                placeholder="Hasło"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formFirstName">
              <Form.Label>Imię</Form.Label>
              <Form.Control
                type="text"
                placeholder="Imię"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formLastName">
              <Form.Label>Nazwisko</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nazwisko"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPersonnummer">
              <Form.Label>Personnummer</Form.Label>
              <Form.Control
                type="text"
                placeholder="XXXXXX-XXXX"
                name="personnummer"
                value={formData.personnummer}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Zarejestruj się
            </Button>
            <Button variant="secondary" onClick={goBack} className="ml-2">
              Powrot
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterUser;
