import React from "react";
import { Modal, Button } from "react-bootstrap";
import { CheckSquareFill, XSquareFill } from "react-bootstrap-icons";

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
      <Modal.Footer>
        <div className="d-flex justify-content-around mt-3 w-100">
          <div className="text-center">
            <Button
              variant="outline-success"
              className="btn-sm p-0"
              onClick={onConfirm}
              title="Yes"
            >
              <CheckSquareFill size={24} />
            </Button>
            <div>Yes</div>
          </div>
          <div className="text-center">
            <Button
              variant="outline-danger"
              className="btn-sm p-0"
              onClick={onHide}
              title="No"
            >
              <XSquareFill size={24} />
            </Button>
            <div>No</div>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
