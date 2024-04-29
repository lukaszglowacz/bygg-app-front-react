import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Image, Form, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { PencilSquare, PersonFill, EnvelopeFill, Hash } from 'react-bootstrap-icons';
import api from "../api/api";
import { useProfileData } from "../hooks/useProfileData";
import { useUserProfile } from "../context/UserProfileContext";

const ProfileComponent = () => {
  const profiles = useProfileData();
  const { loadProfile } = useUserProfile(); 
  const [selectedFiles, setSelectedFiles] = useState<Map<number, File>>(new Map());
  const [previewUrls, setPreviewUrls] = useState<Map<number, string>>(new Map());
  const [formData, setFormData] = useState<Map<number, { firstName: string; lastName: string; personnummer: string }>>(new Map());
  
  useEffect(() => {
    const newFormData = new Map();
    profiles.forEach(profile => {
      newFormData.set(profile.id, {
        firstName: profile.first_name,
        lastName: profile.last_name,
        personnummer: profile.personnummer
      });
    });
    setFormData(newFormData);
  }, [profiles]);

  const handleFileChange = (profileId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFiles(new Map(selectedFiles.set(profileId, file)));
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrls(new Map(previewUrls.set(profileId, fileUrl)));
    }
  };

  const handleInputChange = (profileId: number, field: string, value: string) => {
    const existing = formData.get(profileId) || { firstName: "", lastName: "", personnummer: "" };
    const updated = { ...existing, [field]: value };
    setFormData(new Map(formData.set(profileId, updated)));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, profileId: number) => {
    event.preventDefault();
    const payload = new FormData();
    if (selectedFiles.has(profileId)) {
      payload.append("image", selectedFiles.get(profileId) as Blob);
    }
    const data = formData.get(profileId);
    if (data) {
      payload.append("first_name", data.firstName);
      payload.append("last_name", data.lastName);
      payload.append("personnummer", data.personnummer);
    }

    try {
      await api.patch(`/profile/${profileId}/`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profil został zaktualizowany.");
      loadProfile(); // Odświeżanie profilu w kontekście po aktualizacji
    } catch (error) {
      console.error("Wystąpił błąd przy aktualizacji profilu:", error);
      alert("Nie udało się zaktualizować profilu.");
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        {profiles.map((profile) => (
          <Col md={6} lg={4} key={profile.id} className="mb-3">
            <Card className="mt-5">
              <Card.Header className="text-center position-relative">
                <Image src={previewUrls.get(profile.id) || profile.image} roundedCircle fluid style={{ width: "140px", height: "140px", objectFit: "cover", margin: "0 auto", position: 'absolute', top: '-70px', left: 'calc(50% - 70px)'}} />
                <OverlayTrigger placement="right" overlay={<Tooltip>Edytuj zdjęcie</Tooltip>}>
                  <label className="btn btn-light position-absolute" style={{ top: '10px', right: '10px' }}>
                    <PencilSquare /> <input type="file" hidden onChange={(e) => handleFileChange(profile.id, e)} />
                  </label>
                </OverlayTrigger>
              </Card.Header>
              <Card.Body className="pt-5 mt-3">
                <Form onSubmit={(e) => handleSubmit(e, profile.id)}>
                  <Form.Group className="mb-3">
                    <Form.Label><PersonFill /> Imię</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Wpisz imię"
                      value={formData.get(profile.id)?.firstName || ""}
                      onChange={(e) => handleInputChange(profile.id, 'firstName', e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label><EnvelopeFill /> Nazwisko</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Wpisz nazwisko"
                      value={formData.get(profile.id)?.lastName || ""}
                      onChange={(e) => handleInputChange(profile.id, 'lastName', e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label><Hash /> Personnummer</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Wpisz personnummer"
                      value={formData.get(profile.id)?.personnummer || ""}
                      onChange={(e) => handleInputChange(profile.id, 'personnummer', e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100">Zaktualizuj</Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProfileComponent;
