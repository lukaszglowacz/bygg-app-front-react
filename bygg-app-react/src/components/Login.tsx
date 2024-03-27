import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Col, Row, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LoginComponent: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        email,
        password,
      });

      //Przechowywanie tokena dostepu i odswiezania w localStorage
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      navigate('/');
      
      //Reset stanu bledu
      setError("");

    } catch (err) {
      setError("Nie udalo sie zalogowac. Sprawdz swoje dane logowania");
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
