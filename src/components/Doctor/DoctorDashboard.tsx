import React, { useState } from "react";
import { 
  Clock, 
  AlertTriangle,
  Calendar as CalendarIcon,
  Home,
  Calendar,
  Users,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/Generic/DashboardLayout";
import ReusableSidebar from "@/components/Generic/ReusableSidebar";
import DoctorSchedule from "./DoctorSchedule";
import DoctorPatients from "./DoctorPatients";

interface DoctorDashboardProps {
  doctorName?: string;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  doctorName = "Dr. Sam",
}) => {
  const [activeMenuItem, setActiveMenuItem] = useState<string>("dashboard");

  const handleMenuItemClick = (menuItem: string) => {
    setActiveMenuItem(menuItem);
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      bgColor: "bg-red-500",
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
      id: "queue",
      label: "Patient Queue",
      icon: UserCheck,
      bgColor: "bg-gray-600",
    },
  ];

  const dashboardCards = [
    {
      title: "Today's Schedule",
      value: "12 appointments",
      icon: CalendarIcon,
      color: "text-red-500"
    },
    {
      title: "Waiting Room",
      value: "3 patients",
      icon: Clock,
      color: "text-red-500"
    },
    {
      title: "Action Items",
      value: "2 flagged",
      icon: AlertTriangle,
      color: "text-red-500"
    }
  ];

  const upcomingAppointments = [
    {
      time: "9:00 AM",
      patient: "John Doe",
      purpose: "Follow-up",
      status: "Confirmed",
      statusColor: "text-green-500"
    },
    {
      time: "9:30 AM",
      patient: "Alex R.",
      purpose: "Lab Review",
      status: "Checked-in",
      statusColor: "text-orange-500"
    }
  ];

  const renderContent = () => {
    switch (activeMenuItem) {
      case "dashboard":
        return (
          <div className="flex-1 text-white">
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
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Current Appointment</h2>
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
                    <h3 className="text-lg font-semibold mb-2 text-white">{card.title}</h3>
                    <p className="text-gray-400">{card.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="mx-4 sm:mx-6 lg:mx-8 mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Upcoming Appointments</h2>
              <div 
                className="bg-gray-800 border border-gray-700 rounded-2xl sm:rounded-3xl overflow-hidden"
                style={{ backgroundColor: "#2a2a2a" }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700">
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
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {upcomingAppointments.map((appointment, index) => (
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 bg-gray-700">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="ml-auto"
                  >
                    View Full Schedule
                  </Button>
                </div>
              </div>
            </div>

            {/* Lab Results */}
            <div className="mx-4 sm:mx-6 lg:mx-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Lab Results</h2>
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
      case "schedule":
        return <DoctorSchedule />;
      case "patients":
        return <DoctorPatients />;
      case "queue":
        return (
          <div className="flex-1 text-white p-4 sm:p-6 lg:p-8">
            <div className="mx-4 sm:mx-6 lg:mx-8">
              <div
                className="bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8"
                style={{ backgroundColor: "#2a2a2a" }}
              >
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Patient Queue</h1>
                <p className="text-gray-400 text-sm sm:text-base lg:text-lg">
                  Patient queue content will go here...
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex-1 text-white p-4 sm:p-6 lg:p-8">
            <div className="mx-4 sm:mx-6 lg:mx-8">
              <div
                className="bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8"
                style={{ backgroundColor: "#2a2a2a" }}
              >
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
              </div>
            </div>
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
