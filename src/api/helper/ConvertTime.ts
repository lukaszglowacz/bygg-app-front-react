// src/utils/convertTime.ts

/**
 * Konwertuje czas UTC na czas lokalny dla strefy czasowej Stockholm.
 * @param utcDateString String daty i czasu w formacie 'YY.MM.DD HH:MM', gdzie rok jest dwucyfrowy.
 * @returns String daty i czasu w lokalnej strefie czasowej Stockholm w formacie 'YYYY.MM.DD HH:MM'.
 */
export function convertUTCToLocalTime(utcDateString: string): string {
    const [datePart, timePart] = utcDateString.split(" ");
    const [year, month, day] = datePart.split(".");
    const [hour, minute] = timePart.split(":");
  
    // Rozszerzanie dwucyfrowego roku do czterocyfrowego, zakładając, że dotyczy to lat 2000+.
    const fullYear = parseInt(year) + 2000;
  
    // Utworzenie obiektu Date z czasem UTC
    const utcDate = new Date(Date.UTC(fullYear, parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute)));
  
    // Stockholm jest w UTC+2, konwertujemy czas
    const localDate = new Date(utcDate.getTime() + (2 * 3600000)); // Dodaje 2 godziny
  
    // Formatowanie daty do formatu 'YYYY.MM.DD HH:MM'
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${localDate.getUTCFullYear()}.${pad(localDate.getUTCMonth() + 1)}.${pad(localDate.getUTCDate())} ${pad(localDate.getUTCHours())}:${pad(localDate.getUTCMinutes())}`;
  }
  