import React from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useProfileData } from '../hooks/useProfileData';
import useLogout from '../hooks/useLogOut';

const NavbarComponent: React.FC = () => {
  const navigate = useNavigate();
  const profiles = useProfileData();
  const logout = useLogout();

  const handleLogout = () => {
    // Logika wylogowania i zastosowania useLogOutHook
    logout();
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  const userProfile = profiles[0] || {};

  return (
    <Navbar bg="light" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand onClick={() => navigateTo('/')}>
          <img src={userProfile.image} alt="Profile" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavDropdown title={userProfile.first_name} id="basic-nav-dropdown">
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
