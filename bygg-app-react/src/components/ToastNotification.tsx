import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

interface ToastNotificationProps {
  show: boolean;
  onClose: () => void;
  message: string;
  variant: 'success' | 'danger' | 'warning' | 'info' | 'dark';
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ show, onClose, message, variant }) => {
  const textColor = variant === 'dark' ? 'text-light' : 'text-dark';

  return (
    <ToastContainer position="bottom-center" className="p-3">
      <Toast show={show} onClose={onClose} bg={variant} delay={3000} autohide>
        <Toast.Header>
          <strong className="me-auto">Notification</strong>
        </Toast.Header>
        <Toast.Body className={textColor}>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastNotification;
