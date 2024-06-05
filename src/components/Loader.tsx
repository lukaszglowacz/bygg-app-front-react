import React from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Loader: React.FC = () => {
  return (
    <Container>
      <Row className="justify-content-center my-5">
        <Col md={6} className="text-center">
          <Spinner animation="grow" variant="primary" />
        </Col>
      </Row>
    </Container>
  );
};

export default Loader;
