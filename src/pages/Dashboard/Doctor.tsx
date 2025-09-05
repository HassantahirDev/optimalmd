import React from "react";
import DoctorDashboard from "@/components/Doctor/DoctorDashboard";

interface DoctorPageProps {
  doctorName?: string;
}

const DoctorPage: React.FC<DoctorPageProps> = ({
  doctorName = "Dr. Sam",
}) => {
  return <DoctorDashboard doctorName={doctorName} />;
};

export default DoctorPage;
