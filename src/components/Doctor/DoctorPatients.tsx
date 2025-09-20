import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, Download } from "lucide-react";
import PatientProfileModal from "./PatientProfileModal";
import api from "@/service/api";

interface Patient {
  name: string;
  age: number;
  mrn: string;
  lastVisit: string;
  lastVisitTime?: string;
  lastVisitStatus?: string;
  lastVisitPurpose?: string;
  vitals?: { BP: string; HR: string; Temp: string };
  activeMeds?: string[];
  allergies?: string[];
  lastLogin?: string;
  dob?: string;
  email?: string;
  phone?: string;
  id?: string;
  appointmentId?: string; // New field for appointment ID
  appointmentDate?: string;
  appointmentTime?: string;
  appointmentStatus?: string;
  medicalForm?: any; // Updated to use any for the full medical form structure
}

interface DoctorPatientsProps {
  onPatientSelect?: (patient: any) => void;
}

const DoctorPatients: React.FC<DoctorPatientsProps> = ({ onPatientSelect }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [patientsData, setPatientsData] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get doctor ID from localStorage
  const doctorId = localStorage.getItem("userId");

  // Load patients data from API
  useEffect(() => {
    if (!doctorId) {
      setError("Doctor ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    loadPatientsData();
  }, [searchTerm, currentPage, doctorId]);

  const loadPatientsData = async () => {
    if (!doctorId) return;

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await api.get(`/doctors/${doctorId}/patients?${params}`);
      
      if (response.data.success) {
        // Medical form data is now included in the API response
        const patients = response.data.data.patients.map((patient: any) => ({
          name: patient.name,
          age: patient.age,
          mrn: patient.mrn,
          lastVisit: patient.lastVisit,
          lastVisitTime: patient.lastVisitTime,
          lastVisitStatus: patient.lastVisitStatus,
          lastVisitPurpose: patient.lastVisitPurpose,
          vitals: { BP: "N/A", HR: "N/A", Temp: "N/A" }, // These would need to be fetched separately
          activeMeds: [], // These would need to be fetched separately
          allergies: [], // These would need to be fetched separately
          lastLogin: "N/A", // This would need to be tracked separately
          dob: patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : "N/A",
          email: patient.email,
          phone: patient.phone,
          id: patient.id,
          appointmentId: patient.appointmentId, // Include appointment ID
          appointmentDate: patient.appointmentDate,
          appointmentTime: patient.appointmentTime,
          appointmentStatus: patient.appointmentStatus,
          medicalForm: patient.medicalForm // Medical form is now included in the response
        }));

        setPatientsData(patients);
        setTotalPages(response.data.data.totalPages || 1);
      } else {
        setError('Failed to load patients data');
      }
    } catch (err) {
      console.error('Error loading patients:', err);
      setError('Failed to load patients data');
    } finally {
      setLoading(false);
    }
  };

  // Helper to get patient profile for modal
  const getPatientProfile = (patient: Patient) => ({
    id: patient.id,
    appointmentId: patient.appointmentId, // Include appointment ID for navigation
    avatarUrl: undefined,
    name: patient.name,
    dob: patient.dob || "N/A",
    age: patient.age,
    email: patient.email || `${patient.name.toLowerCase().replace(/ /g, "")}@example.com`,
    alerts: patient.allergies && patient.allergies.length > 0 ? patient.allergies.join(', ') : 'None',
    medicalForm: patient.medicalForm || undefined,
  });

  // Use patientsData directly since search is handled by the API
  const filteredPatients = patientsData;

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleExportCSV = () => {
    // Create CSV content
    const csvHeaders = "Name,Age,MRN,Last Visit\n";
    const csvContent = patientsData
      .map(patient => `${patient.name},${patient.age},${patient.mrn},${patient.lastVisit}`)
      .join("\n");
    
    const csvData = csvHeaders + csvContent;
    
    // Create and download file
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `patients_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex-1 text-white p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading patients...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex-1 text-white p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={loadPatientsData}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 text-white">
      {/* Header Section with Search and Export */}
      <div className="p-4 sm:p-6 lg:p-8 pb-4 sm:pb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left side - Title and Subtitle */}
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
              My Patients
            </h1>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg mt-1 sm:mt-2 leading-relaxed">
              Here's your patient's list.
            </p>
          </div>
          {/* Right side - Export CSV and Search Bar */}
          <div className="flex gap-3 items-center w-full md:w-auto justify-end">
            <button
              onClick={handleExportCSV}
              disabled={filteredPatients.length === 0}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">Export</span>
            </button>
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search by name or MRN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-3 pr-12 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                style={{ backgroundColor: "#333333" }}
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Patients List */}
      <div className="mx-4 sm:mx-6 lg:mx-8">
        <div
          className="bg-gray-800 border border-gray-700 rounded-2xl sm:rounded-3xl overflow-hidden"
          style={{ backgroundColor: "#151515" }}
        >
          {/* Patients List Header */}
          <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-700">
            <h2 className="text-lg sm:text-xl font-bold text-white">Patients List</h2>
          </div>

          {/* Patients Table - Desktop */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black-700">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-medium text-gray-300">
                    Patient Name
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-medium text-gray-300">
                    Age
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-medium text-gray-300">
                    MRN
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-medium text-gray-300">
                    Appointment Date
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-medium text-gray-300">
                    Time
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-medium text-gray-300">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-medium text-gray-300">
                    Purpose
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                      No patients found.
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient, index) => (
                  <tr key={index} className="hover:bg-gray-750">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm relative">
                      <button
                        className="text-white underline hover:text-gray-300 transition-colors"
                        onClick={() => {
                          if (onPatientSelect) {
                            onPatientSelect(getPatientProfile(patient));
                          } else {
                            setSelectedPatient(getPatientProfile(patient));
                            setModalOpen(true);
                          }
                        }}
                        aria-label={`Open profile for ${patient.name}`}
                      >
                        {patient.name}
                      </button>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-white">
                      {patient.age}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-white">
                      {patient.mrn}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-white">
                      {patient.appointmentDate ? new Date(patient.appointmentDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-white">
                      {patient.appointmentTime || 'N/A'}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-white">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        patient.appointmentStatus === 'COMPLETED' ? 'bg-green-900 text-green-300' : 
                        patient.appointmentStatus === 'CONFIRMED' ? 'bg-blue-900 text-blue-300' :
                        patient.appointmentStatus === 'CANCELLED' ? 'bg-red-900 text-red-300' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {patient.appointmentStatus || 'N/A'}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-white">
                      {patient.lastVisitPurpose || 'N/A'}
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Patients Cards - Mobile */}
          <div className="sm:hidden">
            {filteredPatients.map((patient, index) => (
              <div key={index} className="px-4 py-4 border-b border-gray-700 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <button 
                    className="text-white underline hover:text-gray-300 transition-colors text-sm font-medium"
                    onClick={() => {
                      if (onPatientSelect) {
                        onPatientSelect(getPatientProfile(patient));
                      } else {
                        setSelectedPatient(getPatientProfile(patient));
                        setModalOpen(true);
                      }
                    }}
                  >
                    {patient.name}
                  </button>
                  <span className="text-xs text-gray-400">MRN: {patient.mrn}</span>
                </div>
                <div className="space-y-1 text-xs text-gray-300">
                  <div className="flex justify-between">
                    <span>Age: {patient.age}</span>
                    <span>Date: {patient.appointmentDate ? new Date(patient.appointmentDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time: {patient.appointmentTime || 'N/A'}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      patient.appointmentStatus === 'COMPLETED' ? 'bg-green-900 text-green-300' : 
                      patient.appointmentStatus === 'CONFIRMED' ? 'bg-blue-900 text-blue-300' :
                      patient.appointmentStatus === 'CANCELLED' ? 'bg-red-900 text-red-300' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {patient.appointmentStatus || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span>Purpose: {patient.lastVisitPurpose || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredPatients.length === 0 && searchTerm && (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-400">No patients found matching your search.</p>
            </div>
          )}

          {/* Pagination */}
          <div className="px-3 sm:px-6 py-3 sm:py-4 bg-black-700 flex items-center justify-end gap-2 sm:gap-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="w-6 h-6 sm:w-8 sm:h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={12} className="sm:w-4 sm:h-4" />
            </button>
            <span className="text-white text-xs sm:text-sm">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="w-6 h-6 sm:w-8 sm:h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              <ChevronRight size={12} className="sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Patient Profile Modal */}
      <PatientProfileModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        patient={selectedPatient || { name: '', dob: '', age: 0, email: '', alerts: '' }}
        onMessagePatient={() => { setModalOpen(false); }}
      />
    </div>
  );
};

export default DoctorPatients;
