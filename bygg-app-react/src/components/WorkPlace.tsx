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
      <Row className="justify-content-center my-3">
        <Col md={6} className="d-flex justify-content-end">
          <Button
            variant="outline-secondary"
            onClick={handleAddClick}
            size="sm"
          >
            Dodaj miejsce
          </Button>
        </Col>
      </Row>
      <Row className="justify-content-center mt-3"> 
        <Col md={6}>
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
                    variant="outline-success"
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
