import React, { useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Zakładając, że masz taki hook
import { useProfileData } from "../hooks/useProfileData";
import useLogout from "../hooks/useLogOut";
import ConfirmModal from "./ConfirmModal";
import { useUserProfile } from "../context/UserProfileContext";

const NavbarComponent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const profiles = useProfileData();
  const logout = useLogout();
  const [showModal, setShowModal] = useState(false);
  const { profile } = useUserProfile();

  // Przekierowanie na stronę logowania, jeśli użytkownik nie jest zalogowany
  useEffect(() => {
    if (!isLoading && !isAuthenticated && location.pathname !== "/register") {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname]);

  const handleLogoutConfirm = () => {
    logout();
    setShowModal(false);
    navigate("/login");
  };

  const handleLogoutClick = () => {
    setShowModal(true);
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  const userProfile = profiles[0] || {};

  return (
    <>
      <Navbar bg="light" expand="lg" fixed="top">
        <Container>
          {isAuthenticated && userProfile.image && (
            <Navbar.Brand onClick={() => navigateTo("/")}>
              <img
                src={userProfile.image}
                alt="Profile"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  margin: "0 auto",
                }}
              />
            </Navbar.Brand>
          )}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {isAuthenticated && (
                <NavDropdown
                  title={userProfile.first_name}
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item onClick={() => navigateTo("/")}>
                    Panel nawigacyjny
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigateTo("/profile")}>
                    Profil
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => navigateTo("/active-sessions")}
                  >
                    Aktualnie pracuja
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigateTo("/work-hours")}>
                    Godziny pracy
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigateTo("/work-places")}>
                    Miejsca pracy
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogoutClick}>
                    Wyloguj się
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <ConfirmModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={handleLogoutConfirm}
        title="Potwierdzenie wylogowania"
        children={<p>Czy na pewno chcesz się wylogować?</p>}
      />
    </>
  );
};

export default NavbarComponent;
