import React from "react";
import { useWorkPlaceData } from "../hooks/useWorkplaceData";
import { Container, Col, Row, Button, ListGroup } from "react-bootstrap";
import { IWorkPlacesData } from "../api/interfaces/types";
import { useNavigate } from "react-router-dom";

const WorkPlaceContainer: React.FC = () => {
  const workplaces = useWorkPlaceData();
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/add-work-place"); // Przekierowanie do AddWorkPlace
  };

  

  const formatAddress = (workplace: IWorkPlacesData) => {
    return `${workplace.street} ${workplace.street_number}, ${workplace.postal_code} ${workplace.city}`;
  };

  const handleEditClick = (id: number) => {
    navigate(`/edit-work-place/${id}`); // Przekierowanie do formularza edycji z ID miejsca pracy
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
                <div>
                  <Button variant="secondary" onClick={() => handleEditClick(workplace.id)} style={{ marginRight: "10px" }}>
                    Edit
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Button variant="success" onClick={handleAddClick}>
            Dodaj
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default WorkPlaceContainer;
