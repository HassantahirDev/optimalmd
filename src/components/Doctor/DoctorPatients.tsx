import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Download } from "lucide-react";
import PatientProfileModal from "./PatientProfileModal";

interface Patient {
  name: string;
  age: number;
  mrn: string;
  lastVisit: string;
  vitals?: { BP: string; HR: string; Temp: string };
  activeMeds?: string[];
  allergies?: string[];
  lastLogin?: string;
  dob?: string; // Added dob to interface
}

const DoctorPatients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 13;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

  // Helper to get mock email, dob, alerts
  const getPatientProfile = (patient: Patient) => ({
    avatarUrl: undefined,
    name: patient.name,
    dob: patient.dob || "01/02/1983",
    age: patient.age,
    email: `${patient.name.toLowerCase().replace(/ /g, "")}@example.com`,
    alerts: patient.allergies && patient.allergies.length > 0 ? patient.allergies.join(', ') : 'None',
  });

  const patientsData: Patient[] = [
    {
      name: "John Doe",
      age: 42,
      mrn: "00123",
      lastVisit: "Aug 29, 2025",
      vitals: { BP: "120/80", HR: "72", Temp: "98.6" },
      activeMeds: ["Lisinopril", "Metformin"],
      allergies: ["Penicillin"],
      lastLogin: "2024-06-10 09:15",
      dob: "01/01/1980" // Added dob
    },
    {
      name: "Alex Rice",
      age: 66,
      mrn: "00124",
      lastVisit: "Aug 22, 2025",
      vitals: { BP: "130/85", HR: "78", Temp: "98.7" },
      activeMeds: ["Atorvastatin"],
      allergies: [],
      lastLogin: "2024-06-09 17:40",
      dob: "02/03/1957" // Added dob
    },
    {
      name: "Emily Parker",
      age: 33,
      mrn: "00125",
      lastVisit: "Jul 27, 2025",
      vitals: { BP: "110/70", HR: "68", Temp: "98.4" },
      activeMeds: ["Levothyroxine"],
      allergies: ["Latex", "Aspirin"],
      lastLogin: "2024-06-08 13:22",
      dob: "04/05/1990" // Added dob
    },
    {
      name: "Michael Brown",
      age: 54,
      mrn: "00126",
      lastVisit: "Jul 25, 2025",
      vitals: { BP: "125/82", HR: "75", Temp: "98.9" },
      activeMeds: ["Metoprolol"],
      allergies: ["Sulfa drugs"],
      lastLogin: "2024-06-10 08:05",
      dob: "06/07/1970" // Added dob
    },
    {
      name: "Marc Nieto",
      age: 28,
      mrn: "00127",
      lastVisit: "Jul 18, 2025",
      vitals: { BP: "118/76", HR: "70", Temp: "98.5" },
      activeMeds: [],
      allergies: [],
      lastLogin: "2024-06-07 19:10",
      dob: "08/09/1995" // Added dob
    },
    {
      name: "Luis Brandon",
      age: 79,
      mrn: "00128",
      lastVisit: "Jul 14, 2025",
      vitals: { BP: "140/90", HR: "80", Temp: "99.1" },
      activeMeds: ["Amlodipine", "Aspirin"],
      allergies: ["Peanuts"],
      lastLogin: "2024-06-10 10:30",
      dob: "10/11/1944" // Added dob
    }
  ];

  // Filter patients based on search term
  const filteredPatients = patientsData.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.mrn.includes(searchTerm)
  );

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
    const csvContent = filteredPatients
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
                    Name
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-medium text-gray-300">
                    Age
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-medium text-gray-300">
                    MRN
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-medium text-gray-300">
                    Last Visit
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredPatients.map((patient, index) => (
                  <tr key={index} className="hover:bg-gray-750">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm relative">
                      <button
                        className="text-white underline hover:text-gray-300 transition-colors"
                        onClick={() => {
                          setSelectedPatient(getPatientProfile(patient));
                          setModalOpen(true);
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
                      {patient.lastVisit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Patients Cards - Mobile */}
          <div className="sm:hidden">
            {filteredPatients.map((patient, index) => (
              <div key={index} className="px-4 py-4 border-b border-gray-700 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <button className="text-white underline hover:text-gray-300 transition-colors text-sm font-medium">
                    {patient.name}
                  </button>
                  <span className="text-xs text-gray-400">MRN: {patient.mrn}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-300">
                  <span>Age: {patient.age}</span>
                  <span>Last Visit: {patient.lastVisit}</span>
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
        onViewHistory={() => { setModalOpen(false); }}
        onMessagePatient={() => { setModalOpen(false); }}
      />
    </div>
  );
};

export default DoctorPatients;
