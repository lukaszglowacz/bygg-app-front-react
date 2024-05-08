import React from "react";
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
  onSelect: (id: number) => void;
  isActiveSession: boolean;
  selectedWorkplaceId: number;
}

const WorkplaceSelector: React.FC<WorkplaceSelectorProps> = ({
  workplaces,
  onSelect,
  isActiveSession,
  selectedWorkplaceId,
}) => {
  const handleSelect = (eventKey: string | null) => {
    const newSelectedWorkplaceId = parseInt(eventKey ?? "0");
    onSelect(newSelectedWorkplaceId);
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
            backgroundColor: isActiveSession ? "transparent" : "grey",
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

        {(isActiveSession || selectedWorkplaceId !== 0) && (
          <div className="text-secondary mt-2 text-center">
            {`${
              workplaces.find((wp) => wp.id === selectedWorkplaceId)?.street
            } ${
              workplaces.find((wp) => wp.id === selectedWorkplaceId)
                ?.street_number
            }, ${
              workplaces.find((wp) => wp.id === selectedWorkplaceId)
                ?.postal_code
            } ${workplaces.find((wp) => wp.id === selectedWorkplaceId)?.city}`}
          </div>
        )}

        <Dropdown.Menu>
          {workplaces.map((workplace) => (
            <Dropdown.Item
              key={workplace.id}
              eventKey={workplace.id.toString()}
              onClick={() => handleSelect(workplace.id.toString())}
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
