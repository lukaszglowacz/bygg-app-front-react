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
      Your internet connection is currently offline.
    </Alert>
  );
};

export default NetworkStatusAlert;
