import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Col, Row } from "react-bootstrap";
import api from "../api/api";

const AddWorkPlace: React.FC = () => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const [workplace, setWorkplace] = useState({
    street: "",
    street_number: "",
    postal_code: "",
    city: "",
  });

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!workplace.street) {
      newErrors.street = "Ulica jest wymagana.";
    }
    if (!workplace.street_number.match(/^\d+$/)) {
      newErrors.street_number = "Numer ulicy musi być liczbą.";
    }
    if (!workplace.postal_code.match(/^\d{3}\s\d{2}$/)) {
      newErrors.postal_code = "Kod pocztowy musi być w formacie 'XXX XX'.";
    }
    if (!workplace.city) {
      newErrors.city = "Miasto jest wymagane.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWorkplace((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await api.post('/workplace/', workplace);
      alert("Miejsce pracy zostało dodane.");
      navigate("/work-places");
    } catch (error) {
      console.error("Wystąpił błąd podczas dodawania miejsca pracy: ", error);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            {/* Ulica */}
            <Form.Group className="mb-3">
              <Form.Label>Ulica</Form.Label>
              <Form.Control
                type="text"
                name="street"
                value={workplace.street}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Numer ulicy */}
            <Form.Group className="mb-3">
              <Form.Label>Numer ulicy</Form.Label>
              <Form.Control
                type="text"
                name="street_number"
                value={workplace.street_number}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Kod pocztowy */}
            <Form.Group className="mb-3">
              <Form.Label>Kod pocztowy</Form.Label>
              <Form.Control
                type="text"
                name="postal_code"
                value={workplace.postal_code}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Miasto */}
            <Form.Group className="mb-3">
              <Form.Label>Miasto</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={workplace.city}
                onChange={handleChange}
                required
              />
            </Form.Group>
            {Object.keys(errors).map((key) => (
              <Alert key={key} variant="danger">
                {errors[key]}
              </Alert>
            ))}

            <Button variant="primary" type="submit">
              Dodaj
            </Button>
            <Button variant="secondary" onClick={() => navigate("/work-places")} className="ml-2">
              Powrót
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddWorkPlace;
