// BackButton.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Row, Col } from "react-bootstrap";
import { ChevronLeft } from "react-bootstrap-icons"; // Zmiana ikony na ChevronLeft

interface BackButtonProps {
  backPath: string; // Ścieżka, do której ma kierować przycisk
}

const BackButton: React.FC<BackButtonProps> = ({ backPath }) => {
  const navigate = useNavigate();

  return (
    <Row className="justify-content-center my-3">
      <Col md={6}>
        <Button
          onClick={() => navigate(backPath)}
          variant="link"
          className="p-0 border-0 bg-transparent mb-3"
        >
          <ChevronLeft size={30} className="text-secondary"/> {/* Możesz dostosować rozmiar ikony */}
        </Button>
      </Col>
    </Row>
  );
};

export default BackButton;
