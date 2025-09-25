import React, { useEffect, useState } from "react";
import {
  Calendar,
  Users,
  Clock,
  Home,
  UserPlus,
  FileText,
  CheckCircle,
  AlertCircle,
  Settings,
} from "lucide-react";
import DashboardLayout from "@/components/Generic/DashboardLayout";
import ReusableSidebar from "@/components/Generic/ReusableSidebar";
import AdminRequests from "./AdminRequests";
import AdminAppointments from "./AdminAppointments";
import AdminPatients from "./AdminPatients";
import AdminWorkingHours from "./AdminWorkingHours";
import { adminApi } from "@/services/adminApi";


interface SuperAdminDashboardProps {
  adminName?: string;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  adminName = "Super Admin",
}) => {
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const [dashboardStats, setDashboardStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    pendingRequests: 0,
    todayAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminApi.dashboard.getStats();
      setDashboardStats(response.data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuItemClick = (menuItem: string) => {
    setActiveMenuItem(menuItem);
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      bgColor: "bg-red-600",
    },
    {
      id: "requests",
      label: "Requests",
      icon: Clock,
      bgColor: "bg-red-600",
    },
    {
      id: "appointments",
      label: "Appointments",
      icon: Calendar,
      bgColor: "bg-red-600",
    },
    {
      id: "patients",
      label: "Patients",
      icon: Users,
      bgColor: "bg-red-600",
    },
    {
      id: "work-schedule",
      label: "Work Schedule",
      icon: Settings,
      bgColor: "bg-red-600",
    },
  ];

    const dashboardCards = [
    {
      title: "Pending Requests",
      value: dashboardStats.pendingRequests,
      icon: Clock,
      color: "text-red-500",
      description: "Appointments awaiting doctor assignment",
    },
    {
      title: "Total Appointments",
      value: dashboardStats.totalAppointments,
      icon: Calendar,
      color: "text-red-500",
      description: "All scheduled appointments",
    },
    {
      title: "Active Patients",
      value: dashboardStats.totalPatients,
      icon: Users,
      color: "text-red-500",
      description: "Registered patients",
    },
    {
      title: "Doctors Available",
      value: dashboardStats.totalDoctors,
      icon: UserPlus,
      color: "text-red-500",
      description: "Active doctors in system",
    },
  ];

  const renderContent = () => {
    switch (activeMenuItem) {
      case "dashboard":
        return (
          <div className="flex-1 text-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-500 rounded-lg">
                    <Home className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white">Super Admin Dashboard</h1>
                </div>
                <p className="text-gray-400 text-lg">
                  Manage appointments, patients, and doctor assignments
                </p>
              </div>

              {/* Dashboard Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {dashboardCards.map((card, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${card.color.replace('text-', 'bg-').replace('-500', '-500/20')}`}>
                        <card.icon className={`h-6 w-6 ${card.color}`} />
                      </div>
                      <span className="text-2xl font-bold text-white">{card.value}</span>
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">{card.title}</h3>
                    <p className="text-gray-400 text-sm">{card.description}</p>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveMenuItem("requests")}
                    className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <Clock className="h-5 w-5 text-red-500" />
                    <span className="text-white font-medium">Review Requests</span>
                  </button>
                  <button
                    onClick={() => setActiveMenuItem("appointments")}
                    className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <Calendar className="h-5 w-5 text-red-500" />
                    <span className="text-white font-medium">Manage Appointments</span>
                  </button>
                  <button
                    onClick={() => setActiveMenuItem("patients")}
                    className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <Users className="h-5 w-5 text-red-500" />
                    <span className="text-white font-medium">Manage Patients</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "requests":
        return <AdminRequests />;

      case "appointments":
        return <AdminAppointments />;

      case "patients":
        return <AdminPatients />;

      case "work-schedule":
        return <AdminWorkingHours />;

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
          title="Super Admin"
        />
      }
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
