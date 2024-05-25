import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Container, Col, Row, Button, Form, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { AxiosError } from "axios";
import { useUserProfile } from "../context/UserProfileContext";

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
  const { setProfile } = useUserProfile();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const loadUserProfile = async (profileId: string) => {
    try {
      const response = await api.get(`/profile/${profileId}/`);
      setProfile(response.data); // Aktualizacja kontekstu profilu
    } catch (error) {
      console.error("Failed to load user profile:", error);
    }
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    try {
      const response = await api.post("/api/token/", { email, password });
      const { access, refresh, user_id, profile_id } = response.data;
      if (access && refresh && user_id && profile_id) {
        login(
          access,
          refresh,
          user_id,
          profile_id,
          new Date().getTime() + 86400000
        );
        await loadUserProfile(profile_id); // Ładowanie profilu
        navigate("/");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response && axiosError.response.data) {
        setErrors(axiosError.response.data);
      } else {
        setErrors({
          general: ["Failed to log in. Please check your login details."],
        });
      }
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">Log in</h2>
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="email" className="mb-2">
              <Form.Control
                type="email"
                placeholder="E-mail"
                name="email"
                value={email}
                onChange={handleChange}
                isInvalid={!!errors.email}
              />
              {errors.email && (
                <Alert variant="warning" className="mt-2">
                  {errors.email.join(", ")}
                </Alert>
              )}
            </Form.Group>

            <Form.Group controlId="password" className="mb-2">
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={handleChange}
                isInvalid={!!errors.password}
              />
              {errors.password && (
                <Alert variant="warning" className="mt-2">
                  {errors.password.join(", ")}
                </Alert>
              )}
            </Form.Group>
            {errors.general && (
              <Alert variant="danger">{errors.general.join(", ")}</Alert>
            )}

            <div className="d-flex justify-content-between align-items-center mt-4">
              <Button variant="primary" type="submit">
                Log in
              </Button>
              <Link to="/register" className="ml-auto">
                Sign up
              </Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginComponent;
