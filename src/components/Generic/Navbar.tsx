import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { logout } from "@/redux/slice/authSlice";
import { clearAuthData, getUserType } from "@/lib/utils";
import { LogOut, User, Settings, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get profile picture from localStorage
  const profilePicture = localStorage.getItem("profilePicture");
  const userName = localStorage.getItem("name") || "User";
  const userType = getUserType();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    clearAuthData();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav
      className="px-6 py-3 flex items-center border-b border-gray-700"
      style={{ backgroundColor: "#151515" }}
    >
      {/* Logo Section - hidden on small screens */}
      <div className="hidden md:flex items-center space-x-3">
        <img
          src="/logo.png"
          alt="OptimaleMD Logo"
          className="w-8 h-8 object-contain"
        />
        <span className="text-white text-xl font-semibold tracking-wide">
          Optimale<span className="text-white">MD</span>
        </span>
      </div>

      {/* Spacer to push avatar to the right */}
      <div className="ml-auto relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-600">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
                }}
              />
            ) : (
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50">
            <div className="px-4 py-3 border-b border-gray-600">
              <p className="text-white font-medium">{userName}</p>
              <p className="text-gray-400 text-sm">
                {userType === 'doctor' ? 'Doctor' : 'Patient'}
              </p>
            </div>
            <div className="py-2">
              <button className="w-full flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700">
                <User className="w-4 h-4 mr-3" />
                Profile
              </button>
              <button className="w-full flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700">
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </button>
              <div className="border-t border-gray-600 my-1"></div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-red-400 hover:bg-gray-700"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
