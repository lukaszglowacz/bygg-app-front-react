import React from "react";
import { useProfileData } from "../hooks/useProfileData";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Image,
  Form,
  Button,
} from "react-bootstrap";
import api from "../api/api";
import { useState } from "react";

//Interfejs dla danych, których spodziewam się otrzymać z API
const ProfileComponent: React.FC = () => {
  const profiles = useProfileData();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    profileId: number
  ) => {
    event.preventDefault();
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);

      try {
        // Załóżmy, że endpoint API do aktualizacji zdjęcia profilowego wymaga wysłania formularza
        // i używa metody PATCH. Należy dostosować URL i metodę do swojego API.
        await api.patch(`/profile/${profileId}/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Zdjęcie profilowe zostało zaktualizowane.");
      } catch (error) {
        console.error(
          "Wystąpił błąd przy aktualizacji zdjęcia profilowego:",
          error
        );
        alert("Nie udało się zaktualizować zdjęcia profilowego.");
      }
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        {profiles.map((profile) => (
          <Col md={6} lg={4} key={profile.id} className="mb-4">
            <Card>
              <Card.Header>
                <Image
                  src={profile.image}
                  alt={`${profile.first_name} ${profile.last_name}`}
                  roundedCircle
                  fluid
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                <Form onSubmit={(e) => handleSubmit(e, profile.id)}>
                  <Form.Group>
                    <input
                      type="file"
                      className="form-control"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                  <Button type="submit">Upload Image</Button>
                </Form>
              </Card.Header>
              <Card.Body>
                <Card.Title>{`${profile.first_name} ${profile.last_name}`}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {profile.user_email}
                </Card.Subtitle>
              </Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  Personnummer: {profile.personnummer}
                </ListGroup.Item>
                <ListGroup.Item>Utworzono: {profile.created_at}</ListGroup.Item>
                <ListGroup.Item>
                  Zaktualizowano: {profile.updated_at}
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProfileComponent;
