import { useState, useEffect } from "react";
import { User, Calendar, Clock, Mail, AlertTriangle, ArrowLeft } from "lucide-react";
import api from "@/service/api";



const tabs = [
  { id: "visits", label: "Visits" },
  { id: "medical-history", label: "Medical History" },
  { id: "medications", label: "Medications" },
  { id: "allergies", label: "Allergies" },
  { id: "social-history", label: "Social History" },
  { id: "family-history", label: "Family History" },
  { id: "vitals", label: "Vitals" },
];

interface PatientHistoryProps {
  patient?: {
    id?: string;
    name: string;
    dob: string;
    age: number;
    email: string;
    alerts?: string;
    medicalForm?: any;
  };
  onBack?: () => void;
}

export function PatientHistory({ patient, onBack }: PatientHistoryProps) {
  const [activeTab, setActiveTab] = useState("visits");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  
  // Use passed patient data or fallback to default
  const currentPatientData = patient || {
    name: "John Doe",
    dob: "01/02/1983",
    age: 42,
    email: "johndoe@example.com",
    alerts: "None",
  };

  // Fetch patient appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!currentPatientData.id) return;
      
      setLoadingAppointments(true);
      try {
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        const params = new URLSearchParams({
          endDate: todayString, // Only past appointments
          limit: '20' // Get more to filter later
        });

        const response = await api.get(`/appointments/patient/${currentPatientData.id}?${params}`);
        
        if (response.data.success) {
          // Filter past appointments and sort by date (most recent first)
          const pastAppointments = response.data.data
            .filter((apt: any) => {
              const appointmentDate = new Date(apt.appointmentDate);
              const appointmentDateTime = new Date(apt.appointmentDate + 'T' + apt.appointmentTime);
              // Include appointments that are either completed or in the past
              return (apt.status === 'COMPLETED' || appointmentDateTime < today);
            })
            .sort((a: any, b: any) => {
              // Sort by appointment date and time (most recent first)
              const dateA = new Date(a.appointmentDate + 'T' + a.appointmentTime);
              const dateB = new Date(b.appointmentDate + 'T' + b.appointmentTime);
              return dateB.getTime() - dateA.getTime();
            })
            .slice(0, 2); // Get only the latest 2

          setAppointments(pastAppointments);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchAppointments();
  }, [currentPatientData.id]);

  const renderTabContent = () => {
    const medicalForm = currentPatientData.medicalForm;

    switch (activeTab) {
      case "visits":
        return (
          <>
            <h3 className="text-white font-bold text-xl mb-8">Recent Visits</h3>
            {loadingAppointments ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading appointments...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No past appointments found</p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <div className="min-w-full">
                    <div className="grid grid-cols-3 gap-6 pb-4 border-b border-gray-800">
                      <div className="text-gray-400 text-base font-semibold">Date</div>
                      <div className="text-gray-400 text-base font-semibold">Appointment Purpose</div>
                      <div className="text-gray-400 text-base font-semibold">Status</div>
                    </div>
                    {appointments.map((appointment, i) => (
                      <div key={i} className="grid grid-cols-3 gap-6 py-5 border-b border-gray-800 last:border-0">
                        <div className="text-white text-base">
                          {new Date(appointment.appointmentDate).toLocaleDateString()}
                          {appointment.appointmentTime && (
                            <span className="text-gray-400 text-sm ml-2">
                              {appointment.appointmentTime}
                            </span>
                          )}
                        </div>
                        <div className="text-white text-base">
                          {appointment.service?.name || 'General Consultation'}
                        </div>
                        <div className="text-white text-base">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            appointment.status === 'COMPLETED' ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Mobile Cards */}
                <div className="md:hidden flex gap-6 overflow-x-auto pb-2">
                  {appointments.map((appointment, i) => (
                    <div key={i} className="min-w-[250px] p-5 rounded-2xl border border-gray-800 bg-gradient-to-br from-black via-gray-900 to-gray-800 shadow-lg flex-shrink-0">
                      <div className="space-y-4">
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Date</p>
                          <p className="text-white font-semibold text-lg">
                            {new Date(appointment.appointmentDate).toLocaleDateString()}
                            {appointment.appointmentTime && (
                              <span className="text-gray-400 text-sm ml-2">
                                {appointment.appointmentTime}
                              </span>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Appointment Purpose</p>
                          <p className="text-white text-base">
                            {appointment.service?.name || 'General Consultation'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Status</p>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            appointment.status === 'COMPLETED' ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        );

      case "medical-history":
        return (
          <>
            <h3 className="text-white font-bold text-xl mb-8">Medical History</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Chief Complaint</h4>
                <p className="text-white text-base">{medicalForm?.chiefComplaint || 'Not provided'}</p>
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">History of Present Illness</h4>
                <p className="text-white text-base">{medicalForm?.historyOfPresentIllness || 'Not provided'}</p>
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Past Medical History</h4>
                <p className="text-white text-base">{medicalForm?.pastMedicalHistory || 'Not provided'}</p>
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Past Surgical History</h4>
                <p className="text-white text-base">{medicalForm?.pastSurgicalHistory || 'Not provided'}</p>
              </div>
            </div>
          </>
        );

      case "medications":
        return (
          <>
            <h3 className="text-white font-bold text-xl mb-8">Current Medications</h3>
            <div>
              <p className="text-white text-base">{medicalForm?.medications || 'No medications reported'}</p>
            </div>
          </>
        );

      case "allergies":
        return (
          <>
            <h3 className="text-white font-bold text-xl mb-8">Allergies</h3>
            <div>
              <p className="text-white text-base">{medicalForm?.allergies || 'No allergies reported'}</p>
            </div>
          </>
        );

      case "social-history":
        return (
          <>
            <h3 className="text-white font-bold text-xl mb-8">Social History</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Tobacco Use</h4>
                <p className="text-white text-base">{medicalForm?.tobaccoUse || 'Not specified'}</p>
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Alcohol Use</h4>
                <p className="text-white text-base">{medicalForm?.alcoholUse || 'Not specified'}</p>
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Recreational Drugs</h4>
                <p className="text-white text-base">{medicalForm?.recreationalDrugs || 'Not specified'}</p>
              </div>
            </div>
            {medicalForm?.otherSocialHistory && (
              <div className="mt-6">
                <h4 className="text-gray-400 text-sm mb-2">Other Social History</h4>
                <p className="text-white text-base">{medicalForm.otherSocialHistory}</p>
              </div>
            )}
          </>
        );

      case "family-history":
        return (
          <>
            <h3 className="text-white font-bold text-xl mb-8">Family History</h3>
            <div>
              <p className="text-white text-base">{medicalForm?.familyHistory || 'Not provided'}</p>
            </div>
          </>
        );

      case "vitals":
        return (
          <>
            <h3 className="text-white font-bold text-xl mb-8">Vital Signs</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {medicalForm?.bloodPressure && (
                <div>
                  <h4 className="text-gray-400 text-sm mb-2">Blood Pressure</h4>
                  <p className="text-white text-base">{medicalForm.bloodPressure}</p>
                </div>
              )}
              {medicalForm?.heartRate && (
                <div>
                  <h4 className="text-gray-400 text-sm mb-2">Heart Rate</h4>
                  <p className="text-white text-base">{medicalForm.heartRate}</p>
                </div>
              )}
              {medicalForm?.temperature && (
                <div>
                  <h4 className="text-gray-400 text-sm mb-2">Temperature</h4>
                  <p className="text-white text-base">{medicalForm.temperature}</p>
                </div>
              )}
              {medicalForm?.weight && (
                <div>
                  <h4 className="text-gray-400 text-sm mb-2">Weight</h4>
                  <p className="text-white text-base">{medicalForm.weight}</p>
                </div>
              )}
              {medicalForm?.height && (
                <div>
                  <h4 className="text-gray-400 text-sm mb-2">Height</h4>
                  <p className="text-white text-base">{medicalForm.height}</p>
                </div>
              )}
              {medicalForm?.bmi && (
                <div>
                  <h4 className="text-gray-400 text-sm mb-2">BMI</h4>
                  <p className="text-white text-base">{medicalForm.bmi}</p>
                </div>
              )}
            </div>
            {!medicalForm?.bloodPressure && !medicalForm?.heartRate && !medicalForm?.temperature && 
             !medicalForm?.weight && !medicalForm?.height && !medicalForm?.bmi && (
              <p className="text-gray-400 text-base">No vital signs recorded</p>
            )}
          </>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-400">Select a tab to view information</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen text-white p-6 bg-gradient-to-br from-black via-black-900 to-black-700">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Title with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Patients
            </button>
          )}
          <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg">
            Patient History
          </h1>
        </div>

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
                    {currentPatientData.name}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white font-semibold text-lg">
                    {currentPatientData.email}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">DOB</p>
                  <p className="text-white font-semibold text-lg">
                    {currentPatientData.dob}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Age</p>
                  <p className="text-white font-semibold text-lg">
                    {currentPatientData.age} Years Old
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Alerts</p>
                  <p className="text-white font-semibold text-lg">
                    {currentPatientData.alerts || 'None'}
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
                {renderTabContent()}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientHistory;
