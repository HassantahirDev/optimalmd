// components/MyAppointments.tsx
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { getUserId } from "@/lib/utils";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RescheduleAppointmentDto } from "@/redux/api/appointmentApi";
import RescheduleModal from "../Modals/RescheduleModal";
import CancelModal from "../CancelModal";
import { toast } from "react-toastify";

interface MyAppointmentsProps {
  patientName?: string;
}

const MyAppointments: React.FC<MyAppointmentsProps> = ({
  patientName = localStorage.getItem("name") || "",
}) => {
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
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>("");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

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
      // Clear the success state
      dispatch(clearRescheduleState());
      // Refresh appointments
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
      // Clear the success state
      dispatch(clearCancelState());
      // Refresh appointments
      if (userId) {
        dispatch(fetchPatientAppointments({ patientId: userId }));
      }
    }
  }, [cancelSuccess, userId, dispatch]);

  // Handle errors
  useEffect(() => {
    if (rescheduleError) {
      toast.error(`Reschedule failed: ${rescheduleError}`);
      // Clear the error state after showing toast
      dispatch(clearRescheduleState());
    }
  }, [rescheduleError, dispatch]);

  useEffect(() => {
    if (cancelError) {
      toast.error(`Cancellation failed: ${cancelError}`);
      // Clear the error state after showing toast
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

  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
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
    <div className="flex-1 text-white min-h-full dashboard-container" style={{ backgroundColor: "#151515" }}>
      {/* Header Section */}
      <div className="p-8 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-4xl font-bold text-white">
                Hello, {patientName}!
              </h1>
              <span className="text-4xl">👋</span>
            </div>
            <p className="text-gray-400 text-lg mt-2">
              Here's what's next for your health.
            </p>
          </div>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-medium"
            style={{ backgroundColor: "#ff4444" }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Book a New Appointment
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-8 pb-8">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-6 bg-transparent border-0 p-0 gap-4">
            <TabsTrigger
              value="today"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white bg-gray-700 text-gray-300 px-6 py-2 rounded-full transition-all duration-200"
              style={{ backgroundColor: "#333333" }}
            >
              Today
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white bg-gray-700 text-gray-300 px-6 py-2 rounded-full transition-all duration-200"
              style={{ backgroundColor: "#333333" }}
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white bg-gray-700 text-gray-300 px-6 py-2 rounded-full transition-all duration-200"
              style={{ backgroundColor: "#333333" }}
            >
              Past
            </TabsTrigger>
          </TabsList>

          {/* Today */}
          <TabsContent value="today">
            <div
              className="rounded-3xl p-8"
              style={{ backgroundColor: "#2a2a2a" }}
            >
              <h2 className="text-2xl font-bold text-white mb-8">
                Today's Appointments
              </h2>
              {todayAppointments?.length ? (
                <div className="space-y-6">
                  {todayAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="rounded-2xl p-6"
                      style={{ backgroundColor: "#333333" }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-red-500 rounded-lg">
                            <Clock className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-white text-xl">
                              {formatTime(appointment.appointmentTime)}
                            </p>
                            <p className="text-gray-300 text-lg">
                              Dr. {appointment.doctor?.firstName}{" "}
                              {appointment.doctor?.lastName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(appointment.status)}
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button className="px-6 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors">
                          <Video className="w-4 h-4 mr-2 inline" />
                          Join
                        </button>
                        {appointment.status.toLowerCase() === "confirmed" && (
                          <>
                            <button
                              onClick={() => handleRescheduleClick(appointment.id)}
                              disabled={rescheduleLoading}
                              className="px-6 py-3 bg-gray-600 text-white rounded-full font-medium hover:bg-gray-500 transition-colors disabled:cursor-not-allowed flex items-center"
                              style={{ backgroundColor: "#444444" }}
                            >
                              {rescheduleLoading ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Rescheduling...
                                </>
                              ) : (
                                <>
                                  <RefreshCw className="w-4 h-4 mr-2" />
                                  Reschedule
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleCancelClick(appointment)}
                              disabled={cancelLoading}
                              className="px-6 py-3 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors disabled:cursor-not-allowed flex items-center"
                            >
                              {cancelLoading ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Cancelling...
                                </>
                              ) : (
                                <>
                                  <X className="w-4 h-4 mr-2" />
                                  Cancel
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
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-xl text-gray-400">No appointments today</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Upcoming */}
          <TabsContent value="upcoming">
            <div
              className="rounded-3xl p-8"
              style={{ backgroundColor: "#2a2a2a" }}
            >
              <h2 className="text-2xl font-bold text-white mb-8">
                Upcoming Appointments
              </h2>
              {upcomingAppointments?.length ? (
                <div className="space-y-6">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="rounded-2xl p-6"
                      style={{ backgroundColor: "#333333" }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-red-500 rounded-lg">
                            <Calendar className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-white text-xl">
                              {formatDate(appointment.appointmentDate)}
                            </p>
                            <p className="text-gray-300 text-lg">
                              {formatTime(appointment.appointmentTime)} - Dr.{" "}
                              {appointment.doctor?.firstName}{" "}
                              {appointment.doctor?.lastName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(appointment.status)}
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button
                          className="px-6 py-3 bg-gray-600 text-white rounded-full font-medium hover:bg-gray-500 transition-colors"
                          style={{ backgroundColor: "#444444" }}
                        >
                          <ArrowRight className="w-4 h-4 mr-2 inline" />
                          Details
                        </button>
                        {appointment.status.toLowerCase() === "confirmed" && (
                          <>
                            <button
                              onClick={() => handleRescheduleClick(appointment.id)}
                              disabled={rescheduleLoading}
                              className="px-6 py-3 bg-gray-600 text-white rounded-full font-medium hover:bg-gray-500 transition-colors disabled:cursor-not-allowed flex items-center"
                              style={{ backgroundColor: "#444444" }}
                            >
                              {rescheduleLoading ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Rescheduling...
                                </>
                              ) : (
                                <>
                                  <RefreshCw className="w-4 h-4 mr-2" />
                                  Reschedule
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleCancelClick(appointment)}
                              disabled={cancelLoading}
                              className="px-6 py-3 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors disabled:cursor-not-allowed flex items-center"
                            >
                              {cancelLoading ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Cancelling...
                                </>
                              ) : (
                                <>
                                  <X className="w-4 h-4 mr-2" />
                                  Cancel
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
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-xl text-gray-400">
                    No upcoming appointments
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Past */}
          <TabsContent value="past">
            <div
              className="rounded-3xl p-8"
              style={{ backgroundColor: "#2a2a2a" }}
            >
              <h2 className="text-2xl font-bold text-white mb-8">
                Past Appointments
              </h2>
              {pastAppointments?.length ? (
                <div className="space-y-6">
                  {pastAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="rounded-2xl p-6"
                      style={{ backgroundColor: "#333333" }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-gray-500 rounded-lg">
                            <Calendar className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-white text-xl">
                              {formatDate(appointment.appointmentDate)}
                            </p>
                            <p className="text-gray-300 text-lg">
                              Dr. {appointment.doctor?.firstName}{" "}
                              {appointment.doctor?.lastName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(appointment.status)}
                        </div>
                      </div>
                      <button className="px-6 py-3 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors">
                        <Plus className="w-4 h-4 mr-2 inline" />
                        Rebook
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-xl text-gray-400">No past appointments</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

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
    </div>
  );
};

export default MyAppointments;
