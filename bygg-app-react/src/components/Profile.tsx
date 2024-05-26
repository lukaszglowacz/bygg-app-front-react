import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Image,
  Form,
  Button,
  OverlayTrigger,
  Tooltip,
  Alert,
  InputGroup,
} from "react-bootstrap";
import {
  PencilSquare,
  PersonFill,
  PersonLinesFill,
  CalendarFill,
} from "react-bootstrap-icons";
import api from "../api/api";
import { useProfileData } from "../hooks/useProfileData";
import { useUserProfile } from "../context/UserProfileContext";
import { useNavigate } from "react-router-dom";
import BackButton from "./NavigateButton";
import ToastNotification from "./ToastNotification";

const ProfileComponent = () => {
  const profiles = useProfileData();
  const { loadProfile, setProfile } = useUserProfile();
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState<Map<number, File>>(new Map());
  const [previewUrls, setPreviewUrls] = useState<Map<number, string>>(new Map());
  const [formData, setFormData] = useState<Map<number, { firstName: string; lastName: string; personnummer: string }>>(new Map());
  const [errors, setErrors] = useState<Map<number, { [key: string]: string }>>(new Map());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const newFormData = new Map();
    profiles.forEach((profile) => {
      newFormData.set(profile.id, {
        firstName: profile.first_name,
        lastName: profile.last_name,
        personnummer: profile.personnummer,
      });
    });
    setFormData(newFormData);
  }, [profiles]);

  const handleFileChange = (
    profileId: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFiles(new Map(selectedFiles.set(profileId, file)));
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrls(new Map(previewUrls.set(profileId, fileUrl)));
    }
  };

  const handleInputChange = (
    profileId: number,
    field: string,
    value: string
  ) => {
    const existing = formData.get(profileId) || {
      firstName: "",
      lastName: "",
      personnummer: "",
    };
    const updated = { ...existing, [field]: value };
    setFormData(new Map(formData.set(profileId, updated)));
  };

  const validatePersonnummer = (personnummer: string) => {
    const regex = /^\d{6}-\d{4}$/;
    return regex.test(personnummer);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    profileId: number
  ) => {
    event.preventDefault();
    const payload = new FormData();
    if (selectedFiles.has(profileId)) {
      payload.append("image", selectedFiles.get(profileId) as Blob);
    }
    const data = formData.get(profileId);
    if (data) {
      payload.append("first_name", data.firstName);
      payload.append("last_name", data.lastName);
      if (!validatePersonnummer(data.personnummer)) {
        setErrors(
          new Map(
            errors.set(profileId, {
              ...errors.get(profileId),
              personnummer:
                "Invalid personnummer format. Expected format: YYMMDD-XXXX.",
            })
          )
        );
        return;
      }
      payload.append("personnummer", data.personnummer);
    }

    try {
      const response = await api.patch(`/profile/${profileId}/`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await loadProfile();
      setProfile(response.data);
      setToastMessage("The profile has been updated.");
      setShowToast(true);

      // Opóźnij nawigację, aby wyświetlić toast
      setTimeout(() => {
        navigate("/");
      }, 3000); // Opóźnienie 3 sekundy przed przekierowaniem
    } catch (error) {
      console.error("An error occurred while updating the profile:", error);
      setErrors(
        new Map(errors.set(profileId, { general: "Failed to update profile." }))
      );
    }
  };

  return (
    <Container>
      <BackButton backPath="/" />
      <Row className="justify-content-center">
        {profiles.map((profile) => (
          <Col md={6} lg={4} key={profile.id} className="mb-3">
            <Card>
              <Card.Header className="text-center">
                <Image
                  src={previewUrls.get(profile.id) || profile.image}
                  roundedCircle
                  fluid
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    margin: "0 auto",
                  }}
                />
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip>Edit</Tooltip>}
                >
                  <label className="btn btn-secondary">
                    <PencilSquare />{" "}
                    <input
                      type="file"
                      hidden
                      onChange={(e) => handleFileChange(profile.id, e)}
                    />
                  </label>
                </OverlayTrigger>
                <p
                  className="mt-2 mb-0 text-muted"
                  style={{ fontSize: "16px", fontWeight: "bold" }}
                >
                  {profile.user_email}
                </p>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={(e) => handleSubmit(e, profile.id)}>
                  <Form.Group className="mb-3">
                    <InputGroup>
                      <InputGroup.Text>
                        <PersonFill />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="First name"
                        value={formData.get(profile.id)?.firstName || ""}
                        onChange={(e) =>
                          handleInputChange(
                            profile.id,
                            "firstName",
                            e.target.value
                          )
                        }
                        isInvalid={!!errors.get(profile.id)?.firstName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.get(profile.id)?.firstName && (
                          <Alert variant="warning" className="mt-2 w-100">
                            {errors.get(profile.id)?.firstName}
                          </Alert>
                        )}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <InputGroup>
                      <InputGroup.Text>
                        <PersonLinesFill />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Last name"
                        value={formData.get(profile.id)?.lastName || ""}
                        onChange={(e) =>
                          handleInputChange(
                            profile.id,
                            "lastName",
                            e.target.value
                          )
                        }
                        isInvalid={!!errors.get(profile.id)?.lastName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.get(profile.id)?.lastName && (
                          <Alert variant="warning" className="mt-2 w-100">
                            {errors.get(profile.id)?.lastName}
                          </Alert>
                        )}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <InputGroup>
                      <InputGroup.Text>
                        <CalendarFill />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Personnummer"
                        value={formData.get(profile.id)?.personnummer || ""}
                        onChange={(e) =>
                          handleInputChange(
                            profile.id,
                            "personnummer",
                            e.target.value
                          )
                        }
                        isInvalid={!!errors.get(profile.id)?.personnummer}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.get(profile.id)?.personnummer && (
                          <Alert variant="warning" className="mt-2 w-100">
                            {errors.get(profile.id)?.personnummer}
                          </Alert>
                        )}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  {errors.get(profile.id)?.general && (
                    <Alert variant="warning">
                      {errors.get(profile.id)?.general}
                    </Alert>
                  )}
                  <Button
                    variant="success"
                    type="submit"
                    className="w-100"
                    size="sm"
                  >
                    Update
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <ToastNotification
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        variant="dark"
      />
    </Container>
  );
};

export default ProfileComponent;
