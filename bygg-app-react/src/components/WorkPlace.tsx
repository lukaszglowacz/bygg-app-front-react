import React from "react";
import { useWorkPlaceData } from "../hooks/useWorkplaceData";
import { Container, Col, Row, Button, Accordion } from "react-bootstrap";
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
          <h1 className="text-center">Miejsca pracy</h1>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Button
            variant="outline-dark"
            onClick={handleAddClick}
            className="w-100"
          >
            Dodaj miejsce pracy
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <Accordion defaultActiveKey="0" className="text-center">
            {workplaces.map((workplace, index) => (
              <Accordion.Item eventKey={String(index)} key={workplace.id}>
                <Accordion.Header className="text-center">
                <div className="d-flex flex-column justify-content-center">
                  <span>{`${workplace.street} ${workplace.street_number}`}</span>
                  <span>{` ${workplace.postal_code} ${workplace.city}`}</span>
                </div>
              </Accordion.Header>
                <Accordion.Body>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleEditClick(workplace.id)}
                    
                    
                  >
                    Edytuj
                  </Button>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
};

export default WorkPlaceContainer;
