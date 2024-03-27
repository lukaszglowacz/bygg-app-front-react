import React from "react";
import { useProfileData } from "../hooks/useProfileData";
import { Container, Row, Col } from "react-bootstrap";

//Interfejs dla danych, ktorych spodziewam sie otrzymac z API
const ProfileComponent: React.FC = () => {
  const profiles = useProfileData();
  return (
    <Container>
      <Row>
        <Col>
          <h1>Profil uzytkownika</h1>
          {profiles.map((profile) => (
            <div key={profile.id}>
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  borderRadius: "50%",
                }}
              >
                <img
                  src={profile.image}
                  alt={`${profile.first_name} ${profile.last_name}`}
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
              </div>

              <p>Email: {profile.user_email}</p>
              <p>Imię: {profile.first_name}</p>
              <p>Nazwisko: {profile.last_name}</p>
              <p>Personnummer: {profile.personnummer}</p>
              <p>Utworzono: {profile.created_at}</p>
              <p>Zaktualizowano: {profile.updated_at}</p>
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileComponent;
