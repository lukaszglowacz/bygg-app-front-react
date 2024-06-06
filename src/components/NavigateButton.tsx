import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { ChevronLeft } from "react-bootstrap-icons"; // Zmiana ikony na ChevronLeft

interface BackButtonProps {
  backPath: string; // Ścieżka, do której ma kierować przycisk
}

const BackButton: React.FC<BackButtonProps> = ({ backPath }) => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate(backPath)}
      variant="link"
      className="p-0 border-0 bg-transparent m-0"
    >
      <ChevronLeft size={30} className="text-secondary" />{" "}
    </Button>
  );
};

export default BackButton;
