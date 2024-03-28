import React from "react";
import { useWorkPlaceData } from "../hooks/useWorkplaceData";
import { Button, ListGroup } from "react-bootstrap";
import { Container, Col, Row } from "react-bootstrap";
import { IWorkPlacesData } from "../api/interfaces/types";

const WorkPlaceContainer: React.FC = () => {
  const workplaces = useWorkPlaceData();

  const formatAddress = (workplace: IWorkPlacesData) => {
    return `${workplace.street} ${workplace.street_number}, ${workplace.postal_code} ${workplace.city}`;
  };
  
  return (
    <Container>
      <Row>
        <Col>
          <ListGroup>
            <h1>Miejsca pracy</h1>
            {workplaces.map((workplace) => (
              <ListGroup.Item
                key={workplace.id}
                className="d-flex justify-content-between align-items-start"
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold">{formatAddress(workplace)}</div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Button variant="success">Dodaj</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default WorkPlaceContainer;
