import { useMemo, useState } from "react";
import api from "@/service/api";

interface NewMedicationModalProps {
  appointmentId: string;
  isOpen: boolean;
  onClose: () => void;
}

// Hardcoded services and medicines from product/menu images
const SERVICE_TO_MEDICINES: Record<string, string[]> = {
  "Hair Loss Treatments": [
    "Oral Minoxidil",
    "Oral Minoxidil/Finasteride/Vitamins",
    "Finasteride pill",
    "Hair Restore Topical Solution",
  ],
  "Hormone Optimization / TRT": [
    "Testosterone Injections",
    "Testosterone Cream",
    "Testosterone Troche (Sublingual)",
    "Enclomiphene",
  ],
  "Weight Loss & Obesity Medicine": [
    "Semaglutide (injectable)",
    "Tirzepatide (injectable)",
    "Bupropion/topiramate/naltrexone",
  ],
  "Sexual Health": [
    "Tadalafil (oral tablets)",
    "Sildenafil (oral tablets)",
    "PT-141 (injectable)",
  ],
  "Peptides & Longevity": [
    "CJC/Ipamorelin (injectable)",
    "Tesamorelin (injectable)",
    "Sermorelin (injectable)",
    "BPC-157/TB-500 Wolverine Blend (injectable)",
    "Selank (nasal spray)",
    "Semax (nasal spray)",
  ],
  "Lab Testing": [
    "Labs and Initial Consult",
  ],
  "Supplements": [
    "Private label",
    "Shilajit Supplementation",
    "Magnesium L-Threonate",
    "Prescription Grade Multivitamin",
    "Ashwagandha Root",
    "Vitamin D3",
  ],
};

const SERVICE_TABS: string[] = Object.keys(SERVICE_TO_MEDICINES);

export default function NewMedicationModal({ appointmentId, isOpen, onClose }: NewMedicationModalProps) {
  const [activeService, setActiveService] = useState<string>(SERVICE_TABS[0]);
  const [selectedByService, setSelectedByService] = useState<Record<string, Set<string>>>(() => {
    const init: Record<string, Set<string>> = {};
    for (const key of SERVICE_TABS) init[key] = new Set<string>();
    return init;
  });
  const [submitting, setSubmitting] = useState(false);

  const medicines = useMemo(() => SERVICE_TO_MEDICINES[activeService] || [], [activeService]);

  const toggleMedicine = (name: string) => {
    setSelectedByService(prev => {
      const next = { ...prev, [activeService]: new Set(prev[activeService]) };
      if (next[activeService].has(name)) next[activeService].delete(name);
      else next[activeService].add(name);
      return next;
    });
  };

  const submitCurrentService = async () => {
    if (!appointmentId) return;
    setSubmitting(true);
    try {
      const payload: Record<string, string[]> = {
        [activeService]: Array.from(selectedByService[activeService] || []),
      };
      await api.put(`/appointments/${appointmentId}/medications`, {
        medications: payload,
        merge: true,
      });
      onClose();
    } catch (e) {
      console.error("Failed to update medications", e);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-60" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-black border border-gray-800 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-semibold">New Medication</h2>
          <button onClick={onClose} className="px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-white">Close</button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {SERVICE_TABS.map((service) => (
            <button
              key={service}
              onClick={() => setActiveService(service)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors shadow-md whitespace-nowrap ${
                activeService === service
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-black border border-gray-800 text-gray-300 hover:bg-gray-900 hover:text-white"
              }`}
            >
              {service}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-white font-medium">{activeService}</h3>
          <div className="flex flex-wrap gap-2">
            {medicines.map((med) => {
              const selected = selectedByService[activeService]?.has(med);
              return (
                <button
                  key={med}
                  onClick={() => toggleMedicine(med)}
                  className={`px-3 py-2 rounded-full text-sm border transition-colors ${
                    selected ? "bg-green-600 border-green-600 text-white" : "bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800"
                  }`}
                >
                  {med}
                </button>
              );
            })}
          </div>
          <div className="flex justify-end pt-4">
            <button
              onClick={submitCurrentService}
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium"
            >
              {submitting ? "Submitting..." : `Submit ${activeService}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


