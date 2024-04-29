import React, { useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useLogout from "../hooks/useLogOut";
import ConfirmModal from "./ConfirmModal";
import { useUserProfile } from "../context/UserProfileContext";

const NavbarComponent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { profile, loadProfile } = useUserProfile(); // Użyj profilu z kontekstu oraz funkcji do ładowania
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useLogout();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !profile) {
      loadProfile();  // Ładuj profil, gdy jesteśmy uwierzytelnieni, ale profil nie jest jeszcze załadowany
    }
    console.log("Profile:", profile);
    console.log("Authenticated:", isAuthenticated);
    if (!isLoading && !isAuthenticated && location.pathname !== "/register") {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname, profile, loadProfile]);

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

  return (
    <>
      <Navbar bg="light" fixed="top">
        <Container>
          {isAuthenticated && profile && (
            <Navbar.Brand onClick={() => navigateTo("/")}>
              <img
                src={profile.image}
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
          <Nav className="ms-auto">
            {isAuthenticated && profile && (
              <NavDropdown
                title={profile.first_name}
                id="basic-nav-dropdown"
                menuVariant="light"
                align="end"
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
                  Aktualna praca
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
