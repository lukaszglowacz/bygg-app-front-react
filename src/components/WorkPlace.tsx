import React, { useEffect, useState } from "react";
import { Container, Col, Row, Button, Accordion } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../context/UserProfileContext";
import Loader from "./Loader";
import { PencilSquare, PlusSquare, Trash } from "react-bootstrap-icons";
import ConfirmModal from "./ConfirmModal";
import api from "../api/api";
import { IWorkPlacesData } from "../api/interfaces/types";

const WorkPlaceContainer: React.FC = () => {
  const [workplaces, setWorkplaces] = useState<IWorkPlacesData[]>([]);
  const navigate = useNavigate();
  const { profile, loadProfile } = useUserProfile();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [workplaceToDelete, setWorkplaceToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      await loadProfile();
      setIsAuthenticated(!!profile);
      setLoading(false);
    };

    fetchProfile();
  }, [profile, loadProfile]);

  const fetchWorkplaces = async () => {
    try {
      setLoading(true);
      const response = await api.get<IWorkPlacesData[]>('/workplace/');
      setWorkplaces(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch workplaces", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkplaces();
  }, []);

  const handleAddClick = () => {
    navigate("/add-work-place");
  };

  const handleEditClick = (id: number) => {
    navigate(`/edit-work-place/${id}`);
  };

  const handleDeleteClick = (id: number) => {
    setShowModal(true);
    setWorkplaceToDelete(id);
  };

  const confirmDeleteWorkplace = async () => {
    if (workplaceToDelete !== null) {
      try {
        await api.delete(`/workplace/${workplaceToDelete}/`);
        setWorkplaceToDelete(null);
        setShowModal(false);
        fetchWorkplaces(); // Refresh the workplaces after deletion
      } catch (error) {
        console.error("Failed to delete the workplace", error);
        setShowModal(false);
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container className="mt-4">
      {isAuthenticated && profile?.is_employer && (
        <Row className="justify-content-center my-3">
          <Col md={6} className="d-flex justify-content-end">
            <div className="text-center">
              <Button
                variant="primary"
                className="btn-sm p-0"
                onClick={handleAddClick}
                title="Add"
              >
                <PlusSquare size={24} />
              </Button>
              <div>Add</div>
            </div>
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
                    <span>{`${workplace.postal_code} ${workplace.city}`}</span>
                  </div>
                </Accordion.Header>

                {isAuthenticated && profile?.is_employer && (
                  <Accordion.Body>
                    <div className="d-flex justify-content-around mt-3">
                      <div className="text-center">
                        <Button
                          variant="outline-success"
                          className="btn-sm p-0"
                          onClick={() => handleEditClick(workplace.id)}
                          title="Edit"
                        >
                          <PencilSquare size={24} />
                        </Button>
                        <div>Edit</div>
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
                  </Accordion.Body>
                )}
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
      </Row>

      <ConfirmModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={confirmDeleteWorkplace}
      >
        Are you sure you want to delete this workplace?
      </ConfirmModal>
    </Container>
  );
};

export default WorkPlaceContainer;
