import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Row, Col, Alert } from "react-bootstrap";
import api from "../api/api";
import ToastNotification from './ToastNotification';
import { Save2 } from "react-bootstrap-icons";
import LoadingButton from "./LoadingButton";

interface Workplace {
  street: string;
  street_number: string;
  postal_code: string;
  city: string;
}

const AddWorkPlace: React.FC = () => {
  const [workplace, setWorkplace] = useState<Workplace>({
    street: "",
    street_number: "",
    postal_code: "",
    city: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<'success' | 'danger' | 'warning' | 'info' | 'dark'>('dark');
  const navigate = useNavigate();

  const validate = (): boolean => {
    let newErrors: { [key: string]: string } = {};
    if (!workplace.street)
      newErrors = { ...newErrors, street: "Street required" };
    if (!workplace.street_number.match(/^\d+$/))
      newErrors = {
        ...newErrors,
        street_number: "Street number must be numeric",
      };
    if (!workplace.postal_code.match(/^\d{3}\s\d{2}$/))
      newErrors = {
        ...newErrors,
        postal_code: "Postal code must be 'XXX XX'",
      };
    if (!workplace.city)
      newErrors = { ...newErrors, city: "City required" };

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWorkplace((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await api.post("/workplace/", workplace);
      setToastMessage("Workplace has been added.");
      setToastVariant("dark");
      setShowToast(true);
      setTimeout(() => {
        navigate("/work-places");
      }, 3000);
    } catch (error) {
      console.error("An error occurred while adding a workplace: ", error);
      setErrors({ general: "An error occurred while adding a workplace." });
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <Form onSubmit={(e) => e.preventDefault()}>
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
                    placeholder="Street"
                    name="street"
                    value={workplace.street}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.street}
                  />
                </div>
                {errors.street && (
                  <Alert variant="warning" className="mt-2 text-center">
                    {errors.street}
                  </Alert>
                )}
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
                    placeholder="Street number"
                    name="street_number"
                    value={workplace.street_number}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.street_number}
                  />
                </div>
                {errors.street_number && (
                  <Alert variant="warning" className="mt-2 text-center">
                    {errors.street_number}
                  </Alert>
                )}
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
                    placeholder="Postal code"
                    name="postal_code"
                    value={workplace.postal_code}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.postal_code}
                  />
                </div>
                {errors.postal_code && (
                  <Alert variant="warning" className="mt-2 text-center">
                    {errors.postal_code}
                  </Alert>
                )}
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
                    placeholder="City"
                    name="city"
                    value={workplace.city}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.city}
                  />
                </div>
                {errors.city && (
                  <Alert variant="warning" className="mt-2 text-center">
                    {errors.city}
                  </Alert>
                )}
              </Col>
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <div className="d-flex justify-content-around mt-3">
                  <div className="text-center">
                    <LoadingButton
                      variant="success"
                      onClick={handleSubmit}
                      icon={Save2}
                      title="Save"
                      size={24}
                    />
                    <div>Save</div>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <ToastNotification show={showToast} onClose={() => setShowToast(false)} message={toastMessage} variant={toastVariant} />
    </Container>
  );
};

export default AddWorkPlace;
