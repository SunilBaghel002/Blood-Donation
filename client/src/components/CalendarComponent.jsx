// src/components/CalendarComponent.jsx
import React from "react";
import Calendar from "./ui/calendar";

export default function CalendarComponent({ onDateSelect }) {
  const [date, setDate] = React.useState(null);

  const handleSelect = (selectedDate) => {
    setDate(selectedDate);
    if (selectedDate && onDateSelect) {
      const formatted = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD
      onDateSelect(formatted);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <Calendar
        selected={date}
        onSelect={handleSelect}
        disabled={(d) => d < new Date().setHours(0, 0, 0, 0)}
        className="border rounded-md"
      />
      {date && (
        <p className="text-center mt-3 text-sm font-medium text-red-600">
          Selected: {date.toLocaleDateString()}
        </p>
      )}
    </div>
  );
}