import React, { useState, ChangeEvent, FormEvent } from "react";
import { Container, Form, Button, Row, Col, Alert, FormGroup } from "react-bootstrap";
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

interface FieldErrors {
  email?: string[];
  password?: string[];
  first_name?: string[];
  last_name?: string[];
  personnummer?: string[];
  general?: string[];
}

const RegisterUser: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    personnummer: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const navigate = useNavigate();
  const goBack = useGoBack();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof FieldErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    try {
      const response = await api.post("/register/", formData);
      if (response.status === 201) {
        navigate('/login');
      } else {
        throw new Error('Nieudana próba rejestracji');
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: ["Rejestracja nie powiodła się. Sprawdź dane i spróbuj ponownie."] });
      }
    }
  };

  const placeholders = {
    email: "Adres email",
    password: "Hasło",
    first_name: "Imię",
    last_name: "Nazwisko",
    personnummer: "Numer PESEL (XXXXXX-XXXX)"
  };

  return (
    <Container className="my-4">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <h2 className="mb-3 text-center">Rejestracja</h2>
          {errors.general && errors.general.map((error, index) => (
            <Alert key={index} variant="danger">{error}</Alert>
          ))}
          <Form onSubmit={handleSubmit} className="mt-3">
            {Object.keys(formData).map((key) => (
              <FormGroup key={key} controlId={`form${key.charAt(0).toUpperCase() + key.slice(1)}`} className="mb-3">
                <Form.Control
                  type={key === "password" ? "password" : "text"}
                  placeholder={key.replace('_', ' ').charAt(0).toUpperCase() + key.replace('_', ' ').slice(1)}
                  name={key}
                  value={(formData as any)[key]}
                  onChange={handleChange}
                  isInvalid={!!errors[key as keyof FieldErrors]}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors[key as keyof FieldErrors]?.join(', ')}
                </Form.Control.Feedback>
              </FormGroup>
            ))}
            <div className="d-flex justify-content-between align-items-center mt-4">
              <Button variant="primary" type="submit">Zarejestruj się</Button>
              <Button variant="secondary" onClick={goBack} className="ml-auto">Powrót</Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterUser;