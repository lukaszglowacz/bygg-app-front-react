import styles from "./App.module.css";
import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import ProfileComponent from "./components/Profile";
import LoginComponent from "./components/Login";
import NavbarComponent from "./components/NavBar";
import WorkHour from "./components/WorkHour";
import WorkPlace from "./components/WorkPlace";
import EditWorkPlace from "./components/EditWorkPlace";
import RegisterUser from "./components/RegisterUser";
import ActiveSessions from "./components/ActiveSessions";
import { UserProfileProvider } from "./context/UserProfileContext";
import EditWorkHour from "./components/EditWorkHour";

const App: React.FC = () => {
  return (
    <UserProfileProvider>
      <Router>
        <NavbarComponent />
        <div className={styles.routeMargin}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<ProfileComponent />} />
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/work-hours" element={<WorkHour />} />
            <Route path="/edit-work-hour/:id" element={<EditWorkHour />} />
            <Route path="/work-places" element={<WorkPlace />} />
            <Route path="/edit-work-place/:id" element={<EditWorkPlace />} />
            <Route path="/register" element={<RegisterUser />} />
            <Route path="/active-sessions" element={<ActiveSessions />} />
          </Routes>
        </div>
      </Router>
    </UserProfileProvider>
  );
};

export default App;
