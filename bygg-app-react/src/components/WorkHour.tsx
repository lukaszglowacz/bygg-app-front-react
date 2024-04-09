import React from "react";
import { useWorkTimeData } from "../hooks/useWorkTimeData";
import { Container, Col, Row, Table, Button } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";

const WorkHour: React.FC = () => {
  const { workTimes, fetchData, hasMore } = useWorkTimeData();


  return (
    <Container>
      <Row>
        <Col>
          <h1>Godziny pracy</h1>
          
          <InfiniteScroll
            dataLength={workTimes.length}
            next={fetchData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: "center" }}>
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
                  <th>Czas pracy</th>
                </tr>
              </thead>
              <tbody>
                {workTimes.map((workTime, index) => (
                  <tr key={`${workTime.id}-${index}`}>
                    <td>{index + 1}</td>
                    <td>{`${workTime.user_first_name} ${workTime.user_last_name}`}</td>
                    <td>{workTime.user_personnummer}</td>
                    <td>{workTime.workplace_detail}</td>
                    <td>{workTime.start_time}</td>
                    <td>{workTime.end_time}</td>
                    <td>{workTime.total_time}</td>
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
