import React, { useState } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { AxiosError } from "axios";

const LoginComponent: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { login } = useAuth(); // Użyj hooka useAuth
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/token/", {
        email,
        password,
      });

      login(response.data.access, response.data.refresh);
      navigate("/");

      setError(""); // Reset stanu błędu
    } catch (error) {
      const axiosError = error as AxiosError; // Typowanie błędu jako AxiosError
      if (axiosError.response) {
        const errorMessage = axiosError.response.data as { detail: string }; // Zakładamy, że 'data' ma pole 'detail' typu string
        setError(
          `Nie udało się zalogować. ${
            errorMessage.detail || "Sprawdź swoje dane logowania."
          }`
        );
      } else {
        setError("Nie udało się zalogować. Sprawdź swoje dane logowania.");
      }
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <div className="login-form">
            <h2>Logowanie</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email:
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Hasło:
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button variant="primary" type="submit">
                Zaloguj
              </Button>
            </form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginComponent;
