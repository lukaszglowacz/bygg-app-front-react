import React, { useState } from "react";
import { Dropdown, Container } from "react-bootstrap";
import { BiBuildingHouse } from "react-icons/bi"; // Ikona dla miejsca pracy

interface Workplace {
  id: number;
  street: string;
  street_number: string;
  postal_code: string;
  city: string;
}

interface WorkplaceSelectorProps {
  workplaces: Workplace[];
  onSelect: (id: string) => void;
  isActiveSession: boolean;
}

const WorkplaceSelector: React.FC<WorkplaceSelectorProps> = ({
  workplaces,
  onSelect,
  isActiveSession,
}) => {
  const [selectedWorkplace, setSelectedWorkplace] = useState<string>("");

  const handleSelect = (eventKey: string | null) => {
    const newSelectedWorkplace = eventKey ?? "";
    setSelectedWorkplace(newSelectedWorkplace);
    onSelect(newSelectedWorkplace);
  };

  return (
    <Container className="d-flex justify-content-center align-items-start flex-column">
      <Dropdown onSelect={handleSelect} className="text-center">
        <Dropdown.Toggle
          variant={isActiveSession ? "outline-success" : "success"}
          id="dropdown-basic"
          className="rounded-circle"
          style={{
            width: "60px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0",
            backgroundColor: isActiveSession ? "transparent" : "green",
            border: "none",
          }}
        >
          <BiBuildingHouse
            style={{
              color: isActiveSession ? "green" : "white",
              fontSize: "20px",
            }}
          />
        </Dropdown.Toggle>

        {(isActiveSession || selectedWorkplace) && (
          <div className="text-success mt-2 text-center">
            {`${
              workplaces.find((wp) => wp.id.toString() === selectedWorkplace)
                ?.street
            } ${
              workplaces.find((wp) => wp.id.toString() === selectedWorkplace)
                ?.street_number
            }, ${
              workplaces.find((wp) => wp.id.toString() === selectedWorkplace)
                ?.postal_code
            } ${
              workplaces.find((wp) => wp.id.toString() === selectedWorkplace)
                ?.city
            }`}
          </div>
        )}

        <Dropdown.Menu>
          {workplaces.map((workplace) => (
            <Dropdown.Item
              key={workplace.id}
              eventKey={workplace.id.toString()}
            >
              <BiBuildingHouse style={{ marginRight: "5px" }} />
              {`${workplace.street} ${workplace.street_number}, ${workplace.postal_code} ${workplace.city}`}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </Container>
  );
};

export default WorkplaceSelector;
