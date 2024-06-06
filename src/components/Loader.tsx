import React from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Loader: React.FC = () => {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6} className="text-center">
          <Spinner animation="grow" variant="success" />
        </Col>
      </Row>
    </Container>
  );
};

export default Loader;
