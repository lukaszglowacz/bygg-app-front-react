import React from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NavbarComponent: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Logika wylogowania
    navigate('/login'); // Przekierowanie do strony logowania po wylogowaniu
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  // Przykładowe dane - powinny być pobrane np. ze stanu aplikacji lub props
  const userProfileImageUrl = "link_do_zdjecia_profilowego";
  const userName = "Imię Nazwisko";

  return (
    <Navbar bg="light" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand href="#home">
          <img src={userProfileImageUrl} alt="Profile" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavDropdown title={userName} id="basic-nav-dropdown">
              <NavDropdown.Item onClick={() => navigateTo('/')}>Panel nawigacyjny</NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigateTo('/profile')}>Profil</NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigateTo('/work-hours')}>Godziny pracy</NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigateTo('/work-places')}>Miejsca pracy</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Log Out</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
