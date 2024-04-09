import React, { useState, useMemo } from "react";
import { useWorkTimeData } from "../hooks/useWorkTimeData";
import { Container, Col, Row, Table, Form } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";

const WorkHour: React.FC = () => {
  const { workTimes, fetchData, hasMore } = useWorkTimeData();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedWorkplace, setSelectedWorkplace] = useState("");

  // Utworzenie listy unikalnych użytkowników
  const users = useMemo(() => {
    const uniqueUsers = new Map();
    workTimes.forEach((wt) => {
      if (!uniqueUsers.has(wt.user_personnummer)) {
        uniqueUsers.set(wt.user_personnummer, `${wt.user_first_name} ${wt.user_last_name}`);
      }
    });
    return Array.from(uniqueUsers.entries());
  }, [workTimes]);

  // Utworzenie listy unikalnych miejsc pracy
  const workplaces = useMemo(() => {
    const uniqueWorkplaces = new Map();
    workTimes.forEach((wt) => {
      if (!uniqueWorkplaces.has(wt.workplace_detail)) {
        uniqueWorkplaces.set(wt.workplace_detail, wt.workplace_detail);
      }
    });
    return Array.from(uniqueWorkplaces.keys());
  }, [workTimes]);

  // Filtrowanie danych na podstawie wybranego użytkownika i miejsca pracy
  const filteredWorkTimes = useMemo(() => {
    return workTimes.filter((wt) => (
      (selectedUserId ? wt.user_personnummer === selectedUserId : true) &&
      (selectedWorkplace ? wt.workplace_detail === selectedWorkplace : true)
    ));
  }, [workTimes, selectedUserId, selectedWorkplace]);

  return (
    <Container>
      <Row>
        <Col>
          <h1>Godziny pracy</h1>
          <Form.Control as="select" value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
            <option value="">Wszyscy użytkownicy</option>
            {users.map(([personnummer, name]) => (
              <option key={personnummer} value={personnummer}>
                {name}
              </option>
            ))}
          </Form.Control>
          <Form.Control as="select" value={selectedWorkplace} onChange={(e) => setSelectedWorkplace(e.target.value)}>
            <option value="">Wszystkie miejsca pracy</option>
            {workplaces.map((place) => (
              <option key={place} value={place}>
                {place}
              </option>
            ))}
          </Form.Control>
          <InfiniteScroll
            dataLength={filteredWorkTimes.length}
            next={fetchData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Świetnie! To już wszystkie godziny pracy!</b>
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
                {filteredWorkTimes.map((workTime, index) => (
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
