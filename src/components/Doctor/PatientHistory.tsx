import { useState, useEffect } from "react";
import { User, Calendar, Clock, Mail, AlertTriangle, ArrowLeft, FileText, Download } from "lucide-react";
import api from "@/service/api";
import { toast } from "@/components/ui/use-toast";
import { formatTime } from "@/utils/timeUtils";
import NewMedicationModal from "./NewMedicationModal";



const tabs = [
  { id: "visits", label: "Visits" },
  { id: "screen2", label: "About You" },
  { id: "screen3", label: "Goals" },
  { id: "screen4", label: "Medical Background" },
  { id: "screen5", label: "Lifestyle & Habits" },
  { id: "screen6", label: "Symptoms" },
  { id: "screen7", label: "Safety Check" },
  { id: "screen8", label: "Labs & Uploads" },
  { id: "screen9", label: "Consent" },
];

interface PatientHistoryProps {
  patient?: {
    id?: string;
    appointmentId?: string; // Add appointment ID
    name: string;
    dob: string;
    age: number;
    email: string;
    alerts?: string;
    medicalForm?: any;
    internalNotes?: string; // Add internal notes field
  };
  onBack?: () => void;
}

export function PatientHistory({ patient, onBack }: PatientHistoryProps) {
  const [activeTab, setActiveTab] = useState("visits");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFormData, setEditedFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [internalNotes, setInternalNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  
  // Use passed patient data or fallback to default
  const currentPatientData = patient || {
    name: "John Doe",
    dob: "01/02/1983",
    age: 42,
    email: "johndoe@example.com",
    alerts: "None",
  };

  // Initialize edited form data when medical form changes
  useEffect(() => {
    if (currentPatientData.medicalForm) {
      setEditedFormData(currentPatientData.medicalForm);
    }
  }, [currentPatientData.medicalForm]);

  // Fetch internal notes for the current appointment
  useEffect(() => {
    const fetchInternalNotes = async () => {
      if (!currentPatientData.appointmentId) return;
      
      console.log('Fetching internal notes for appointment:', currentPatientData.appointmentId);
      
      try {
        // First try to get from current patient data (if it has appointment info)
        if (currentPatientData.internalNotes) {
          console.log('Setting internal notes from patient data:', currentPatientData.internalNotes);
          setInternalNotes(currentPatientData.internalNotes);
          return;
        }
        
        // Then try to get from appointments list
        if (appointments.length > 0) {
          const currentAppointment = appointments.find(apt => apt.id === currentPatientData.appointmentId);
          console.log('Found current appointment:', currentAppointment);
          if (currentAppointment && currentAppointment.internalNotes) {
            console.log('Setting internal notes from appointment:', currentAppointment.internalNotes);
            setInternalNotes(currentAppointment.internalNotes);
            return;
          }
        }
        
        // If not found in local data, fetch from API
        console.log('Fetching internal notes from API...');
        const response = await api.get(`/appointments/${currentPatientData.appointmentId}`);
        if (response.data.success && response.data.data.internalNotes) {
          console.log('Setting internal notes from API:', response.data.data.internalNotes);
          setInternalNotes(response.data.data.internalNotes);
        }
      } catch (error) {
        console.error('Error fetching internal notes:', error);
      }
    };

    fetchInternalNotes();
  }, [currentPatientData.appointmentId, currentPatientData.internalNotes, appointments]);

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

  // Check if report already exists
  useEffect(() => {
    const checkReportExists = async () => {
      if (!currentPatientData.appointmentId) return;
      
      try {
        const response = await api.get(`/appointments/${currentPatientData.appointmentId}`);
        if (response.data.success && response.data.data.reportPdfPath) {
          setReportGenerated(true);
        }
      } catch (error) {
        console.error('Error checking report:', error);
      }
    };

    checkReportExists();
  }, [currentPatientData.appointmentId]);

  const handleGenerateReport = async () => {
    if (!currentPatientData.appointmentId) return;

    setGeneratingReport(true);
    try {
      const response = await api.post(`/reports/generate/${currentPatientData.appointmentId}`);
      if (response.data.success) {
        setReportGenerated(true);
        toast({
          title: "Report generated",
          description: "PDF has been generated and emailed to you.",
        });
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Failed to generate",
        description: "Please try again.",
      });
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleDownloadReport = async (appointmentId?: string) => {
    const targetId = appointmentId || currentPatientData.appointmentId;
    if (!targetId) return;

    try {
      const response = await api.get(`/reports/download/${targetId}`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report_${targetId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast({
        title: "Download started",
        description: "Your report is downloading.",
      });
    } catch (error) {
      console.error('Error downloading report:', error);
      toast({
        title: "Failed to download",
        description: "Please try again.",
      });
    }
  };

  const handleViewReport = async (appointmentId?: string) => {
    const targetId = appointmentId || currentPatientData.appointmentId;
    if (!targetId) return;

    try {
      const response = await api.get(`/reports/download/${targetId}`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      toast({
        title: "Report opened",
        description: "Your report opened in a new tab.",
      });
    } catch (error) {
      console.error('Error viewing report:', error);
      toast({
        title: "Failed to open",
        description: "Please try again.",
      });
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Reset to original data when canceling
      setEditedFormData(currentPatientData.medicalForm || {});
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setEditedFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!currentPatientData.appointmentId) return;
    
    setSaving(true);
    try {
      await api.put(`/medical-form/${currentPatientData.appointmentId}`, editedFormData);
      setIsEditing(false);
      // Optionally refresh the data or show success message
    } catch (error) {
      console.error('Error saving medical form:', error);
      // Handle error (show toast, etc.)
    } finally {
      setSaving(false);
    }
  };

  const handleSaveInternalNotes = async () => {
    if (!currentPatientData.appointmentId) return;
    
    setSavingNotes(true);
    try {
      const response = await api.put(`/appointments/${currentPatientData.appointmentId}/internal-notes`, {
        internalNotes: internalNotes
      });
      
      if (response.data.success) {
        // Update the appointments list with the new internal notes
        setAppointments(prevAppointments => 
          prevAppointments.map(apt => 
            apt.id === currentPatientData.appointmentId 
              ? { ...apt, internalNotes: internalNotes }
              : apt
          )
        );
        
        // Also update current patient data if it exists
        if (currentPatientData.appointmentId) {
          // You could trigger a parent component refresh here if needed
        }
      }
    } catch (error) {
      console.error('Error saving internal notes:', error);
      // Handle error (show toast, etc.)
    } finally {
      setSavingNotes(false);
    }
  };

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
                <p className="text-gray-400">No past visits found</p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <div className="min-w-full">
                    <div className="grid grid-cols-4 gap-6 pb-4 border-b border-gray-800">
                      <div className="text-gray-400 text-base font-semibold">Date</div>
                      <div className="text-gray-400 text-base font-semibold">Appointment Purpose</div>
                      <div className="text-gray-400 text-base font-semibold">Status</div>
                      <div className="text-gray-400 text-base font-semibold">Report</div>
                    </div>
                    {appointments.map((appointment, i) => (
                      <div key={i} className="grid grid-cols-4 gap-6 py-5 border-b border-gray-800 last:border-0">
                        <div className="text-white text-base">
                          {(() => {
                            try {
                              const date = new Date(appointment.appointmentDate);
                              if (isNaN(date.getTime())) return 'Invalid Date';
                              return date.toLocaleDateString('en-US', {
                                month: 'short',
                                day: '2-digit',
                                year: 'numeric',
                                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                              });
                            } catch (error) {
                              return 'Invalid Date';
                            }
                          })()}
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
                        <div className="text-white text-base">
                          {appointment.reportPdfPath ? (
                            <button
                              onClick={() => handleDownloadReport(appointment.id)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                          ) : (
                            <span className="text-gray-500 text-sm">No report</span>
                          )}
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
                            {(() => {
                              try {
                                const date = new Date(appointment.appointmentDate);
                                if (isNaN(date.getTime())) return 'Invalid Date';
                                return date.toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: '2-digit',
                                  year: 'numeric',
                                  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                                });
                              } catch (error) {
                                return 'Invalid Date';
                              }
                            })()}
                            {appointment.appointmentTime && (
                              <span className="text-gray-400 text-sm ml-2">
                                {formatTime(appointment.appointmentTime)}
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
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Report</p>
                          {appointment.reportPdfPath ? (
                            <button
                              onClick={() => handleDownloadReport(appointment.id)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm w-full justify-center"
                            >
                              <Download className="w-4 h-4" />
                              Download Report
                            </button>
                          ) : (
                            <span className="text-gray-500 text-sm">No report available</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        );

      case "screen2":
        return (
          <>
            <h3 className="text-white font-bold text-xl mb-8">About You</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Height</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedFormData?.height || ''}
                    onChange={(e) => handleFieldChange('height', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="e.g., 5'10&quot; or 178 cm"
                  />
                ) : (
                  <p className="text-white text-base">{editedFormData?.height || 'Not provided'}</p>
                )}
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Weight</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedFormData?.weight || ''}
                    onChange={(e) => handleFieldChange('weight', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="e.g., 180 lbs or 82 kg"
                  />
                ) : (
                  <p className="text-white text-base">{editedFormData?.weight || 'Not provided'}</p>
                )}
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Waist</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedFormData?.waist || ''}
                    onChange={(e) => handleFieldChange('waist', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="e.g., 32 inches or 81 cm"
                  />
                ) : (
                  <p className="text-white text-base">{editedFormData?.waist || 'Not provided'}</p>
                )}
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Emergency Contact Name</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedFormData?.emergencyContactName || ''}
                    onChange={(e) => handleFieldChange('emergencyContactName', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="Emergency contact name"
                  />
                ) : (
                  <p className="text-white text-base">{editedFormData?.emergencyContactName || 'Not provided'}</p>
                )}
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Emergency Contact Phone</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedFormData?.emergencyContactPhone || ''}
                    onChange={(e) => handleFieldChange('emergencyContactPhone', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="Emergency contact phone"
                  />
                ) : (
                  <p className="text-white text-base">{editedFormData?.emergencyContactPhone || 'Not provided'}</p>
                )}
              </div>
            </div>
          </>
        );

      case "screen3":
        return (
          <>
            <h3 className="text-white font-bold text-xl mb-8">Your Goals</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={editedFormData?.goalMoreEnergy || false}
                      onChange={(e) => handleFieldChange('goalMoreEnergy', e.target.checked)}
                      className="w-4 h-4 text-green-500 bg-gray-800 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                    />
                  ) : (
                    <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                      editedFormData?.goalMoreEnergy 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-400 bg-transparent'
                    }`}>
                      {editedFormData?.goalMoreEnergy && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  )}
                  <span className="text-white">More Energy</span>
                </div>
                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={editedFormData?.goalBetterSexualPerformance || false}
                      onChange={(e) => handleFieldChange('goalBetterSexualPerformance', e.target.checked)}
                      className="w-4 h-4 text-green-500 bg-gray-800 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                    />
                  ) : (
                    <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                      editedFormData?.goalBetterSexualPerformance 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-400 bg-transparent'
                    }`}>
                      {editedFormData?.goalBetterSexualPerformance && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  )}
                  <span className="text-white">Better Sexual Performance</span>
                </div>
                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={editedFormData?.goalLoseWeight || false}
                      onChange={(e) => handleFieldChange('goalLoseWeight', e.target.checked)}
                      className="w-4 h-4 text-green-500 bg-gray-800 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                    />
                  ) : (
                    <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                      editedFormData?.goalLoseWeight 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-400 bg-transparent'
                    }`}>
                      {editedFormData?.goalLoseWeight && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  )}
                  <span className="text-white">Lose Weight</span>
                </div>
                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={editedFormData?.goalHairRestoration || false}
                      onChange={(e) => handleFieldChange('goalHairRestoration', e.target.checked)}
                      className="w-4 h-4 text-green-500 bg-gray-800 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                    />
                  ) : (
                    <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                      editedFormData?.goalHairRestoration 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-400 bg-transparent'
                    }`}>
                      {editedFormData?.goalHairRestoration && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  )}
                  <span className="text-white">Hair Restoration</span>
                </div>
                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={editedFormData?.goalImproveMood || false}
                      onChange={(e) => handleFieldChange('goalImproveMood', e.target.checked)}
                      className="w-4 h-4 text-green-500 bg-gray-800 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                    />
                  ) : (
                    <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                      editedFormData?.goalImproveMood 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-400 bg-transparent'
                    }`}>
                      {editedFormData?.goalImproveMood && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  )}
                  <span className="text-white">Improve Mood</span>
                </div>
                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={editedFormData?.goalLongevity || false}
                      onChange={(e) => handleFieldChange('goalLongevity', e.target.checked)}
                      className="w-4 h-4 text-green-500 bg-gray-800 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                    />
                  ) : (
                    <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                      editedFormData?.goalLongevity 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-400 bg-transparent'
                    }`}>
                      {editedFormData?.goalLongevity && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  )}
                  <span className="text-white">Longevity</span>
                </div>
              </div>
              {(editedFormData?.goalOther || isEditing) && (
                <div className="mt-4">
                  <h4 className="text-gray-400 text-sm mb-2">Other Goals</h4>
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={editedFormData?.goalOther || false}
                          onChange={(e) => handleFieldChange('goalOther', e.target.checked)}
                          className="w-4 h-4 text-green-500 bg-gray-800 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                        />
                        <span className="text-white">Other</span>
                      </div>
                      {editedFormData?.goalOther && (
                        <textarea
                          value={editedFormData?.goalOtherDescription || ''}
                          onChange={(e) => handleFieldChange('goalOtherDescription', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                          placeholder="Describe other goals..."
                          rows={3}
                        />
                      )}
                    </div>
                  ) : (
                    <p className="text-white text-base">{editedFormData?.goalOtherDescription || 'Not specified'}</p>
                  )}
                </div>
              )}
            </div>
          </>
        );

      case "screen4":
        return (
          <>
            <h3 className="text-white font-bold text-xl mb-8">Medical Background</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Chronic Conditions</h4>
                {isEditing ? (
                  <textarea
                    value={editedFormData?.chronicConditions || ''}
                    onChange={(e) => handleFieldChange('chronicConditions', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="List chronic conditions..."
                    rows={3}
                  />
                ) : (
                  <p className="text-white text-base">{editedFormData?.chronicConditions || 'Not provided'}</p>
                )}
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Past Surgeries/Hospitalizations</h4>
                {isEditing ? (
                  <textarea
                    value={editedFormData?.pastSurgeriesHospitalizations || ''}
                    onChange={(e) => handleFieldChange('pastSurgeriesHospitalizations', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="List past surgeries and hospitalizations..."
                    rows={3}
                  />
                ) : (
                  <p className="text-white text-base">{editedFormData?.pastSurgeriesHospitalizations || 'Not provided'}</p>
                )}
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Current Medications</h4>
                {isEditing ? (
                  <textarea
                    value={editedFormData?.currentMedications || ''}
                    onChange={(e) => handleFieldChange('currentMedications', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="List current medications..."
                    rows={3}
                  />
                ) : (
                  <p className="text-white text-base">{editedFormData?.currentMedications || 'Not provided'}</p>
                )}
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Allergies</h4>
                {isEditing ? (
                  <textarea
                    value={editedFormData?.allergies || ''}
                    onChange={(e) => handleFieldChange('allergies', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="List allergies..."
                    rows={3}
                  />
                ) : (
                  <p className="text-white text-base">{editedFormData?.allergies || 'Not provided'}</p>
                )}
              </div>
            </div>
          </>
        );

      case "screen5":
        return (
          <>
            <h3 className="text-white font-bold text-xl mb-8">Lifestyle & Habits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Sleep Hours/Night</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedFormData?.sleepHoursPerNight || ''}
                    onChange={(e) => handleFieldChange('sleepHoursPerNight', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="e.g., 6-8"
                  />
                ) : (
                  <p className="text-white text-base">{editedFormData?.sleepHoursPerNight || 'Not specified'}</p>
                )}
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Sleep Quality</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedFormData?.sleepQuality || ''}
                    onChange={(e) => handleFieldChange('sleepQuality', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="Poor/Fair/Good"
                  />
                ) : (
                  <p className="text-white text-base">{editedFormData?.sleepQuality || 'Not specified'}</p>
                )}
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Exercise Frequency</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedFormData?.exerciseFrequency || ''}
                    onChange={(e) => handleFieldChange('exerciseFrequency', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="None/1-2x/week/3-5x/week/Daily"
                  />
                ) : (
                  <p className="text-white text-base">{editedFormData?.exerciseFrequency || 'Not specified'}</p>
                )}
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Diet Type</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedFormData?.dietType || ''}
                    onChange={(e) => handleFieldChange('dietType', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="Balanced/High protein/Low-carb/Plant-based/Other"
                  />
                ) : (
                  <p className="text-white text-base">{editedFormData?.dietType || 'Not specified'}</p>
                )}
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Alcohol Use</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedFormData?.alcoholUse || ''}
                    onChange={(e) => handleFieldChange('alcoholUse', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="None/Social/Regular"
                  />
                ) : (
                  <p className="text-white text-base">{editedFormData?.alcoholUse || 'Not specified'}</p>
                )}
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Tobacco Use</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedFormData?.tobaccoUse || ''}
                    onChange={(e) => handleFieldChange('tobaccoUse', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="Never/Current/Former"
                  />
                ) : (
                  <p className="text-white text-base">{editedFormData?.tobaccoUse || 'Not specified'}</p>
                )}
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Cannabis/Other Substances</h4>
                {isEditing ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={!!editedFormData?.cannabisOtherSubstances}
                      onChange={(e) => handleFieldChange('cannabisOtherSubstances', e.target.checked)}
                      className="w-4 h-4 text-green-500 bg-gray-800 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                    />
                    <span className="text-white">Uses substances</span>
                  </div>
                ) : (
                  <p className="text-white text-base">{editedFormData?.cannabisOtherSubstances ? 'Yes' : 'No'}</p>
                )}
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Stress Level</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedFormData?.stressLevel || ''}
                    onChange={(e) => handleFieldChange('stressLevel', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="Low/Medium/High"
                  />
                ) : (
                  <p className="text-white text-base">{editedFormData?.stressLevel || 'Not specified'}</p>
                )}
              </div>
            </div>
            {(editedFormData?.cannabisOtherSubstances || isEditing) && (
              <div className="mt-6">
                <h4 className="text-gray-400 text-sm mb-2">Substances List</h4>
                {isEditing ? (
                  <textarea
                    value={editedFormData?.cannabisOtherSubstancesList || ''}
                    onChange={(e) => handleFieldChange('cannabisOtherSubstancesList', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="List substances..."
                    rows={3}
                  />
                ) : (
                  <p className="text-white text-base">{editedFormData?.cannabisOtherSubstancesList || 'Not specified'}</p>
                )}
              </div>
            )}
          </>
        );

      case "screen6":
        return (
          <>
            <h3 className="text-white font-bold text-xl mb-8">Symptom Check</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ['symptomFatigue', 'Fatigue'],
                ['symptomLowLibido', 'Low Libido'],
                ['symptomMuscleLoss', 'Muscle Loss'],
                ['symptomWeightGain', 'Weight Gain'],
                ['symptomGynecomastia', 'Gynecomastia'],
                ['symptomBrainFog', 'Brain Fog'],
                ['symptomMoodSwings', 'Mood Swings'],
                ['symptomPoorSleep', 'Poor Sleep'],
                ['symptomHairThinning', 'Hair Thinning'],
              ].map(([key, label]) => (
                <div key={key} className="flex items-center gap-3">
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={!!editedFormData?.[key]}
                      onChange={(e) => handleFieldChange(key as string, e.target.checked)}
                      className="w-4 h-4 text-red-500 bg-gray-800 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                    />
                  ) : (
                <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                      editedFormData?.[key]
                    ? 'bg-red-500 border-red-500' 
                    : 'border-gray-400 bg-transparent'
                }`}>
                      {editedFormData?.[key] && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                  )}
                  <span className="text-white">{label}</span>
                </div>
              ))}
            </div>
          </>
        );

      case "screen7":
        return (
          <>
            <h3 className="text-white font-bold text-xl mb-8">Safety Check</h3>
            <div className="space-y-4">
              {[
                ['historyProstateBreastCancer', 'History of Prostate/Breast Cancer'],
                ['historyBloodClotsMIStroke', 'History of Blood Clots/MI/Stroke'],
                ['currentlyUsingHormonesPeptides', 'Currently Using Hormones/Peptides'],
                ['planningChildrenNext12Months', 'Planning Children Next 12 Months'],
              ].map(([key, label], idx) => (
                <div key={key} className="flex items-center gap-3">
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={!!editedFormData?.[key]}
                      onChange={(e) => handleFieldChange(key as string, e.target.checked)}
                      className={`w-4 h-4 ${idx < 2 ? 'text-red-500' : 'text-yellow-500'} bg-gray-800 border-gray-600 rounded focus:ring-2 focus:ring-offset-0 ${idx < 2 ? 'focus:ring-red-500' : 'focus:ring-yellow-500'}`}
                    />
                  ) : (
                <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                      editedFormData?.[key]
                        ? (idx < 2 ? 'bg-red-500 border-red-500' : 'bg-yellow-500 border-yellow-500')
                    : 'border-gray-400 bg-transparent'
                }`}>
                      {editedFormData?.[key] && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                  )}
                  <span className="text-white">{label}</span>
                </div>
              ))}
            </div>
          </>
        );

      case "screen8":
        return (
          <>
            <h3 className="text-white font-bold text-xl mb-8">Labs & Uploads</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Lab Uploads</h4>
                <p className="text-white text-base">{medicalForm?.labUploads || 'No lab uploads'}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                  medicalForm?.labSchedulingNeeded 
                    ? 'bg-blue-500 border-blue-500' 
                    : 'border-gray-400 bg-transparent'
                }`}>
                  {medicalForm?.labSchedulingNeeded && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-white">Lab Scheduling Needed</span>
              </div>
            </div>
          </>
        );

      case "screen9":
        return (
          <>
            <h3 className="text-white font-bold text-xl mb-8">Consent & Finalize</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                  editedFormData?.consentTelemedicineCare 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-gray-400 bg-transparent'
                }`}>
                  {editedFormData?.consentTelemedicineCare && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-white">Consent to Telemedicine Care</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                  editedFormData?.consentElectiveOptimizationTreatment 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-gray-400 bg-transparent'
                }`}>
                  {editedFormData?.consentElectiveOptimizationTreatment && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-white">Consent to Elective Optimization Treatment</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                  editedFormData?.consentRequiredLabMonitoring 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-gray-400 bg-transparent'
                }`}>
                  {editedFormData?.consentRequiredLabMonitoring && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-white">Consent to Required Lab Monitoring</span>
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Digital Signature</h4>
                <p className="text-white text-base">{editedFormData?.digitalSignature || 'Not provided'}</p>
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Consent Date</h4>
                <p className="text-white text-base">
                  {editedFormData?.consentDate ? (() => {
                    try {
                      const date = new Date(editedFormData.consentDate);
                      if (isNaN(date.getTime())) return 'Invalid Date';
                      return date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                      });
                    } catch (error) {
                      return 'Invalid Date';
                    }
                  })() : 'Not provided'}
                </p>
              </div>
            </div>
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
    <div className="min-h-screen text-white p-4 sm:p-6 bg-gradient-to-br from-black via-black-900 to-black-700">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Page Title with Back Button */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
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
          
          {/* Generate/View Report Buttons */}
          {currentPatientData.appointmentId && (
            <div className="flex items-center gap-3">
              {!reportGenerated ? (
                <button
                  onClick={handleGenerateReport}
                  disabled={generatingReport}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
                >
                  <FileText className="w-5 h-5" />
                  {generatingReport ? 'Generating...' : 'Generate Report'}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleViewReport()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors font-medium"
                  >
                    <FileText className="w-5 h-5" />
                    View Report
                  </button>
                  <button
                    onClick={() => handleDownloadReport()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                  <button
                    onClick={handleGenerateReport}
                    disabled={generatingReport}
                    className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors text-sm"
                  >
                    {generatingReport ? 'Regenerating...' : 'Regenerate'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Patient Details - Horizontal Rectangle at Top */}
        <div className="border border-gray-800 rounded-2xl p-6 shadow-lg bg-black">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Patient Image */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
                <User className="w-10 h-10 text-gray-400" />
              </div>
            </div>

            {/* Patient Info - Responsive Grid Layout */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="min-w-0">
                  <p className="text-gray-400 text-sm mb-1">Name</p>
                  <p className="text-white font-semibold text-lg truncate">
                    {currentPatientData.name}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-gray-400 text-sm mb-1">Email</p>
                  <p className="text-white font-semibold text-lg truncate">
                    {currentPatientData.email}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-gray-400 text-sm mb-1">DOB</p>
                  <p className="text-white font-semibold text-lg">
                    {currentPatientData.dob}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-gray-400 text-sm mb-1">Age</p>
                  <p className="text-white font-semibold text-lg">
                    {currentPatientData.age} Years Old
                  </p>
                </div>
              </div>
            </div>

            {/* New Medication Button */}
            {currentPatientData.appointmentId && (
              <div className="ml-auto">
                <button
                  onClick={() => setShowMedicationModal(true)}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                >
                  New Medication
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabs and Content Container */}
        <div className="w-full">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black whitespace-nowrap
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

            {/* Edit/Save Buttons */}
            {activeTab !== "visits" && activeTab !== "screen9" && (
              <div className="flex justify-end gap-3 mt-4">
                {!isEditing ? (
                  <button
                    onClick={handleEditToggle}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleEditToggle}
                      className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Content Area */}
            <div className="border border-gray-800 rounded-2xl shadow-xl bg-black mt-6">
              <div className="p-8">
                {renderTabContent()}
              </div>
            </div>

            {/* Internal Notes Section */}
            <div className="border border-gray-800 rounded-2xl shadow-xl bg-black mt-6">
              <div className="p-8">
                <h3 className="text-white font-bold text-xl mb-6">Internal Notes</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Doctor's Internal Notes for this Appointment
                    </label>
                    <textarea
                      value={internalNotes}
                      onChange={(e) => setInternalNotes(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500 resize-none"
                      placeholder="Add your internal notes about this appointment..."
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveInternalNotes}
                      disabled={savingNotes}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
                    >
                      {savingNotes ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        'Save Internal Notes'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Medications Modal */}
            <NewMedicationModal
              appointmentId={currentPatientData.appointmentId || ""}
              isOpen={showMedicationModal}
              onClose={() => setShowMedicationModal(false)}
            />
        </div>
      </div>
    </div>
  );
}

export default PatientHistory;
