import React from 'react';
import { Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Loader: React.FC = () => {
  return (
    <div className="d-flex vh-100 justify-content-center align-items-center mb-5">
      <Spinner animation="border" variant="info"/>
    </div>
  );
};

export default Loader;
