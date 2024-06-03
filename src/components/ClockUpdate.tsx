import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";

const ClockUpdate: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Aktualizacja co 1000 ms, czyli co 1 sekundę

    return () => clearInterval(intervalId); // Czyszczenie interwału przy demontażu komponentu
  }, []); // Pusta tablica zależności oznacza, że efekt uruchomi się tylko przy montowaniu

  return (
    <Container>
      <Row>
        <Col>
          <h1
            style={{
              fontSize: "70px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {currentTime.toLocaleTimeString([], {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            })}
          </h1>
        </Col>
      </Row>
    </Container>
  );
};

export default ClockUpdate;
