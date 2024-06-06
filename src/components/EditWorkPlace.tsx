import React, { useState, useEffect, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Col, Row, Alert } from "react-bootstrap";
import api from "../api/api";
import { IWorkPlacesData } from "../api/interfaces/types";
import ToastNotification from "./ToastNotification";
import Loader from "./Loader";
import { Trash, Save2 } from "react-bootstrap-icons";

const EditWorkPlace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(true);
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
        setLoading(false);
      } catch (error) {
        console.log("Failed to retrieve workplace data.", error);
        setLoading(false);
      }
    };

    if (id) {
      fetchWorkPlace();
    }
  }, [id]);

  const validate = (): boolean => {
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
    try {
      await api.delete(`/workplace/${id}/`);
      setToastMessage("Workplace has been removed.");
      setShowToast(true);
      setTimeout(() => {
        navigate("/work-places");
      }, 3000);
    } catch (error) {
      console.error("An error occurred while deleting the workplace: ", error);
      setToastMessage("Workplace could not be removed.");
      setShowToast(true);
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
      setToastMessage("The workplace has been updated.");
      setShowToast(true);
      setTimeout(() => {
        navigate("/work-places");
      }, 3000);
    } catch (error) {
      console.error("An error occurred while updating the workplace: ", error);
      setToastMessage("An error occurred while updating the workplace.");
      setShowToast(true);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} className="mb-3" controlId="streetInput">
              <Col md={6} className="mx-auto">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="bi bi-signpost-2"></i>
                    </span>
                  </div>
                  <Form.Control
                    type="text"
                    name="street"
                    value={workplace.street}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.street}
                  />
                  <Form.Control.Feedback type="invalid">
                    <Alert variant="warning">{errors.street}</Alert>
                  </Form.Control.Feedback>
                </div>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="streetNumberInput">
              <Col md={6} className="mx-auto">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="bi bi-hash"></i>
                    </span>
                  </div>
                  <Form.Control
                    type="text"
                    name="street_number"
                    value={workplace.street_number}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.street_number}
                  />
                  <Form.Control.Feedback type="invalid">
                    <Alert variant="warning">{errors.street_number}</Alert>
                  </Form.Control.Feedback>
                </div>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="postalCodeInput">
              <Col md={6} className="mx-auto">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="bi bi-envelope"></i>
                    </span>
                  </div>
                  <Form.Control
                    type="text"
                    name="postal_code"
                    value={workplace.postal_code}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.postal_code}
                  />
                  <Form.Control.Feedback type="invalid">
                    <Alert variant="warning">{errors.postal_code}</Alert>
                  </Form.Control.Feedback>
                </div>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="cityInput">
              <Col md={6} className="mx-auto">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="bi bi-building"></i>
                    </span>
                  </div>
                  <Form.Control
                    type="text"
                    name="city"
                    value={workplace.city}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.city}
                  />
                  <Form.Control.Feedback type="invalid">
                    <Alert variant="warning">{errors.city}</Alert>
                  </Form.Control.Feedback>
                </div>
              </Col>
            </Form.Group>

            <Row className="justify-content-around my-3">
              <Col md={6}>
                <div className="d-flex justify-content-around mt-3">
                  <div className="text-center">
                    <Button
                      variant="success"
                      className="btn-sm p-0"
                      type="submit"
                      title="Save"
                    >
                      <Save2 size={24} />
                    </Button>
                    <div>Save</div>
                  </div>
                  <div className="text-center">
                    <Button
                      variant="danger"
                      className="btn-sm p-0"
                      onClick={() => handleDeleteClick(workplace.id)}
                      title="Delete"
                    >
                      <Trash size={24} />
                    </Button>
                    <div>Delete</div>
                  </div>
                </div>
              </Col>
            </Row>
            
          </Form>
        </Col>
      </Row>
      <ToastNotification
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        variant="dark"
      />
    </Container>
  );
};

export default EditWorkPlace;
