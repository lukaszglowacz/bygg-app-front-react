import React, { useEffect, useState } from "react";
import { useWorkPlaceData } from "../hooks/useWorkplaceData";
import { Container, Col, Row, Button, Accordion } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../context/UserProfileContext";
import BackButton from "./NavigateButton";
import Loader from "./Loader";

const WorkPlaceContainer: React.FC = () => {
  const workplaces = useWorkPlaceData();
  const navigate = useNavigate();
  const { profile, loadProfile } = useUserProfile();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      await loadProfile();
      setIsAuthenticated(!!profile);
      setLoading(false);
    };

    fetchProfile();
  }, [profile, loadProfile]);

  const handleAddClick = () => {
    navigate("/add-work-place");
  };

  const handleEditClick = (id: number) => {
    navigate(`/edit-work-place/${id}`);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <BackButton backPath="/" />
      {isAuthenticated && profile?.is_employer && (
        <Row className="justify-content-center my-3">
          <Col md={6} className="d-flex justify-content-end">
            <Button
              variant="outline-secondary"
              onClick={handleAddClick}
              size="sm"
            >
              Add
            </Button>
          </Col>
        </Row>
      )}
      <Row className="justify-content-center mt-3">
        <Col md={6}>
          <Accordion className="text-center">
            {workplaces.map((workplace, index) => (
              <Accordion.Item eventKey={String(index)} key={workplace.id}>
                <Accordion.Header className="text-center">
                  <div className="d-flex flex-column justify-content-center">
                    <span>{`${workplace.street} ${workplace.street_number}`}</span>
                    <span>{` ${workplace.postal_code} ${workplace.city}`}</span>
                  </div>
                </Accordion.Header>

                {isAuthenticated && profile?.is_employer && (
                  <Accordion.Body>
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => handleEditClick(workplace.id)}
                    >
                      Edit
                    </Button>
                  </Accordion.Body>
                )}
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
};

export default WorkPlaceContainer;
