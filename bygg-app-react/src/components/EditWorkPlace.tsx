import React, { useState, useEffect, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Col, Row } from "react-bootstrap";
import api from "../api/api";
import { IWorkPlacesData } from "../api/interfaces/types"; // Zakładam, że ten interfejs jest już zdefiniowany
import { deleteWorkPlace } from "../api/api";
import useGoBack from "../hooks/useGoBack";

const EditWorkPlace: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Użycie generycznego typu bezpośrednio
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const goBack = useGoBack();

  const [workplace, setWorkplace] = useState<IWorkPlacesData>({
    id: 0, // początkowa wartość jako 0, ale zostanie zaktualizowana po pobraniu danych
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
        await deleteWorkPlace(id);
        alert("Miejsce pracy zostało usunięte.");
        navigate("/work-places"); // Odświeżenie listy może być potrzebne
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
      console.error(
        "Wystąpił błąd podczas aktualizacji miejsca pracy: ",
        error
      );
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
              Zaktualizuj
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDeleteClick(workplace.id)}
            >
              Usuń
            </Button>
            <Button variant="secondary" onClick={goBack} className="ml-2">
              Powrot
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditWorkPlace;
