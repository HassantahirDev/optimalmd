import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  UserPlus,
  Search,
  Edit,
  Trash2,
  FileText,
  Phone,
  Mail,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CreatePatientForm from "./CreatePatientForm";
import EditPatientForm from "./EditPatientForm";
import { adminApi, Patient } from "@/services/adminApi";
import { toast } from "sonner";

/* -------------------- Small reusable presenters -------------------- */

function Section({
  title,
  value,
  field,
  isEditing,
  editedData,
  onChange,
}: {
  title: string;
  value?: any;
  field?: string;
  isEditing?: boolean;
  editedData?: any;
  onChange?: (field: string, value: any) => void;
}) {
  if (isEditing && field && onChange) {
    return (
      <div>
        <p className="text-gray-400 text-sm mb-1">{title}</p>
        <textarea
          value={editedData?.[field] ?? ""}
          onChange={(e) => onChange(field, e.target.value)}
          className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-0 outline-none whitespace-pre-wrap break-words resize-y min-h-[80px]"
        />
      </div>
    );
  }

  return (
    <div>
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p className="text-white bg-gray-700 p-3 rounded-lg whitespace-pre-wrap break-words">
        {value ?? "—"}
      </p>
    </div>
  );
}

function KV({
  label,
  value,
  field,
  isEditing,
  editedData,
  onChange,
  type = "text",
  options,
}: {
  label: string;
  value?: any;
  field?: string;
  isEditing?: boolean;
  editedData?: any;
  onChange?: (field: string, value: any) => void;
  type?: "text" | "select" | "checkbox";
  options?: string[];
}) {
  if (isEditing && field && onChange) {
    if (type === "checkbox") {
      return (
        <div>
          <p className="text-gray-400 text-sm mb-1">{label}</p>
          <label className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              checked={!!editedData?.[field]}
              onChange={(e) => onChange(field, e.target.checked)}
              className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
            />
            {editedData?.[field] ? "Yes" : "No"}
          </label>
        </div>
      );
    }

    if (type === "select" && options) {
      return (
        <div>
          <p className="text-gray-400 text-sm mb-1">{label}</p>
          <select
            value={editedData?.[field] ?? ""}
            onChange={(e) => onChange(field, e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-0 outline-none"
          >
            <option value="">—</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div>
        <p className="text-gray-400 text-sm mb-1">{label}</p>
        <input
          type="text"
          value={editedData?.[field] ?? ""}
          onChange={(e) => onChange(field, e.target.value)}
          className="w-full bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-0 outline-none"
        />
      </div>
    );
  }

  return (
    <div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-white font-medium">{value ?? "—"}</p>
    </div>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-block px-2 py-1 rounded-md bg-red-600/20 text-red-400 border border-red-600/40 text-xs">
      {label}
    </span>
  );
}

function toYesNo(v: any): string {
  if (v === true) return "Yes";
  if (v === false) return "No";
  return "—";
}

/* -------------------- Main component -------------------- */

const AdminPatients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMedicalFormModal, setShowMedicalFormModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [medicalForm, setMedicalForm] = useState<any | null>(null);
  const [medicalFormLoading, setMedicalFormLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFormData, setEditedFormData] = useState<any>({});
  const [savingForm, setSavingForm] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "screen2" | "screen3" | "screen4" | "screen5" | "screen6" | "screen7" | "screen8" | "screen9"
  >("screen2");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load patients from API
  useEffect(() => {
    loadPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, statusFilter]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const response = await adminApi.patient.getPatients({
        page: 1,
        limit: 50,
        search: debouncedSearchTerm || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      setPatients(response.data);
    } catch (error: any) {
      console.error("Error loading patients:", error);
      toast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  // Filtering is now handled by the API, so we use patients directly
  const filteredPatients = patients;

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-500 text-white">Active</Badge>
    ) : (
      <Badge className="bg-gray-500 text-white">Inactive</Badge>
    );
  };

  const getPatientName = (patient: Patient) => {
    return `${patient.firstName} ${patient.middleName ? patient.middleName + " " : ""}${patient.lastName}`;
  };

  const getPatientAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleCreatePatient = () => {
    setEditingPatient(null);
    setShowCreateModal(true);
  };

  const handlePatientCreated = () => {
    // Refresh the patients list
    loadPatients();
    toast.success("Patient created successfully");
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setEditingPatient(null);
    // Refresh the patients list
    loadPatients();
  };

  const handleDeletePatient = async (patientId: string) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await adminApi.patient.deletePatient(patientId);
        toast.success("Patient deleted successfully");
        loadPatients();
      } catch (error: any) {
        console.error("Error deleting patient:", error);
        toast.error("Failed to delete patient");
      }
    }
  };

  const handleViewMedicalForm = async (patient: Patient) => {
    setSelectedPatient(patient);
    setShowMedicalFormModal(true);
    setMedicalForm(null);
    setActiveTab("screen2");
    setIsEditing(false);
    setEditedFormData({});
    try {
      setMedicalFormLoading(true);
      const response = await adminApi.patient.getMedicalForm(patient.id);
      setMedicalForm(response.data);
      setEditedFormData(response.data);
    } catch (error: any) {
      console.error("Error loading medical form:", error);
      setMedicalForm(null);
      toast.error("Failed to load medical form");
    } finally {
      setMedicalFormLoading(false);
    }
  };

  const handleSaveForm = async () => {
    if (!selectedPatient || !editedFormData) return;
    
    setSavingForm(true);
    try {
      await adminApi.patient.updateMedicalForm(selectedPatient.id, editedFormData);
      setMedicalForm(editedFormData);
      setIsEditing(false);
      toast.success("Medical form updated successfully");
    } catch (error) {
      console.error("Error updating medical form:", error);
      toast.error("Failed to update medical form");
    } finally {
      setSavingForm(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setEditedFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case "screen2":
        return (
          <>
            <h3 className="text-white font-bold text-xl mb-8">About You</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Height</h4>
                <p className="text-white text-base">{medicalForm?.height || "Not provided"}</p>
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Weight</h4>
                <p className="text-white text-base">{medicalForm?.weight || "Not provided"}</p>
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Waist</h4>
                <p className="text-white text-base">{medicalForm?.waist || "Not provided"}</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Emergency Contact Name</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={medicalForm?.emergencyContactName || ""}
                    onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="Emergency contact name"
                  />
                ) : (
                  <p className="text-white text-base">{medicalForm?.emergencyContactName || "Not provided"}</p>
                )}
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Emergency Contact Phone</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={medicalForm?.emergencyContactPhone || ""}
                    onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="Emergency contact phone"
                  />
                ) : (
                  <p className="text-white text-base">{medicalForm?.emergencyContactPhone || "Not provided"}</p>
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
                      checked={medicalForm?.goalMoreEnergy || false}
                      onChange={(e) => handleInputChange("goalMoreEnergy", e.target.checked)}
                      className="w-4 h-4 text-green-500 bg-gray-800 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                    />
                  ) : (
                    <div
                      className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                        medicalForm?.goalMoreEnergy
                          ? "bg-green-500 border-green-500"
                          : "border-gray-400 bg-transparent"
                      }`}
                    >
                      {medicalForm?.goalMoreEnergy && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
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
                      checked={medicalForm?.goalBetterSexualPerformance || false}
                      onChange={(e) => handleInputChange("goalBetterSexualPerformance", e.target.checked)}
                      className="w-4 h-4 text-green-500 bg-gray-800 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                    />
                  ) : (
                    <div
                      className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                        medicalForm?.goalBetterSexualPerformance
                          ? "bg-green-500 border-green-500"
                          : "border-gray-400 bg-transparent"
                      }`}
                    >
                      {medicalForm?.goalBetterSexualPerformance && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
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
                      checked={medicalForm?.goalLoseWeight || false}
                      onChange={(e) => handleInputChange("goalLoseWeight", e.target.checked)}
                      className="w-4 h-4 text-green-500 bg-gray-800 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                    />
                  ) : (
                    <div
                      className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                        medicalForm?.goalLoseWeight
                          ? "bg-green-500 border-green-500"
                          : "border-gray-400 bg-transparent"
                      }`}
                    >
                      {medicalForm?.goalLoseWeight && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
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
                      checked={medicalForm?.goalHairRestoration || false}
                      onChange={(e) => handleInputChange("goalHairRestoration", e.target.checked)}
                      className="w-4 h-4 text-green-500 bg-gray-800 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                    />
                  ) : (
                    <div
                      className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                        medicalForm?.goalHairRestoration
                          ? "bg-green-500 border-green-500"
                          : "border-gray-400 bg-transparent"
                      }`}
                    >
                      {medicalForm?.goalHairRestoration && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
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
                      checked={medicalForm?.goalImproveMood || false}
                      onChange={(e) => handleInputChange("goalImproveMood", e.target.checked)}
                      className="w-4 h-4 text-green-500 bg-gray-800 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                    />
                  ) : (
                    <div
                      className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                        medicalForm?.goalImproveMood
                          ? "bg-green-500 border-green-500"
                          : "border-gray-400 bg-transparent"
                      }`}
                    >
                      {medicalForm?.goalImproveMood && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
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
                      checked={medicalForm?.goalLongevity || false}
                      onChange={(e) => handleInputChange("goalLongevity", e.target.checked)}
                      className="w-4 h-4 text-green-500 bg-gray-800 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                    />
                  ) : (
                    <div
                      className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                        medicalForm?.goalLongevity
                          ? "bg-green-500 border-green-500"
                          : "border-gray-400 bg-transparent"
                      }`}
                    >
                      {medicalForm?.goalLongevity && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  )}
                  <span className="text-white">Longevity</span>
                </div>
              </div>
              {(medicalForm?.goalOther || isEditing) && (
                <div className="mt-4">
                  <h4 className="text-gray-400 text-sm mb-2">Other Goals</h4>
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={medicalForm?.goalOther || false}
                          onChange={(e) => handleInputChange("goalOther", e.target.checked)}
                          className="w-4 h-4 text-green-500 bg-gray-800 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                        />
                        <span className="text-white">Other</span>
                      </div>
                      {medicalForm?.goalOther && (
                        <textarea
                          value={medicalForm?.goalOtherDescription || ""}
                          onChange={(e) => handleInputChange("goalOtherDescription", e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                          placeholder="Describe other goals..."
                          rows={3}
                        />
                      )}
                    </div>
                  ) : (
                    <p className="text-white text-base">{medicalForm?.goalOtherDescription || "Not specified"}</p>
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
                    value={medicalForm?.chronicConditions || ""}
                    onChange={(e) => handleInputChange("chronicConditions", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="List chronic conditions..."
                    rows={3}
                  />
                ) : (
                  <p className="text-white text-base">{medicalForm?.chronicConditions || "Not provided"}</p>
                )}
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Past Surgeries/Hospitalizations</h4>
                {isEditing ? (
                  <textarea
                    value={medicalForm?.pastSurgeriesHospitalizations || ""}
                    onChange={(e) => handleInputChange("pastSurgeriesHospitalizations", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="List past surgeries and hospitalizations..."
                    rows={3}
                  />
                ) : (
                  <p className="text-white text-base">{medicalForm?.pastSurgeriesHospitalizations || "Not provided"}</p>
                )}
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Current Medications</h4>
                {isEditing ? (
                  <textarea
                    value={medicalForm?.currentMedications || ""}
                    onChange={(e) => handleInputChange("currentMedications", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="List current medications..."
                    rows={3}
                  />
                ) : (
                  <p className="text-white text-base">{medicalForm?.currentMedications || "Not provided"}</p>
                )}
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Allergies</h4>
                {isEditing ? (
                  <textarea
                    value={medicalForm?.allergies || ""}
                    onChange={(e) => handleInputChange("allergies", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="List allergies..."
                    rows={3}
                  />
                ) : (
                  <p className="text-white text-base">{medicalForm?.allergies || "Not provided"}</p>
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
                    value={medicalForm?.sleepHoursPerNight || ""}
                    onChange={(e) => handleInputChange("sleepHoursPerNight", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="e.g., 7-8 hours"
                  />
                ) : (
                  <p className="text-white text-base">{medicalForm?.sleepHoursPerNight || "Not specified"}</p>
                )}
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Sleep Quality</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={medicalForm?.sleepQuality || ""}
                    onChange={(e) => handleInputChange("sleepQuality", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="e.g., Good, Fair, Poor"
                  />
                ) : (
                  <p className="text-white text-base">{medicalForm?.sleepQuality || "Not specified"}</p>
                )}
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Exercise Frequency</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={medicalForm?.exerciseFrequency || ""}
                    onChange={(e) => handleInputChange("exerciseFrequency", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="e.g., 3-4 times per week"
                  />
                ) : (
                  <p className="text-white text-base">{medicalForm?.exerciseFrequency || "Not specified"}</p>
                )}
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Diet Type</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={medicalForm?.dietType || ""}
                    onChange={(e) => handleInputChange("dietType", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="e.g., Mediterranean, Keto, Standard"
                  />
                ) : (
                  <p className="text-white text-base">{medicalForm?.dietType || "Not specified"}</p>
                )}
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Alcohol Use</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={medicalForm?.alcoholUse || ""}
                    onChange={(e) => handleInputChange("alcoholUse", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="e.g., None, Occasional, Regular"
                  />
                ) : (
                  <p className="text-white text-base">{medicalForm?.alcoholUse || "Not specified"}</p>
                )}
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Tobacco Use</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={medicalForm?.tobaccoUse || ""}
                    onChange={(e) => handleInputChange("tobaccoUse", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="e.g., None, Former, Current"
                  />
                ) : (
                  <p className="text-white text-base">{medicalForm?.tobaccoUse || "Not specified"}</p>
                )}
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Cannabis/Other Substances</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={medicalForm?.cannabisOtherSubstances || ""}
                    onChange={(e) => handleInputChange("cannabisOtherSubstances", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="e.g., None, Occasional, Regular"
                  />
                ) : (
                  <p className="text-white text-base">{medicalForm?.cannabisOtherSubstances || "Not specified"}</p>
                )}
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Stress Level</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={medicalForm?.stressLevel || ""}
                    onChange={(e) => handleInputChange("stressLevel", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="e.g., Low, Moderate, High"
                  />
                ) : (
                  <p className="text-white text-base">{medicalForm?.stressLevel || "Not specified"}</p>
                )}
              </div>
            </div>
            {medicalForm?.cannabisOtherSubstancesList && (
              <div className="mt-6">
                <h4 className="text-gray-400 text-sm mb-2">Substances List</h4>
                {isEditing ? (
                  <textarea
                    value={medicalForm?.cannabisOtherSubstancesList || ""}
                    onChange={(e) => handleInputChange("cannabisOtherSubstancesList", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="List substances..."
                    rows={3}
                  />
                ) : (
                  <p className="text-white text-base">{medicalForm.cannabisOtherSubstancesList}</p>
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
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                    medicalForm?.symptomFatigue ? "bg-red-500 border-red-500" : "border-gray-400 bg-transparent"
                  }`}
                >
                  {medicalForm?.symptomFatigue && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-white">Fatigue</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                    medicalForm?.symptomLowLibido ? "bg-red-500 border-red-500" : "border-gray-400 bg-transparent"
                  }`}
                >
                  {medicalForm?.symptomLowLibido && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-white">Low Libido</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                    medicalForm?.symptomMuscleLoss ? "bg-red-500 border-red-500" : "border-gray-400 bg-transparent"
                  }`}
                >
                  {medicalForm?.symptomMuscleLoss && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-white">Muscle Loss</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                    medicalForm?.symptomWeightGain ? "bg-red-500 border-red-500" : "border-gray-400 bg-transparent"
                  }`}
                >
                  {medicalForm?.symptomWeightGain && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-white">Weight Gain</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                    medicalForm?.symptomGynecomastia ? "bg-red-500 border-red-500" : "border-gray-400 bg-transparent"
                  }`}
                >
                  {medicalForm?.symptomGynecomastia && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-white">Gynecomastia</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                    medicalForm?.symptomBrainFog ? "bg-red-500 border-red-500" : "border-gray-400 bg-transparent"
                  }`}
                >
                  {medicalForm?.symptomBrainFog && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-white">Brain Fog</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                    medicalForm?.symptomMoodSwings ? "bg-red-500 border-red-500" : "border-gray-400 bg-transparent"
                  }`}
                >
                  {medicalForm?.symptomMoodSwings && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-white">Mood Swings</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                    medicalForm?.symptomPoorSleep ? "bg-red-500 border-red-500" : "border-gray-400 bg-transparent"
                  }`}
                >
                  {medicalForm?.symptomPoorSleep && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-white">Poor Sleep</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                    medicalForm?.symptomHairThinning ? "bg-red-500 border-red-500" : "border-gray-400 bg-transparent"
                  }`}
                >
                  {medicalForm?.symptomHairThinning && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-white">Hair Thinning</span>
              </div>
            </div>
          </>
        );

      case "screen7":
        return (
          <>
            <h3 className="text-white font-bold text-xl mb-8">Safety Check</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                    medicalForm?.historyProstateBreastCancer
                      ? "bg-red-500 border-red-500"
                      : "border-gray-400 bg-transparent"
                  }`}
                >
                  {medicalForm?.historyProstateBreastCancer && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-white">History of Prostate/Breast Cancer</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                    medicalForm?.historyBloodClotsMIStroke
                      ? "bg-red-500 border-red-500"
                      : "border-gray-400 bg-transparent"
                  }`}
                >
                  {medicalForm?.historyBloodClotsMIStroke && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-white">History of Blood Clots/MI/Stroke</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                    medicalForm?.currentlyUsingHormonesPeptides
                      ? "bg-yellow-500 border-yellow-500"
                      : "border-gray-400 bg-transparent"
                  }`}
                >
                  {medicalForm?.currentlyUsingHormonesPeptides && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-white">Currently Using Hormones/Peptides</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                    medicalForm?.planningChildrenNext12Months
                      ? "bg-yellow-500 border-yellow-500"
                      : "border-gray-400 bg-transparent"
                  }`}
                >
                  {medicalForm?.planningChildrenNext12Months && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-white">Planning Children Next 12 Months</span>
              </div>
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
                {isEditing ? (
                  <textarea
                    value={medicalForm?.labUploads || ""}
                    onChange={(e) => handleInputChange("labUploads", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="Lab upload information..."
                    rows={3}
                  />
                ) : (
                  <p className="text-white text-base">{medicalForm?.labUploads || "No lab uploads"}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                    medicalForm?.labSchedulingNeeded ? "bg-blue-500 border-blue-500" : "border-gray-400 bg-transparent"
                  }`}
                >
                  {medicalForm?.labSchedulingNeeded && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
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
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={medicalForm?.consentTelemedicineCare || false}
                    onChange={(e) => handleInputChange("consentTelemedicineCare", e.target.checked)}
                    className="w-4 h-4 text-green-500 bg-gray-800 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                  />
                ) : (
                  <div
                    className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                      medicalForm?.consentTelemedicineCare
                        ? "bg-green-500 border-green-500"
                        : "border-gray-400 bg-transparent"
                    }`}
                  >
                    {medicalForm?.consentTelemedicineCare && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                )}
                <span className="text-white">Consent to Telemedicine Care</span>
              </div>
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={medicalForm?.consentElectiveOptimizationTreatment || false}
                    onChange={(e) => handleInputChange("consentElectiveOptimizationTreatment", e.target.checked)}
                    className="w-4 h-4 text-green-500 bg-gray-800 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                  />
                ) : (
                  <div
                    className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                      medicalForm?.consentElectiveOptimizationTreatment
                        ? "bg-green-500 border-green-500"
                        : "border-gray-400 bg-transparent"
                    }`}
                  >
                    {medicalForm?.consentElectiveOptimizationTreatment && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                )}
                <span className="text-white">Consent to Elective Optimization Treatment</span>
              </div>
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={medicalForm?.consentRequiredLabMonitoring || false}
                    onChange={(e) => handleInputChange("consentRequiredLabMonitoring", e.target.checked)}
                    className="w-4 h-4 text-green-500 bg-gray-800 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                  />
                ) : (
                  <div
                    className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                      medicalForm?.consentRequiredLabMonitoring
                        ? "bg-green-500 border-green-500"
                        : "border-gray-400 bg-transparent"
                    }`}
                  >
                    {medicalForm?.consentRequiredLabMonitoring && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                )}
                <span className="text-white">Consent to Required Lab Monitoring</span>
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Digital Signature</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={medicalForm?.digitalSignature || ""}
                    onChange={(e) => handleInputChange("digitalSignature", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                    placeholder="Digital signature"
                  />
                ) : (
                  <p className="text-white text-base">{medicalForm?.digitalSignature || "Not provided"}</p>
                )}
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Consent Date</h4>
                <p className="text-white text-base">
                  {medicalForm?.consentDate
                    ? (() => {
                        try {
                          const date = new Date(medicalForm.consentDate);
                          if (isNaN(date.getTime())) return "Invalid Date";
                          return date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                          });
                        } catch (error) {
                          return "Invalid Date";
                        }
                      })()
                    : "Not provided"}
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

  if (loading) {
    return (
      <div className="flex-1 text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading patients...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-600 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">Patients Management</h1>
            </div>
            <Button
              onClick={handleCreatePatient}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Create Patient
            </Button>
          </div>
          <p className="text-gray-400 text-lg">
            Manage patient records, medical forms, and patient information
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
              className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Patients List */}
        <div className="space-y-6">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No patients found</p>
            </div>
          ) : (
            filteredPatients.map((patient) => (
              <Card key={patient.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-white flex items-center gap-3">
                        <Users className="h-5 w-5" />
                        {getPatientName(patient)}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {patient.primaryEmail}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {patient.primaryPhone}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(patient.isActive)}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleViewMedicalForm(patient)}
                          variant="outline"
                          size="sm"
                          className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleEditPatient(patient)}
                          variant="outline"
                          size="sm"
                          className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeletePatient(patient.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Age</p>
                      <p className="text-white font-medium">{getPatientAge(patient.dateOfBirth)} years old</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Gender</p>
                      <p className="text-white font-medium">{patient.gender}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Email Verified</p>
                      <div className="flex items-center gap-2">
                        {patient.isEmailVerified ? (
                          <Badge className="bg-green-500 text-white">Verified</Badge>
                        ) : (
                          <Badge className="bg-orange-500 text-white">Pending</Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Status</p>
                      <div className="flex items-center gap-2">
                        {patient.isActive ? (
                          <Badge className="bg-green-500 text-white">Active</Badge>
                        ) : (
                          <Badge className="bg-gray-500 text-white">Inactive</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm mb-1">Address</p>
                    <p className="text-white bg-gray-700 p-3 rounded-lg">
                      {patient.completeAddress}, {patient.city}, {patient.state} {patient.zipcode}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-400 text-sm mb-1">Emergency Contact</p>
                    <p className="text-white">
                      {patient.emergencyContactName} - {patient.emergencyContactPhone}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-1">Member Since</p>
                    <p className="text-white">
                      {new Date(patient.createdAt).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Create Patient Form Modal */}
        {showCreateModal && (
          <CreatePatientForm
            onClose={() => setShowCreateModal(false)}
            onSuccess={handlePatientCreated}
          />
        )}

        {/* Edit Patient Form Modal */}
        {showEditModal && editingPatient && (
          <EditPatientForm
            patient={editingPatient}
            onClose={() => {
              setShowEditModal(false);
              setEditingPatient(null);
            }}
            onSuccess={handleEditSuccess}
          />
        )}

        {/* Medical Form Modal */}
        <Dialog open={showMedicalFormModal} onOpenChange={setShowMedicalFormModal}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-white">
                  Medical Form - {selectedPatient ? getPatientName(selectedPatient) : ""}
                </DialogTitle>
                {medicalForm && !isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Edit
                  </button>
                )}
              </div>
            </DialogHeader>

            {medicalFormLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading medical form...</p>
              </div>
            ) : medicalForm ? (
              <div className="space-y-6">
                {/* Tabs */}
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
                  {[
                    { id: "screen2", label: "About You" },
                    { id: "screen3", label: "Goals" },
                    { id: "screen4", label: "Medical Background" },
                    { id: "screen5", label: "Lifestyle & Habits" },
                    { id: "screen6", label: "Symptoms" },
                    { id: "screen7", label: "Safety Check" },
                    { id: "screen8", label: "Labs & Uploads" },
                    { id: "screen9", label: "Consent" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id as any)}
                      className={`rounded-full px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 whitespace-nowrap ${
                        activeTab === t.id
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Content */}
                <div className="space-y-6">
                  {renderTabContent()}
                    </div>
                  </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                <p className="text-white text-lg mb-2">Medical Form Not Available</p>
                <p className="text-gray-400 mb-4">This patient may not have completed the form yet.</p>
                  </div>
                )}

              {/* Save/Cancel buttons for edit mode */}
            {medicalForm && isEditing && (
                <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-700">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedFormData(medicalForm);
                    }}
                    className="px-4 py-2 border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveForm}
                    disabled={savingForm}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                  {savingForm ? "Saving..." : "Save Changes"}
                  </button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminPatients;
