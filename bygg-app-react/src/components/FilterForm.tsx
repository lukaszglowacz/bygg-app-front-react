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
        <Col>
          <Form.Group>
            <Form.Label>Profil</Form.Label>
            <Form.Control
              as="select"
              value={filters.profile}
              onChange={(e) =>
                setFilters({ ...filters, profile: e.target.value })
              }
            >
              <option value="">Wszyscy</option>
              {profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.full_name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Miejsce pracy</Form.Label>
            <Form.Control
              as="select"
              value={filters.workplace}
              onChange={(e) =>
                setFilters({ ...filters, workplace: e.target.value })
              }
            >
              <option value="">Wybierz miejsce pracy</option>
              {workplaces.map((workplace) => (
                <option key={workplace.id} value={workplace.id}>
                  {workplace.street}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label>Data rozpoczęcia (Od)</Form.Label>
            <Form.Control
              type="date"
              value={filters.start_min}
              onChange={(e) =>
                setFilters({ ...filters, start_min: e.target.value })
              }
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Data rozpoczęcia (Do)</Form.Label>
            <Form.Control
              type="date"
              value={filters.start_max}
              onChange={(e) =>
                setFilters({ ...filters, start_max: e.target.value })
              }
            />
          </Form.Group>
        </Col>
      </Row>
      <Button
        onClick={fetchWorkSessionsWithFilters}
        variant="primary"
        className="mb-4 m-2"
      >
        Filtruj
      </Button>
    </Form>
  );
};
