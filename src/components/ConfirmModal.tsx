import React from "react";
import { Modal, Button, Stack } from "react-bootstrap";

interface ConfirmModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  children: React.ReactNode;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  show,
  onHide,
  onConfirm,
  children,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Body className="text-center">{children}</Modal.Body>
      <Modal.Footer className="d-flex flex-column align-items-center">
        <Stack gap={2} className="w-100">
          <Button
            variant="success"
            className="w-100"
            onClick={onConfirm}
          >
            Yes
          </Button>
          <Button variant="outline-danger" className="w-100" onClick={onHide}>
            No
          </Button>
        </Stack>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
