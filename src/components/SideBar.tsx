// components/SideBar.tsx
import { Calendar, FileText, Mail, Clock } from "lucide-react";

interface SidebarProps {
  activeMenuItem?: string;
  onMenuItemClick?: (menuItem: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeMenuItem = "book-appointment",
  onMenuItemClick,
}) => {
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
    <div
      className="w-64 text-white h-screen flex flex-col"
      style={{ backgroundColor: "#151515" }}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-600">
        <h2 className="text-lg font-medium text-gray-300">Main Menu</h2>
      </div>

      {/* Menu Items */}
      <div className="flex-1 py-4">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeMenuItem === item.id;

          return (
            <div
              key={item.id}
              onClick={() => onMenuItemClick?.(item.id)}
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
  );
};

export default Sidebar;
