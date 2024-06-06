import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { IconBaseProps } from 'react-icons';

interface LoadingButtonProps {
  variant: string;
  onClick: () => Promise<void>;
  icon: React.ComponentType<IconBaseProps>;
  title: string;
  size: number;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({ variant, onClick, icon: Icon, title, size }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onClick();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant={variant} className="btn-sm p-0" onClick={handleClick} title={title} disabled={loading}>
      {loading ? (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          style={{ width: `${size}px`, height: `${size}px` }}
        />
      ) : (
        <Icon size={size} />
      )}
    </Button>
  );
};

export default LoadingButton;
