// components/Sidebar.tsx
import { Calendar, FileText, Mail, Clock, Menu, X } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  activeMenuItem?: string;
  onMenuItemClick?: (menuItem: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeMenuItem = "book-appointment",
  onMenuItemClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#151515] text-white transform transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:flex-shrink-0`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-600 flex-shrink-0">
          <h2 className="text-lg font-medium text-gray-300">Main Menu</h2>
        </div>

        {/* Menu Items */}
        <div className="flex-1 py-4 overflow-y-auto">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeMenuItem === item.id;

            return (
              <div
                key={item.id}
                onClick={() => {
                  onMenuItemClick?.(item.id);
                  setIsOpen(false); // auto close on mobile
                }}
                className={`flex items-center px-6 py-4 cursor-pointer transition-colors duration-200 ${
                  isActive
                    ? `${item.bgColor} text-white`
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                <div
                  className={`p-1 rounded ${
                    isActive ? "text-white" : "text-gray-400"
                  }`}
                >
                  <IconComponent size={20} />
                </div>
                <span className="ml-3 font-medium">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
