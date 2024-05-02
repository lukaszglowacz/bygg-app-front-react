import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import api from '../api/api'; // Upewnij się, że ścieżka do API jest poprawna
import { Employee } from '../api/interfaces/types'; // Upewnij się, że ten typ danych jest poprawnie zdefiniowany
import { Button } from 'react-bootstrap';
import { CalendarDate, Person, GeoAlt, ClockHistory, InfoCircleFill, CircleFill } from 'react-bootstrap-icons';

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get<Employee[]>('/employee');
        setEmployees(response.data); // Zakładamy, że odpowiedź API to bezpośrednio lista pracowników
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching employees:", err);
        setError('Failed to fetch employees');
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Accordion defaultActiveKey="0">
      {employees.map((employee, index) => (
        <Accordion.Item eventKey={String(index)} key={employee.id}>
          <Accordion.Header>
            <Person className="me-2" /> {employee.full_name}
          </Accordion.Header>
          <Accordion.Body>
          <div>
      <InfoCircleFill className="me-2" />
      {employee.current_session_status} 
      {employee.current_session_status === 'Trwa' ? (
        <CircleFill color="green" className="me-2" />
      ) : (
        <CircleFill color="red" className="me-2" />
      )}
      
    </div>
            <div><GeoAlt className="me-2" />{employee.current_workplace}</div>
            <div><ClockHistory className="me-2" />{employee.current_session_start_time}</div>
            <Button variant="link" onClick={() => alert('Szczegóły pracownika')}>
              <InfoCircleFill className="me-2" /> Szczegóły pracownika
            </Button>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default EmployeeList;
