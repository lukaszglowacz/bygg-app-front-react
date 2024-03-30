import React from "react";
import { useWorkTimeData } from "../hooks/useWorkTimeData";
import { Container, Col, Row, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const WorkHour: React.FC = () => {
  const workTimes = useWorkTimeData();
  const navigate = useNavigate(); // Hook do nawigowania

  const handleAddClick = () => {
    navigate('/addworkhour'); // Przekierowanie do AddWorkHour
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Godziny pracy</h1>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Pracownik</th>
                <th>Personnummer</th>
                <th>Miejsce pracy</th>
                <th>Start</th>
                <th>Koniec</th>
                <th>Łącznie</th>
              </tr>
            </thead>
            <tbody>
              {workTimes.map((workTime, index) => (
                <tr key={workTime.id}>
                  <td>{index + 1}</td>
                  {/* Teraz bezpośrednio korzystamy z danych zwróconych przez API */}
                  <td>{`${workTime.user_first_name} ${workTime.user_last_name}`}</td>
                  <td>{workTime.user_personnummer}</td>
                  <td>{workTime.workplace_detail}</td>
                  <td>{new Date(workTime.start_time).toLocaleString()}</td>
                  <td>{new Date(workTime.end_time).toLocaleString()}</td>
                  <td>{workTime.total_time} h</td>
                </tr>
              ))}
            </tbody>
            
          </Table>
          <Button variant="success" onClick={handleAddClick}>Dodaj</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default WorkHour;
