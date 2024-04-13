import React, { useState, useEffect } from 'react';

// Definiowanie typu dla propsów
interface TimeElapsedProps {
  startTime: string;
}

const TimeElapsed: React.FC<TimeElapsedProps> = ({ startTime }) => {
  const [elapsedTime, setElapsedTime] = useState<string>('');

  useEffect(() => {
    // Przekształcanie formatu daty na format ISO 8601, który jest kompatybilny z konstruktorem Date w JavaScript
    const startTimeDate = new Date(startTime.replace(/\./g, '-').replace(' ', 'T') + ':00');

    // Ustawianie interwału, który będzie aktualizowany co sekundę
    const timerId = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - startTimeDate.getTime(); // Obliczanie różnicy czasu w milisekundach
      const hours = Math.floor(diff / 3600000); // Przeliczanie milisekund na godziny
      const minutes = Math.floor((diff % 3600000) / 60000); // Przeliczanie reszty na minuty
      const seconds = Math.floor((diff % 60000) / 1000); // Przeliczanie reszty na sekundy
      setElapsedTime(`${hours}h ${minutes}m ${seconds}s`); // Aktualizacja stanu przechowującego upływający czas
    }, 1000);

    // Czyszczenie interwału, kiedy komponent będzie odmontowywany
    return () => clearInterval(timerId);
  }, [startTime]);

  // Wyświetlanie upływającego czasu
  return <span>{elapsedTime}</span>;
};

export default TimeElapsed;
