import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ScheduleItem {
  time: string;
  patient: string;
  purpose: string;
  status: "Confirmed" | "Checked-in" | "In Session" | "No-show";
}

const DoctorSchedule: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("Today");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 13;

  const scheduleData: ScheduleItem[] = [
    {
      time: "9:00 AM",
      patient: "John Doe",
      purpose: "Follow-up",
      status: "Confirmed"
    },
    {
      time: "9:30 AM",
      patient: "Alex R.",
      purpose: "Lab Review",
      status: "Checked-in"
    },
    {
      time: "10:00 AM",
      patient: "Emily Parker",
      purpose: "Weight Mgmt",
      status: "In Session"
    },
    {
      time: "11:30 AM",
      patient: "Mike Blue",
      purpose: "TRT Follow-up",
      status: "No-show"
    },
    {
      time: "12:00 PM",
      patient: "Bella K",
      purpose: "Lab Review",
      status: "No-show"
    },
    {
      time: "2:30 PM",
      patient: "Marc Nieto",
      purpose: "Follow-up",
      status: "Confirmed"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "text-green-500";
      case "Checked-in":
        return "text-orange-500";
      case "In Session":
        return "text-blue-500";
      case "No-show":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  const filterButtons = [
    { id: "Today", label: "Today" },
    { id: "Tomorrow", label: "Tomorrow" },
    { id: "Upcoming", label: "Upcoming" },
    { id: "Recent", label: "Recent" }
  ];

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex-1 text-white">
      {/* Header Section with Filter Buttons */}
      <div className="p-4 sm:p-6 lg:p-8 pb-4 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
              My Schedule
            </h1>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg mt-1 sm:mt-2 leading-relaxed">
              Here's your schedule.
            </p>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            {filterButtons.map((button) => (
              <button
                key={button.id}
                onClick={() => setActiveFilter(button.id)}
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                  activeFilter === button.id
                    ? "bg-red-500 text-white"
                    : "bg-gray-600 text-white hover:bg-gray-500"
                }`}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule List */}
      <div className="mx-4 sm:mx-6 lg:mx-8">
        <div
          className="bg-gray-800 border border-gray-700 rounded-2xl sm:rounded-3xl overflow-hidden"
          style={{ backgroundColor: "#151515" }}
        >
          {/* Schedule List Header */}
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Schedule List</h2>
          </div>

          {/* Schedule Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-medium text-gray-300">
                    Time
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-medium text-gray-300">
                    Patient
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-medium text-gray-300 hidden sm:table-cell">
                    Appointment Purpose
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-medium text-gray-300">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {scheduleData.map((appointment, index) => (
                  <tr key={index} className="hover:bg-gray-750">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-white">
                      {appointment.time}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                      <button className="text-white underline hover:text-gray-300 transition-colors">
                        {appointment.patient}
                      </button>
                      {/* Show purpose on mobile below patient name */}
                      <div className="sm:hidden text-xs text-gray-400 mt-1">
                        {appointment.purpose}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-300 hidden sm:table-cell">
                      {appointment.purpose}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                      <span className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-3 sm:px-6 py-3 sm:py-4 bg-gray-700 flex items-center justify-end gap-2 sm:gap-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="w-6 h-6 sm:w-8 sm:h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={12} className="sm:w-4 sm:h-4" />
            </button>
            <span className="text-white text-xs sm:text-sm">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="w-6 h-6 sm:w-8 sm:h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              <ChevronRight size={12} className="sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedule;
