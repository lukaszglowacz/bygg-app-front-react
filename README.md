# Gurudo

Gurudo is an innovative work time management application inspired by the character Gurudo from Dragon Ball Z, who possesses the unique ability to stop time during battles. The application aims to assist employers and employees in efficiently managing work sessions, tracking time, and increasing productivity in the workplace.

---

## Table of Contents

- [Introduction](#introduction)
- [System Requirements](#system-requirements)
  * [Backend](#backend)
  * [Frontend](#frontend)
  * [Other Tools](#other-tools)
  * [Development Tools](#development-tools)
  * [System Configuration](#system-configuration)
- [Installation Instructions](#installation-instructions)
  * [Steps to Clone the Repository](#steps-to-clone-the-repository)
  * [Instructions for Installing Backend Dependencies (Django)](#instructions-for-installing-backend-dependencies-django)
  * [Instructions for installing frontend dependencies (React)](#instructions-for-installing-frontend-dependencies-react)
  * [Running the Backend Server](#running-the-backend-server)
  * [Running the Frontend Application](#running-the-frontend-application)
- [Usage](#usage)
  * [Examples of Main Application Features](#examples-of-main-application-features)
    + [Employee Interface](#employee-interface)
    + [Employer Interface](#employer-interface)
    + [Adding Employees](#adding-employees)
    + [Recording Work Sessions](#recording-work-sessions)
    + [Viewing and Editing Work Sessions](#viewing-and-editing-work-sessions)
    + [Generating Monthly Reports](#generating-monthly-reports)
    + [Managing Workplaces](#managing-workplaces)
  * [Summary](#summary)
- [Application Features](#application-features)
    + [Employee Management](#employee-management)
    + [Workplace Management](#workplace-management)
    + [Work Session Recording](#work-session-recording)
    + [Report Generation](#report-generation)
    + [Daily Session Overview](#daily-session-overview)
    + [Monthly Session Overview](#monthly-session-overview)
    + [User Permissions Management](#user-permissions-management)
    + [Intuitive Interface](#intuitive-interface)
    + [Action Alerts](#action-alerts)
    + [Integration with External Tools](#integration-with-external-tools)
- [Sample Images/Screenshots](#sample-imagesscreenshots)
  * [Login](#login)
  * [Sign Up](#sign-up)
  * [Reset Password](#reset-password)
  * [Confirm Reset Password](#confirm-reset-password)
  * [Home](#home)
  * [Profile](#profile)
  * [Profile](#profile-1)
  * [Month View](#month-view)
  * [Month View](#month-view-1)
  * [Team - Employer](#team---employer)
  * [Team - Employer](#team---employer-1)
  * [Month View - Employer](#month-view---employer)
  * [Add Work Session - Employer](#add-work-session---employer)
  * [Edit Work Session - Employer](#edit-work-session---employer)
  * [Confirm Deletion Modal - Employer](#confirm-deletion-modal---employer)
  * [Workplace - Employer](#workplace---employer)
  * [Menu](#menu)
- [API Documentation](#api-documentation)
  * [Endpoints](#endpoints)
    + [1. Main Endpoint](#1-main-endpoint)
    + [2. Admin](#2-admin)
    + [3. API Authorization](#3-api-authorization)
    + [4. Profiles](#4-profiles)
    + [5. Workplaces](#5-workplaces)
    + [6. Work Sessions](#6-work-sessions)
    + [7. Active Sessions](#7-active-sessions)
    + [8. Employees](#8-employees)
    + [9. JWT Token](#9-jwt-token)
    + [10. User Registration](#10-user-registration)
    + [11. Password Reset](#11-password-reset)
    + [12. Accounts](#12-accounts)
- [Configuration](#configuration)
  * [Backend Settings](#backend-settings)
    + [CORS Configuration in Django](#cors-configuration-in-django)
  * [Frontend Settings](#frontend-settings)
    + [baseURL Configuration in `api.ts`](#baseurl-configuration-in-apits)
- [Sample Code Components](#sample-code-components)
  * [EmployeeDetailsByDay.tsx](#employeedetailsbydaytsx)
- [Error Management](#error-management)
  * [How to Handle Errors in the Application](#how-to-handle-errors-in-the-application)
    + [Displaying Error Messages](#displaying-error-messages)
    + [Handling Network Errors](#handling-network-errors)
- [Managing Work Sessions](#managing-work-sessions)
  * [How the Application Manages Work Sessions](#how-the-application-manages-work-sessions)
    + [Current Work Sessions](#current-work-sessions)
    + [Deleting Workplaces When There Are Active Sessions](#deleting-workplaces-when-there-are-active-sessions)
    + [Monitoring Employee Activity](#monitoring-employee-activity)
- [Manual Testing](#manual-testing)
  * [Application Errors - Completed Fixes](#application-errors---completed-fixes)
  * [Application Errors to Fix in the Future](#application-errors-to-fix-in-the-future)
- [About the Author](#about-the-author)
- [License](#license)
- [Acknowledgements](#acknowledgements)

<!-- tocstop -->

---

## Introduction

Gurudo is a modern application designed to facilitate work time management. The application is inspired by the character Gurudo from Dragon Ball, who has the ability to stop time, symbolizing control and effective time management.

Gurudo is a tool intended for both employers and employees. It enables tracking working hours, managing workplaces, and monitoring work sessions in real-time. The application is designed with ease of use and an intuitive interface in mind, to streamline work time management processes as much as possible.

The introduction to Gurudo includes:
- A brief history of the project's inception
- The application's goal and mission
- Key features and capabilities
- Benefits of using the application

The aim of Gurudo is to provide a comprehensive solution for managing work time, which increases efficiency, improves organization, and supports better human resource management in any organization.


---

## System Requirements

To run and use the Gurudo application, the following system requirements must be met:

### Backend
**Python**
  - Version: 3.8 or higher
  - Python is the primary programming language used to build the backend of the application.

**Django**
  - Version: 3.2 or higher
  - Django is the main web framework used to create the backend of the Gurudo application.

**Django REST Framework**
  - Version: 3.12 or higher
  - Used to build the API that communicates with the frontend.

**djangorestframework-simplejwt**
  - Used to manage JWT authorization and authentication.

**cloudinary**
  - Version: 1.25.0 or higher
  - Used for storing and managing media files in the application.

**dj-database-url**
  - Used to configure the database connection.

### Frontend
**Node.js**
  - Version: 14.x or higher
  - Node.js is the JavaScript runtime environment required to run build tools and manage frontend packages.

**npm (Node Package Manager)**
  - Version: 6.x or higher
  - npm is used to manage JavaScript packages and frontend libraries.

**React**
  - Version: 18.2.0 or higher
  - React is a JavaScript library used to build the user interface.

**React Bootstrap**
  - Version: 2.10.2 or higher
  - Used to style frontend components.

**React Router**
  - Version: 6.22.3 or higher
  - Used to manage routes in the frontend application.

**Vite**
  - Version: 5.2.0 or higher
  - Used as a build tool and to run the frontend application.

### Other Tools
**PostgreSQL**
  - Version: 12.x or higher
  - PostgreSQL is the recommended database for storing application data.

**Docker (optional)**
  - Used for containerizing the application, which simplifies deployment and environment management.

### Development Tools
**Visual Studio Code**
  - Version: latest
  - Recommended code editor for working on the project.

**Git**
  - Version: latest
  - Version control system used to manage the project's source code.

**Chrome DevTools / Safari DevTools**
  - Tools for debugging the frontend part of the application.

### System Configuration
**Operating System**
  - Linux, macOS, Windows (preferably with WSL2 installed for Windows)

**Web Browser**
  - Google Chrome, Mozilla Firefox, Safari (latest version)

Ensuring compliance with the above system requirements will enable the proper functioning and usage of the Gurudo application.

---

## Installation Instructions

### Steps to Clone the Repository
1. Open the terminal or command prompt.
2. Navigate to the directory where you want to clone the repository.
3. Execute the following command to clone the repository (frontend):
   ```bash
   git clone https://github.com/lukaszglowacz/bygg-app-front-react.git
4. Navigate to the project directory:
   ```bash
   cd bygg-app-front-react
5. Execute the following command to clone the repository (backend):
   ```bash
   git clone https://github.com/lukaszglowacz/bygg-drf-api.git
6. Navigate to the project directory:
   ```bash
   cd bygg-drf-api
### Instructions for Installing Backend Dependencies (Django)
1. Ensure that you have Python version 3.8 or later installed.
2. Install a virtual environment (venv):
   ```bash
   python -m venv venv
3. Activate the virtual environment:
   - Na systemie Windows:
     ```bash
     venv\Scripts\activate
   - Na systemie macOS/Linux:
     ```bash
     source venv/bin/activate
4. Install backend dependencies from the `requirements.txt` file:
   ```bash
   pip install -r requirements.txt
### Instructions for installing frontend dependencies (React)
1. Ensure you have Node.js version 14.x or newer and npm version 6.x or newer installed.
2. Navigate to the frontend directory:
   ```bash
   cd bygg-app-front-react
3. Install the frontend dependencies:
   ```bash
   npm install
### Running the Backend Server
1. Ensure that the virtual environment is activated.
2. Run the database migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
3. Start the Django server:
    ```bash
    python manage.py runserver
  You should see a message indicating that the server is running at `http://127.0.0.1:8000/`


### Running the Frontend Application
1. Make sure you are in the frontend directory:
   ```bash
   cd bygg-app-front-react
2. Start the development server:
   ```bash
   npm run dev
 You should see a message indicating that the application is running at `http://localhost:3000/`.

---

## Usage
### Examples of Main Application Features

The interface for employees and employers differs based on user permissions.

#### Employee Interface
1. Employees can record their working hours using the "Start" and "End" buttons.
2. Employees can view their work sessions, hour summaries, and historical work session data.
3. The total hours worked are displayed, along with basic information needed to monitor working hours during a specific period.
4. Employees can edit their personal data, change their password, and permanently delete their account.


#### Employer Interface
1. Employers have access to all the functions available to employees.
2. Employers can manage workplaces, including adding, deleting, and editing workplace data.
3. Employers can manage their employees' work sessions, including adding, editing, and deleting sessions.
4. Employers can monitor in real-time which employees are currently active, where they are working, and when they started their work.
5. Employers can remotely end an active work session of any employee.
6. Employers can generate monthly activity reports for each of their employees in PDF format.


 #### Adding Employees
Employees automatically receive employee permissions upon registering for the application. To register, follow these steps:

1. Click the "Sign Up here" button on the login screen.
2. Provide the necessary information (email, password, first name, last name, personnummer).
3. Click the "Sign Up" button.
4. You will be redirected to the login screen.
5. Fill in the login form with the registration details and log into the application.

#### Recording Work Sessions

1. On the homepage, select the workplace from the dropdown list by clicking the building icon.
2. When you are at the workplace and ready to start working, click "Start".
3. When you finish working, click "End".

#### Viewing and Editing Work Sessions

1. Go to the "Team Management" section in the navigation menu.
2. Select an employee.
3. Click the "Show Hours" button.
4. You will be taken to the employee's monthly work session view.
5. Find the month and day of the session you want to edit.
6. Click the "ArrowRight" button next to the date of the work session.
7. You will be taken to the daily view of the work sessions.
8. Click the "Edit" button.
9. Fill out the form with the new data.
10. Click the "Save" button.

#### Generating Monthly Reports

1. Go to the "Team Management" section in the navigation menu.
2. Select an employee.
3. Click the "Show Hours" button.
4. You will be taken to the employee's monthly work session view.
5. Click the "Download" button.
6. A PDF file with the selected employee's monthly summary for the chosen month will be generated.

#### Managing Workplaces

1. Go to the "Locations" section in the navigation menu.
2. Click the "Add" button.
3. Fill out the form with detailed information such as street, street number, postal code, and city.
4. Click the "Save" button to add a new workplace.
5. Employees will now be able to select this workplace from the dropdown menu.
6. To edit a workplace, click the "Edit" button and make the necessary changes.
7. To delete a workplace, click the "Delete" button and confirm the deletion.

### Summary

The Gurudo application offers a range of features that simplify time and workplace management. With an intuitive user interface and advanced functionalities, employers and employees can efficiently manage their duties and work hours.

Following the above steps will help you fully utilize the capabilities of the Gurudo application.


---

## Application Features

#### Employee Management
- Ability to add, edit, and delete employees.
- Review and manage employee data, including their work session history.

#### Workplace Management
- Adding, editing, and deleting workplaces.
- Review available workplaces and assign them to employee work sessions.

#### Work Session Recording
- Employees can start and end work sessions.
- Monitor active work sessions in real time.
- Employers can add, edit, and delete employee work sessions.

#### Report Generation
- Create reports of employee work sessions.
- Generate monthly summaries of employee activities in PDF format.

#### Daily Session Overview
- Review employee work sessions by the selected day.
- Detailed information on the start time, end time, and total work time.

#### Monthly Session Overview
- Review employee work sessions by the selected month.
- Summary of total work time for each day of the month.

#### User Permissions Management
- Ability to assign roles and permissions for employees and employers.
- Manage access to different application functions based on user roles.

#### Intuitive Interface
- Display detailed real-time instructions to facilitate navigation and use of the application.

#### Action Alerts
- Notifications of errors, such as an employer attempting to delete a workplace currently in use by an employee.

#### Integration with External Tools
- Ability to integrate with project management tools and other HR systems.
- API enabling communication with external applications.


---

## Sample Images/Screenshots
### Login
<img src="screenshots/192.168.0.69_3000_(iPhone%20SE).png" alt="Login" style="width: 50%;">

### Sign Up
<img src="screenshots/192.168.0.69_3000_(iPhone%20SE)%20(1).png" alt="Sign Up" style="width: 50%;">

### Reset Password
<img src="screenshots/192.168.0.69_3000_(iPhone%20SE)%20(2).png" alt="Reset password" style="width: 50%;"><img src="screenshots/worktime-app-react-cd9b9f8fb803.herokuapp.com_reset-password_Mw_c8cizw-2fa20e7d90c05fe49da5163e5423b847_(iPhone%20SE).png" alt="Reset password" style="width: 50%;">


### Home
<img src="screenshots/192.168.0.69_3000_(iPhone%20SE)%20(3).png" alt="Home" style="width: 50%;">

### Profile
<img src="screenshots/192.168.0.69_3000_(iPhone%20SE)%20(4).png" alt="Profile" style="width: 50%;"><img src="screenshots/192.168.0.69_3000_(iPhone%20SE)%20(5).png" alt="Profile" style="width: 50%;">

### Month View
<img src="screenshots/192.168.0.69_3000_(iPhone%20SE)%20(7).png" alt="Month View" style="width: 50%;"><img src="screenshots/192.168.0.69_3000_(iPhone%20SE)%20(8).png" alt="Team" style="width: 50%;">

### Team - Employer
<img src="screenshots/192.168.0.69_3000_(iPhone%20SE)%20(9).png" alt="Team" style="width: 50%;"><img src="screenshots/192.168.0.69_3000_(iPhone%20SE)%20(10).png" alt="Month View Employer" style="width: 50%;">

### Month View - Employer
<img src="screenshots/192.168.0.69_3000_(iPhone%20SE)%20(11).png" alt="Add Work Session" style="width: 50%;">

### Add Work Session - Employer
<img src="screenshots/192.168.0.69_3000_(iPhone%20SE)%20(13).png" alt="Confirm Deletion Modal" style="width: 50%;">

### Edit Work Session - Employer
<img src="screenshots/192.168.0.69_3000_(iPhone%20SE)%20(14).png" alt="Workplace" style="width: 50%;">

### Confirm Deletion Modal - Employer
<img src="screenshots/192.168.0.69_3000_(iPhone%20SE)%20(15).png" alt="Navbar" style="width: 50%;">

### Workplace - Employer
<img src="screenshots/192.168.0.69_3000_(iPhone%20SE)%20(16).png" alt="Strona główna" style="width: 50%;">

### Menu
<img src="screenshots/192.168.0.69_3000_(iPhone%20SE)%20(17).png" alt="Strona główna" style="width: 50%;">



---

## API Documentation

### Endpoints

#### 1. Main Endpoint
- **URL:** `/`
- **Method:** GET
- **Description:** This endpoint is the main entry point to the API, typically used to check the status of the API.

#### 2. Admin
- **URL:** `/admin/`
- **Method:** GET, POST
- **Description:** Django admin panel, accessible only to administrators. Used for managing application models.

#### 3. API Authorization
- **URL:** `/api-auth/`
- **Method:** GET, POST
- **Description:** Handles user login and logout via the REST API.

#### 4. Profiles
- **URL:** `/profile/`
- **Method:** GET, POST, PUT, DELETE
- **Description:** Endpoint for managing user profiles. Supports creating, reading, updating, and deleting profiles.

#### 5. Workplaces
- **URL:** `/workplace/`
- **Method:** GET, POST, PUT, DELETE
- **Description:** Endpoint for managing workplaces. Supports creating, reading, updating, and deleting workplaces.

#### 6. Work Sessions
- **URL:** `/worksession/`
- **Method:** GET, POST, PUT, DELETE
- **Description:** Endpoint for managing work sessions. Supports creating, reading, updating, and deleting work sessions.

#### 7. Active Sessions
- **URL:** `/livesession/`
- **Method:** GET
- **Description:** Endpoint for reading currently active work sessions. Supports only reading.

#### 8. Employees
- **URL:** `/employee/`
- **Method:** GET, POST, PUT, DELETE
- **Description:** Endpoint for managing employees. Supports creating, reading, updating, and deleting employees.

#### 9. JWT Token
- **URL:** `/api/token/`
- **Method:** POST
- **Description:** Endpoint for obtaining JWT tokens for logged-in users.

- **URL:** `/api/token/refresh/`
- **Method:** POST
- **Description:** Endpoint for refreshing JWT tokens for logged-in users.

#### 10. User Registration
- **URL:** `/register/`
- **Method:** POST
- **Description:** Endpoint for registering a new user.

#### 11. Password Reset
- **URL:** `/password-reset/`
- **Method:** POST, GET
- **Description:** Endpoint for resetting user passwords. Supports password reset requests and confirmations.

#### 12. Accounts
- **URL:** `/accounts/`
- **Method:** GET, POST, PUT, DELETE
- **Description:** Endpoint for managing user accounts. Supports creating, reading, updating, and deleting accounts.

---

## Configuration

### Backend Settings

#### CORS Configuration in Django

To enable communication between the frontend and backend, configure CORS in the `settings.py` file:

```python
# settings.py

INSTALLED_APPS = [
    ...,
    'corsheaders',
    ...,
]

MIDDLEWARE = [
    ...,
    'corsheaders.middleware.CorsMiddleware',
    ...,
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = [
    'https://worktime-app-api-080c4d35911e.herokuapp.com',
    'https://worktime-app-react-cd9b9f8fb803.herokuapp.com',  
]
``````

### Frontend Settings
#### baseURL Configuration in `api.ts`
The `api.ts` file contains the Axios configuration, including setting the baseURL for HTTP requests to the backend:

``````jsx

import axios, { AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "https://worktime-app-api-080c4d35911e.herokuapp.com", // Ustawienie baseURL dla żądań HTTP do backendu
  headers: {
    "Content-Type": "application/json",
  },
});

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  retry?: boolean;
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest.retry
    ) {
      originalRequest.retry = true;
      try {
        const tokenResponse = await axios.post<{ access: string }>("https://worktime-app-api-080c4d35911e.herokuapp.com/api/token/refresh/", {
          refresh: localStorage.getItem("refreshToken")
        });
        if (tokenResponse.data.access) {
          localStorage.setItem("accessToken", tokenResponse.data.access);
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${tokenResponse.data.access}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError: any) {
        console.error("Error refreshing token:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

``````

---

## Sample Code Components
This section presents code examples for the main components of the application, demonstrating how various parts of the application are built. These components are crucial for the functionality of the application and illustrate how different technologies and libraries are used to implement specific features.

### EmployeeDetailsByDay.tsx
The EmployeeDetailsByDay.tsx component is responsible for displaying detailed information about an employee's work sessions on a selected day for the employer. Below is the sample code for this component.

``````jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { WorkSession, Employee } from "../api/interfaces/types";
import {
  Container,
  Row,
  Col,
  Alert,
  ListGroup,
  Button,
  Card,
} from "react-bootstrap";
import {
  House,
  ClockHistory,
  ClockFill,
  HourglassSplit,
  PersonBadge,
  Envelope,
  PersonCircle,
  ChevronLeft,
  ChevronRight,
  PlusSquare,
  PencilSquare,
  Trash,
} from "react-bootstrap-icons";
import { sumTotalTime } from "../utils/timeUtils";
import { formatTime } from "../utils/dateUtils";
import Loader from "./Loader";
import moment from "moment-timezone";
import ConfirmModal from "./ConfirmModal";

const EmployeeDetailsByDay: React.FC = () => {
  const { id, date } = useParams<{ id: string; date?: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [sessions, setSessions] = useState<WorkSession[]>([]);
  const [totalTime, setTotalTime] = useState<string>("0 h, 0 min");
  const [isLoadingSessions, setIsLoadingSessions] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [sessionToDelete, setSessionToDelete] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await api.get<Employee>(`/employee/${id}`);
        setEmployee(response.data);
      } catch (err) {
        setError("Error retrieving employee data");
      }
    };

    fetchEmployee();
  }, [id]);

  useEffect(() => {
    if (employee) {
      fetchSessions(employee.work_session, date);
    }
  }, [employee, date]);

  const fetchSessions = (allSessions: WorkSession[], date?: string) => {
    setIsLoadingSessions(true);
    const daySessions = getSessionsForDate(allSessions, date);
    setSessions(daySessions);
    setTotalTime(sumTotalTime(daySessions));
    setIsLoadingSessions(false);
  };

  const getSessionsForDate = (sessions: WorkSession[], date?: string) => {
    if (!date) return [];
    const targetDate = moment.tz(date, "Europe/Stockholm");
    const sessionsForDate: WorkSession[] = [];

    sessions.forEach((session) => {
      const start = moment.utc(session.start_time).tz("Europe/Stockholm");
      const end = moment.utc(session.end_time).tz("Europe/Stockholm");

      let currentStart = start.clone();

      while (currentStart.isBefore(end)) {
        const sessionEndOfDay = currentStart.clone().endOf("day");
        const sessionEnd = end.isBefore(sessionEndOfDay)
          ? end
          : sessionEndOfDay;

        if (currentStart.isSame(targetDate, "day")) {
          sessionsForDate.push({
            ...session,
            start_time: currentStart.toISOString(),
            end_time: sessionEnd.toISOString(),
            total_time: calculateTotalTime(currentStart, sessionEnd),
          });
        } else if (
          currentStart.isBefore(targetDate) &&
          sessionEnd.isAfter(targetDate)
        ) {
          const fullDaySessionStart = targetDate.clone().startOf("day");
          const fullDaySessionEnd = targetDate.clone().endOf("day");

          sessionsForDate.push({
            ...session,
            start_time: fullDaySessionStart.toISOString(),
            end_time: fullDaySessionEnd.toISOString(),
            total_time: calculateTotalTime(
              fullDaySessionStart,
              fullDaySessionEnd
            ),
          });
        }

        currentStart = sessionEnd.clone().add(1, "second");
      }
    });

    return sessionsForDate;
  };

  const calculateTotalTime = (
    start: moment.Moment,
    end: moment.Moment
  ): string => {
    const duration = moment.duration(end.diff(start));
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    return `${hours} h, ${minutes} min`;
  };

  const changeDay = (offset: number): void => {
    if (!date) {
      console.error("Date not available");
      return;
    }
    const currentDate = moment.tz(date, "Europe/Stockholm").add(offset, "days");
    navigate(`/employee/${id}/day/${currentDate.format("YYYY-MM-DD")}`);
  };

  const handleEditSession = (sessionId: number) => {
    navigate(`/edit-work-hour/${sessionId}?date=${date}&employeeId=${id}`);
  };

  const handleDeleteSession = (sessionId: number) => {
    setShowModal(true);
    setSessionToDelete(sessionId);
  };

  const confirmDeleteSession = async () => {
    if (sessionToDelete !== null) {
      try {
        await api.delete(`/worksession/${sessionToDelete}`);
        const updatedSessions = sessions.filter(
          (session) => session.id !== sessionToDelete
        );
        setSessions(updatedSessions);
        setTotalTime(sumTotalTime(updatedSessions));
        setShowModal(false);
        setSessionToDelete(null);
      } catch (error) {
        console.error("Error deleting session: ", error);
        setError("Error deleting session");
        setShowModal(false);
        setSessionToDelete(null);
      }
    }
  };

  const handleAddSession = () => {
    navigate(`/add-work-hour?date=${date}&employeeId=${id}`);
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center my-3">
        <Col md={6} className="d-flex justify-content-end">
          <div className="text-center">
            <Button
              variant="primary"
              className="btn-sm p-0"
              onClick={handleAddSession}
              title="Add"
            >
              <PlusSquare size={24} />
            </Button>
            <div>Add</div>
          </div>
        </Col>
      </Row>
      <Row className="justify-content-center mt-3">
        <Col md={6}>
          <Card className="mt-3 mb-3">
            <Card.Header
              as="h6"
              className="d-flex justify-content-center align-items-center"
            >
              Daily summary
            </Card.Header>
            <Card.Body>
              <Card.Text className="small text-muted">
                <PersonCircle className="me-2" />
                {employee?.full_name}
              </Card.Text>
              <Card.Text className="small text-muted">
                <PersonBadge className="me-2" />
                {employee?.personnummer}
              </Card.Text>
              <Card.Text className="small text-muted">
                <Envelope className="me-2" />
                {employee?.user_email}
              </Card.Text>
              <Card.Text className="small text-muted">
                <HourglassSplit className="me-2" />
                <strong>{totalTime}</strong>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="justify-content-center my-3">
        <Col md={6}>
          <Row className="justify-content-between">
            <Col className="text-start">
              <Button className="btn-sm" onClick={() => changeDay(-1)} variant="success">
                <ChevronLeft />
              </Button>
            </Col>

            <Col className="text-center">
              {date ? (
                <>
                  <div
                    className="font-weight-bold"
                    style={{ fontSize: "15px" }}
                  >
                    {moment.tz(date, "Europe/Stockholm").format("D MMMM YYYY")}
                  </div>
                  <small className="text-muted">
                    {moment.tz(date, "Europe/Stockholm").format("dddd")}
                  </small>
                </>
              ) : (
                <span>Date not available</span>
              )}
            </Col>

            <Col className="text-end">
              <Button className="btn-sm" onClick={() => changeDay(1)} variant="success">
                <ChevronRight />
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      {isLoadingSessions && (
        <Row className="justify-content-center my-5">
          <Col md={6} className="text-center">
            <Loader />
          </Col>
        </Row>
      )}
      {!isLoadingSessions && !error && !sessions.length && (
        <Row className="justify-content-center my-3">
          <Col md={6} className="text-center">
            <Alert variant="info" className="text-center">
              No work sessions for this day
            </Alert>
          </Col>
        </Row>
      )}
      {!isLoadingSessions && !error && sessions.length > 0 && (
        <ListGroup className="mb-4">
          {sessions.map((session) => (
            <Row key={session.id} className="justify-content-center">
              <Col md={6}>
                <ListGroup.Item className="mb-2 small">
                  <Row className="align-items-center">
                    <Col xs={12}>
                      <House className="me-2" /> {session.workplace.street} {session.workplace.street_number}, {session.workplace.postal_code} {session.workplace.city}
                    </Col>
                    <Col xs={12}>
                      <ClockFill className="me-2" />{" "}
                      {formatTime(session.start_time)}
                    </Col>
                    <Col xs={12}>
                      <ClockHistory className="me-2" />{" "}
                      {formatTime(session.end_time)}
                    </Col>
                    <Col xs={12}>
                      <HourglassSplit className="me-2" /> {session.total_time}
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <div className="d-flex justify-content-around mt-3">
                        <div className="text-center">
                          <Button
                            variant="outline-success"
                            className="btn-sm p-0"
                            onClick={() => handleEditSession(session.id)}
                            title="Edit"
                          >
                            <PencilSquare size={24} />
                          </Button>
                          <div>Edit</div>
                        </div>
                        <div className="text-center">
                          <Button
                            variant="danger"
                            className="btn-sm p-0"
                            onClick={() => handleDeleteSession(session.id)}
                            title="Delete"
                          >
                            <Trash size={24} />
                          </Button>
                          <div>Delete</div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </Col>
            </Row>
          ))}
        </ListGroup>
      )}

      <ConfirmModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={confirmDeleteSession}
      >
        Confirm deletion of this work session
      </ConfirmModal>
    </Container>
  );
};

export default EmployeeDetailsByDay;

``````

---


## Error Management

Managing errors in the Gurudo application is a crucial aspect of ensuring a high-quality user experience. This section describes how to handle errors to keep the application running smoothly and user-friendly.

### How to Handle Errors in the Application

#### Displaying Error Messages

In the Gurudo application, error messages are displayed using the `Alert` components from the React Bootstrap library. Error messages inform the user about issues that have occurred while using the application and suggest possible corrective actions.

``````jsx
import React, { useState } from 'react';
   import { Alert } from 'react-bootstrap';

   const ErrorNotification = ({ errorMessage }) => {
     return (
       <Alert variant="danger">
         {errorMessage}
       </Alert>
     );
   };

   export default ErrorNotification;
``````

#### Handling Network Errors

The Gurudo application uses the Axios library to perform HTTP requests. Network error handling is implemented by intercepting errors using Axios interceptors.


``````jsx
import axios, { AxiosError, AxiosResponse } from 'axios';

   const api = axios.create({
     baseURL: 'http://localhost:8000',
     headers: {
       'Content-Type': 'application/json',
     },
   });

   api.interceptors.response.use(
     (response: AxiosResponse) => response,
     (error: AxiosError) => {
       if (error.response) {
         // W przypadku błędów serwera, wyświetl komunikat o błędzie
         console.error('Server Error:', error.response.data);
       } else if (error.request) {
         // W przypadku braku odpowiedzi serwera, wyświetl komunikat o błędzie
         console.error('Network Error:', error.request);
       } else {
         // Inne błędy
         console.error('Error:', error.message);
       }
       return Promise.reject(error);
     }
   );

   export default api;
``````

Proper error handling is essential for ensuring the stability and usability of the application. Employing the techniques mentioned above helps in identifying, diagnosing, and resolving issues, leading to a better user experience.

---

## Managing Work Sessions

Managing work sessions is a key aspect of the Gurudo application. Below is a description of how the application handles various aspects of work session management, including current sessions, deleting workplaces when there are active sessions, and other related operations.

### How the Application Manages Work Sessions
#### Current Work Sessions

The Gurudo application tracks current work sessions of employees, providing insight into ongoing activities. Each employee can start and end a work session using the "Start" and "End" buttons on the main page. Information about current sessions is stored and can be reviewed by employers to monitor employee activity.


``````jsx
import React, { useState, useEffect } from "react";
import { Button, Alert, Container, Row, Col } from "react-bootstrap";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import ClockUpdate from "./ClockUpdate";
import WorkplaceSelector from "./WorkplaceSelector";
import ConfirmModal from "./ConfirmModal";
import Loader from "./Loader"; // Import the Loader component

interface Profile {
  id: number;
  user_email: string;
  user_id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  personnummer: string;
  created_at: string;
  updated_at: string;
  image: string;
}

interface Workplace {
  id: number;
  street: string;
  street_number: string;
  postal_code: string;
  city: string;
}

interface Session {
  id: number;
  profile: Profile;
  workplace: Workplace;
  start_time: string;
  status: string;
}

const Home: React.FC = () => {
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
  const [selectedWorkplaceId, setSelectedWorkplaceId] = useState<number>(0);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [alertInfo, setAlertInfo] = useState<string>("");
  const [isActiveSession, setIsActiveSession] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalAction, setModalAction] = useState<() => void>(() => {});
  const [loading, setLoading] = useState(true); // Add loading state

  const { profileId } = useAuth();

  const handleSelectWorkplace = (id: number) => {
    setSelectedWorkplaceId(id);
  };

  useEffect(() => {
    const fetchWorkplacesAndSession = async () => {
      try {
        const workplacesResponse = await api.get("/workplace/");
        setWorkplaces(workplacesResponse.data);

        const sessionResponse = await api.get("/livesession/active/");
        if (sessionResponse.data.length > 0) {
          const userActiveSession = sessionResponse.data.find(
            (session: Session) => session.profile.id === Number(profileId)
          );
          if (userActiveSession) {
            setActiveSession(userActiveSession);
            setIsActiveSession(true);
            setSelectedWorkplaceId(userActiveSession.workplace.id);
            setAlertInfo("Work in progress. Click 'End' when done.");
          } else {
            setActiveSession(null);
            setIsActiveSession(false);
            setSelectedWorkplaceId(0);
            setAlertInfo("No active session. Click 'Start' to begin.");
          }
        } else {
          setActiveSession(null);
          setIsActiveSession(false);
          setSelectedWorkplaceId(0);
          setAlertInfo("Click 'Start' to begin.");
        }
      } catch (error) {
        setAlertInfo("Error fetching data");
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchWorkplacesAndSession();
  }, [profileId]);

  const handleStartSession = () => {
    if (!profileId || selectedWorkplaceId <= 0 || activeSession) {
      setAlertInfo("Select a workplace");
      return;
    }
    setModalText("Start work?");
    setModalAction(() => startSession);
    setShowModal(true);
  };

  const startSession = async () => {
    setShowModal(false);
    try {
      const response = await api.post("/livesession/start/", {
        workplace: selectedWorkplaceId,
        profile: profileId,
      });
      setActiveSession(response.data);
      setIsActiveSession(true);
      setAlertInfo("Session started. Click 'End' to finish");
    } catch (error) {
      console.error("Error starting session", error);
      setAlertInfo("Error starting session");
    }
  };

  const handleEndSession = () => {
    if (!activeSession || !activeSession.id) {
      setAlertInfo("No active session to end");
      return;
    }
    setModalText("End session?");
    setModalAction(() => endSession);
    setShowModal(true);
  };

  const endSession = async () => {
    if (!activeSession) return; // Additional check to ensure activeSession is not null
    setShowModal(false);
    try {
      await api.patch(`/livesession/end/${activeSession.id}/`);
      setActiveSession(null);
      setIsActiveSession(false);
      setSelectedWorkplaceId(0);
      setAlertInfo("Session ended");
    } catch (error) {
      console.error("Error ending session", error);
      setAlertInfo("Error ending session");
    }
  };

  const formatDate = (date: Date) => {
    const weekday = new Date(date).toLocaleDateString("en-EN", {
      weekday: "long",
    });
    const restOfDate = new Date(date).toLocaleDateString("en-EN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return `${weekday}, ${restOfDate}`;
  };

  const today = new Date();
  const formattedDate = formatDate(today);

  if (loading) {
    return <Loader />; // Show Loader while data is being fetched
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Row className="mb-0">
            <Col className="text-secondary text-center mb-0">
              <h2 style={{ fontSize: "18px" }}>{formattedDate}</h2>
            </Col>
          </Row>

          <Row>
            <Col className="text-center mb-4 mt-0">
              <ClockUpdate />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col md={4}>
          <WorkplaceSelector
            workplaces={workplaces}
            selectedWorkplaceId={selectedWorkplaceId}
            onSelect={handleSelectWorkplace}
            isActiveSession={isActiveSession}
          />
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col className="d-grid gap-2 my-3" md={4}>
          {!activeSession && (
            <Button
              variant="secondary"
              onClick={handleStartSession}
              disabled={!!activeSession}
              className="btn-lg"
              style={{ padding: "15px 25px", fontSize: "1rem" }}
            >
              Start
            </Button>
          )}
          {activeSession && (
            <Button
              variant="success"
              onClick={handleEndSession}
              disabled={!activeSession}
              className="btn-lg"
              style={{ padding: "15px 25px", fontSize: "1rem" }}
            >
              End
            </Button>
          )}
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col md={4} className="text-center">
          {alertInfo && <Alert variant="info" className="text-center">{alertInfo}</Alert>}
        </Col>
      </Row>

      <ConfirmModal show={showModal} onHide={() => setShowModal(false)} onConfirm={modalAction}>
        {modalText}
      </ConfirmModal>
    </Container>
  );
};

export default Home;

``````

#### Deleting Workplaces When There Are Active Sessions
To ensure data integrity, the application does not allow the deletion of a workplace if there are active work sessions associated with it. Before deleting a workplace, the application checks to ensure that no employees are currently logged in and working at that location.


``````jsx
import React, { useEffect, useState } from "react";
import { Container, Col, Row, Button, Accordion, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../context/UserProfileContext";
import Loader from "./Loader";
import { PencilSquare, PlusSquare, Trash } from "react-bootstrap-icons";
import ConfirmModal from "./ConfirmModal";
import api from "../api/api";
import { IWorkPlacesData } from "../api/interfaces/types";

const WorkPlaceContainer: React.FC = () => {
  const [workplaces, setWorkplaces] = useState<IWorkPlacesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [workplaceToDelete, setWorkplaceToDelete] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<{ id: number; message: string } | null>(null);
  const navigate = useNavigate();
  const { profile, loadProfile } = useUserProfile();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      await loadProfile();
      setIsAuthenticated(!!profile);
      setLoading(false);
    };

    fetchProfile();
  }, [profile, loadProfile]);

  const fetchWorkplaces = async () => {
    try {
      setLoading(true);
      const response = await api.get<IWorkPlacesData[]>("/workplace/");
      setWorkplaces(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Unable to load workplaces", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkplaces();
  }, []);

  const fetchActiveSessions = async (workplaceId: number) => {
    try {
      const response = await api.get("/employee/");
      const activeSessions = response.data.filter(
        (employee: any) => 
          employee.current_workplace && 
          employee.current_workplace.id === workplaceId &&
          employee.current_session_status === "Trwa"
      );
      return activeSessions.length > 0;
    } catch (error) {
      console.error("Failed to verify workplace usage", error);
      return false;
    }
  };

  const handleAddClick = () => {
    navigate("/add-work-place");
  };

  const handleEditClick = (id: number) => {
    navigate(`/edit-work-place/${id}`);
  };

  const handleDeleteClick = async (id: number) => {
    const isActive = await fetchActiveSessions(id);

    if (isActive) {
      setDeleteError({ id, message: "Cannot delete, workplace in use. Try again later" });
      setTimeout(() => {
        setDeleteError(null);
      }, 3000); // Hide the alert after 5 seconds
    } else {
      setShowModal(true);
      setWorkplaceToDelete(id);
      setDeleteError(null);
    }
  };

  const confirmDeleteWorkplace = async () => {
    if (workplaceToDelete !== null) {
      try {
        await api.delete(`/workplace/${workplaceToDelete}/`);
        setWorkplaceToDelete(null);
        setShowModal(false);
        fetchWorkplaces(); // Refresh the workplaces after deletion
      } catch (error) {
        console.error("Unable to delete workplace", error);
        setShowModal(false);
        setDeleteError({ id: workplaceToDelete, message: "Cannot delete this workplace as it is currently in use. Please try again later." });
        setTimeout(() => {
          setDeleteError(null);
        }, 3000); // Hide the alert after 5 seconds
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container className="mt-4">
      {isAuthenticated && profile?.is_employer && (
        <Row className="justify-content-center my-3">
          <Col md={6} className="d-flex justify-content-end">
            <div className="text-center">
              <Button
                variant="primary"
                className="btn-sm p-0"
                onClick={handleAddClick}
                title="Add"
              >
                <PlusSquare size={24} />
              </Button>
              <div>Add</div>
            </div>
          </Col>
        </Row>
      )}
      <Row className="justify-content-center mt-3">
        <Col md={6}>
          <Accordion className="text-center">
            {workplaces.map((workplace, index) => (
              <Accordion.Item eventKey={String(index)} key={workplace.id}>
                <Accordion.Header className="text-center">
                  <div className="d-flex flex-column justify-content-center">
                    <span>{`${workplace.street} ${workplace.street_number}`}</span>
                    <span>{`${workplace.postal_code} ${workplace.city}`}</span>
                  </div>
                </Accordion.Header>

                {isAuthenticated && profile?.is_employer && (
                  <Accordion.Body>
                    <div className="d-flex justify-content-around mt-3">
                      <div className="text-center">
                        <Button
                          variant="outline-success"
                          className="btn-sm p-0"
                          onClick={() => handleEditClick(workplace.id)}
                          title="Edit"
                        >
                          <PencilSquare size={24} />
                        </Button>
                        <div>Edit</div>
                      </div>
                      <div className="text-center">
                        <Button
                          variant="danger"
                          className="btn-sm p-0"
                          onClick={() => handleDeleteClick(workplace.id)}
                          title="Delete"
                        >
                          <Trash size={24} />
                        </Button>
                        <div>Delete</div>
                      </div>
                    </div>
                    {deleteError && deleteError.id === workplace.id && (
                      <Alert variant="warning" className="mt-3 text-center">
                        {deleteError.message}
                      </Alert>
                    )}
                  </Accordion.Body>
                )}
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
      </Row>

      <ConfirmModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={confirmDeleteWorkplace}
      >
        Are you sure you want to delete this workplace?
      </ConfirmModal>
    </Container>
  );
};

export default WorkPlaceContainer;

``````

#### Monitoring Employee Activity
Employers have access to view the current activity of their employees. They can see which employees are currently logged in and where they are working, allowing for better team and resource management.


``````jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import api from "../api/api";
import { Employee } from "../api/interfaces/types";
import { Container, Row, Col, Button } from "react-bootstrap";
import {
  HourglassSplit,
  Person,
  PersonFill,
  GeoAlt,
  CheckCircle,
  XCircle,
  Power,
  Clock,
  ClockHistory,
} from "react-bootstrap-icons";
import TimeElapsed from "./TimeElapsed";
import Loader from "./Loader";
import ConfirmModal from "./ConfirmModal";
import { formatDateTime } from "../utils/dateUtils";

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get<Employee[]>("/employee");
        setEmployees(response.data);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching employees:", err);
        setError("Error fetching employees");
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleEmployee = (id: number) => {
    navigate(`/employees/${id}`);
  };

  const handleEndSession = async () => {
    if (selectedSessionId !== null) {
      try {
        await api.patch(`/livesession/end/${selectedSessionId}/`);
        const updatedEmployees = employees.map((employee) =>
          employee.current_session_id === selectedSessionId
            ? { ...employee, current_session_status: "Zakończona" }
            : employee
        );
        setEmployees(updatedEmployees);
        setShowModal(false);
      } catch (error) {
        console.error("Error ending session", error);
        setError("Error ending session");
      }
    }
  };

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <Accordion>
            {employees.map((employee, index) => (
              <Accordion.Item eventKey={String(index)} key={employee.id}>
                <Accordion.Header>
                  {employee.current_session_status === "Trwa" ? (
                    <PersonFill className="me-2 text-success" />
                  ) : (
                    <Person className="me-2" />
                  )}
                  {employee.full_name}
                </Accordion.Header>
                <Accordion.Body
                  style={{ fontSize: "0.9em", lineHeight: "1.6" }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center">
                      {employee.current_session_status === "Trwa" ? (
                        <CheckCircle className="text-success me-2" />
                      ) : (
                        <XCircle className="text-danger me-2" />
                      )}
                      {employee.current_session_status === "Trwa"
                        ? "Currently working"
                        : "Not working"}
                    </div>
                  </div>
                  {employee.current_session_status === "Trwa" && (
                    <>
                      <div className="d-flex align-items-center mb-2">
                        <GeoAlt className="me-2" />
                        {employee.current_workplace && (
                          `${employee.current_workplace.street} ${employee.current_workplace.street_number}, ${employee.current_workplace.postal_code} ${employee.current_workplace.city}`
                        )}
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <Clock className="me-2" />
                        {formatDateTime(employee.current_session_start_time)}
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <HourglassSplit className="me-2" />
                        <TimeElapsed
                          startTime={employee.current_session_start_time}
                        />
                      </div>
                    </>
                  )}
                  <div className="d-flex justify-content-around mt-3">
                    <div className="text-center">
                      <Button
                        variant="primary"
                        className="btn-sm p-0"
                        onClick={() => handleEmployee(employee.id)}
                        title="Show More"
                      >
                        <ClockHistory size={24} />
                      </Button>
                      <div>Show Hours</div>
                    </div>
                    {employee.current_session_status === "Trwa" && (
                      <div className="text-center">
                        <Button
                          variant="danger"
                          className="btn-sm p-0"
                          onClick={() => {
                            setSelectedSessionId(employee.current_session_id);
                            setShowModal(true);
                          }}
                          title="End Session"
                        >
                          <Power size={24} />
                        </Button>
                        <div>End Session</div>
                      </div>
                    )}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
      </Row>

      <ConfirmModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={handleEndSession}
      >
        Confirm ending this session
      </ConfirmModal>
    </Container>
  );
};

export default EmployeeList;

``````

Work session management in the Gurudo application is designed to provide both employees and employers with efficient tools to monitor and manage work hours.

---

## Manual Testing
### Application Errors - Completed Fixes

1. **Error editing work hours on the phone.**
   - The error was related to passing an object as a string when the server expected only a numeric ID type. Fixed.

2. **Improvement of "Next" and "Back" button styles.**
   - The buttons were too large, hindering proper UX. Updated style.

3. **Return from editing work hours to the specific day.**
   - The application did not return to the previous view after editing work hours. Fixed.

4. **Employer return from day view to month view.**
   - The error was related to an incorrect endpoint. Now correctly loads user data upon return.

5. **Lack of key icon in the password change form.**
   - Added the ability to toggle password visibility in the password change form.

6. **Information about link expiration.**
   - Added an alert informing about link expiration and a redirection to the password recovery function if the user wishes to reset the password.

7. **Weak internet connection.**
   - Added a network connection alert. The alert appears when the user is out of network range and disappears when the connection is restored.

8. **Loader on the daily view.**
   - Optimized loader functionality to load only work sessions, not the entire component.

9. **Loader on buttons.**
   - Added a loader to buttons to inform the user to wait for a server response.

10. **Title and back button in Navbar on the work session addition view.**
    - Added correct title and back button.

11. **Modal for deleting work session.**
    - Added a confirmation modal for deleting a work session, increasing operational security.

12. **Modal for deleting workplace.**
    - Added a confirmation modal for deleting a workplace and refreshing the workplace list after deletion.

13. **User profile deletion.**
    - Added the ability for a user to delete their account with confirmation and information about the irreversibility of the operation.

14. **Blocking workplace deletion with active sessions.**
    - Added a function to prevent deleting a workplace if someone is currently working there.

15. **Refreshing state after adding work hours by the employer.**
    - Added automatic state refresh of work hours after addition.

16. **Issue loading work sessions by new user.**
    - Added an alert informing about no work sessions for new users.

17. **Blocking login page access for logged-in users.**
    - Added a function redirecting logged-in users to the home page.

18. **Automatic logout after password change.**
    - Users are now automatically logged out and redirected to the login page after changing their password.

19. **Improved alert display.**
    - Improved alert display style and categorized them (info, warning, danger).

20. **Improved active session view.**
    - Standardized the active session user view.

21. **Day names in the monthly view.**
    - Added day names to the monthly view for better clarity.

22. **Standardized workplace addresses.**
    - Standardized the format of displaying workplace addresses.

23. **Capitalization of first and last name.**
    - Implemented automatic capitalization of the user's first and last name.

### Application Errors to Fix in the Future

1. **Activation link after registration via email.**
   - Implementing a function to send an activation link to the user's email to confirm authenticity. This will increase security and prevent registration with non-existent email addresses.

---

## About the Author

The Gurudo project was created and is maintained by Lucka Baron, an experienced Full Stack Developer. If you have any questions about the project, need assistance, or have suggestions for the development of the application, please contact:

- **Name:** Lucka Baron
- **Role:** Full Stack Developer
- **Email:** bakatjur@gmail.com

Lucka Baron is open to any questions and is happy to help resolve any issues related to the Gurudo application.


---

## License

The Gurudo project is released under the MIT License. Detailed information about the license is provided below:



``````
MIT License

  Copyright (c) 2024 Lucka Baron

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
``````
  

---

## Acknowledgements

Special thanks to:

- My girlfriend, Swietłana, who supported me at every stage of the project.
- Everyone who helped with manual testing and used the application.
- Friends who inspired me to create the application.

Thank you for your invaluable help and support.

Lucka