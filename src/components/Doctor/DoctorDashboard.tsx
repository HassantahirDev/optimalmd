import React, { useState, useEffect } from "react";
import {
  Clock,
  AlertTriangle,
  Calendar as CalendarIcon,
  Home,
  Calendar,
  Users,
  Phone,
  Video,
  StickyNote,
  Mail,
  Settings,
  Link,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/Generic/DashboardLayout";
import ReusableSidebar from "@/components/Generic/ReusableSidebar";
import DoctorSchedule from "./DoctorSchedule";
import DoctorPatients from "./DoctorPatients";
import { PatientHistory } from "./PatientHistory";
import WorkingHours from "./WorkingHours";
import DoctorSlots from "./DoctorSlots";
import GoogleCalendarConnection from "./GoogleCalendarConnection";
import GoogleCalendarImport from "./GoogleCalendarImport";
import Messages from "./Messages";
import api from "@/service/api";

interface DoctorDashboardProps {
  doctorName?: string;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  doctorName = "Dr. Sam",
}) => {
  const [activeMenuItem, setActiveMenuItem] = useState<string>("dashboard");
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  // Get doctor ID from localStorage
  const doctorId = localStorage.getItem("userId");

  // Load dashboard statistics
  useEffect(() => {
    if (!doctorId) {
      setError("Doctor ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    loadDashboardStats();
  }, [doctorId]);

  const loadDashboardStats = async () => {
    if (!doctorId) return;

    try {
      setLoading(true);
      setError(null);

      // Load dashboard statistics and upcoming appointments in parallel
      const [statsResponse, appointmentsResponse] = await Promise.all([
        api.get(`/doctors/${doctorId}/dashboard-stats`),
        loadUpcomingAppointments()
      ]);
      
      if (statsResponse.data.success) {
        setDashboardStats(statsResponse.data.data);
      } else {
        setError('Failed to load dashboard statistics');
      }
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const loadUpcomingAppointments = async () => {
    if (!doctorId) return;

    try {
      // Get upcoming appointments (next 7 days) with only CONFIRMED status
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      const params = new URLSearchParams({
        startDate: today.toISOString().split('T')[0],
        endDate: nextWeek.toISOString().split('T')[0],
        status: 'CONFIRMED',
        limit: '5' // Show only 5 upcoming appointments
      });

      const response = await api.get(`/appointments/doctor/${doctorId}/schedule?${params}`);
      
      if (response.data.success) {
        const appointments = response.data.data.map((apt: any) => ({
          time: apt.appointmentTime,
          patient: `${apt.patient.firstName} ${apt.patient.lastName}`,
          purpose: apt.service?.name || 'General Consultation',
          status: 'Confirmed',
          statusColor: 'text-green-500',
          appointmentId: apt.id,
          patientId: apt.patient.id,
          appointmentDate: apt.appointmentDate
        }));

        setUpcomingAppointments(appointments);
      }
    } catch (err) {
      console.error('Error loading upcoming appointments:', err);
      // Don't set error for appointments, just log it
    }
  };

  const handleMenuItemClick = (menuItem: string) => {
    setActiveMenuItem(menuItem);
  };

  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);
    setActiveMenuItem("patient-history");
  };

  const handleBackToPatients = () => {
    setSelectedPatient(null);
    setActiveMenuItem("patients");
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      bgColor: "bg-red-500",
    },
    {
      id: "working-hours",
      label: "Working Hours",
      icon: Settings,
      bgColor: "bg-gray-600",
    },
    {
      id: "google-calendar",
      label: "Google Calendar",
      icon: Link,
      bgColor: "bg-blue-600",
    },
    {
      id: "calendar-import",
      label: "Calendar Import",
      icon: Calendar,
      bgColor: "bg-purple-600",
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageCircle,
      bgColor: "bg-green-600",
    },
    {
      id: "schedule",
      label: "My Schedule",
      icon: Calendar,
      bgColor: "bg-gray-600",
    },
    {
      id: "patients",
      label: "My Patients",
      icon: Users,
      bgColor: "bg-gray-600",
    },
    {
      id: "slots",
      label: "Doctor Slots",
      icon: Calendar,
      bgColor: "bg-gray-600",
    },
  ];

  // Use API data or fallback to defaults
  const hasUrgentTasks = dashboardStats?.hasUrgentTasks || false;
  const urgentTasksSummary = dashboardStats?.urgentTasksSummary || "No urgent tasks";
  const todaysAppointmentsCount = dashboardStats?.todaysAppointments || 0;
  const labsToReviewCount = dashboardStats?.labsToReview || 0;
  const messagesAwaitingReplyCount = dashboardStats?.messagesAwaitingReply || 0;

  const dashboardCards = [
    {
      title: "Today's Appointments",
      value: todaysAppointmentsCount,
      icon: CalendarIcon,
      color: "text-red-500",
    },
    {
      title: "Labs to Review",
      value: labsToReviewCount,
      icon: AlertTriangle,
      color: "text-yellow-500",
    },
    {
      title: "Messages Awaiting Reply",
      value: messagesAwaitingReplyCount,
      icon: Mail,
      color: "text-blue-500",
    },
  ];


  // Show loading state for dashboard
  if (activeMenuItem === "dashboard" && loading) {
    return (
      <div className="flex-1 text-white p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state for dashboard
  if (activeMenuItem === "dashboard" && error) {
    return (
      <div className="flex-1 text-white p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={loadDashboardStats}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeMenuItem) {
      case "dashboard":
        return (
          <div className="flex-1 text-white">
            {/* Needs Attention Banner */}
            {hasUrgentTasks && (
              <div className="bg-yellow-500 text-black rounded-xl px-6 py-3 mb-6 flex items-center gap-3 shadow">
                <span className="text-2xl">⚠</span>
                <span className="font-semibold">Needs Attention:</span>
                <span>{urgentTasksSummary}</span>
              </div>
            )}
            {/* Welcome Section */}
            <div className="p-4 sm:p-6 lg:p-8 pb-4 sm:pb-6">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  Welcome Back, {doctorName}! 👋
                </h1>
              </div>
              <p className="text-gray-400 text-sm sm:text-base lg:text-lg mt-1 sm:mt-2 leading-relaxed">
                Here's what's next for today.
              </p>
            </div>

            {/* Current Appointment Cards */}
            <div className="mx-4 sm:mx-6 lg:mx-8 mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                Current Appointment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {dashboardCards.map((card, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 border border-gray-700 rounded-2xl sm:rounded-3xl p-6 hover:bg-gray-750 transition-colors"
                    style={{ backgroundColor: "#2a2a2a" }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <card.icon className={`w-8 h-8 ${card.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-white">
                      {card.title}
                    </h3>
                    <p className="text-gray-400">{card.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="mx-4 sm:mx-6 lg:mx-8 mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                Upcoming Appointments
              </h2>
              <div
                className="bg-gray-800 border border-gray-700 rounded-2xl sm:rounded-3xl overflow-hidden"
                style={{ backgroundColor: "#2a2a2a" }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-black-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                          Time
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                          Patient
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                          Appointment Purpose
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {upcomingAppointments.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                            No upcoming confirmed appointments for the next 7 days.
                          </td>
                        </tr>
                      ) : (
                        upcomingAppointments.map((appointment, index) => (
                          <tr key={index} className="hover:bg-gray-750">
                            <td className="px-6 py-4 text-sm text-white">
                              {appointment.time}
                            </td>
                            <td className="px-6 py-4 text-sm text-white">
                              {appointment.patient}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-300">
                              {appointment.purpose}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className={appointment.statusColor}>
                                {appointment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                title="Send Message"
                                onClick={() => handleMenuItemClick("messages")}
                              >
                                <MessageCircle className="w-5 h-5" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 bg-black-700">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleMenuItemClick("schedule")}
                  >
                    View Full Schedule
                  </Button>
                </div>
              </div>
            </div>

            {/* Lab Results */}
            <div className="mx-4 sm:mx-6 lg:mx-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                Lab Results
              </h2>
              <div
                className="bg-gray-800 border border-gray-700 rounded-2xl sm:rounded-3xl p-6"
                style={{ backgroundColor: "#2a2a2a" }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300">
                      2 new lab reports pending release
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Review Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      case "working-hours":
        return <WorkingHours doctorId={localStorage.getItem("userId") || undefined} />;
      case "google-calendar":
        return <GoogleCalendarConnection doctorId={localStorage.getItem("userId") || ""} />;
      case "calendar-import":
        return <GoogleCalendarImport doctorId={localStorage.getItem("userId") || ""} />;
      case "messages":
        return <Messages doctorId={localStorage.getItem("userId") || ""} />;
      case "schedule":
        return <DoctorSchedule />;
      case "patients":
        return <DoctorPatients onPatientSelect={handlePatientSelect} />;
      case "patient-history":
        return <PatientHistory patient={selectedPatient} onBack={handleBackToPatients} />;
      case "slots":
        return <DoctorSlots doctorId={localStorage.getItem("userId") || ""} />;

      default:
        return (
          <div className="flex-1 text-white p-4">
            <h1>Dashboard</h1>
          </div>
        );
    }
  };

  return (
    <DashboardLayout
      sidebar={
        <ReusableSidebar
          activeMenuItem={activeMenuItem}
          onMenuItemClick={handleMenuItemClick}
          menuItems={menuItems}
        />
      }
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default DoctorDashboard;
