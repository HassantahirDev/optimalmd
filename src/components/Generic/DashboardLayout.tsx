import React from "react";
import Navbar from "./Navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, sidebar }) => {
  return (
    <div
      className="h-screen overflow-hidden dashboard-container"
      style={{ backgroundColor: "#151515" }}
    >
      {/* Add the Navbar at the top */}
      <Navbar />

      {/* Main content area with sidebar and content */}
      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        {/* Subtract navbar height */}
        {sidebar}
        <div
          className="flex-1 overflow-auto dashboard-container"
          style={{ backgroundColor: "#151515" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
