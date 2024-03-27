import styles from './App.module.css'
import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import ProfileComponent from "./components/Profile";
import LoginComponent from "./components/Login";
import NavbarComponent from "./components/NavBar";
import WorkHour from "./components/WorkHour";
import WorkPlace from "./components/WorkPlace";

const App: React.FC = () => {
  return (
    <Router>
      <NavbarComponent />
      <div className={styles.routeMargin}>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/profile" element={<ProfileComponent />}/>
          <Route path="/login" element={<LoginComponent/>}/>
          <Route path="/work-hours" element={<WorkHour />}/>
          <Route path="/work-places" element={<WorkPlace/>}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App;
