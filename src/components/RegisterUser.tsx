import React, { useState, ChangeEvent } from "react";
import {
  Container,
  Form,
  Row,
  Col,
  Alert,
  InputGroup,
} from "react-bootstrap";
import {
  EnvelopeFill,
  LockFill,
  PersonFill,
  CalendarFill,
  PersonPlusFill,
} from "react-bootstrap-icons";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons"; // Dodajemy ikony oka
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import ToastNotification from "./ToastNotification";
import LoadingButton from "./LoadingButton";

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
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false); // Stan do zarządzania widocznością hasła
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof FieldErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateForm = () => {
    const newErrors: FieldErrors = {};
    if (!formData.email) {
      newErrors.email = ["Email is required."];
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = ["Invalid email address."];
    }

    if (!formData.password) {
      newErrors.password = ["Password is required."];
    }

    if (!formData.first_name) {
      newErrors.first_name = ["First name is required."];
    }

    if (!formData.last_name) {
      newErrors.last_name = ["Last name is required."];
    }

    if (!formData.personnummer) {
      newErrors.personnummer = ["Personnummer is required."];
    } else if (!/^\d{6}-\d{4}$/.test(formData.personnummer)) {
      newErrors.personnummer = ["Personnummer must be in format YYMMDD-XXXX."];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      const response = await api.post("/register/", formData);
      if (response.status === 201) {
        setToastMessage("Registration successful.");
        setShowToast(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000); // Opóźnienie 3 sekundy przed przekierowaniem
      } else {
        throw new Error("Unsuccessful registration attempt");
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setErrors(error.response.data);
      } else {
        setErrors({
          general: [
            "Registration failed. Please check your details and try again.",
          ],
        });
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <h2 className="mb-3 text-center">Sign Up</h2>
          {errors.general &&
            errors.general.map((error, index) => (
              <Alert key={index} variant="danger">
                {error}
              </Alert>
            ))}
          <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="mt-3">
            <Form.Group className="mb-3">
              <InputGroup>
                <InputGroup.Text>
                  <EnvelopeFill />
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
              </InputGroup>
              {errors.email?.map((err, index) => (
                <Alert key={index} variant="warning" className="mt-2 w-100">
                  {err}
                </Alert>
              ))}
            </Form.Group>

            <Form.Group className="mb-3">
              <InputGroup>
                <InputGroup.Text>
                  <LockFill />
                </InputGroup.Text>
                <Form.Control
                  type={passwordVisible ? "text" : "password"} // Przełączamy typ pola
                  placeholder="Password"
                  name="password"
                  value={formData.password}
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
              </InputGroup>
              {errors.password?.map((err, index) => (
                <Alert key={index} variant="warning" className="mt-2 w-100">
                  {err}
                </Alert>
              ))}
            </Form.Group>

            <Form.Group className="mb-3">
              <InputGroup>
                <InputGroup.Text>
                  <PersonFill />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="First name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  isInvalid={!!errors.first_name}
                />
              </InputGroup>
              {errors.first_name?.map((err, index) => (
                <Alert key={index} variant="warning" className="mt-2 w-100">
                  {err}
                </Alert>
              ))}
            </Form.Group>

            <Form.Group className="mb-3">
              <InputGroup>
                <InputGroup.Text>
                  <PersonFill />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Last name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  isInvalid={!!errors.last_name}
                />
              </InputGroup>
              {errors.last_name?.map((err, index) => (
                <Alert key={index} variant="warning" className="mt-2 w-100">
                  {err}
                </Alert>
              ))}
            </Form.Group>

            <Form.Group className="mb-3">
              <InputGroup>
                <InputGroup.Text>
                  <CalendarFill />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Personnummer (YYMMDD-XXXX)"
                  name="personnummer"
                  value={formData.personnummer}
                  onChange={handleChange}
                  isInvalid={!!errors.personnummer}
                />
              </InputGroup>
              {errors.personnummer?.map((err, index) => (
                <Alert key={index} variant="warning" className="mt-2 w-100">
                  {err}
                </Alert>
              ))}
            </Form.Group>
            <div className="text-center mb-3">
              <LoadingButton
                variant="success"
                onClick={handleSubmit}
                icon={PersonPlusFill}
                title="Sign Up"
                size={36}
              />
              <div>Sign Up</div>
            </div>
            <div className="text-center mt-2">
              <p style={{ fontSize: "0.9em" }}>
                Already have an account?{" "}
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

export default RegisterUser;
