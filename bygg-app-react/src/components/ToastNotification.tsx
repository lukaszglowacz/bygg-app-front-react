// ToastNotification.tsx
import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

interface ToastNotificationProps {
  show: boolean;
  onClose: () => void;
  message: string;
  variant: 'success' | 'danger' | 'warning' | 'info' | 'dark';
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ show, onClose, message, variant }) => {
  return (
    <ToastContainer position="bottom-center" className="p-3">
      <Toast show={show} onClose={onClose} bg={variant} delay={3000} autohide>
        <Toast.Header>
          <strong className="me-auto">Notification</strong>
        </Toast.Header>
        <Toast.Body className={`text-${variant === 'dark' ? 'white' : 'dark'}`}>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastNotification;
