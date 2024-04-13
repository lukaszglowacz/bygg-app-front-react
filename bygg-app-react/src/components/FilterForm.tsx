import React from "react";
import { Row, Col, Form, Button } from "react-bootstrap";

interface FilterFormProps {
  profiles: Array<{
    id: number;
    full_name: string;
  }>;
  workplaces: Array<{
    id: number;
    street: string;
  }>;
  filters: {
    profile: string;
    workplace: string;
    start_min: string;
    start_max: string;
  };
  setFilters: (filters: any) => void; // Możesz zdefiniować dokładniejszy typ
  fetchWorkSessionsWithFilters: () => void;
}

export const FilterForm: React.FC<FilterFormProps> = ({
  profiles,
  workplaces,
  filters,
  setFilters,
  fetchWorkSessionsWithFilters,
}) => {
  return (
    <Form>
      <Row className="mb-3">
        <Col xs={12} md={6}>
          <Form.Group controlId="profileSelect">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">
                  <i className="bi bi-person-fill" />
                </span>
              </div>
              <Form.Control
                as="select"
                value={filters.profile}
                onChange={(e) =>
                  setFilters({ ...filters, profile: e.target.value })
                }
                aria-label="Profile"
                aria-describedby="basic-addon1"
              >
                <option value="">Wszyscy</option>
                {profiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.full_name}
                  </option>
                ))}
              </Form.Control>
            </div>
          </Form.Group>
        </Col>
        <Col xs={12} md={6}>
          <Form.Group controlId="workplaceSelect">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon2">
                  <i className="bi bi-geo-alt-fill" />
                </span>
              </div>
              <Form.Control
                as="select"
                value={filters.workplace}
                onChange={(e) =>
                  setFilters({ ...filters, workplace: e.target.value })
                }
                aria-label="Workplace"
                aria-describedby="basic-addon2"
              >
                <option value="">Wybierz miejsce pracy</option>
                {workplaces.map((workplace) => (
                  <option key={workplace.id} value={workplace.id}>
                    {workplace.street}
                  </option>
                ))}
              </Form.Control>
            </div>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={6}>
          <Form.Group controlId="startDateSelect">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon3">
                  <i className="bi bi-calendar" />
                </span>
              </div>
              <Form.Control
                type="date"
                value={filters.start_min}
                onChange={(e) =>
                  setFilters({ ...filters, start_min: e.target.value })
                }
                aria-label="Start Date"
                aria-describedby="basic-addon3"
              />
            </div>
          </Form.Group>
        </Col>
        <Col xs={12} md={6}>
          <Form.Group controlId="endDateSelect">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon4">
                  <i className="bi bi-calendar2" />
                </span>
              </div>
              <Form.Control
                type="date"
                value={filters.start_max}
                onChange={(e) =>
                  setFilters({ ...filters, start_max: e.target.value })
                }
                aria-label="End Date"
                aria-describedby="basic-addon4"
              />
            </div>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <Button
            onClick={fetchWorkSessionsWithFilters}
            variant="outline-success"
            className="mb-4 mt-2"
          >
            Filtruj
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
