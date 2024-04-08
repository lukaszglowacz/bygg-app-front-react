import React from "react";
import { useWorkTimeData } from "../hooks/useWorkTimeData";
import { Container, Col, Row, Table, Button } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";

const WorkHour: React.FC = () => {
  const {workTimes, fetchData, hasMore }= useWorkTimeData();
  const navigate = useNavigate(); // Hook do nawigowania

  const handleAddClick = () => {
    navigate('/addworkhour'); // Przekierowanie do AddWorkHour
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Godziny pracy</h1>
          <Button variant="success" onClick={handleAddClick} style={{ marginBottom: "10px" }}>
            Dodaj
          </Button>
          <InfiniteScroll
            dataLength={workTimes.length}
            next={fetchData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: 'center' }}>
                <b>Swietnie! To juz wszystkie godziny pracy!</b>
              </p>
            }
          >
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Lp</th>
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
                    <td>{`${workTime.user_first_name} ${workTime.user_last_name}`}</td>
                    <td>{workTime.user_personnummer}</td>
                    <td>{workTime.workplace_detail}</td>
                    <td>{workTime.start_time}</td>
                    <td>{workTime.end_time}</td>
                    <td>{workTime.total_time} h</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </InfiniteScroll>
        </Col>
      </Row>
    </Container>
  );
};

export default WorkHour;
