// components/BookAppointment.tsx
import { Calendar, ChevronDown } from "lucide-react";
import { useState } from "react";

interface BookAppointmentProps {
  patientName?: string;
}

const BookAppointment: React.FC<BookAppointmentProps> = ({
  patientName = "Stephen",
}) => {
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const handleReschedule = () => {
    // Handle reschedule logic
    console.log("Reschedule clicked");
  };

  const handleCancel = () => {
    // Handle cancel logic
    console.log("Cancel appointment clicked");
  };

  return (
    <div className="flex-1 text-white">
      {/* Header Section */}
      <div className="p-8 pb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-4xl font-bold text-white">
            Hello, {patientName}!
          </h1>
          <span className="text-4xl">👋</span>
        </div>
        <p className="text-gray-400 text-lg mt-2">
          Here's what's next for your health.
        </p>
      </div>

      {/* Book Appointment Card */}
      <div className="mx-8">
        <div
          className="bg-gray-800 rounded-3xl p-8"
          style={{ backgroundColor: "#2a2a2a" }}
        >
          <h2 className="text-2xl font-bold text-white mb-8">
            Book an Appointment
          </h2>

          {/* Form Grid */}
          <div className="grid grid-cols-2 gap-8">
            {/* Service Dropdown */}
            <div>
              <label className="block text-white text-lg font-medium mb-4">
                Service
              </label>
              <div className="relative">
                <select
                  className="w-full bg-gray-700 text-gray-300 px-4 py-4 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
                  style={{ backgroundColor: "#333333" }}
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                >
                  <option value="">Select a Service</option>
                  <option value="general">General Consultation</option>
                  <option value="checkup">Health Checkup</option>
                  <option value="specialist">Specialist Visit</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500"
                  size={20}
                />
              </div>
            </div>

            {/* Provider Dropdown */}
            <div>
              <label className="block text-white text-lg font-medium mb-4">
                Provider
              </label>
              <div className="relative">
                <select
                  className="w-full bg-gray-700 text-gray-300 px-4 py-4 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
                  style={{ backgroundColor: "#333333" }}
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                >
                  <option value="">Choose a Provider</option>
                  <option value="dr-smith">Dr. Smith</option>
                  <option value="dr-johnson">Dr. Johnson</option>
                  <option value="dr-williams">Dr. Williams</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500"
                  size={20}
                />
              </div>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-white text-lg font-medium mb-4">
                Select Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full bg-gray-700 text-gray-300 px-4 py-4 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
                  style={{ backgroundColor: "#333333" }}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
                <Calendar
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500 pointer-events-none"
                  size={20}
                />
              </div>
            </div>

            {/* Time Slot Dropdown */}
            <div>
              <label className="block text-white text-lg font-medium mb-4">
                Select Time
              </label>
              <div className="relative">
                <select
                  className="w-full bg-gray-700 text-gray-300 px-4 py-4 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
                  style={{ backgroundColor: "#333333" }}
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                >
                  <option value="">Select a Time Slot</option>
                  <option value="9:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500"
                  size={20}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-12">
            <button
              onClick={handleReschedule}
              className="px-8 py-3 bg-gray-600 text-white rounded-full font-medium hover:bg-gray-500 transition-colors"
            >
              Book Appointment
            </button>
            <button
              onClick={handleCancel}
              className="px-8 py-3 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
