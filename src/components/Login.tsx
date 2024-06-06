import React, { useState, FormEvent, ChangeEvent } from "react";
import {
  Container,
  Col,
  Row,
  Button,
  Form,
  Alert,
  InputGroup,
} from "react-bootstrap";
import { EnvelopeFill, LockFill } from "react-bootstrap-icons";
import { EyeFill, EyeSlashFill, BoxArrowInRight } from "react-bootstrap-icons"; // Dodajemy ikony oka
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { AxiosError } from "axios";
import { useUserProfile } from "../context/UserProfileContext";
import ToastNotification from "./ToastNotification";

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
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false); // Stan do zarządzania widocznością hasła
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
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
        setToastMessage("Login successful.");
        navigate("/", {
          state: { showToast: true, toastMessage: "Login successful." },
        });
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

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6} className="mx-auto">
          <h2 className="text-center mb-4">Log In</h2>
          {errors.general &&
            errors.general.map((error, index) => (
              <Alert key={index} variant="danger">
                {error}
              </Alert>
            ))}
          <Form onSubmit={handleLogin} className="mt-3">
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
                {errors.email &&
                  errors.email.map((err, index) => (
                    <Alert key={index} variant="warning" className="mt-2 w-100">
                      {err}
                    </Alert>
                  ))}
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="password" className="mb-3">
              <InputGroup>
                <InputGroup.Text>
                  <LockFill />
                </InputGroup.Text>
                <Form.Control
                  type={passwordVisible ? "text" : "password"} // Przełączamy typ pola
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                />
                <InputGroup.Text
                  onClick={togglePasswordVisibility}
                  style={{ cursor: "pointer" }}
                >
                  {passwordVisible ? (
                    <EyeSlashFill size={20} />
                  ) : (
                    <EyeFill size={20} />
                  )}
                </InputGroup.Text>
                {errors.password &&
                  errors.password.map((err, index) => (
                    <Alert key={index} variant="warning" className="mt-2 w-100">
                      {err}
                    </Alert>
                  ))}
              </InputGroup>
            </Form.Group>
            <div className="text-center mb-3">
              <Button
                variant="success"
                className="btn-sm p-0"
                type="submit"
                title="Log In"
              >
                <BoxArrowInRight size={36} />
              </Button>
              <div>Log In</div>
            </div>
            <div className="text-center mt-2">
              <p style={{ fontSize: "0.9em" }}>
                Don't have an account?{" "}
                <Link to="/register" style={{ textDecoration: "underline" }}>
                  Sign Up here
                </Link>
              </p>
              <p style={{ fontSize: "0.9em" }}>
                Forgot your password?{" "}
                <Link
                  to="/reset-password"
                  style={{ textDecoration: "underline" }}
                >
                  Reset it here
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

export default LoginComponent;
