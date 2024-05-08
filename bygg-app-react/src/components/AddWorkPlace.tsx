import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import api from "../api/api";

const AddWorkPlace: React.FC = () => {
  const [workplace, setWorkplace] = useState({
    street: "",
    street_number: "",
    postal_code: "",
    city: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const validate = () => {
    let newErrors = {};
    if (!workplace.street) newErrors = { ...newErrors, street: "Ulica jest wymagana." };
    if (!workplace.street_number.match(/^\d+$/)) newErrors = { ...newErrors, street_number: "Numer ulicy musi być liczbą." };
    if (!workplace.postal_code.match(/^\d{3}\s\d{2}$/)) newErrors = { ...newErrors, postal_code: "Kod pocztowy musi być w formacie 'XXX XX'." };
    if (!workplace.city) newErrors = { ...newErrors, city: "Miasto jest wymagane." };

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
      await api.post("/workplace/", workplace);
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
            <Form.Group as={Row} className="mb-3" controlId="streetInput">
              <Col md={6} className="mx-auto">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text"><i className="bi bi-signpost-2"></i></span>
                  </div>
                  <Form.Control
                    type="text"
                    placeholder="Ulica"
                    name="street"
                    value={workplace.street}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.street}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.street}
                  </Form.Control.Feedback>
                </div>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="streetNumberInput">
              <Col md={6} className="mx-auto">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text"><i className="bi bi-hash"></i></span>
                  </div>
                  <Form.Control
                    type="text"
                    placeholder="Numer"
                    name="street_number"
                    value={workplace.street_number}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.street_number}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.street_number}
                  </Form.Control.Feedback>
                </div>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="postalCodeInput">
              <Col md={6} className="mx-auto">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                  </div>
                  <Form.Control
                    type="text"
                    placeholder="Kod pocztowy"
                    name="postal_code"
                    value={workplace.postal_code}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.postal_code}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.postal_code}
                  </Form.Control.Feedback>
                </div>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="cityInput">
              <Col md={6} className="mx-auto">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text"><i className="bi bi-building"></i></span>
                  </div>
                  <Form.Control
                    type="text"
                    placeholder="Miasto"
                    name="city"
                    value={workplace.city}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.city}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.city}
                  </Form.Control.Feedback>
                </div>
              </Col>
            </Form.Group>

            <Row className="mb-3 mt-5">
              <Col md={6} className="mx-auto">
                <Button variant="success" type="submit" className="w-100" size="sm">
                  Dodaj
                </Button>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6} className="mx-auto">
                <Button variant="outline-secondary" onClick={() => navigate("/work-places")} className="w-100" size="sm">
                  Powrot
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddWorkPlace;
