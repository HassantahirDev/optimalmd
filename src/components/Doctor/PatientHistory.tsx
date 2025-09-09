import { useState } from "react";
import { User, Calendar, Clock, Mail, AlertTriangle, Plus } from "lucide-react";

const patientData = {
  name: "John Doe",
  avatar: "/placeholder-avatar.jpg",
  dob: "01/02/1983",
  age: "42 Years Old",
  email: "johndoe@example.com",
  alerts: "None",
};

const visits = [
  { date: "Aug 1, 2025", purpose: "Follow-up", note: "Stable, continue TRT" },
  { date: "Aug 1, 2025", purpose: "Follow-up", note: "Stable, continue TRT" },
];

const tabs = [
  { id: "visits", label: "Visits" },
  { id: "meds", label: "Meds" },
  { id: "allergies", label: "Allergies" },
  { id: "lab-results", label: "Lab Results" },
  { id: "notes", label: "Notes" },
  { id: "tasks", label: "Tasks" },
];

export function PatientHistory() {
  const [activeTab, setActiveTab] = useState("visits");

  return (
    <div className="min-h-screen text-white p-6 bg-gradient-to-br from-black via-black-900 to-black-700">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-white mb-8 tracking-tight drop-shadow-lg">
          Patient History
        </h1>

        {/* Main Content Container */}
        <div className="flex flex-row gap-8">
          {/* First Container - Patient Image and Info */}
          <div className="w-full lg:w-1/3">
            <div className="border border-gray-800 rounded-2xl p-6 shadow-lg bg-black">
              {/* Patient Image */}
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              </div>

              {/* Patient Info */}
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="text-white font-semibold text-lg">
                    {patientData.name}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white font-semibold text-lg">
                    {patientData.email}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">DOB</p>
                  <p className="text-white font-semibold text-lg">
                    {patientData.dob}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Age</p>
                  <p className="text-white font-semibold text-lg">
                    {patientData.age}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Alerts</p>
                  <p className="text-white font-semibold text-lg">
                    {patientData.alerts}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Second Container - Tabs and Content */}
          <div className="w-full lg:w-2/3">
            {/* Tabs */}
            <div className="flex flex-wrap gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-6 py-2 text-base font-semibold transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black
                    ${
                      activeTab === tab.id
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-black border border-gray-800 text-gray-300 hover:bg-gray-900 hover:text-white"
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="border border-gray-800 rounded-2xl shadow-xl bg-black mt-6">
              <div className="p-8">
                <h3 className="text-white font-bold text-xl mb-8">
                  Visits List
                </h3>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <div className="min-w-full">
                    <div className="grid grid-cols-3 gap-6 pb-4 border-b border-gray-800">
                      <div className="text-gray-400 text-base font-semibold">
                        Date
                      </div>
                      <div className="text-gray-400 text-base font-semibold">
                        Appointment Purpose
                      </div>
                      <div className="text-gray-400 text-base font-semibold">
                        Note
                      </div>
                    </div>
                    {visits.map((visit, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-3 gap-6 py-5 border-b border-gray-800 last:border-0"
                      >
                        <div className="text-white text-base">{visit.date}</div>
                        <div className="text-white text-base">
                          {visit.purpose}
                        </div>
                        <div className="text-white text-base">
                          "{visit.note}"
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile Cards - Horizontal Scroll */}
                <div className="md:hidden flex gap-6 overflow-x-auto pb-2">
                  {visits.map((visit, i) => (
                    <div
                      key={i}
                      className="min-w-[250px] p-5 rounded-2xl border border-gray-800 bg-gradient-to-br from-black via-gray-900 to-gray-800 shadow-lg flex-shrink-0"
                    >
                      <div className="space-y-4">
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Date</p>
                          <p className="text-white font-semibold text-lg">
                            {visit.date}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">
                            Appointment Purpose
                          </p>
                          <p className="text-white text-base">
                            {visit.purpose}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Note</p>
                          <p className="text-white text-base">"{visit.note}"</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <button className="flex-1 sm:flex-none px-5 py-3 bg-black border border-gray-800 text-gray-300 hover:bg-gray-900 hover:text-white rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-md">
                <Plus className="w-5 h-5" />
                Add Note
              </button>
              <button className="flex-1 sm:flex-none px-5 py-3 bg-black border border-gray-800 text-gray-300 hover:bg-gray-900 hover:text-white rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-md">
                Order Test
              </button>
              <button className="flex-1 sm:flex-none px-5 py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl transition-colors shadow-md">
                Message Patient
              </button>
              <button className="flex-1 sm:flex-none px-5 py-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl transition-colors shadow-md">
                Release Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientHistory;
