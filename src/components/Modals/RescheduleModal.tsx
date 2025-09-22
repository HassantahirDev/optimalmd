import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { Button } from "../ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import {
  fetchAvailableSlots,
  setSelectedDate,
} from "@/redux/slice/appointmentSlice";
import { Calendar, Clock, ChevronRight, CalendarDays, Loader2 } from "lucide-react";
import { formatTime } from "@/utils/timeUtils";

interface RescheduleModalProps {
  isOpen: boolean;
  doctorId?: string;
  onClose: () => void;
  onConfirm: (payload: {
    newDate: string;
    newTime: string;
    slotId: string;
  }) => void;
}

export default function RescheduleModal({
  isOpen,
  doctorId,
  onClose,
  onConfirm,
}: RescheduleModalProps) {
  const dispatch = useAppDispatch();
  const { availableSlots, loading, rescheduleLoading } = useAppSelector(
    (state) => state.appointment
  );

  const [selectedDate, setSelectedDateLocal] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  // Get date options (next 30 days)
  const getDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Format date in local timezone to avoid UTC conversion issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const localDateString = `${year}-${month}-${day}`;
      dates.push(localDateString);
    }
    return dates;
  };

  const dateOptions = getDateOptions();

  // Fetch slots when date is selected
  useEffect(() => {
    if (selectedDate && doctorId) {
      dispatch(
        fetchAvailableSlots({
          doctorId,
          date: selectedDate,
        })
      );
      setSelectedSlot(null); // Reset selected slot when date changes
    }
  }, [selectedDate, doctorId, dispatch]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedDateLocal("");
      setSelectedSlot(null);
    }
  }, [isOpen]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };


  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center pb-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Reschedule Appointment
          </h2>
          <p className="text-gray-600">
            Choose a new date and time for your appointment
          </p>
        </div>

        {/* Date Selection */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-500 rounded-lg">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Select New Date
            </h3>
          </div>

          <div className="relative">
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDateLocal(e.target.value)}
              className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 appearance-none cursor-pointer text-gray-700 font-medium"
            >
              <option value="" className="text-gray-500">
                Choose a date...
              </option>
              {dateOptions.map((date) => (
                <option key={date} value={date} className="py-2">
                  {formatDate(date)}
                </option>
              ))}
            </select>
            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500 pointer-events-none" />
            <ChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 rotate-90 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Available Slots */}
        {selectedDate && (
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Available Times
                </h3>
                <p className="text-sm text-gray-600">
                  {formatDateShort(selectedDate)}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
                <p className="text-gray-600 font-medium">
                  Loading available slots...
                </p>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="p-4 bg-gray-200 rounded-full mb-4">
                  <Clock className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-gray-600 font-medium">
                  No available slots for this date
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Please try selecting a different date
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
                {availableSlots
                  .filter((slot) => slot.isAvailable)
                  .map((slot) => (
                    <div
                      key={slot.id}
                      className={`group relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                        selectedSlot?.id === slot.id
                          ? "border-red-500 bg-red-500 shadow-lg transform scale-105"
                          : "border-gray-300 bg-white hover:border-red-300 hover:shadow-md"
                      }`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div
                          className={`p-2 rounded-full mb-2 transition-colors duration-200 ${
                            selectedSlot?.id === slot.id
                              ? "bg-white/20"
                              : "bg-gray-100 group-hover:bg-red-50"
                          }`}
                        >
                          <Clock
                            className={`w-4 h-4 ${
                              selectedSlot?.id === slot.id
                                ? "text-white"
                                : "text-red-500"
                            }`}
                          />
                        </div>
                        <p
                          className={`font-bold text-sm ${
                            selectedSlot?.id === slot.id
                              ? "text-white"
                              : "text-gray-800 group-hover:text-red-600"
                          }`}
                        >
                          {formatTime(slot.startTime)}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            selectedSlot?.id === slot.id
                              ? "text-white/80"
                              : "text-gray-500"
                          }`}
                        >
                          {formatTime(slot.endTime)}
                        </p>
                        {selectedSlot?.id === slot.id && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center gap-4 pt-6 border-t border-gray-200">
        <Button
          onClick={onClose}
          className="flex-1 h-12 bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400 transition-all duration-200"
        >
          Cancel
        </Button>
        <Button
          className={`flex-1 h-12 font-semibold transition-all duration-200 ${
            selectedSlot
              ? "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!selectedSlot || rescheduleLoading}
          onClick={() => {
            if (selectedSlot && selectedDate) {
              onConfirm({
                newDate: selectedDate,
                newTime: selectedSlot.startTime,
                slotId: selectedSlot.id,
              });
            }
          }}
        >
          {rescheduleLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Rescheduling...
            </>
          ) : selectedSlot ? (
            "Confirm Reschedule"
          ) : (
            "Select a Time Slot"
          )}
        </Button>
      </div>
    </Modal>
  );
}
