import React, { useState, useEffect } from 'react';

const ClockUpdate: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Aktualizacja co 1000 ms, czyli co 1 sekundę

    return () => clearInterval(intervalId); // Czyszczenie interwału przy demontażu komponentu
  }, []); // Pusta tablica zależności oznacza, że efekt uruchomi się tylko przy montowaniu

  return (
    <h1 style={{ fontSize: '60px', fontWeight: 'bold', textAlign: 'center' }}>
      {currentTime.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </h1>
  );
};

export default ClockUpdate;
