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
  };
  onViewHistory?: () => void;
  onMessagePatient?: () => void;
  onOrderLab?: () => void;
  onAddNote?: () => void;
}

const PatientProfileModal: React.FC<PatientProfileModalProps> = ({
  open,
  onClose,
  patient,
  onViewHistory,
  onMessagePatient,
  onOrderLab,
  onAddNote,
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
        {/* Info Grid */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Email */}
          <div className="bg-black-700 rounded-lg p-4 flex items-center gap-3">
            <div className="bg-red-500 rounded-full p-2 text-white">
              <Mail size={16} />
            </div>
            <div>
              <div className="text-xs text-gray-400">Email</div>
              <div className="font-bold text-white text-base">{patient.email}</div>
            </div>
          </div>
          {/* Alerts */}
          <div className="bg-black-700 rounded-lg p-4 flex items-center gap-3">
            <div className="bg-red-500 rounded-full p-2 text-white">
              <AlertCircle size={16} />
            </div>
            <div>
              <div className="text-xs text-gray-400">Alerts</div>
              <div className="font-bold text-white text-base">{patient.alerts || 'None'}</div>
            </div>
          </div>
        </div>
        {/* Expanded Info Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Vitals */}
          <div className="bg-black-700 rounded-lg p-4">
            <div className="text-xs text-gray-400 mb-1">Vitals</div>
            <div className="text-white text-sm">
              BP: {patient.vitals?.BP || '--'}<br />
              HR: {patient.vitals?.HR || '--'}<br />
              Temp: {patient.vitals?.Temp || '--'}
            </div>
          </div>
          {/* Active Meds */}
          <div className="bg-black-700 rounded-lg p-4">
            <div className="text-xs text-gray-400 mb-1">Active Meds</div>
            <div className="text-white text-sm">
              {patient.activeMeds && patient.activeMeds.length > 0 ? patient.activeMeds.join(', ') : '--'}
            </div>
          </div>
          {/* Allergies */}
          <div className="bg-black-700 rounded-lg p-4">
            <div className="text-xs text-gray-400 mb-1">Allergies</div>
            <div className="text-white text-sm">
              {patient.allergies && patient.allergies.length > 0 ? patient.allergies.join(', ') : 'None'}
            </div>
          </div>
          {/* Last Login */}
          <div className="bg-black-700 rounded-lg p-4">
            <div className="text-xs text-gray-400 mb-1">Last Login</div>
            <div className="text-white text-sm">
              {patient.lastLogin || '--'}
            </div>
          </div>
        </div>
        <hr className="border-gray-700 mb-6" />
        {/* Action Buttons */}
        <div className="flex flex-wrap justify-end gap-4">
          <button
            className="px-6 py-2 rounded-full bg-gray-700 text-white font-medium hover:bg-gray-600 transition-colors"
            onClick={onViewHistory}
          >
            View History
          </button>
          <button
            className="px-6 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            onClick={onMessagePatient}
          >
            Message Patient
          </button>
          <button
            className="px-6 py-2 rounded-full bg-yellow-500 text-black font-medium hover:bg-yellow-600 transition-colors"
            onClick={onOrderLab}
          >
            Order Lab
          </button>
          <button
            className="px-6 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
            onClick={onAddNote}
          >
            Add Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileModal;
