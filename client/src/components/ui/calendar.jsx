// src/components/ui/calendar.jsx
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function Calendar({
  className,
  selected,
  onSelect,
  disabled,
  ...props
}) {
  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={onSelect}
      disabled={disabled}
      className={cn(
        "p-3 bg-white rounded-lg border border-gray-200 shadow-sm",
        className
      )}
      classNames={{
        caption: "flex justify-center items-center h-10 font-medium",
        caption_label: "text-sm",
        nav: "flex items-center gap-1",
        nav_button:
          "h-7 w-7 bg-transparent p-0 hover:bg-gray-100 rounded-md flex items-center justify-center",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell: "text-gray-500 text-xs font-normal w-9 text-center",
        row: "flex w-full mt-2",
        cell: "relative p-0 text-center text-sm h-9 w-9",
        day: cn(
          "h-9 w-9 p-0 font-normal rounded-md hover:bg-red-50 transition-colors",
          "aria-selected:bg-red-600 aria-selected:text-white"
        ),
        day_selected: "bg-red-600 text-white",
        day_today: "font-bold text-red-600",
        day_disabled: "text-gray-400 opacity-50",
        day_outside: "text-gray-400",
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      formatters={{
        formatCaption: (date) => format(date, "MMMM yyyy"),
      }}
      {...props}
    />
  );
}
