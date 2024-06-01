import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone'; // Importowanie moment i moment-timezone

// Definiowanie typu dla propsów
interface TimeElapsedProps {
  startTime: string;
}

const TimeElapsed: React.FC<TimeElapsedProps> = ({ startTime }) => {
  const [elapsedTime, setElapsedTime] = useState<string>('');

  useEffect(() => {
    // Przekształcanie formatu daty na moment z właściwą strefą czasową
    const startTimeMoment = moment.tz(startTime, 'Europe/Stockholm');

    // Ustawianie interwału, który będzie aktualizowany co sekundę
    const timerId = setInterval(() => {
      const now = moment();
      const diff = moment.duration(now.diff(startTimeMoment)); // Obliczanie różnicy czasu
      const hours = Math.floor(diff.asHours()); // Przeliczanie różnicy na godziny
      const minutes = diff.minutes(); // Minuty
      setElapsedTime(`${hours}h ${minutes}m`); // Aktualizacja stanu przechowującego upływający czas
    }, 1000);

    // Czyszczenie interwału, kiedy komponent będzie odmontowywany
    return () => clearInterval(timerId);
  }, [startTime]);

  // Wyświetlanie upływającego czasu
  return <span>{elapsedTime}</span>;
};

export default TimeElapsed;
