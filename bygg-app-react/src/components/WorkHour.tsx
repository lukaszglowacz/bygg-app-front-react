import React, { useState, useMemo, useEffect } from "react";
import { useWorkTimeData } from "../hooks/useWorkTimeData";
import { Container, Col, Row, Table, Form, InputGroup } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaCalendarAlt } from "react-icons/fa";

function parseDate(dateStr: string): Date {
  const [date, time] = dateStr.split(' ');
  const [day, month, year] = date.split('.');
  const [hours, minutes] = time.split(':');
  // Tworzenie nowego obiektu Date używając formatu rok, miesiąc (od 0), dzień, godziny, minuty
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
}

const WorkHour: React.FC = () => {
  const { workTimes, fetchData, hasMore } = useWorkTimeData();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedWorkplace, setSelectedWorkplace] = useState("");
  const [selectedDate, setSelectedDate] = useState("");  // Stan dla wybranej daty

  const users = useMemo(() => {
    const uniqueUsers = new Map();
    workTimes.forEach((wt) => {
      if (!uniqueUsers.has(wt.user_personnummer)) {
        uniqueUsers.set(wt.user_personnummer, `${wt.user_first_name} ${wt.user_last_name}`);
      }
    });
    return Array.from(uniqueUsers.entries());
  }, [workTimes]);

  const workplaces = useMemo(() => {
    const uniqueWorkplaces = new Map();
    workTimes.forEach((wt) => {
      if (!uniqueWorkplaces.has(wt.workplace_detail)) {
        uniqueWorkplaces.set(wt.workplace_detail, wt.workplace_detail);
      }
    });
    return Array.from(uniqueWorkplaces.keys());
  }, [workTimes]);

  const filteredWorkTimes = useMemo(() => {
    return workTimes.filter((wt) => {
      const wtDate = parseDate(wt.start_time);
      wtDate.setHours(0, 0, 0, 0);
      const selectedDateObj = new Date(selectedDate);
      selectedDateObj.setHours(0, 0, 0, 0);
      return (
        (selectedUserId ? wt.user_personnummer === selectedUserId : true) &&
        (selectedWorkplace ? wt.workplace_detail === selectedWorkplace : true) &&
        (selectedDate ? wtDate.getTime() === selectedDateObj.getTime() : true)
      );
    });
  }, [workTimes, selectedUserId, selectedWorkplace, selectedDate]);

  return (
    <Container>
      <Row>
        <Col>
          <h1>Godziny pracy</h1>
          <Form>
            <Form.Group>
              <Form.Label>Użytkownik</Form.Label>
              <Form.Control as="select" value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
                <option value="">Wszyscy użytkownicy</option>
                {users.map(([personnummer, name]) => (
                  <option key={personnummer} value={personnummer}>{name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Miejsce pracy</Form.Label>
              <Form.Control as="select" value={selectedWorkplace} onChange={(e) => setSelectedWorkplace(e.target.value)}>
                <option value="">Wszystkie miejsca pracy</option>
                {workplaces.map((place) => (
                  <option key={place} value={place}>{place}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Data rozpoczęcia</Form.Label>
              <InputGroup>
                <InputGroup.Text><FaCalendarAlt /></InputGroup.Text>
                <Form.Control
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </InputGroup>
            </Form.Group>
          </Form>
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
