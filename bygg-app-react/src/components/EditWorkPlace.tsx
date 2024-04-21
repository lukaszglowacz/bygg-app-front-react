import React, { useState, useEffect, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Col, Row } from "react-bootstrap";
import api from "../api/api";
import { IWorkPlacesData } from "../api/interfaces/types";
import { deleteWorkPlace } from "../api/api";

const EditWorkPlace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const [workplace, setWorkplace] = useState<IWorkPlacesData>({
    id: 0,
    street: "",
    street_number: "",
    postal_code: "",
    city: "",
  });

  useEffect(() => {
    const fetchWorkPlace = async () => {
      try {
        const response = await api.get<IWorkPlacesData>(`/workplace/${id}/`);
        setWorkplace(response.data);
      } catch (error) {
        console.log("Nie udało się pobrać danych miejsca pracy.", error);
      }
    };

    if (id) {
      fetchWorkPlace();
    }
  }, [id]);

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

  const handleDeleteClick = async (id: number) => {
    if (window.confirm("Czy na pewno chcesz usunąć to miejsce pracy?")) {
      try {
        // Przykładowe wywołanie metody delete przy użyciu Axios
        await api.delete(`/workplace/${id}/`);
        alert("Miejsce pracy zostało usunięte.");
        navigate("/work-places");
      } catch (error) {
        console.error("Wystąpił błąd podczas usuwania miejsca pracy: ", error);
        alert("Nie udało się usunąć miejsca pracy.");
      }
    }
  };
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWorkplace((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await api.put(`/workplace/${id}/`, workplace);
      alert("Miejsce pracy zostało zaktualizowane.");
      navigate("/work-places");
    } catch (error) {
      console.error("Wystąpił błąd podczas aktualizacji miejsca pracy: ", error);
    }
  };

  return (
    <Container>
      <Row>
        <Col className="text-center">
          <h1>Edytuj miejsce pracy</h1>
        </Col>
      </Row>
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
                    name="street"
                    value={workplace.street}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.street}
                  />
                  <Form.Control.Feedback type="invalid">{errors.street}</Form.Control.Feedback>
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
                    name="street_number"
                    value={workplace.street_number}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.street_number}
                  />
                  <Form.Control.Feedback type="invalid">{errors.street_number}</Form.Control.Feedback>
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
                    name="postal_code"
                    value={workplace.postal_code}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.postal_code}
                  />
                  <Form.Control.Feedback type="invalid">{errors.postal_code}</Form.Control.Feedback>
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
                    name="city"
                    value={workplace.city}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.city}
                  />
                  <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                </div>
              </Col>
            </Form.Group>

            <Row className="mb-3">
              <Col md={6} className="mx-auto">
                <Button variant="primary" type="submit" className="w-100">
                  Edytuj
                </Button>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6} className="mx-auto">
                <Button variant="danger" onClick={() => handleDeleteClick(workplace.id)} className="w-100">
                  Usuń
                </Button>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6} className="mx-auto">
                <Button variant="outline-secondary" onClick={() => navigate("/work-places")} className="w-100">
                  Powrót
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditWorkPlace;
