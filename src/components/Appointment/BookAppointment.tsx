// components/BookAppointment.tsx
import { Calendar, ChevronDown, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { getUserId } from "@/lib/utils";
import {
  fetchDoctors,
  fetchDoctorServices,
  fetchAvailableSlots,
  fetchPrimaryServices,
  bookAppointment,
  setSelectedDoctor,
  setSelectedService,
  setSelectedPrimaryService,
  setSelectedSlot,
  setSelectedDate,
  setSelectedTime,
  resetForm,
  clearBookingState,
} from "@/redux/slice/appointmentSlice";
import { toast } from "react-toastify";
import PaymentModal from "../Modals/PaymentModal";

interface BookAppointmentProps {
  patientName?: string;
}

const BookAppointment: React.FC<BookAppointmentProps> = ({
  patientName = localStorage.getItem('name') || '',
}) => {
  const dispatch = useAppDispatch();
  const {
    doctors,
    services,
    primaryServices,
    availableSlots,
    selectedDoctor,
    selectedService,
    selectedPrimaryService,
    selectedSlot,
    selectedDate,
    selectedTime,
    loading,
    error,
    bookingLoading,
    bookingError,
    bookingSuccess,
  } = useAppSelector((state) => state.appointment);

  // Get user ID directly from localStorage
  const userId = getUserId();
  
  // Payment modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [tempAppointmentData, setTempAppointmentData] = useState<any>(null);
  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // Format date for display (MM-DD-YYYY)
  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  // Handle custom date input
  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow only numbers and dashes
    const cleaned = value.replace(/[^0-9-]/g, '');
    
    // Format as MM-DD-YYYY
    let formatted = cleaned;
    if (cleaned.length >= 2 && !cleaned.includes('-')) {
      formatted = cleaned.slice(0, 2) + '-' + cleaned.slice(2);
    }
    if (cleaned.length >= 5 && cleaned.split('-').length === 2) {
      formatted = cleaned.slice(0, 5) + '-' + cleaned.slice(5, 9);
    }
    
    // Convert to YYYY-MM-DD for internal storage
    if (formatted.length === 10) {
      const [month, day, year] = formatted.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (!isNaN(date.getTime())) {
        dispatch(setSelectedDate(date.toISOString().split('T')[0]));
      }
    }
  };

  useEffect(() => {
    // Fetch doctors on component mount
    dispatch(fetchDoctors());
    dispatch(fetchPrimaryServices());
  }, [dispatch]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.calendar-container')) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  useEffect(() => {
    // Fetch services when doctor is selected
    if (selectedDoctor) {
      dispatch(fetchDoctorServices(selectedDoctor.id));
    }
  }, [selectedDoctor, dispatch]);

  useEffect(() => {
    // Fetch available slots when doctor, service, and date are selected
    if (selectedDoctor && selectedService && selectedDate) {
      dispatch(fetchAvailableSlots({
        doctorId: selectedDoctor.id,
        date: selectedDate,
        serviceId: selectedService.id,
      }));
    }
  }, [selectedDoctor, selectedService, selectedDate, dispatch]);

  useEffect(() => {
    // Show success message
    if (bookingSuccess) {
      toast.success("Appointment booked successfully!");
      dispatch(clearBookingState());
      dispatch(resetForm());
    }
  }, [bookingSuccess, dispatch]);

  useEffect(() => {
    // Show error message
    if (bookingError) {
      toast.error(bookingError);
      dispatch(clearBookingState());
    }
  }, [bookingError, dispatch]);

  const handleDoctorChange = (doctorId: string) => {
    const doctor = doctors?.find(d => d.id === doctorId);
    dispatch(setSelectedDoctor(doctor || null));
  };

  const handleServiceChange = (serviceId: string) => {
    const service = services?.find(s => s.id === serviceId);
    dispatch(setSelectedService(service || null));
  };

  const handlePrimaryServiceChange = (primaryServiceId: string) => {
    const primary = primaryServices?.find(p => p.id === primaryServiceId) || null;
    dispatch(setSelectedPrimaryService(primary));
  };

  const handleSlotChange = (slotId: string) => {
    const slot = availableSlots?.find(s => s.id === slotId);
    dispatch(setSelectedSlot(slot || null));
  };

  const handleDateChange = (date: string) => {
    dispatch(setSelectedDate(date));
  };

  const handleTimeChange = (time: string) => {
    dispatch(setSelectedTime(time));
  };

  // Calculate total amount (adds primary service price if Primary Service = Follow Up)
  const getTotalAmount = () => {
    const specialityPrice = selectedService ? parseFloat(String(selectedService.basePrice)) : 0;
    console.log("specialityPrice", specialityPrice);
    const primaryName = selectedPrimaryService?.name?.trim().toLowerCase() || '';
    if (primaryName === 'follow up' || primaryName === 'follow-up' || primaryName === 'followup') {
      const primaryPrice = selectedPrimaryService ? parseFloat(String(selectedPrimaryService.basePrice)) : 0;
      const sum = (isNaN(specialityPrice) ? 0 : specialityPrice) + (isNaN(primaryPrice) ? 0 : primaryPrice);
      return sum;
    }
    return isNaN(specialityPrice) ? 0 : specialityPrice;
  };

  // Calculate display price for a given speciality option
  const getDisplayPriceForService = (service: { basePrice: string | number }) => {
    const base = parseFloat(String(service.basePrice));
    const primaryName = selectedPrimaryService?.name?.trim().toLowerCase() || '';
    if (primaryName === 'follow up' || primaryName === 'follow-up' || primaryName === 'followup') {
      const primaryPrice = selectedPrimaryService ? parseFloat(String(selectedPrimaryService.basePrice)) : 0;
      const sum = (isNaN(base) ? 0 : base) + (isNaN(primaryPrice) ? 0 : primaryPrice);
      return sum.toFixed(2);
    }
    return (isNaN(base) ? 0 : base).toFixed(2);
  };

  const handleBookAppointment = async () => {
    if (!userId) {
      toast.error("Please log in to book an appointment");
      return;
    }

    if (!selectedDoctor || !selectedService || !selectedPrimaryService || !selectedSlot || !selectedDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const totalAmount = getTotalAmount();

    const appointmentData = {
      patientId: userId,
      doctorId: selectedDoctor.id,
      serviceId: selectedService.id,
      primaryServiceId: selectedPrimaryService.id,
      slotId: selectedSlot.id,
      appointmentDate: selectedDate,
      appointmentTime: selectedSlot.startTime, // Use the slot's start time
      duration: selectedService.duration,
      amount: totalAmount.toFixed(2),
    };

    setIsCreatingAppointment(true);
    
    try {
      // Create temporary appointment first
      const response = await fetch('http://localhost:3000/api/appointments/temporary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create temporary appointment');
      }

      const result = await response.json();
      
      // Store appointment data with the created appointment ID and show payment modal
      setTempAppointmentData({
        ...appointmentData,
        id: result.data.id, // Use the actual appointment ID from backend
      });
      setIsPaymentModalOpen(true);
    } catch (error) {
      console.error('Error creating temporary appointment:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create appointment');
    } finally {
      setIsCreatingAppointment(false);
    }
  };

  const handleCancel = () => {
    dispatch(resetForm());
  };

  const handlePaymentSuccess = async () => {
    if (tempAppointmentData) {
      // Payment was successful, appointment is already confirmed on backend
      // Just show success message and reset the form
      toast.success('Appointment booked successfully!');
      dispatch(resetForm());
      setTempAppointmentData(null);
      setIsCreatingAppointment(false);
    }
  };

  const handlePaymentModalClose = () => {
    setIsPaymentModalOpen(false);
    setTempAppointmentData(null);
    setIsCreatingAppointment(false);
  };

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
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

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}



          {/* Form Grid */}
          <div className="grid grid-cols-2 gap-8">
            {/* Primary Service Dropdown */}
            <div>
              <label className="block text-white text-lg font-medium mb-4">
                Service
              </label>
              <div className="relative">
                <select
                  className="w-full bg-gray-700 text-gray-300 px-4 py-4 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
                  style={{ backgroundColor: "#333333" }}
                  value={selectedPrimaryService?.id || ""}
                  onChange={(e) => handlePrimaryServiceChange(e.target.value)}
                  disabled={loading}
               >
                  <option value="">Select a Primary Service</option>
                  {primaryServices && primaryServices.length > 0 ? (
                    primaryServices.map((ps) => (
                      <option key={ps.id} value={ps.id}>
                        {ps.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No services available</option>
                  )}
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500"
                  size={20}
                />
              </div>
            </div>

            {/* Doctor Dropdown */}
            <div>
              <label className="block text-white text-lg font-medium mb-4">
                Doctor
              </label>
              <div className="relative">
                <select
                  className="w-full bg-gray-700 text-gray-300 px-4 py-4 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
                  style={{ backgroundColor: "#333333" }}
                  value={selectedDoctor?.id || ""}
                  onChange={(e) => handleDoctorChange(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Choose a Doctor</option>
                  {doctors && doctors.length > 0 ? (
                    doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.title} {doctor.firstName} {doctor.lastName}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No doctors available</option>
                  )}
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500"
                  size={20}
                />
              </div>
            </div>

            {/* Service Dropdown */}
            <div>
              <label className="block text-white text-lg font-medium mb-4">
                Medical Services
              </label>
              <div className="relative">
                <select
                  className="w-full bg-gray-700 text-gray-300 px-4 py-4 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
                  style={{ backgroundColor: "#333333" }}
                  value={selectedService?.id || ""}
                  onChange={(e) => handleServiceChange(e.target.value)}
                  disabled={!selectedDoctor || !selectedPrimaryService || loading}
                >
                  <option value="">Select a Medical Service</option>
                  {services && services.length > 0 ? (
                    services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} - ${getDisplayPriceForService(service)}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No services available</option>
                  )}
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
              <div className="relative calendar-container">
                <input
                  type="text"
                  className="w-full bg-gray-700 text-gray-300 px-4 py-4 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
                  style={{ backgroundColor: "#333333" }}
                  value={selectedDate ? formatDateForDisplay(selectedDate) : ""}
                  onChange={(e) => handleDateInputChange(e)}
                  placeholder="MM-DD-YYYY"
                  disabled={!selectedService}
                  onFocus={(e) => e.target.select()}
                />
                <button
                  type="button"
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-400"
                >
                  <Calendar size={20} />
                </button>
                {showCalendar && (
                  <div className="absolute z-10 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg p-4 w-64">
                    {/* Month and Year Header */}
                    <div className="text-center mb-4">
                      <h3 className="text-white font-semibold text-lg">
                        {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 text-sm">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="p-2 text-center font-medium text-gray-400">
                          {day}
                        </div>
                      ))}
                      {Array.from({ length: 35 }, (_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() + i);
                        const isToday = date.toDateString() === new Date().toDateString();
                        const isSelected = selectedDate === date.toISOString().split('T')[0];
                        
                        return (
                          <button
                            key={i}
                            onClick={() => {
                              dispatch(setSelectedDate(date.toISOString().split('T')[0]));
                              setShowCalendar(false);
                            }}
                            className={`p-2 text-center rounded hover:bg-gray-700 ${
                              isToday ? 'bg-red-500 text-white' : ''
                            } ${
                              isSelected ? 'bg-red-600 text-white' : 'text-gray-300'
                            }`}
                          >
                            {date.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
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
                  value={selectedSlot?.id || ""}
                  onChange={(e) => handleSlotChange(e.target.value)}
                  disabled={!selectedDate || !availableSlots || availableSlots.length === 0 || loading}
                >
                  <option value="">Select a Time Slot</option>
                  {availableSlots && availableSlots.length > 0 ? (
                    availableSlots.map((slot) => (
                      <option key={slot.id} value={slot.id}>
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </option>
                    ))
                  ) : selectedDate && selectedService && selectedDoctor ? (
                    <option value="" disabled>No available slots for this date</option>
                  ) : (
                    <option value="" disabled>Select date and service first</option>
                  )}
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500"
                  size={20}
                />
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="mt-6 flex items-center justify-center">
              <Loader2 className="animate-spin text-red-500" size={24} />
              <span className="ml-2 text-gray-400">Loading...</span>
            </div>
          )}

          {/* No Slots Available Message */}
          {selectedDate && selectedService && selectedDoctor && !loading && availableSlots && availableSlots.length === 0 && (
            <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
              <p className="text-yellow-400">
                No available time slots for the selected date. Please try a different date or contact the doctor's office.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mt-12">
            <button
              onClick={handleBookAppointment}
              disabled={!selectedDoctor || !selectedPrimaryService || !selectedService || !selectedSlot || !selectedDate || isCreatingAppointment}
              className="px-8 py-3 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isCreatingAppointment ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating Appointment...
                </>
              ) : (
                'Book Appointment'
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={bookingLoading}
              className="px-8 py-3 bg-gray-600 text-white rounded-full font-medium hover:bg-gray-500 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>

          {/* Success Message */}
          {bookingSuccess && (
            <div className="mt-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
              <p className="text-green-400">Appointment booked successfully!</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {tempAppointmentData && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={handlePaymentModalClose}
          appointmentId={tempAppointmentData.id} // Use the actual appointment ID
          amount={tempAppointmentData.amount}
          doctorName={`Dr. ${selectedDoctor?.lastName}`}
          serviceName={selectedService?.name || ''}
          appointmentDate={tempAppointmentData.appointmentDate}
          appointmentTime={tempAppointmentData.appointmentTime}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default BookAppointment;
