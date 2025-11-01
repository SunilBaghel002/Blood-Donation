// components/CalendarComponent.jsx
import React from "react";
import { Calendar } from "@/components/ui/calendar";

export default function CalendarComponent() {
  const [date, setDate] = React.useState(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border shadow"
    />
  );
}