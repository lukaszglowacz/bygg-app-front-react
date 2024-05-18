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
        console.log("Failed to retrieve workplace data.", error);
      }
    };

    if (id) {
      fetchWorkPlace();
    }
  }, [id]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!workplace.street) {
      newErrors.street = "Street is required.";
    }
    if (!workplace.street_number.match(/^\d+$/)) {
      newErrors.street_number = "The street number must be a number.";
    }
    if (!workplace.postal_code.match(/^\d{3}\s\d{2}$/)) {
      newErrors.postal_code = "Postal code must be in the format 'XXX XX'.";
    }
    if (!workplace.city) {
      newErrors.city = "City is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this workplace?")) {
      try {
        // Przykładowe wywołanie metody delete przy użyciu Axios
        await api.delete(`/workplace/${id}/`);
        alert("Workplace has been removed.");
        navigate("/work-places");
      } catch (error) {
        console.error("An error occurred while deleting the workplace: ", error);
        alert("Workplace could not be removed.");
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
      alert("The workplace has been updated.");
      navigate("/work-places");
    } catch (error) {
      console.error("An error occurred while updating the workplace: ", error);
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

            <Row className="justify-content-center mb-3 mt-5">
              <Col md={6} className="d-flex justify-content-center">
                <Button variant="success" type="submit" size="sm" className="w-100">
                  Edit
                </Button>
              </Col>
            </Row>
            <Row className="justify-content-center my-3">
              <Col md={6} className="d-flex justify-content-center">
                <Button variant="outline-secondary" onClick={() => navigate("/work-places")} size="sm" className="w-100">
                  Back
                </Button>
              </Col>
            </Row>
            <Row className="justify-content-center my-3">
              <Col md={6} className="d-flex justify-content-center">
                <Button variant="outline-danger" onClick={() => handleDeleteClick(workplace.id)} size="sm" className="w-100">
                  Delete
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
