import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  MessageSquare,
  ChevronDown,
  CalendarClock,
  XCircle,
  Play,
} from "lucide-react";
import api from "@/service/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type PatientStatus =
  | "Scheduled"
  | "Waiting Room"
  | "In Visit"
  | "Completed"
  | "No-show";

interface Patient {
  name: string;
  status: PatientStatus;
  time: string; // appointment time, e.g., "09:30 AM"
}

interface PatientQueueProps {
  patients?: Patient[];
}

const PatientQueue: React.FC<PatientQueueProps> = ({ patients = [] }) => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [now, setNow] = useState(new Date());
  const [queueData, setQueueData] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get doctor ID from localStorage
  const doctorId = localStorage.getItem("userId");

  // Auto-refresh clock every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  // Load queue data from API
  useEffect(() => {
    if (!doctorId) {
      setError("Doctor ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    loadQueueData();
  }, [activeFilter, doctorId]);

  const loadQueueData = async () => {
    if (!doctorId) return;

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (activeFilter !== "All") {
        params.append('status', activeFilter);
      }

      const response = await api.get(`/appointments/doctor/${doctorId}/queue?${params}`);
      
      if (response.data.success) {
        const queuePatients = response.data.data.map((apt: any) => ({
          name: apt.patient,
          status: apt.status,
          time: apt.time,
          appointmentType: apt.appointmentType,
          age: apt.age,
          lastVisit: apt.lastVisit,
          purpose: apt.purpose,
          patientId: apt.patientId,
          patientEmail: apt.patientEmail,
          patientPhone: apt.patientPhone,
        }));

        setQueueData(queuePatients);
      } else {
        setError('Failed to load queue data');
      }
    } catch (err) {
      console.error('Error loading queue:', err);
      setError('Failed to load queue data');
    } finally {
      setLoading(false);
    }
  };

  // Use API data if available, otherwise use passed patients, otherwise empty array
  const patientList = queueData.length > 0 ? queueData : (patients.length > 0 ? patients : []);

  // Show loading state
  if (loading) {
    return (
      <div className="flex-1 text-white p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading patient queue...</p>
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
              onClick={loadQueueData}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Helpers
  const getStatusColor = (status: PatientStatus) => {
    switch (status) {
      case "Scheduled":
        return "text-gray-400";
      case "Waiting Room":
        return "text-yellow-400";
      case "In Visit":
        return "text-green-400";
      case "Completed":
        return "text-blue-400";
      case "No-show":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  // Convert "10:00 AM" → Date
  const parseTime = (timeStr: string) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const d = new Date(now);
    d.setHours(hours, minutes, 0, 0);
    return d;
  };

  // Calculate waiting duration
  const getWaitingTime = (time: string, status: PatientStatus) => {
    if (status === "Waiting Room") {
      const scheduled = parseTime(time);
      const diffMs = now.getTime() - scheduled.getTime();
      if (diffMs > 0) {
        const minutes = Math.floor(diffMs / 60000);
        return `Waiting ${minutes}m`;
      }
    }
    return "";
  };

  // Actions available for each patient based on status
  const getActions = (status: PatientStatus) => {
    switch (status) {
      case "Scheduled":
      case "Waiting Room":
        return ["Start Visit", "Reschedule", "Message Patient"];
      case "In Visit":
        return ["Mark Complete", "Message Patient"];
      case "Completed":
      case "No-show":
        return ["Message Patient"];
      default:
        return [];
    }
  };

  return (
    <div className="flex-1 text-white p-4 sm:p-6 lg:p-8">
      <div className="mx-2 sm:mx-4 lg:mx-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Patient Queue</h1>
            <p className="text-gray-400">
              Live patient queue with real-time updates.
            </p>
          </div>
          <div className="flex gap-2">
            {[
              "All",
              "Scheduled",
              "Waiting Room",
              "In Visit",
              "Completed",
              "No-show",
            ].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeFilter === filter
                    ? "bg-red-500 text-white"
                    : "bg-gray-900 text-gray-400 hover:bg-gray-800"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Queue List */}
        <div className="bg-black rounded-2xl p-4 sm:p-6 shadow-lg overflow-x-auto">
          {/* Header Row */}
          <div className="hidden sm:flex justify-between font-bold text-lg border-b border-gray-700 pb-2">
            <span className="w-1/5">Name</span>
            <span className="w-1/5">Status</span>
            <span className="w-1/5">Time</span>
            <span className="w-1/5">Wait</span>
            <span className="w-1/5 text-right">Actions</span>
          </div>

          {/* Patient Rows */}
          {patientList
            .filter((p) => activeFilter === "All" || p.status === activeFilter)
            .length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-400">
                No patients found in the queue for the selected filter.
              </div>
            ) : (
              patientList
            .filter((p) => activeFilter === "All" || p.status === activeFilter)
            .map((p, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b border-gray-800 last:border-0 gap-3 sm:gap-0"
              >
                <span className="w-full sm:w-1/5 font-medium">{p.name}</span>
                <span
                  className={`w-full sm:w-1/5 font-medium ${getStatusColor(
                    p.status
                  )}`}
                >
                  {p.status}
                </span>
                <span className="w-full sm:w-1/5">{p.time}</span>
                <span className="w-full sm:w-1/5 text-gray-400">
                  {getWaitingTime(p.time, p.status)}
                </span>

                {/* Dropdown Actions */}
                <div className="flex justify-end w-full sm:w-1/5">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-full px-4 py-1 transition"
                      >
                        <span>Actions</span>
                        <ChevronDown size={16} className="text-gray-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-gray-900 text-white rounded-lg shadow-xl min-w-[180px] p-2"
                    >
                      <DropdownMenuItem className="hover:bg-gray-800 rounded-md flex items-center gap-3 px-3 py-2 text-sm cursor-pointer">
                        <Play size={16} className="text-green-400" />
                        Start Visit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-gray-800 rounded-md flex items-center gap-3 px-3 py-2 text-sm cursor-pointer">
                        <CalendarClock size={16} className="text-yellow-400" />
                        Reschedule
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-gray-800 rounded-md flex items-center gap-3 px-3 py-2 text-sm cursor-pointer">
                        <MessageSquare size={16} className="text-blue-400" />
                        Message Patient
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-1 bg-gray-700" />
                      {/* <DropdownMenuItem className="hover:bg-gray-800 rounded-md flex items-center gap-3 px-3 py-2 text-sm cursor-pointer text-red-400">
                        <XCircle size={16} />
                        Remove from Queue
                      </DropdownMenuItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
                ))
            )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button className="p-2 bg-red-500 hover:bg-red-600 rounded transition">
            <ChevronLeft size={20} />
          </button>
          <span className="bg-black border border-gray-700 px-4 py-2 rounded">
            1 / 13
          </span>
          <button className="p-2 bg-red-500 hover:bg-red-600 rounded transition">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientQueue;
