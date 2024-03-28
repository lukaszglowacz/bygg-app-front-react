import React from "react";
import { useProfileData } from "../hooks/useProfileData";
import { Container, Row, Col, Card, ListGroup, Image } from "react-bootstrap";

//Interfejs dla danych, których spodziewam się otrzymać z API
const ProfileComponent: React.FC = () => {
  const profiles = useProfileData();

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
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
              </Card.Header>
              <Card.Body>
                <Card.Title>{`${profile.first_name} ${profile.last_name}`}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{profile.user_email}</Card.Subtitle>
              </Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>Personnummer: {profile.personnummer}</ListGroup.Item>
                <ListGroup.Item>Utworzono: {profile.created_at}</ListGroup.Item>
                <ListGroup.Item>Zaktualizowano: {profile.updated_at}</ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProfileComponent;
