import React, { useState } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { AxiosError } from "axios";

const LoginComponent: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { login } = useAuth(); // Use the useAuth hook
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    interface LoginResponse {
      access: string;
      refresh: string;
      user_id: string;
      detail?: string; // opcjonalne pole, które może pojawić się w odpowiedzi błędu
    }
    
    // Następnie użyj tego interfejsu w swoich wywołaniach API:
    try {
      const response = await api.post<LoginResponse>("/api/token/", { email, password });
    
      if (response.data.access && response.data.refresh && response.data.user_id) {
        const expiresIn = 24 * 60 * 60 * 1000; // 24 godziny w milisekundach
        const expiresAt = new Date().getTime() + expiresIn;
        login(response.data.access, response.data.refresh, response.data.user_id, expiresAt);
        navigate("/");
        setError("");
      } else {
        setError("Logowanie nieudane: brak identyfikatora użytkownika lub błędne dane.");
      }
    } catch (error) {
      const axiosError = error as AxiosError<LoginResponse>;
      if (axiosError.response && axiosError.response.data.detail) {
        setError(`Nie udało się zalogować. ${axiosError.response.data.detail}`);
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
              <p className="mt-3">
                Nie masz konta? <Link to="/register">Zarejestruj się</Link>.
              </p>
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
