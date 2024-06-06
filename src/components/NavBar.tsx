import React, { useEffect, useState, forwardRef, MouseEvent } from "react";
import {
  Container,
  Navbar,
  Dropdown,
  DropdownToggleProps,
  Row,
  Col,
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useLogout from "../hooks/useLogOut";
import ConfirmModal from "./ConfirmModal";
import { useUserProfile } from "../context/UserProfileContext";
import ToastNotification from "./ToastNotification";
import {
  Speedometer2,
  PersonCircle,
  PeopleFill,
  ClockHistory,
  CalendarCheck,
  GeoAltFill,
  BoxArrowRight,
} from "react-bootstrap-icons";
import styles from "../assets/styles/Navbar.module.css";
import BackButton from "./NavigateButton";

const CustomToggle = forwardRef<HTMLDivElement, DropdownToggleProps>(
  ({ children, onClick }, ref) => (
    <div
      ref={ref}
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (onClick) onClick(e as unknown as MouseEvent<HTMLButtonElement>);
      }}
      className={styles["custom-burger"]}
    >
      {children}
      <Navbar.Toggle
        aria-controls="basic-navbar-nav"
        className={styles["custom-burger"]}
      />
    </div>
  )
);

const NavbarComponent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { profile, loadProfile } = useUserProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useLogout();
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [currentTitle, setCurrentTitle] = useState("Dashboard");
  const [showBackButton, setShowBackButton] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !profile) {
      loadProfile();
    }

    if (location.state && location.state.showToast) {
      setShowToast(true);
      setToastMessage(location.state.toastMessage);
      window.history.replaceState({}, document.title);
    }
  }, [isAuthenticated, profile, loadProfile, location.state]);

  useEffect(() => {
    switch (location.pathname) {
      case "/":
        setCurrentTitle(`Welcome`);
        setShowBackButton(false);
        break;
      case "/profile":
        setCurrentTitle("Account Settings");
        setShowBackButton(true);
        break;
      case "/active-sessions":
        setCurrentTitle("Active Sessions");
        setShowBackButton(true);
        break;
      case "/work-hours":
        setCurrentTitle("Time Tracking");
        setShowBackButton(true);
        break;
      case "/work-places":
        setCurrentTitle("Locations");
        setShowBackButton(true);
        break;
      case "/employees":
        setCurrentTitle("Team Management");
        setShowBackButton(true);
        break;
      default:
        setCurrentTitle("Dashboard");
        setShowBackButton(false);
    }
  }, [location.pathname, profile?.full_name]);

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

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Navbar bg="light" expand={false} fixed="top" className={styles["navbar-custom"]}>
        <Container className="p-0 d-flex justify-content-center">
          <Row className="w-100 p-0 m-0" style={{ maxWidth: "540px" }}>
            <Col className={`d-flex align-items-center ${styles["navbar-content"]}`}>
              {isAuthenticated && profile && (
                <Navbar.Brand onClick={() => navigateTo("/")}>
                  {showBackButton ? (
                    <BackButton backPath="/" />
                  ) : (
                    <img
                      src={profile.image}
                      alt="Profile"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </Navbar.Brand>
              )}
            </Col>
            <Col className={`d-flex justify-content-center align-items-center ${styles["navbar-content"]}`}>
              {isAuthenticated && profile && (
                <div className="text-center">
                  <p className="small mb-0">{currentTitle}</p>
                  {!showBackButton && (
                    <p className="small mb-0">{profile.full_name}</p>
                  )}
                </div>
              )}
            </Col>
            <Col className={`d-flex justify-content-end align-items-center ${styles["navbar-content"]}`}>
              <Dropdown align="end">
                <Dropdown.Toggle as={CustomToggle} />
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => navigateTo("/")}>
                    <Speedometer2 className="me-2" /> Dashboard
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigateTo("/profile")}>
                    <PersonCircle className="me-2" /> Account Settings
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigateTo("/active-sessions")}>
                    <ClockHistory className="me-2" /> Active sessions
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigateTo("/work-hours")}>
                    <CalendarCheck className="me-2" /> Time Tracking
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigateTo("/work-places")}>
                    <GeoAltFill className="me-2" /> Locations
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  {profile?.is_employer && (
                    <Dropdown.Item onClick={() => navigateTo("/employees")}>
                      <PeopleFill className="me-2" /> Team Management
                    </Dropdown.Item>
                  )}
                  <Dropdown.Item onClick={handleLogoutClick}>
                    <BoxArrowRight className="me-2" /> Sign Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </Container>
      </Navbar>
      <ConfirmModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={handleLogoutConfirm}
      >
        <p>Are you sure you want to sign out?</p>
      </ConfirmModal>
      <ToastNotification
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        variant="dark"
      />
    </>
  );
};

export default NavbarComponent;
