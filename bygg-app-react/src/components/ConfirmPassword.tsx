import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import api from '../api/api';  // Zakładam, że ten plik istnieje i jest skonfigurowany
import ToastNotification from './ToastNotification';
import { AxiosError } from 'axios';
import { LockFill } from "react-bootstrap-icons";

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
  const [password, setPassword] = useState<string>('');
  const [confirm_password, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (name === 'password') setPassword(value);
    if (name === 'confirm_password') setConfirmPassword(value);
  };

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    const regex_password = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (password.length < 8) {
      errors.push("The password must contain at least 8 characters.");
    }
    if (!regex_password.test(password)) {
      errors.push("The password must contain at least one uppercase letter, one number, and one special character.");
    }

    return errors;
  };

  const handleReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setErrors({ password: passwordErrors });
      return;
    }

    if (password !== confirm_password) {
      setErrors({ confirm_password: ['Passwords do not match'] });
      return;
    }

    try {
      await api.post(`/password-reset/confirm/${uidb64}/${token}/`, { password, confirm_password });
      setToastMessage('Password has been reset successfully.');
      setShowToast(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response && axiosError.response.data) {
        setErrors(axiosError.response.data);
      } else {
        setErrors({
          general: ['Failed to reset password. Please try again later.'],
        });
      }
    }
  };

  return (
    <Container className="my-4">
      <Form onSubmit={handleReset} className="mt-3">
        <Form.Group controlId="password" className="mb-3">
          <InputGroup>
            <InputGroup.Text>
              <LockFill />
            </InputGroup.Text>
            <Form.Control
              type="password"
              placeholder="New Password"
              name="password"
              value={password}
              onChange={handleChange}
              isInvalid={!!errors.password}
            />
          </InputGroup>
          {errors.password?.map((err, index) => (
            <Alert key={index} variant="warning" className="mt-2 w-100">{err}</Alert>
          ))}
        </Form.Group>

        <Form.Group controlId="confirm_password" className="mb-3">
          <InputGroup>
            <InputGroup.Text>
              <LockFill />
            </InputGroup.Text>
            <Form.Control
              type="password"
              placeholder="Confirm New Password"
              name="confirm_password"
              value={confirm_password}
              onChange={handleChange}
              isInvalid={!!errors.confirm_password}
            />
          </InputGroup>
          {errors.confirm_password?.map((err, index) => (
            <Alert key={index} variant="warning" className="mt-2 w-100">{err}</Alert>
          ))}
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100 mb-2">
          Reset Password
        </Button>
      </Form>
      {errors.general && errors.general.map((error, index) => (
        <Alert key={index} variant="danger">{error}</Alert>
      ))}
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
