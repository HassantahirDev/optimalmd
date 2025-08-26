import BookAppointment from "@/components/BookAppointment";
import MyAppointments from "@/components/MyAppointments";
import Sidebar from "@/components/SideBar";
import Navbar from "@/components/Navbar"; // Add this import
import { useState } from "react";

interface PatientDashboardProps {
  patientName?: string;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({
  patientName = localStorage.getItem('name') || '',
}) => {
  const [activeMenuItem, setActiveMenuItem] =
    useState<string>("book-appointment");

  const handleMenuItemClick = (menuItem: string) => {
    setActiveMenuItem(menuItem);
  };

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
        return (
          <div className="flex-1 text-white p-8">
            <h1 className="text-3xl font-bold">Messages</h1>
            <p className="text-gray-400 mt-4">
              Messages content will go here...
            </p>
          </div>
        );
      default:
        return <BookAppointment patientName={patientName} />;
    }
  };

  return (
    <div className="h-screen" style={{ backgroundColor: "#151515" }}>
      {/* Add the Navbar at the top */}
      <Navbar />
      
      {/* Main content area with sidebar and content */}
      <div className="flex h-[calc(100vh-64px)]"> {/* Subtract navbar height */}
        <Sidebar
          activeMenuItem={activeMenuItem}
          onMenuItemClick={handleMenuItemClick}
        />
        {renderContent()}
      </div>
    </div>
  );
};

export default PatientDashboard;