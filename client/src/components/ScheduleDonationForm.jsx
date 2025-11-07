// src/components/ScheduleDonationForm.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const ScheduleDonationForm = ({
  scheduleData,
  setScheduleData,
  bloodBanks,
  isLoading,
  onSubmit,
}) => {
  const [date, setDate] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (date) {
      const formatted = date.toISOString().split("T")[0];
      setScheduleData((prev) => ({ ...prev, date: formatted }));
    }
  }, [date, setScheduleData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <CalendarIcon className="w-5 h-5 mr-2 text-red-500" /> Schedule Donation
      </h3>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex justify-start gap-3 items-center">
          {/* Blood Bank */}
          <div>
            <Label className="text-sm font-medium">Blood Bank</Label>
            <select
              value={scheduleData.bloodBankId}
              onChange={(e) =>
                setScheduleData({
                  ...scheduleData,
                  bloodBankId: e.target.value,
                })
              }
              className="w-full mt-1 bg-red-50 border border-red-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 outline-none"
              required
            >
              <option value="">Select Blood Bank</option>
              {bloodBanks.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <Label className="text-sm font-medium">Date</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full mt-1 justify-start text-left font-normal bg-red-50 border-red-200 hover:bg-red-50 focus:ring-2 focus:ring-red-400"
                >
                  {date ? (
                    date.toLocaleDateString()
                  ) : (
                    <span className="text-gray-500">Pick a date</span>
                  )}
                  <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    setDate(d);
                    setOpen(false);
                  }}
                  disabled={(d) => d < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Picker */}
          <div>
            <Label className="text-sm font-medium">Time</Label>
            <Input
              type="time"
              value={scheduleData.time}
              onChange={(e) =>
                setScheduleData({ ...scheduleData, time: e.target.value })
              }
              className="mt-1 bg-red-50 border border-red-200 focus:ring-2 focus:ring-red-400"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={
            isLoading ||
            !scheduleData.date ||
            !scheduleData.time ||
            !scheduleData.bloodBankId
          }
          className="w-full mt-4 bg-gradient-to-r from-red-500 to-pink-400 hover:from-red-600 hover:to-pink-500 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Schedule Donation"
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default ScheduleDonationForm;
