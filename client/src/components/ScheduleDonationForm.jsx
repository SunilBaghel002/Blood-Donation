// src/components/ScheduleDonationForm.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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
      className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-red-100"
    >
      <h3 className="text-xl font-bold mb-6 flex items-center text-red-600">
        <CalendarIcon className="w-6 h-6 mr-2" />
        Schedule Your Donation
      </h3>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Blood Bank Select */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">
            Blood Bank
          </Label>
          <Select
            value={scheduleData.bloodBankId}
            onValueChange={(value) =>
              setScheduleData({ ...scheduleData, bloodBankId: value })
            }
            required
          >
            <SelectTrigger className="bg-red-50 border-red-200 focus:ring-2 focus:ring-red-400 h-12">
              <SelectValue placeholder="Choose a blood bank" />
            </SelectTrigger>
            <SelectContent>
              {bloodBanks.map((bank) => (
                <SelectItem key={bank._id} value={bank._id}>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <div>
                      <div className="font-medium">{bank.name}</div>
                      <div className="text-xs text-gray-500">
                        {bank.location}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Picker */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">Date</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal bg-red-50 border-red-200 hover:bg-red-100 focus:ring-2 focus:ring-red-400 h-12"
              >
                {date ? (
                  <span className="font-medium">
                    {date.toLocaleDateString()}
                  </span>
                ) : (
                  <span className="text-gray-500">Select a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 text-red-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  setDate(d);
                  setOpen(false);
                }}
                disabled={(d) => d < new Date()}
                initialFocus
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Picker */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">Time</Label>
          <Input
            type="time"
            value={scheduleData.time}
            onChange={(e) =>
              setScheduleData({ ...scheduleData, time: e.target.value })
            }
            className="bg-red-50 border-red-200 focus:ring-2 focus:ring-red-400 h-12"
            required
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={
            isLoading ||
            !scheduleData.date ||
            !scheduleData.time ||
            !scheduleData.bloodBankId
          }
          className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:opacity-60 shadow-lg transition-all"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Scheduling...
            </div>
          ) : (
            "Confirm Schedule"
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default ScheduleDonationForm;
