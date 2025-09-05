import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Download } from "lucide-react";

interface Patient {
  name: string;
  age: number;
  mrn: string;
  lastVisit: string;
}

const DoctorPatients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 13;

  const patientsData: Patient[] = [
    {
      name: "John Doe",
      age: 42,
      mrn: "00123",
      lastVisit: "Aug 29, 2025"
    },
    {
      name: "Alex Rice",
      age: 66,
      mrn: "00124",
      lastVisit: "Aug 22, 2025"
    },
    {
      name: "Emily Parker",
      age: 33,
      mrn: "00125",
      lastVisit: "Jul 27, 2025"
    },
    {
      name: "Michael Brown",
      age: 54,
      mrn: "00126",
      lastVisit: "Jul 25, 2025"
    },
    {
      name: "Marc Nieto",
      age: 28,
      mrn: "00127",
      lastVisit: "Jul 18, 2025"
    },
    {
      name: "Luis Brandon",
      age: 79,
      mrn: "00128",
      lastVisit: "Jul 14, 2025"
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left side - Title and Subtitle */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                My Patients
              </h1>
            </div>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg mt-1 sm:mt-2 leading-relaxed">
              Here's your patient's list.
            </p>
          </div>

          {/* Right side - Search Bar and Export Button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              disabled={filteredPatients.length === 0}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">Export</span>
            </button>
            
            {/* Search Bar */}
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
              <thead className="bg-gray-700">
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
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                      <button className="text-white underline hover:text-gray-300 transition-colors">
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
          <div className="px-3 sm:px-6 py-3 sm:py-4 bg-gray-700 flex items-center justify-end gap-2 sm:gap-4">
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
    </div>
  );
};

export default DoctorPatients;
