// timeUtils.ts
import { WorkSession, ProfileWorksession } from "../interfaces/types";// Zakładam, że interfejs WorkSession jest już zdefiniowany

export const sumTotalTime = (sessions: WorkSession[]): string => {
  let totalMinutes = 0;

  sessions.forEach(session => {
    const parts = session.total_time.split(' ');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[2], 10);

    totalMinutes += (hours * 60) + minutes;
  });

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours} h, ${minutes} min`;
};

export const sumTotalTimeForProfile = (sessions: ProfileWorksession[]): string => {
    let totalMinutes = 0;
  
    sessions.forEach(session => {
      const parts = session.total_time.split(' ');
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[2], 10);
  
      totalMinutes += (hours * 60) + minutes;
    });
  
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
  
    return `${hours} h, ${minutes} min`;
  };
