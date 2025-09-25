// components/MyAppointments.tsx
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { getUserId } from "@/lib/utils";
import { formatTime } from "@/utils/timeUtils";
import {
  fetchPatientAppointments,
  rescheduleAppointment,
  cancelAppointment,
  clearRescheduleState,
  clearCancelState,
} from "@/redux/slice/appointmentSlice";
import {
  Calendar,
  Clock,
  User,
  Video,
  Plus,
  RefreshCw,
  X,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Stethoscope,
  MapPin,
  Activity,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AppointmentDetailsModal from "./AppointmentDetailsModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RescheduleAppointmentDto } from "@/redux/api/appointmentApi";
import RescheduleModal from "../Modals/RescheduleModal";
import CancelModal from "../CancelModal";
import { toast } from "react-toastify";

interface MyAppointmentsProps {
  patientName?: string;
  setActiveMenuItem?: (menuItem: string) => void; // 👈 add this
}

const MyAppointments: React.FC<MyAppointmentsProps> = ({
  patientName = localStorage.getItem("name") || "",
}) => {
  // Add custom styles for better responsive behavior
  useEffect(() => {
    // Add custom CSS for scrollbar hiding and responsive improvements
    const style = document.createElement("style");
    style.textContent = `
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      
      @media (max-width: 640px) {
        .dashboard-container {
          padding-bottom: env(safe-area-inset-bottom);
        }
      }
      
      @media (max-width: 768px) {
        .appointment-card {
          transition: transform 0.2s ease-in-out;
        }
        .appointment-card:active {
          transform: scale(0.98);
        }
      }
      
      @media (min-width: 1024px) {
        .appointment-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const dispatch = useAppDispatch();
  const {
    patientAppointments,
    appointmentsLoading,
    rescheduleLoading,
    rescheduleError,
    rescheduleSuccess,
    cancelLoading,
    cancelError,
    cancelSuccess,
  } = useAppSelector((state) => state.appointment);

  const userId = getUserId();
  const [isRescheduleOpen, setRescheduleOpen] = useState(false);
  const [isCancelOpen, setCancelOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] =
    useState<string>("");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isDetailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchPatientAppointments({ patientId: userId }));
    }
  }, [userId, dispatch]);

  // Handle reschedule success
  useEffect(() => {
    if (rescheduleSuccess) {
      toast.success("Appointment rescheduled successfully!");
      setRescheduleOpen(false);
      setSelectedAppointmentId("");
      dispatch(clearRescheduleState());
      if (userId) {
        dispatch(fetchPatientAppointments({ patientId: userId }));
      }
    }
  }, [rescheduleSuccess, userId, dispatch]);

  // Handle cancel success
  useEffect(() => {
    if (cancelSuccess) {
      toast.success("Appointment cancelled successfully!");
      setCancelOpen(false);
      setSelectedAppointment(null);
      dispatch(clearCancelState());
      if (userId) {
        dispatch(fetchPatientAppointments({ patientId: userId }));
      }
    }
  }, [cancelSuccess, userId, dispatch]);

  // Handle errors
  useEffect(() => {
    if (rescheduleError) {
      toast.error(`Reschedule failed: ${rescheduleError}`);
      dispatch(clearRescheduleState());
    }
  }, [rescheduleError, dispatch]);

  useEffect(() => {
    if (cancelError) {
      toast.error(`Cancellation failed: ${cancelError}`);
      dispatch(clearCancelState());
    }
  }, [cancelError, dispatch]);

  // Formatters
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });


  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5">
            Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5">
            Pending
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5">
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5">
            {status}
          </Badge>
        );
    }
  };

  // Handle reschedule confirmation
  const handleRescheduleConfirm = (payload: {
    newDate: string;
    newTime: string;
    slotId: string;
  }) => {
    if (!selectedAppointmentId) return;

    dispatch(
      rescheduleAppointment({
        appointmentId: selectedAppointmentId,
        newSlotId: payload.slotId,
        reason: "Patient requested reschedule",
      })
    );
  };

  // Handle reschedule button click
  const handleRescheduleClick = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setRescheduleOpen(true);
  };

  // Handle cancel button click
  const handleCancelClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setCancelOpen(true);
  };

  // Get current appointment for modal
  const getCurrentAppointment = () => {
    return patientAppointments?.find((apt) => apt.id === selectedAppointmentId);
  };

  // helpers
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayAppointments = patientAppointments?.filter(
    (a) =>
      new Date(a.appointmentDate).setHours(0, 0, 0, 0) === today.getTime() &&
      a.status !== "cancelled"
  );

  const upcomingAppointments = patientAppointments?.filter(
    (a) => new Date(a.appointmentDate) > today && a.status !== "cancelled"
  );

  const pastAppointments = patientAppointments?.filter(
    (a) => new Date(a.appointmentDate) < today && a.status !== "cancelled"
  );

  return (
    <div
      className="flex-1 text-white min-h-full dashboard-container"
      style={{ backgroundColor: "#151515" }}
    >
      {appointmentsLoading && (
        <div className="flex-1 text-white p-4 sm:p-6 lg:p-8 w-full">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading appointments...</p>
            </div>
          </div>
        </div>
      )}
      {!appointmentsLoading && (<>
      {/* Header Section */}
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 pb-3 sm:pb-4 md:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 md:gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                Hello, {patientName}!
              </h1>
              <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                👋
              </span>
            </div>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg mt-1 sm:mt-2 leading-relaxed">
              Here's what's next for your health.
            </p>
          </div>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-3 rounded-full font-medium text-sm sm:text-base w-full sm:w-auto min-h-[44px] sm:min-h-[48px] md:min-h-[52px] transition-all duration-200"
            style={{ backgroundColor: "#ff4444" }}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="hidden md:inline">Book a New Appointment</span>
            <span className="hidden sm:inline md:hidden">New Appointment</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-3 sm:mx-4 md:mx-6 lg:mx-8 pb-4 sm:pb-6 md:pb-8">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-3 sm:mb-4 md:mb-6 bg-transparent border-0 p-0 gap-1.5 sm:gap-2 md:gap-4 w-full flex overflow-x-auto scrollbar-hide">
            <TabsTrigger
              value="today"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white bg-gray-700 text-gray-300 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-3 rounded-full transition-all duration-200 text-sm sm:text-base md:text-lg whitespace-nowrap flex-shrink-0 min-h-[44px] sm:min-h-[48px] md:min-h-[52px] font-medium"
              style={{ backgroundColor: "#333333" }}
            >
              Today
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white bg-gray-700 text-gray-300 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-3 rounded-full transition-all duration-200 text-sm sm:text-base md:text-lg whitespace-nowrap flex-shrink-0 min-h-[44px] sm:min-h-[48px] md:min-h-[52px] font-medium"
              style={{ backgroundColor: "#333333" }}
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white bg-gray-700 text-gray-300 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-3 rounded-full transition-all duration-200 text-sm sm:text-base md:text-lg whitespace-nowrap flex-shrink-0 min-h-[44px] sm:min-h-[48px] md:min-h-[52px] font-medium"
              style={{ backgroundColor: "#333333" }}
            >
              Past
            </TabsTrigger>
          </TabsList>

          {/* Today */}
          <TabsContent value="today" className="mt-0">
            <div
              className="rounded-xl sm:rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8"
              style={{ backgroundColor: "#2a2a2a" }}
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 md:mb-8">
                Today's Appointments
              </h2>
              {todayAppointments?.length ? (
                <div className="space-y-3 sm:space-y-4 md:space-y-6">
                  {todayAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="appointment-card rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 transition-all duration-200 hover:shadow-lg"
                      style={{ backgroundColor: "#333333" }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-3 md:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                          <div className="p-2 sm:p-2.5 md:p-3 bg-red-500 rounded-lg flex-shrink-0">
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-white text-base sm:text-lg md:text-xl leading-tight">
                              {formatTime(appointment.appointmentTime)}
                            </p>
                            <p className="text-gray-300 text-sm sm:text-base md:text-lg truncate leading-relaxed">
                              Dr. {appointment.doctor?.firstName}{" "}
                              {appointment.doctor?.lastName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 sm:ml-2 md:ml-4">
                          {getStatusBadge(appointment.status)}
                          {appointment.medications && Object.values(appointment.medications as Record<string, string[]>)?.some((m: any) => (m as string[])?.length > 0) && (
                            <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5">Medication Assigned</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                        <button className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors text-sm sm:text-base min-h-[44px] sm:min-h-[48px] md:min-h-[52px] flex items-center justify-center">
                          <Video className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          <span className="hidden sm:inline">Join</span>
                          <span className="sm:hidden">Join</span>
                        </button>
                        {/* Keep only one Details in Today section */}
                        <button
                          onClick={() => { setSelectedAppointment(appointment); setDetailsOpen(true); }}
                          className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-3 bg-gray-700 text-white rounded-full font-medium hover:bg-gray-600 transition-colors text-sm sm:text-base min-h-[44px] sm:min-h-[48px] md:min-h-[52px] flex items-center justify-center"
                        >
                          Details
                        </button>
                        {appointment.status.toLowerCase() === "confirmed" && (
                          <>
                            <button
                              onClick={() =>
                                handleRescheduleClick(appointment.id)
                              }
                              disabled={rescheduleLoading}
                              className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-3 bg-gray-600 text-white rounded-full font-medium hover:bg-gray-500 transition-colors disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base min-h-[44px] sm:min-h-[48px] md:min-h-[52px]"
                              style={{ backgroundColor: "#444444" }}
                            >
                              {rescheduleLoading ? (
                                <>
                                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                                  <span className="hidden md:inline">
                                    Rescheduling...
                                  </span>
                                  <span className="hidden sm:inline md:hidden">
                                    Rescheduling...
                                  </span>
                                  <span className="sm:hidden">...</span>
                                </>
                              ) : (
                                <>
                                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                  <span className="hidden md:inline">
                                    Reschedule
                                  </span>
                                  <span className="hidden sm:inline md:hidden">
                                    Reschedule
                                  </span>
                                  <span className="sm:hidden">Reschedule</span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleCancelClick(appointment)}
                              disabled={cancelLoading}
                              className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-3 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base min-h-[44px] sm:min-h-[48px] md:min-h-[52px]"
                            >
                              {cancelLoading ? (
                                <>
                                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                                  <span className="hidden md:inline">
                                    Cancelling...
                                  </span>
                                  <span className="hidden sm:inline md:hidden">
                                    Cancelling...
                                  </span>
                                  <span className="sm:hidden">...</span>
                                </>
                              ) : (
                                <>
                                  <X className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                  <span className="hidden md:inline">
                                    Cancel
                                  </span>
                                  <span className="hidden sm:inline md:hidden">
                                    Cancel
                                  </span>
                                  <span className="sm:hidden">Cancel</span>
                                </>
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8 md:py-12">
                  <Calendar className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-gray-500 mx-auto mb-3 sm:mb-4" />
                  <p className="text-base sm:text-lg md:text-xl text-gray-400">
                    No appointments today
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Upcoming */}
          <TabsContent value="upcoming" className="mt-0">
            <div
              className="rounded-xl sm:rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8"
              style={{ backgroundColor: "#2a2a2a" }}
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 md:mb-8">
                Upcoming Appointments
              </h2>
              {upcomingAppointments?.length ? (
                <div className="space-y-3 sm:space-y-4 md:space-y-6">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="appointment-card rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 transition-all duration-200 hover:shadow-lg"
                      style={{ backgroundColor: "#333333" }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-3 md:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                          <div className="p-2 sm:p-2.5 md:p-3 bg-red-500 rounded-lg flex-shrink-0">
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-white text-base sm:text-lg md:text-xl leading-tight">
                              {formatDate(appointment.appointmentDate)}
                            </p>
                            <p className="text-gray-300 text-sm sm:text-base md:text-lg truncate leading-relaxed">
                              {formatTime(appointment.appointmentTime)} - Dr.{" "}
                              {appointment.doctor?.firstName}{" "}
                              {appointment.doctor?.lastName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 sm:ml-2 md:ml-4">
                          {getStatusBadge(appointment.status)}
                          {appointment.medications && Object.values(appointment.medications as Record<string, string[]>)?.some((m: any) => (m as string[])?.length > 0) && (
                            <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5">Medication Assigned</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                        {/* Use the existing first Details button to open modal */}
                        <button
                          onClick={() => { setSelectedAppointment(appointment); setDetailsOpen(true); }}
                          className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-3 bg-gray-600 text-white rounded-full font-medium hover:bg-gray-500 transition-colors text-sm sm:text-base min-h-[44px] sm:min-h-[48px] md:min-h-[52px] flex items-center justify-center"
                          style={{ backgroundColor: "#444444" }}
                        >
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          <span className="hidden sm:inline">Details</span>
                          <span className="sm:hidden">Details</span>
                        </button>
                        {appointment.status.toLowerCase() === "confirmed" && (
                          <>
                            <button
                              onClick={() =>
                                handleRescheduleClick(appointment.id)
                              }
                              disabled={rescheduleLoading}
                              className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-3 bg-gray-600 text-white rounded-full font-medium hover:bg-gray-500 transition-colors disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base min-h-[44px] sm:min-h-[48px] md:min-h-[52px]"
                              style={{ backgroundColor: "#444444" }}
                            >
                              {rescheduleLoading ? (
                                <>
                                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                                  <span className="hidden md:inline">
                                    Rescheduling...
                                  </span>
                                  <span className="hidden sm:inline md:hidden">
                                    Rescheduling...
                                  </span>
                                  <span className="sm:hidden">...</span>
                                </>
                              ) : (
                                <>
                                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                  <span className="hidden md:inline">
                                    Reschedule
                                  </span>
                                  <span className="hidden sm:inline md:hidden">
                                    Reschedule
                                  </span>
                                  <span className="sm:hidden">Reschedule</span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleCancelClick(appointment)}
                              disabled={cancelLoading}
                              className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-3 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base min-h-[44px] sm:min-h-[48px] md:min-h-[52px]"
                            >
                              {cancelLoading ? (
                                <>
                                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                                  <span className="hidden md:inline">
                                    Cancelling...
                                  </span>
                                  <span className="hidden sm:inline md:hidden">
                                    Cancelling...
                                  </span>
                                  <span className="sm:hidden">...</span>
                                </>
                              ) : (
                                <>
                                  <X className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                  <span className="hidden md:inline">
                                    Cancel
                                  </span>
                                  <span className="hidden sm:inline md:hidden">
                                    Cancel
                                  </span>
                                  <span className="sm:hidden">Cancel</span>
                                </>
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8 md:py-12">
                  <Calendar className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-gray-500 mx-auto mb-3 sm:mb-4" />
                  <p className="text-base sm:text-lg md:text-xl text-gray-400">
                    No upcoming appointments
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Past */}
          <TabsContent value="past" className="mt-0">
            <div
              className="rounded-xl sm:rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8"
              style={{ backgroundColor: "#2a2a2a" }}
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 md:mb-8">
                Past Appointments
              </h2>
              {pastAppointments?.length ? (
                <div className="space-y-3 sm:space-y-4 md:space-y-6">
                  {pastAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="appointment-card rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 transition-all duration-200 hover:shadow-lg"
                      style={{ backgroundColor: "#333333" }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-3 md:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                          <div className="p-2 sm:p-2.5 md:p-3 bg-gray-500 rounded-lg flex-shrink-0">
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-white text-base sm:text-lg md:text-xl leading-tight">
                              {formatDate(appointment.appointmentDate)}
                            </p>
                            <p className="text-gray-300 text-sm sm:text-base md:text-lg truncate leading-relaxed">
                              Dr. {appointment.doctor?.firstName}{" "}
                              {appointment.doctor?.lastName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 sm:ml-2 md:ml-4">
                          {getStatusBadge(appointment.status)}
                          {appointment.medications && Object.values(appointment.medications as Record<string, string[]>)?.some((m: any) => (m as string[])?.length > 0) && (
                            <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5">Medication Assigned</Badge>
                          )}
                        </div>
                      </div>
                      <button className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-3 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors text-sm sm:text-base min-h-[44px] sm:min-h-[48px] md:min-h-[52px] w-full sm:w-auto flex items-center justify-center">
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        <span className="hidden sm:inline">Rebook</span>
                        <span className="sm:hidden">Rebook</span>
                      </button>
                      <button
                        onClick={() => { setSelectedAppointment(appointment); setDetailsOpen(true); }}
                        className="mt-3 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-3 bg-gray-700 text-white rounded-full font-medium hover:bg-gray-600 transition-colors w-full sm:w-auto"
                      >
                        Details
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8 md:py-12">
                  <Calendar className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-gray-500 mx-auto mb-3 sm:mb-4" />
                  <p className="text-base sm:text-lg md:text-xl text-gray-400">
                    No past appointments
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Details Modal */}
        <AppointmentDetailsModal
          isOpen={isDetailsOpen}
          appointment={selectedAppointment}
          onClose={() => setDetailsOpen(false)}
        />

        {/* Reschedule Modal */}
        <RescheduleModal
          isOpen={isRescheduleOpen}
          doctorId={getCurrentAppointment()?.doctorId}
          onClose={() => {
            setRescheduleOpen(false);
            setSelectedAppointmentId("");
          }}
          onConfirm={handleRescheduleConfirm}
        />

        {/* Cancel Modal */}
        {selectedAppointment && (
          <CancelModal
            isOpen={isCancelOpen}
            onClose={() => {
              setCancelOpen(false);
              setSelectedAppointment(null);
            }}
            appointment={selectedAppointment}
          />
        )}
      </div>
      </>)}
    </div>
  );
};

export default MyAppointments;
// Render Appointment Details Modal root
// Note: placing after default export would be ignored; include JSX before return above.
