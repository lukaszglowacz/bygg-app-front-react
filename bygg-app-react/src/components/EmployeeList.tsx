// src/components/EmployeeList.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { Employee } from '../api/interfaces/types';

const EmployeeList: React.FC = () => {
  const navigate = useNavigate();
  const employees: Employee[] = [
    { id: 1, name: "Jan Kowalski", details: { hoursWorked: 40, workPlace: "Biuro Główne", startHour: "08:00", endHour: "16:00" } },
    { id: 2, name: "Anna Nowak", details: { hoursWorked: 35, workPlace: "Oddział Warszawa", startHour: "09:00", endHour: "17:00" } },
    { id: 3, name: "Piotr Zalewski", details: { hoursWorked: 45, workPlace: "Biuro Kraków", startHour: "10:00", endHour: "18:00" } }
  ];

  const handleSelectEmployee = (employeeId: number) => {
    navigate(`/employees/${employeeId}`);
  };

  return (
    <ListGroup>
      {employees.map(employee => (
        <ListGroupItem key={employee.id} action onClick={() => handleSelectEmployee(employee.id)}>
          {employee.name}
        </ListGroupItem>
      ))}
    </ListGroup>
  );
};

export default EmployeeList;
