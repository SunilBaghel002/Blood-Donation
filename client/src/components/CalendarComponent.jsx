// src/components/CalendarComponent.jsx
import React from "react";
import Calendar from "@/components/ui/calendar";

export default function CalendarComponent() {
  const [date, setDate] = React.useState(new Date());

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
      {date && (
        <p className="text-center mt-2 text-sm text-gray-600">
          Selected: {date.toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
