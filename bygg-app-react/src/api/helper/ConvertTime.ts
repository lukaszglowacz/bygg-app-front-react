// utils/convertTime.ts

/**
 * Konwertuje datę i czas UTC na czas lokalny dla Sztokholmu.
 * @param utcDateTime Ciąg reprezentujący datę i czas UTC w formacie 'YY.MM.DD HH:MM'
 * @returns Sformatowany czas lokalny jako ciąg 'HH:MM'
 */
export const convertUTCToLocalTime = (utcDateTime: string): string => {
    const dateTimeParts = utcDateTime.split(" ");
    const datePart = dateTimeParts[0];
    const timePart = dateTimeParts[1];
  
    // Konwersja formatu daty na standard ISO 8601, który jest dobrze obsługiwany przez JavaScript Date
    const isoFormattedDate = `20${datePart.replace(/\./g, '-')}` + 'T' + timePart + ':00Z';
  
    const date = new Date(isoFormattedDate);
    return date.toLocaleTimeString('sv-SE', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Stockholm'
    });
  };
  