// src/components/CalendarComponent.jsx
import React from "react";
import Calendar from "@/components/ui/calendar";

export default function CalendarComponent() {
  const [date, setDate] = React.useState(new Date());

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-center text-red-700">
        Select Donation Date
      </h3>
      <Calendar
        selected={date}
        onSelect={setDate}
        disabled={(date) => date < new Date().setHours(0, 0, 0, 0)} // No past dates
        className="border rounded-md"
      />
      {date && (
        <p className="text-center mt-4 text-sm text-gray-600">
          Selected: <strong>{date.toLocaleDateString()}</strong>
        </p>
      )}
    </div>
  );
}
