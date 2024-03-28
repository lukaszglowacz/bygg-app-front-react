import React, { useState, useEffect } from "react";
import { Container, Row, Col, Dropdown, DropdownButton, Button } from "react-bootstrap";
import { useWorkPlaceData } from "../hooks/useWorkplaceData";
import { IWorkPlacesData } from "../api/interfaces/types";

const Home: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [selectedWorkPlaceId, setSelectedWorkPlaceId] = useState<number | null>(null);
  const workplaces = useWorkPlaceData();

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}:${seconds}`);

      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const day = now.getDate().toString().padStart(2, "0");
      const month = months[now.getMonth()];
      const year = now.getFullYear();
      setCurrentDate(`${day} ${month} ${year}`);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Tutaj dodajemy typowanie dla parametru 'workplace'
  const formatAddress = (workplace: IWorkPlacesData) => {
    return `${workplace.street} ${workplace.street_number}, ${workplace.postal_code} ${workplace.city}`;
  };

  const handleWorkPlaceSelect = (id: number) => {
    setSelectedWorkPlaceId(id);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6} className="text-center">
          <h1 style={{ fontSize: '2.5rem' }}>{currentTime}</h1>
          <p>{currentDate}</p>
          <DropdownButton id="dropdown-basic-button" title="Wybierz miejsce pracy">
            {workplaces.map((workplace) => (
              <Dropdown.Item 
                key={workplace.id} 
                onClick={() => handleWorkPlaceSelect(workplace.id)}
                active={workplace.id === selectedWorkPlaceId}>
                {formatAddress(workplace)}
              </Dropdown.Item>
            ))}
          </DropdownButton>
          <div className="mt-3">
            <Button variant="success" className="me-2">Zaloguj</Button>
            <Button variant="danger">Wyloguj</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
