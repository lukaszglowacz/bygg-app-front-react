import React from "react";

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const MonthYearDisplay: React.FC<{ currentDate: Date }> = ({ currentDate }) => {
  const monthYear = currentDate.toLocaleString("en-EN", {
    month: "long",
    year: "numeric",
  });

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const firstDayFormatted = formatDate(firstDayOfMonth);
  const lastDayFormatted = formatDate(lastDayOfMonth);

  return (
    <div style={{ textAlign: "center" }}>
      <span style={{ display: "block", marginBottom: "0rem" }}>{monthYear}</span>
      <div style={{ fontSize: "0.9rem", marginTop: "0rem" }}>
        {`${firstDayFormatted} - ${lastDayFormatted}`}
      </div>
    </div>
  );
};

export default MonthYearDisplay;
