import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Container, Col, Row, Button, Form, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { AxiosError } from "axios";
import useActiveSession from "../hooks/useActiveSession";

interface FieldErrors {
  email?: string[];
  password?: string[];
  general?: string[];
}

interface ErrorResponse {
  email?: string[];
  password?: string[];
  general?: string[];
}


const LoginComponent: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const activeSession = useActiveSession();

  useEffect(() => {
    if (activeSession) {
      navigate("/");
    }
  }, [activeSession, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: undefined }));
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    try {
      const response = await api.post("/api/token/", { email, password });
      const { access, refresh, user_id, profile_id } = response.data;
      if (access && refresh && user_id && profile_id) {
        const expiresIn = 24 * 60 * 60 * 1000;
        const expiresAt = new Date().getTime() + expiresIn;
        login(access, refresh, user_id, profile_id, expiresAt);
        navigate("/");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response && axiosError.response.data) {
        setErrors(axiosError.response.data);
      } else {
        setErrors({ general: ["Nie udało się zalogować. Sprawdź swoje dane logowania."] });
      }
    }
  };
  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">Logowanie</h2>
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="email" className="mb-2">
              <Form.Control
                type="email"
                placeholder="Adres email"
                name="email"
                value={email}
                onChange={handleChange}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.join(", ")}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Control
                type="password"
                placeholder="Hasło"
                name="password"
                value={password}
                onChange={handleChange}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.join(", ")}
              </Form.Control.Feedback>
            </Form.Group>

            {errors.general && (
              <Alert variant="danger">
                {errors.general.join(", ")}
              </Alert>
            )}

            <div className="d-flex justify-content-between align-items-center mt-4">
              <Button variant="primary" type="submit">Zaloguj</Button>
              <Link to="/register" className="ml-auto">Zarejestruj się</Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginComponent;
