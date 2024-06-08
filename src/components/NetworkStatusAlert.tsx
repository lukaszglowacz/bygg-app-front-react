import React from "react";
import { Alert } from "react-bootstrap";
import useNetworkStatus from "../hooks/useNetworkStatus";

const NetworkStatusAlert: React.FC = () => {
  const isOnline = useNetworkStatus();

  if (isOnline) {
    return null;
  }

  return (
    <Alert variant="warning" className="text-center">
      No internet connection
    </Alert>
  );
};

export default NetworkStatusAlert;
