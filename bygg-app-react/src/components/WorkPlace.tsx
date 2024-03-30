import React from "react";
import { useWorkPlaceData } from "../hooks/useWorkplaceData";
import { Container, Col, Row, Button, ListGroup } from "react-bootstrap";
import { IWorkPlacesData } from "../api/interfaces/types";
import { useNavigate } from "react-router-dom";
import { deleteWorkPlace } from "../api/api";

const WorkPlaceContainer: React.FC = () => {
  const workplaces = useWorkPlaceData();
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/add-work-place"); // Przekierowanie do AddWorkPlace
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm("Czy na pewno chcesz usunąć to miejsce pracy?")) {
      try {
        await deleteWorkPlace(id);
        alert("Miejsce pracy zostało usunięte.");
        navigate("/work-places");
      } catch (error) {
        console.error("Wystąpił błąd podczas usuwania miejsca pracy: ", error);
        alert("Nie udało się usunąć miejsca pracy.");
      }
    }
  };

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
                <Button variant="danger" onClick={() => handleDeleteClick(workplace.id)}>
                  Usuń
                </Button>
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
