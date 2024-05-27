import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Home from "./components/Home";
import ProfileComponent from "./components/Profile";
import LoginComponent from "./components/Login";
import NavbarComponent from "./components/NavBar";
import WorkHour from "./components/WorkHour";
import WorkHourByDay from "./components/WorkHourByDay";
import WorkPlace from "./components/WorkPlace";
import EditWorkPlace from "./components/EditWorkPlace";
import RegisterUser from "./components/RegisterUser";
import ActiveSessions from "./components/ActiveSessions";
import EditWorkHour from "./components/EditWorkHour";
import AddWorkHour from "./components/AddWorkHour";
import AddWorkPlace from "./components/AddWorkPlace";
import EmployeeList from "./components/EmployeeList";
import EmployeeDetails from "./components/EmployeeDetails";
import EmployeeDetailsByDay from "./components/EmployeeDetailsByDay";
import ResetPasswordComponent from "./components/ResetPasswordComponent";
import { UserProfileProvider } from "./context/UserProfileContext";
import ConfirmPassword from "./components/ConfirmPassword";

const App: React.FC = () => {
  return (
    <UserProfileProvider>
      <Router>
        <NavbarComponent />
        <Container style={{ marginTop: "100px" }}>
          <Row>
            <Col>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<ProfileComponent />} />
                <Route path="/login" element={<LoginComponent />} />
                <Route path="/add-work-hour" element={<AddWorkHour />} />
                <Route path="/work-hours" element={<WorkHour />} />
                <Route path="/work-hours/day/:date" element={<WorkHourByDay />} />
                <Route path="/edit-work-hour/:id" element={<EditWorkHour />} />
                <Route path="/work-places" element={<WorkPlace />} />
                <Route path="/add-work-place" element={<AddWorkPlace />} />
                <Route path="/edit-work-place/:id" element={<EditWorkPlace />} />
                <Route path="/register" element={<RegisterUser />} />
                <Route path="/active-sessions" element={<ActiveSessions />} />
                <Route path="/employees" element={<EmployeeList />} />
                <Route path="/employees/:id" element={<EmployeeDetails />} />
                <Route path="/employee/:id/day/:date" element={<EmployeeDetailsByDay />} />
                <Route path="/reset-password" element={<ResetPasswordComponent />} />
                <Route path="/reset-password/:uidb64/:token" element={<ConfirmPassword />} />
              </Routes>
            </Col>
          </Row>
        </Container>
      </Router>
    </UserProfileProvider>
  );
};

export default App;
