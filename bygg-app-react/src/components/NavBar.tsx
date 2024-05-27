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
      loadProfile(); // Ładuj profil, gdy jesteśmy uwierzytelnieni, ale profil nie jest jeszcze załadowany
    }
    console.log("Profile:", profile);
    console.log("isEmployer:", profile?.is_employer);
    console.log("Authenticated:", isAuthenticated);

    const publicPaths = ["/register", "/reset-password", "/login"];
    const isPublicPath = publicPaths.some(path => location.pathname.startsWith(path));

    if (!isLoading && !isAuthenticated && !isPublicPath) {
      navigate("/login");
    }
  }, [
    isAuthenticated,
    isLoading,
    navigate,
    location.pathname,
    profile,
    loadProfile,
  ]);

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
                  Navigation panel
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigateTo("/profile")}>
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => navigateTo("/active-sessions")}
                >
                  Current worksession
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigateTo("/work-hours")}>
                  Workhour
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigateTo("/work-places")}>
                  Workplace
                </NavDropdown.Item>
                {profile?.is_employer && (
                  <NavDropdown.Item onClick={() => navigateTo("/employees")}>
                    Employer
                  </NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogoutClick}>
                  Log out
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
        children={<p>Are you sure you want to log out?</p>}
      />
    </>
  );
};

export default NavbarComponent;
