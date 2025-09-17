import React from "react";
import { X, Mail, AlertCircle } from "lucide-react";

interface PatientProfileModalProps {
  open: boolean;
  onClose: () => void;
  patient: {
    avatarUrl?: string;
    name: string;
    dob: string;
    age: number;
    email: string;
    alerts?: string;
    vitals?: { BP: string; HR: string; Temp: string };
    activeMeds?: string[];
    allergies?: string[];
    lastLogin?: string;
    // Medical form fields
    medicalForm?: {
      chiefComplaint?: string;
      historyOfPresentIllness?: string;
      pastMedicalHistory?: string;
      pastSurgicalHistory?: string;
      allergies?: string;
      tobaccoUse?: string;
      alcoholUse?: string;
      recreationalDrugs?: string;
      familyHistory?: string;
      workHistory?: string;
      medications?: string;
      bloodPressure?: string;
      heartRate?: string;
      temperature?: string;
      weight?: string;
      height?: string;
      bmi?: string;
    };
  };
  onMessagePatient?: () => void;
}

const PatientProfileModal: React.FC<PatientProfileModalProps> = ({
  open,
  onClose,
  patient,
  onMessagePatient,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-[#181818] rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6 relative">
        {/* Close Button */}
        <button
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-6">Patient Profile Card</h2>
        
        {/* Basic Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {/* Name */}
          <div className="bg-black-700 rounded-lg p-4 flex items-center gap-3">
            {patient.avatarUrl ? (
              <img src={patient.avatarUrl} alt={patient.name} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold text-white">
                {patient.name[0]}
              </div>
            )}
            <div>
              <div className="text-xs text-gray-400">Name</div>
              <div className="font-bold text-white text-base">{patient.name}</div>
            </div>
          </div>
          {/* DOB */}
          <div className="bg-black-700 rounded-lg p-4 flex items-center gap-3">
            <div className="bg-red-500 rounded-full p-2 text-white">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            </div>
            <div>
              <div className="text-xs text-gray-400">DOB</div>
              <div className="font-bold text-white text-base">{patient.dob}</div>
            </div>
          </div>
          {/* Age */}
          <div className="bg-black-700 rounded-lg p-4 flex items-center gap-3">
            <div className="bg-red-500 rounded-full p-2 text-white">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>
            </div>
            <div>
              <div className="text-xs text-gray-400">Age</div>
              <div className="font-bold text-white text-base">{patient.age} Years Old</div>
            </div>
          </div>
        </div>

        {/* Medical Form Data */}
        {patient.medicalForm && (
          <div className="space-y-4 mb-6">
            {/* Chief Complaint */}
            <div className="bg-black-700 rounded-lg p-4">
              <div className="text-xs text-gray-400 mb-2">Chief Complaint</div>
              <div className="text-white text-sm">{patient.medicalForm.chiefComplaint || 'Not provided'}</div>
            </div>

            {/* Medical History Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Past Medical History */}
              <div className="bg-black-700 rounded-lg p-4">
                <div className="text-xs text-gray-400 mb-2">Past Medical History</div>
                <div className="text-white text-sm">{patient.medicalForm.pastMedicalHistory || 'Not provided'}</div>
              </div>
              
              {/* Past Surgical History */}
              <div className="bg-black-700 rounded-lg p-4">
                <div className="text-xs text-gray-400 mb-2">Past Surgical History</div>
                <div className="text-white text-sm">{patient.medicalForm.pastSurgicalHistory || 'Not provided'}</div>
              </div>
            </div>

            {/* Allergies and Medications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Allergies */}
              <div className="bg-black-700 rounded-lg p-4">
                <div className="text-xs text-gray-400 mb-2">Allergies</div>
                <div className="text-white text-sm">{patient.medicalForm.allergies || 'None reported'}</div>
              </div>
              
              {/* Current Medications */}
              <div className="bg-black-700 rounded-lg p-4">
                <div className="text-xs text-gray-400 mb-2">Current Medications</div>
                <div className="text-white text-sm">{patient.medicalForm.medications || 'None reported'}</div>
              </div>
            </div>

            {/* Social History */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-black-700 rounded-lg p-4">
                <div className="text-xs text-gray-400 mb-2">Tobacco Use</div>
                <div className="text-white text-sm">{patient.medicalForm.tobaccoUse || 'Not specified'}</div>
              </div>
              <div className="bg-black-700 rounded-lg p-4">
                <div className="text-xs text-gray-400 mb-2">Alcohol Use</div>
                <div className="text-white text-sm">{patient.medicalForm.alcoholUse || 'Not specified'}</div>
              </div>
              <div className="bg-black-700 rounded-lg p-4">
                <div className="text-xs text-gray-400 mb-2">Recreational Drugs</div>
                <div className="text-white text-sm">{patient.medicalForm.recreationalDrugs || 'Not specified'}</div>
              </div>
            </div>

            {/* Family History */}
            <div className="bg-black-700 rounded-lg p-4">
              <div className="text-xs text-gray-400 mb-2">Family History</div>
              <div className="text-white text-sm">{patient.medicalForm.familyHistory || 'Not provided'}</div>
            </div>

            {/* Vitals */}
            {(patient.medicalForm.bloodPressure || patient.medicalForm.heartRate || patient.medicalForm.temperature || patient.medicalForm.weight || patient.medicalForm.height || patient.medicalForm.bmi) && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {patient.medicalForm.bloodPressure && (
                  <div className="bg-black-700 rounded-lg p-4">
                    <div className="text-xs text-gray-400 mb-2">Blood Pressure</div>
                    <div className="text-white text-sm">{patient.medicalForm.bloodPressure}</div>
                  </div>
                )}
                {patient.medicalForm.heartRate && (
                  <div className="bg-black-700 rounded-lg p-4">
                    <div className="text-xs text-gray-400 mb-2">Heart Rate</div>
                    <div className="text-white text-sm">{patient.medicalForm.heartRate}</div>
                  </div>
                )}
                {patient.medicalForm.temperature && (
                  <div className="bg-black-700 rounded-lg p-4">
                    <div className="text-xs text-gray-400 mb-2">Temperature</div>
                    <div className="text-white text-sm">{patient.medicalForm.temperature}</div>
                  </div>
                )}
                {patient.medicalForm.weight && (
                  <div className="bg-black-700 rounded-lg p-4">
                    <div className="text-xs text-gray-400 mb-2">Weight</div>
                    <div className="text-white text-sm">{patient.medicalForm.weight}</div>
                  </div>
                )}
                {patient.medicalForm.height && (
                  <div className="bg-black-700 rounded-lg p-4">
                    <div className="text-xs text-gray-400 mb-2">Height</div>
                    <div className="text-white text-sm">{patient.medicalForm.height}</div>
                  </div>
                )}
                {patient.medicalForm.bmi && (
                  <div className="bg-black-700 rounded-lg p-4">
                    <div className="text-xs text-gray-400 mb-2">BMI</div>
                    <div className="text-white text-sm">{patient.medicalForm.bmi}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Fallback for patients without medical form */}
        {!patient.medicalForm && (
          <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-yellow-400">
              <AlertCircle size={16} />
              <span className="text-sm font-medium">Medical form not completed</span>
            </div>
            <p className="text-yellow-300 text-sm mt-1">Patient has not completed their medical consultation form yet.</p>
          </div>
        )}
        <hr className="border-gray-700 mb-6" />
        {/* Action Buttons */}
        <div className="flex justify-end">
          <button
            className="px-6 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            onClick={onMessagePatient}
          >
            Message Patient
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileModal;
