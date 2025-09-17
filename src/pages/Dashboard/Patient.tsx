import BookAppointment from "@/components/Appointment/BookAppointment";
import MyAppointments from "@/components/Appointment/MyAppointments";
import DashboardLayout from "@/components/Generic/DashboardLayout";
import ReusableSidebar from "@/components/Generic/ReusableSidebar";
import Messages from "@/components/Patient/Messages";
import { Calendar, Clock, FileText, Mail } from "lucide-react";
import { useState } from "react";

interface PatientDashboardProps {
  patientName?: string;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({
  patientName = localStorage.getItem("name") || "",
}) => {
  const [activeMenuItem, setActiveMenuItem] =
    useState<string>("book-appointment");

  const handleMenuItemClick = (menuItem: string) => {
    setActiveMenuItem(menuItem);
  };

  const menuItems = [
    {
      id: "book-appointment",
      label: "Book Appointment",
      icon: Calendar,
      bgColor: "bg-red-500",
    },
    {
      id: "my-appointments",
      label: "My Appointments",
      icon: Clock,
      bgColor: "bg-gray-600",
    },
    {
      id: "care-plan",
      label: "Care Plan Status",
      icon: FileText,
      bgColor: "bg-gray-600",
    },
    {
      id: "messages",
      label: "Messages",
      icon: Mail,
      bgColor: "bg-gray-600",
    },
  ];

  const renderContent = () => {
    switch (activeMenuItem) {
      case "book-appointment":
        return <BookAppointment patientName={patientName} />;
      case "my-appointments":
        return <MyAppointments patientName={patientName} />;
      case "care-plan":
        return (
          <div className="flex-1 text-white p-8">
            <h1 className="text-3xl font-bold">Care Plan Status</h1>
            <p className="text-gray-400 mt-4">
              Care plan content will go here...
            </p>
          </div>
        );
      case "messages":
        return <Messages patientId={localStorage.getItem("userId") || ""} />;
      default:
        return <BookAppointment patientName={patientName} />;
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

export default PatientDashboard;
