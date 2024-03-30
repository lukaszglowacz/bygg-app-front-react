import React, { useState, FormEvent } from "react";
import { Button, Form, Container, Col, Row, Alert } from "react-bootstrap";
import { addWorkPlace } from "../api/api";
import { IAddWorkPlaceData } from "../api/interfaces/types";

const AddWorkPlace: React.FC = () => {
  const [street, setStreet] = useState<string>("");
  const [streetNumber, setStreetNumber] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!street) {
      newErrors.street = "Ulica jest wymagana.";
    }
    if (!streetNumber.match(/^\d+$/)) {
      newErrors.streetNumber = "Numer ulicy musi być liczbą.";
    }
    if (!postalCode.match(/^\d{3}\s\d{2}$/)) {
      newErrors.postalCode = "Kod pocztowy musi być w formacie 'XXX XX'.";
    }
    if (!city) {
      newErrors.city = "Miasto jest wymagane.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const workPlaceData: IAddWorkPlaceData = {
      street,
      street_number: streetNumber,
      postal_code: postalCode,
      city,
    };

    try {
      await addWorkPlace(workPlaceData);
      setStreet("");
      setStreetNumber("");
      setPostalCode("");
      setCity("");
      setErrors({});
      alert("Miejsce pracy zostało dodane.");
    } catch (error) {
      alert("Wystąpił błąd podczas dodawania miejsca pracy.");
      console.error(error);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            <h1>Dodaj miejsce pracy</h1>
            <Form.Group className="mb-3" controlId="formStreet">
              <Form.Label>Ulica</Form.Label>
              <Form.Control
                type="text"
                placeholder="Wpisz ulicę"
                value={street}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setStreet(e.target.value)
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formStreetNumber">
              <Form.Label>Numer ulicy</Form.Label>
              <Form.Control
                type="text"
                placeholder="Wpisz numer ulicy"
                value={streetNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setStreetNumber(e.target.value)
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPostalCode">
              <Form.Label>Kod pocztowy</Form.Label>
              <Form.Control
                type="text"
                placeholder="Wpisz kod pocztowy"
                value={postalCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPostalCode(e.target.value)
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCity">
              <Form.Label>Miasto</Form.Label>
              <Form.Control
                type="text"
                placeholder="Wpisz miasto"
                value={city}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCity(e.target.value)
                }
              />
            </Form.Group>
            <Button variant="success" type="submit">
              Dodaj
            </Button>
            {errors.street && <Alert variant="danger">{errors.street}</Alert>}
            {errors.streetNumber && <Alert variant="danger">{errors.streetNumber}</Alert>}
            {errors.postalCode && <Alert variant="danger">{errors.postalCode}</Alert>}
            {errors.city && <Alert variant="danger">{errors.city}</Alert>}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddWorkPlace;
