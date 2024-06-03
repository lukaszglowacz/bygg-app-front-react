import React, { useState, FormEvent, ChangeEvent } from "react";
import { Container, Col, Row, Button, Form, Alert, InputGroup } from "react-bootstrap";
import { EnvelopeFill } from "react-bootstrap-icons";
import api from "../api/api";
import ToastNotification from "./ToastNotification";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from 'axios';

interface FieldErrors {
  email?: string[];
  general?: string[];
}

interface ErrorResponse {
  email?: string[];
  general?: string[];
}

const ResetPasswordComponent: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setEmail(value);
  };

  const handleReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    try {
      await api.post("/password-reset/", { email });
      setToastMessage("Password reset email sent.");
      setShowToast(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000); // Przekierowanie po 3 sekundach
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response && axiosError.response.data) {
        setErrors(axiosError.response.data);
        if (axiosError.response.data.email) {
          setEmail(""); // Resetowanie pola email po błędnym adresie
        }
      } else {
        setErrors({
          general: ["Failed to send password reset email. Please try again later."],
        });
      }
    }
  };

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col md={6} className="mx-auto">
          <h2 className="text-center mb-4">Reset Password</h2>
          {errors.general && errors.general.map((error, index) => (
            <Alert key={index} variant="danger">{error}</Alert>
          ))}
          <Form onSubmit={handleReset} className="mt-3">
            <Form.Group controlId="email" className="mb-3">
              <InputGroup>
                <InputGroup.Text>
                  <EnvelopeFill />
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  placeholder="E-mail"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
                {errors.email && errors.email.map((err, index) => (
                  <Alert key={index} variant="warning" className="mt-2 w-100">{err}</Alert>
                ))}
              </InputGroup>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mb-2">
              Reset Password
            </Button>
            <div className="text-center mt-2">
              <p style={{ fontSize: "0.9em" }}>
                Remember your password?{" "}
                <Link to="/login" style={{ textDecoration: "underline" }}>
                  Log In here
                </Link>
              </p>
            </div>
          </Form>
        </Col>
      </Row>
      <ToastNotification
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        variant="dark"
      />
    </Container>
  );
};

export default ResetPasswordComponent;
