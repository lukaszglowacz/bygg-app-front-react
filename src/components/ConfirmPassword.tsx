import React, { useState, ChangeEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Form, Alert, InputGroup, Row, Col } from "react-bootstrap";
import api from "../api/api";
import ToastNotification from "./ToastNotification";
import { AxiosError } from "axios";
import {
  LockFill,
  KeyFill,
  EyeFill,
  EyeSlashFill,
} from "react-bootstrap-icons";
import LoadingButton from "./LoadingButton";

interface FieldErrors {
  password?: string[];
  confirm_password?: string[];
  general?: string[];
}

interface ErrorResponse {
  password?: string[];
  confirm_password?: string[];
  general?: string[];
}

const ConfirmPassword: React.FC = () => {
  const { uidb64, token } = useParams<{ uidb64: string; token: string }>();
  const [password, setPassword] = useState<string>("");
  const [confirm_password, setConfirmPassword] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] =
    useState<boolean>(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (name === "password") setPassword(value);
    if (name === "confirm_password") setConfirmPassword(value);
  };

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    const regex_password =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (password.length < 8) {
      errors.push("Password must have at least 8 characters");
    }
    if (!regex_password.test(password)) {
      errors.push(
        "Password must include an uppercase letter, a number, and a special character"
      );
    }

    return errors;
  };

  const handleReset = async () => {
    setErrors({});

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setErrors({ password: passwordErrors });
      return;
    }

    if (password !== confirm_password) {
      setErrors({ confirm_password: ["Passwords do not match"] });
      return;
    }

    try {
      await api.post(`/password-reset/confirm/${uidb64}/${token}/`, {
        password,
        confirm_password,
      });
      setToastMessage("Password has been reset successfully.");
      setShowToast(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response && axiosError.response.status === 400) {
        setErrors({
          general: ["Password reset link expired. Click here to reset again"],
        });
      } else if (axiosError.response && axiosError.response.data) {
        setErrors(axiosError.response.data);
      } else {
        setErrors({
          general: ["Failed to reset password. Try again later"],
        });
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6} className="mx-auto">
          <h2 className="text-center mb-4">Reset Password</h2>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleReset();
            }}
            className="mt-3"
          >
            <Form.Group controlId="password" className="mb-3">
              <InputGroup>
                <InputGroup.Text>
                  <LockFill />
                </InputGroup.Text>
                <Form.Control
                  type={passwordVisible ? "text" : "password"}
                  placeholder="New Password"
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
              </InputGroup>
              {errors.password?.map((err, index) => (
                <Alert key={index} variant="warning" className="mt-2 w-100 text-center">
                  {err}
                </Alert>
              ))}
            </Form.Group>

            <Form.Group controlId="confirm_password" className="mb-3">
              <InputGroup>
                <InputGroup.Text>
                  <LockFill />
                </InputGroup.Text>
                <Form.Control
                  type={confirmPasswordVisible ? "text" : "password"}
                  placeholder="Confirm New Password"
                  name="confirm_password"
                  value={confirm_password}
                  onChange={handleChange}
                  isInvalid={!!errors.confirm_password}
                />
                <InputGroup.Text
                  onClick={toggleConfirmPasswordVisibility}
                  style={{ cursor: "pointer" }}
                >
                  {confirmPasswordVisible ? (
                    <EyeSlashFill size={20} />
                  ) : (
                    <EyeFill size={20} />
                  )}
                </InputGroup.Text>
              </InputGroup>
              {errors.confirm_password?.map((err, index) => (
                <Alert key={index} variant="warning" className="mt-2 w-100 text-center">
                  {err}
                </Alert>
              ))}
            </Form.Group>
            <div className="text-center mb-3">
              <LoadingButton
                variant="success"
                onClick={handleReset}
                icon={KeyFill}
                title="Reset Password"
                size={36}
              />
              <div>Reset Password</div>
            </div>
            <div className="text-center mt-2">
              <p style={{ fontSize: "0.9em" }}>
                Remember your password?{" "}
                <Link to="/login" style={{ textDecoration: "underline" }}>
                  Log In here
                </Link>
              </p>
            </div>
          </Form>
          {errors.general && (
            <Alert variant="warning" className="text-center">
              Password reset link expired. Click{" "}
              <Link to="/reset-password">here</Link> to reset again
            </Alert>
          )}
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

export default ConfirmPassword;
