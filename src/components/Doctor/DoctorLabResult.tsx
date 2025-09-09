import React, { useState } from "react";
import {
  Home,
  Calendar,
  Users,
  UserPlus,
  Edit2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface LabResult {
  id: string;
  name: string;
  date: string;
  selected: boolean;
  status: "normal" | "high" | "low";
  summary?: string;
}

interface Patient {
  name: string;
  mrn: string;
  age: string;
}

const LabResultsComponent: React.FC = () => {
  const [selectedResults, setSelectedResults] = useState<LabResult[]>([
    {
      id: "1",
      name: "Testosterone Panel",
      date: "Aug 29, 2025",
      selected: true,
      status: "low",
      summary:
        "Testosterone levels are below normal range. Consider hormone replacement therapy consultation.",
    },
    {
      id: "2",
      name: "CBC Panel",
      date: "Aug 29, 2025",
      selected: false,
      status: "normal",
      summary: "Complete blood count shows all values within normal limits.",
    },
    {
      id: "3",
      name: "Lipid Panel",
      date: "Aug 29, 2025",
      selected: false,
      status: "high",
      summary:
        "Cholesterol is slightly elevated at 245 mg/dL. Dietary modifications and follow-up recommended.",
    },
  ]);

  const [note, setNote] = useState("");
  const [sendNotification, setSendNotification] = useState(true);
  const [editingSummary, setEditingSummary] = useState<string | null>(null);
  const [editedSummaries, setEditedSummaries] = useState<{
    [key: string]: string;
  }>({});

  const patient: Patient = {
    name: "John Doe",
    mrn: "00123",
    age: "42 Years Old",
  };

  const toggleResultSelection = (id: string) => {
    setSelectedResults((prev) =>
      prev.map((result) =>
        result.id === id ? { ...result, selected: !result.selected } : result
      )
    );
  };

  const selectAllResults = () => {
    setSelectedResults((prev) =>
      prev.map((result) => ({ ...result, selected: true }))
    );
  };

  const deselectAllResults = () => {
    setSelectedResults((prev) =>
      prev.map((result) => ({ ...result, selected: false }))
    );
  };

  const handleEditSummary = (id: string, currentSummary: string) => {
    setEditingSummary(id);
    setEditedSummaries((prev) => ({
      ...prev,
      [id]: currentSummary,
    }));
  };

  const saveSummary = (id: string) => {
    setSelectedResults((prev) =>
      prev.map((result) =>
        result.id === id
          ? { ...result, summary: editedSummaries[id] || result.summary }
          : result
      )
    );
    setEditingSummary(null);
  };

  const cancelEditSummary = () => {
    setEditingSummary(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "high":
        return "text-red-400";
      case "low":
        return "text-red-400";
      case "normal":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "high":
      case "low":
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case "normal":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses =
      "px-2 py-1 rounded-full text-xs font-semibold uppercase";
    switch (status) {
      case "high":
        return `${baseClasses} bg-red-900 text-red-300`;
      case "low":
        return `${baseClasses} bg-red-900 text-red-300`;
      case "normal":
        return `${baseClasses} bg-green-900 text-green-300`;
      default:
        return `${baseClasses} bg-gray-900 text-gray-300`;
    }
  };

  const handleRelease = () => {
    const selected = selectedResults.filter((result) => result.selected);
    console.log("Releasing selected results:", selected);
    console.log("Note:", note);
    console.log("Send notification:", sendNotification);
    // Handle release logic here
  };

  const handleCancel = () => {
    // Handle cancel logic here
    console.log("Operation cancelled");
  };

  const selectedCount = selectedResults.filter(
    (result) => result.selected
  ).length;

  return (
    <div className="min-h-screen bg-black-900 text-white">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Release Lab Results</h1>
          <div className="flex gap-3">
            <button
              onClick={selectAllResults}
              className="px-4 py-2 bg-black-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              Select All
            </button>
            <button
              onClick={deselectAllResults}
              className="px-4 py-2 bg-black-800 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              Deselect All
            </button>
          </div>
        </div>

        {/* Patient Info Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-black-800 rounded-lg p-6 border border-gray-1000">
            <div className="flex items-center mb-2">
              <div className="w-12 h-12 bg-gray-600 rounded-full mr-4"></div>
              <div>
                <p className="text-white-400 text-sm">Name</p>
                <p className="text-xl font-semibold">{patient.name}</p>
              </div>
            </div>
          </div>

          <div className="bg-black-800 rounded-lg p-6 border border-gray-1000">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <div>
                <p className="text-white-400 text-sm">MRN</p>
                <p className="text-xl font-semibold">{patient.mrn}</p>
              </div>
            </div>
          </div>

          <div className="bg-black-800 rounded-lg p-6 border border-gray-1000">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <div>
                <p className="text-white-400 text-sm">Age</p>
                <p className="text-xl font-semibold">{patient.age}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="bg-black-800 rounded-lg p-6 mb-8 border border-gray-1000">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Results List</h2>
            {selectedCount > 0 && (
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                {selectedCount} selected
              </span>
            )}
          </div>

          <div className="grid grid-cols-12 gap-4 mb-6 text-sm text-white-400">
            <div className="col-span-1"></div>
            <div className="col-span-3">Test Name</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-4">AI Summary</div>
          </div>

          {selectedResults.map((result) => (
            <div
              key={result.id}
              className="grid grid-cols-12 gap-4 items-start py-4 border-b border-gray-700 last:border-b-0"
            >
              <div className="col-span-1 flex items-center pt-1">
                <input
                  type="checkbox"
                  checked={result.selected}
                  onChange={() => toggleResultSelection(result.id)}
                  className="w-5 h-5 bg-gray-700 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                />
              </div>

              <div className="col-span-3 flex items-center pt-1">
                {getStatusIcon(result.status)}
                <span
                  className={`text-lg ml-2 ${getStatusColor(result.status)}`}
                >
                  {result.name}
                </span>
              </div>

              <div className="col-span-2 pt-1">
                <span className="text-lg text-gray-300">{result.date}</span>
              </div>

              <div className="col-span-2 pt-1">
                <span className={getStatusBadge(result.status)}>
                  {result.status}
                </span>
              </div>

              <div className="col-span-4">
                {editingSummary === result.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editedSummaries[result.id] || result.summary || ""}
                      onChange={(e) =>
                        setEditedSummaries((prev) => ({
                          ...prev,
                          [result.id]: e.target.value,
                        }))
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-sm text-white resize-none"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveSummary(result.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-500"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditSummary}
                        className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <p className="text-sm text-gray-300 leading-relaxed flex-1">
                      {result.summary}
                    </p>
                    <button
                      onClick={() =>
                        handleEditSummary(result.id, result.summary || "")
                      }
                      className="text-gray-400 hover:text-white p-1"
                      title="Edit summary"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Patient Notification */}
        <div className="bg-black-800 rounded-lg p-6 mb-8 border border-gray-1000">
          <h2 className="text-2xl font-bold mb-4">Patient Notification</h2>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="notification"
              checked={sendNotification}
              onChange={(e) => setSendNotification(e.target.checked)}
              className="w-5 h-5 bg-gray-700 border-gray-600 rounded focus:ring-red-500 focus:ring-2 mr-3"
            />
            <label htmlFor="notification" className="text-lg">
              Send Patient Email/SMS Notification
            </label>
          </div>
          <p className="text-sm text-white-400 mt-2 ml-8">
            Patient will receive automated notification when results are
            released
          </p>
        </div>

        {/* Add Note Section */}
        <div className="bg-black-800 rounded-lg p-6 mb-8 border border-gray-1000">
          <h2 className="text-2xl font-bold mb-6">Add Note</h2>

          <div className="mb-4">
            <label className="text-gray-400 text-sm mb-2 block">
              Add Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write here"
              className="w-full bg-[#2A2A2A] border border-[#2A2A2A] rounded-lg p-4 text-white placeholder-gray-500 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleCancel}
            className="px-8 py-3 bg-gray-600 text-white rounded-full font-semibold hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleRelease}
            disabled={selectedCount === 0}
            className="px-8 py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            Release {selectedCount > 0 ? `${selectedCount} ` : ""}Selected
            Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabResultsComponent;
