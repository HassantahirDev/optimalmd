import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/service/api";

interface ScheduleItem {
  time: string;
  patient: string;
  purpose: string;
  status: "Confirmed" | "Check-in Pending" | "Checked-in" | "In Session" | "No-show" | "Completed";
  appointmentType: 'Telemedicine' | 'In-person';
  age?: number;
  lastVisit?: string;
  outstandingLabs?: number;
}

const DoctorSchedule: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("Today");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'All' | 'Telemedicine' | 'In-person' | 'No-show'>('All');

  // Get doctor ID from localStorage
  const doctorId = localStorage.getItem("userId");

  // Load schedule data from API
  useEffect(() => {
    if (!doctorId) {
      setError("Doctor ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    loadScheduleData();
  }, [activeFilter, currentPage, filter, doctorId]);

  const loadScheduleData = async () => {
    if (!doctorId) return;

    try {
      setLoading(true);
      setError(null);

      // Calculate date range based on filter
      const { startDate, endDate } = getDateRange(activeFilter);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });

      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (filter !== 'All') {
        if (filter === 'No-show') {
          params.append('status', 'NO_SHOW');
        } else {
          params.append('appointmentType', filter.toUpperCase().replace('-', '_'));
        }
      }

      const response = await api.get(`/appointments/doctor/${doctorId}/schedule?${params}`);
      
      if (response.data.success) {
        const appointments = response.data.data.map((apt: any) => ({
          time: apt.appointmentTime,
          patient: `${apt.patient.firstName} ${apt.patient.lastName}`,
          purpose: apt.service?.name || 'General Consultation',
          status: mapStatusToDisplay(apt.status),
          appointmentType: apt.appointmentType === 'IN_PERSON' ? 'In-person' : 'Telemedicine',
          age: calculateAge(apt.patient.dateOfBirth),
          lastVisit: apt.patient.dateOfBirth ? 'N/A' : 'N/A', // This would need to be calculated from previous appointments
          outstandingLabs: 0 // This would need to be calculated from lab results
        }));

        setScheduleData(appointments);
        setTotalPages(response.data.pagination?.totalPages || 1);
      } else {
        setError('Failed to load schedule data');
      }
    } catch (err) {
      console.error('Error loading schedule:', err);
      setError('Failed to load schedule data');
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = (filter: string) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    switch (filter) {
      case 'Today':
        return {
          startDate: today.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0]
        };
      case 'Tomorrow':
        return {
          startDate: tomorrow.toISOString().split('T')[0],
          endDate: tomorrow.toISOString().split('T')[0]
        };
      case 'Upcoming':
        return {
          startDate: tomorrow.toISOString().split('T')[0],
          endDate: nextWeek.toISOString().split('T')[0]
        };
      case 'Recent':
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        return {
          startDate: lastWeek.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0]
        };
      default:
        return { startDate: null, endDate: null };
    }
  };

  const mapStatusToDisplay = (status: string) => {
    const statusMap = {
      'PENDING': 'Check-in Pending',
      'CONFIRMED': 'Confirmed',
      'IN_PROGRESS': 'In Session',
      'COMPLETED': 'Completed',
      'CANCELLED': 'Cancelled',
      'NO_SHOW': 'No-show',
      'RESCHEDULED': 'Rescheduled',
    };
    return statusMap[status] || status;
  };

  const calculateAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const [selectedAppointments, setSelectedAppointments] = useState<number[]>([]);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  // Filter by appointment type and status
  const filteredByType = filter === 'All'
    ? scheduleData
    : filter === 'No-show'
      ? scheduleData.filter(p => p.status === 'No-show')
      : scheduleData.filter(p => p.appointmentType === filter);

  // Batch actions
  const handleSelectAppointment = (idx: number) => {
    setSelectedAppointments(prev =>
      prev.includes(idx) ? prev.filter(id => id !== idx) : [...prev, idx]
    );
  };
  const handleSelectAll = () => {
    if (selectedAppointments.length === filteredByType.length) {
      setSelectedAppointments([]);
    } else {
      setSelectedAppointments(filteredByType.map((_, idx) => idx));
    }
  };
  const handleMessageNoShows = () => {
    alert('Message sent to all no-shows!');
  };
  const handleRescheduleSelected = () => {
    alert('Reschedule action for selected appointments!');
  };

  // Filtered by search and type (if you add search)
  const filteredAppointments = filteredByType;

  // Updated status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "text-green-500";
      case "Check-in Pending":
        return "text-yellow-400";
      case "Checked-in":
        return "text-orange-500";
      case "No-show":
        return "text-red-500";
      case "Completed":
        return "text-blue-500";
      case "In Session":
        return "text-blue-400";
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

  // Show loading state
  if (loading) {
    return (
      <div className="flex-1 text-white p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading schedule...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex-1 text-white p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={loadScheduleData}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 text-white">

      {/* Header Section with Dropdown Filters */}
      <div className="p-4 sm:p-6 lg:p-8 pb-4 sm:pb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left: Heading and subtitle */}
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
              My Schedule
            </h1>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg mt-1 sm:mt-2 leading-relaxed">
              Here's your schedule.
            </p>
          </div>
          {/* Right: Dropdown Filters */}
          <div className="flex gap-3 items-center w-full md:w-auto justify-end">
            {/* Type Dropdown */}
            <div className="relative" tabIndex={0}>
              <button
                className="px-4 py-2 rounded-full font-medium border transition-colors text-sm bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 flex items-center gap-2 min-w-[120px]"
                onClick={() => setShowTypeDropdown((prev) => !prev)}
                type="button"
              >
                Type: <span className="font-semibold text-white">{filter}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {showTypeDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-20">
                  {['All', 'Telemedicine', 'In-person', 'No-show'].map(type => (
                    <button
                      key={type}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 ${filter === type ? 'bg-red-500 text-white' : 'text-gray-200'}`}
                      onClick={() => { setFilter(type as any); setShowTypeDropdown(false); }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Date Dropdown */}
            <div className="relative" tabIndex={0}>
              <button
                className="px-4 py-2 rounded-full font-medium border transition-colors text-sm bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 flex items-center gap-2 min-w-[120px]"
                onClick={() => setShowDateDropdown((prev) => !prev)}
                type="button"
              >
                Date: <span className="font-semibold text-white">{filterButtons.find(b => b.id === activeFilter)?.label}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {showDateDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-20">
                  {filterButtons.map((button) => (
                    <button
                      key={button.id}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 ${activeFilter === button.id ? 'bg-red-500 text-white' : 'text-gray-200'}`}
                      onClick={() => { setActiveFilter(button.id); setShowDateDropdown(false); }}
                    >
                      {button.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Batch Actions */}
      <div className="mx-4 sm:mx-6 lg:mx-8 mb-2 flex flex-wrap gap-2">
        <button
          className="px-4 py-2 rounded-full font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm"
          onClick={handleMessageNoShows}
        >
          Message All No-shows
        </button>
        <button
          className="px-4 py-2 rounded-full font-medium bg-yellow-500 text-black hover:bg-yellow-600 transition-colors text-sm"
          onClick={handleRescheduleSelected}
          disabled={selectedAppointments.length === 0}
        >
          Reschedule Selected
        </button>
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
              <thead className="bg-black-700">
                <tr>
                  <th className="px-2"><input type="checkbox" checked={selectedAppointments.length === filteredAppointments.length && filteredAppointments.length > 0} onChange={handleSelectAll} /></th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-medium text-gray-300">Time</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-medium text-gray-300">Patient</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-medium text-gray-300 hidden sm:table-cell">Appointment Purpose</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-medium text-gray-300">Type</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-medium text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                      No appointments found for the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((appointment, index) => (
                  <tr key={index} className="hover:bg-gray-750">
                    <td className="px-2"><input type="checkbox" checked={selectedAppointments.includes(index)} onChange={() => handleSelectAppointment(index)} /></td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-white">{appointment.time}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm relative group">
                      <button className="text-white underline hover:text-gray-300 transition-colors">
                        {appointment.patient}
                      </button>
                      {/* Hover Preview */}
                      <div className="absolute left-0 top-full z-10 mt-2 w-56 bg-gray-900 text-white rounded-lg shadow-lg p-4 text-xs opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200">
                        <div><span className="font-semibold">Age:</span> {appointment.age ?? '--'}</div>
                        <div><span className="font-semibold">Last Visit:</span> {appointment.lastVisit ?? '--'}</div>
                        <div><span className="font-semibold">Outstanding Labs:</span> {appointment.outstandingLabs ?? 0}</div>
                      </div>
                      {/* Show purpose on mobile below patient name */}
                      <div className="sm:hidden text-xs text-gray-400 mt-1">
                        {appointment.purpose}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-300 hidden sm:table-cell">{appointment.purpose}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-white">{appointment.appointmentType}</td>
                    <td className={`px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold ${getStatusColor(appointment.status)}`}>{appointment.status}</td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-3 sm:px-6 py-3 sm:py-4 bg-black-700 flex items-center justify-end gap-2 sm:gap-4">
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
