import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Button, InputGroup, FormControl } from "react-bootstrap";
import { Download } from "react-bootstrap-icons";
import { Employee } from "../api/interfaces/types";

interface Params {
  [key: string]: string | undefined;
}

const EmployeeDetails: React.FC = () => {
  const { id } = useParams<Params>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [week, setWeek] = useState<string>("1");

  useEffect(() => {
    // Sprawdzenie czy id istnieje i jest poprawne, zanim wykonamy parsowanie i szukanie pracownika
    if (id) {
      const employeeId = parseInt(id, 10);
      if (!isNaN(employeeId)) {
        const employeeData = findEmployeeById(employeeId);
        setEmployee(employeeData);
      }
    }
  }, [id]);

  if (!employee)
    return <Card body>Wybierz pracownika, aby zobaczyć szczegóły.</Card>;

  return (
    <Card>
      <Card.Header>Szczegóły pracownika: {employee?.name}</Card.Header>
      <Card.Body>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Tydzień (1-52)"
            aria-label="Tydzień"
            type="number"
            min="1"
            max="52"
            value={week}
            onChange={(e) => setWeek(e.target.value)}
          />
        </InputGroup>
        <Button
          variant="primary"
          onClick={() => console.log("Eksportowanie do PDF")}
        >
          <Download /> Eksportuj tydzień {week} do PDF
        </Button>
      </Card.Body>
    </Card>
  );
};

const findEmployeeById = (id: number): Employee | null => {
  // Implementacja funkcji zależy od dostępu do danych
  // Poniżej przykładowa implementacja
  const employees: Employee[] = [
    {
      id: 1,
      name: "Jan Kowalski",
      details: {
        hoursWorked: 40,
        workPlace: "Biuro Główne",
        startHour: "08:00",
        endHour: "16:00",
      },
    },
    {
      id: 2,
      name: "Anna Nowak",
      details: {
        hoursWorked: 35,
        workPlace: "Oddział Warszawa",
        startHour: "09:00",
        endHour: "17:00",
      },
    },
    {
      id: 3,
      name: "Piotr Zalewski",
      details: {
        hoursWorked: 45,
        workPlace: "Biuro Kraków",
        startHour: "10:00",
        endHour: "18:00",
      },
    },
  ];
  return employees.find((employee) => employee.id === id) || null;
};

export default EmployeeDetails;
