import React, { useEffect, useState, forwardRef, MouseEvent } from "react";
import {
  Container,
  Navbar,
  Dropdown,
  DropdownToggleProps,
  Row,
  Col,
} from "react-bootstrap";
import { useNavigate, useLocation, matchPath } from "react-router-dom";
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
  const [backPath, setBackPath] = useState("/");

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
    const updateNavbar = () => {
      if (matchPath({ path: "/employees/:id", end: true }, location.pathname)) {
        setCurrentTitle("Time Tracking\nMonth View");
        setBackPath("/employees");
        setShowBackButton(true);
      } else if (matchPath({ path: "/employee/:id/day/:date", end: true }, location.pathname)) {
        const { id } = matchPath("/employee/:id/day/:date", location.pathname)?.params || {};
        setCurrentTitle("Time Tracking\nDay View");
        setBackPath(`/employees/${id}`);
        setShowBackButton(true);
      } else if (matchPath({ path: "/work-hours/day/:date", end: true }, location.pathname)) {
        setCurrentTitle("Time Tracking\nDay View");
        setBackPath("/work-hours");
        setShowBackButton(true);
      } else if (matchPath({ path: "/add-work-hour", end: true }, location.pathname)) {
        const searchParams = new URLSearchParams(location.search);
        const employeeId = searchParams.get("employeeId");
        const date = searchParams.get("date");
        setCurrentTitle("Add Work Session");
        setBackPath(`/employee/${employeeId}/day/${date}`);
        setShowBackButton(true);
      } else if (matchPath({ path: "/edit-work-hour/:id", end: true }, location.pathname)) {
        const searchParams = new URLSearchParams(location.search);
        const employeeId = searchParams.get("employeeId");
        const date = searchParams.get("date");
        setCurrentTitle("Edit Work Hour");
        setBackPath(`/employee/${employeeId}/day/${date}`);
        setShowBackButton(true);
      } else if (matchPath({ path: "/edit-work-place/:id", end: true }, location.pathname)) {
        setCurrentTitle("Edit Work Place");
        setBackPath("/work-places");
        setShowBackButton(true);
      } else {
        switch (location.pathname) {
          case "/":
            setCurrentTitle("Welcome");
            setBackPath("");
            setShowBackButton(false);
            break;
          case "/profile":
            setCurrentTitle("Account Settings");
            setBackPath("/");
            setShowBackButton(true);
            break;
          case "/active-sessions":
            setCurrentTitle("Active Sessions");
            setBackPath("/");
            setShowBackButton(true);
            break;
          case "/work-hours":
            setCurrentTitle("Time Tracking\nMonth View");
            setBackPath("/");
            setShowBackButton(true);
            break;
          case "/work-places":
            setCurrentTitle("Locations");
            setBackPath("/");
            setShowBackButton(true);
            break;
          case "/add-work-place":
            setCurrentTitle("Add Work Place");
            setBackPath("/work-places");
            setShowBackButton(true);
            break;
          case "/employees":
            setCurrentTitle("Team Management");
            setBackPath("/");
            setShowBackButton(true);
            break;
          default:
            setCurrentTitle("Dashboard");
            setBackPath("/");
            setShowBackButton(false);
        }
      }
    };

    updateNavbar();
  }, [location.pathname, location.search, location.state]);

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
        <Container className="p-0 d-flex justify-content-center align-items-center">
          <Row className="w-100 p-0 m-0" style={{ maxWidth: "768px" }}>
            <Col className="d-flex align-items-center">
              {isAuthenticated && profile && (
                <Navbar.Brand onClick={() => navigateTo(backPath)}>
                  {showBackButton ? (
                    <BackButton backPath={backPath} />
                  ) : (
                    <img
                      src={profile.image}
                      alt="Profile"
                      className={styles["navbar-image"]}
                    />
                  )}
                </Navbar.Brand>
              )}
            </Col>
            <Col className={`d-flex justify-content-center align-items-center ${styles["navbar-content"]}`}>
              {isAuthenticated && profile && (
                <div className="text-center">
                  <p className="small m-0">
                    {currentTitle.split("\n").map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </p>
                  {location.pathname === "/" && (
                    <p className="small m-0">{profile.first_name}</p>
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
