import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  MapPin,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  fetchDoctorsApi,
  fetchDoctorServicesApi,
  fetchAvailableSlotsApi,
  bookAppointmentApi,
  Doctor,
  Service,
  AvailableSlot,
  CreateAppointmentDto,
} from "@/redux/api/appointmentApi";

interface AppointmentBookingProps {
  patientId: string;
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  patientId,
}) => {
  const queryClient = useQueryClient();

  // State for the appointment flow
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [patientNotes, setPatientNotes] = useState<string>("");
  const [symptoms, setSymptoms] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Format date for display (MM-DD-YYYY)
  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Format in local timezone to avoid UTC conversion
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
    
    e.target.value = formatted;
    
    // Convert to YYYY-MM-DD for internal storage
    if (formatted.length === 10) {
      const [month, day, year] = formatted.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (!isNaN(date.getTime())) {
        // Format in local timezone to avoid UTC conversion
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const localDateString = `${year}-${month}-${day}`;
        setSelectedDate(localDateString);
      }
    }
  };

  // Handle date picker selection
  const handleDatePickerSelect = (date: string) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.date-picker-container')) {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

  // Fetch doctors
  const { data: doctors, isLoading: doctorsLoading } = useQuery({
    queryKey: ["doctors"],
    queryFn: fetchDoctorsApi,
  });

  // Fetch services for selected doctor
  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ["doctorServices", selectedDoctor],
    queryFn: () => fetchDoctorServicesApi(selectedDoctor),
    enabled: !!selectedDoctor,
  });

  // Fetch available slots for selected doctor, date, and service
  const { data: availableSlots, isLoading: slotsLoading } = useQuery({
    queryKey: ["availableSlots", selectedDoctor, selectedDate, selectedService],
    queryFn: () =>
      fetchAvailableSlotsApi(selectedDoctor, selectedDate, selectedService),
    enabled: !!selectedDoctor && !!selectedDate,
  });

  // Book appointment mutation
  const bookAppointmentMutation = useMutation({
    mutationFn: bookAppointmentApi,
    onSuccess: () => {
      toast.success("Appointment booked successfully!");
      // Reset form
      setSelectedDoctor("");
      setSelectedService("");
      setSelectedDate("");
      setSelectedSlot("");
      setPatientNotes("");
      setSymptoms("");
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to book appointment"
      );
    },
  });

  // Get selected service details for pricing
  const selectedServiceDetails = services?.find(
    (service) => service.id === selectedService
  );
  const selectedSlotDetails = availableSlots?.find(
    (slot) => slot.id === selectedSlot
  );

  // Calculate total price
  const totalPrice = selectedServiceDetails
    ? parseFloat(selectedServiceDetails.basePrice)
    : 0;

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDoctor || !selectedService || !selectedDate || !selectedSlot) {
      toast.error("Please fill in all required fields");
      return;
    }

    const appointmentData: CreateAppointmentDto = {
      patientId,
      doctorId: selectedDoctor,
      serviceId: selectedService,
      primaryServiceId: selectedService, // Using the same serviceId as primaryServiceId
      slotId: selectedSlot,
      appointmentDate: selectedDate,
      appointmentTime: selectedSlotDetails?.startTime || "",
      duration: selectedServiceDetails?.duration || 30,
      patientNotes: patientNotes || undefined,
      symptoms: symptoms || undefined,
      amount: totalPrice.toString(),
    };

    bookAppointmentMutation.mutate(appointmentData);
  };

  // Reset dependent fields when doctor changes
  useEffect(() => {
    setSelectedService("");
    setSelectedDate("");
    setSelectedSlot("");
  }, [selectedDoctor]);

  // Reset dependent fields when service changes
  useEffect(() => {
    setSelectedDate("");
    setSelectedSlot("");
  }, [selectedService]);

  // Reset slot when date changes
  useEffect(() => {
    setSelectedSlot("");
  }, [selectedDate]);

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Book an Appointment
        </h1>
        <p className="text-gray-600 mt-2">
          Select your preferred doctor, service, and time slot
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Select Doctor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Step 1: Choose Your Doctor
            </CardTitle>
            <CardDescription>
              Select a healthcare provider from our network of verified doctors
            </CardDescription>
          </CardHeader>
          <CardContent>
            {doctorsLoading ? (
              <div className="text-center py-4">Loading doctors...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {doctors?.map((doctor) => (
                  <Card
                    key={doctor.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedDoctor === doctor.id
                        ? "ring-2 ring-blue-500 bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedDoctor(doctor.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            Dr. {doctor.firstName} {doctor.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {doctor.specialization}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {doctor.city}, {doctor.state}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <Badge
                          variant={doctor.isVerified ? "default" : "secondary"}
                        >
                          {doctor.isVerified ? "Verified" : "Pending"}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <DollarSign className="h-3 w-3" />
                          {doctor.consultationFee}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Select Service */}
        {selectedDoctor && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Step 2: Choose Your Service
              </CardTitle>
              <CardDescription>
                Select the medical service you need
              </CardDescription>
            </CardHeader>
            <CardContent>
              {servicesLoading ? (
                <div className="text-center py-4">Loading services...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services?.map((service) => (
                    <Card
                      key={service.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedService === service.id
                          ? "ring-2 ring-blue-500 bg-blue-50"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedService(service.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {service.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {service.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {service.duration} min
                              </span>
                              <Badge variant="outline">
                                {service.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              ${parseFloat(service.basePrice).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Select Date */}
        {selectedService && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Step 3: Choose Your Date
              </CardTitle>
              <CardDescription>
                Select a date for your appointment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-xs relative date-picker-container">
                <Label htmlFor="appointment-date">Appointment Date</Label>
                <div className="relative">
                  <Input
                    id="appointment-date"
                    type="text"
                    value={formatDateForDisplay(selectedDate)}
                    onChange={handleDateInputChange}
                    onClick={() => setShowDatePicker(true)}
                    placeholder="MM-DD-YYYY"
                    className="mt-2 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Calendar className="w-5 h-5" />
                  </button>
                </div>
                {showDatePicker && (
                  <div className="absolute z-10 mt-2 bg-white border border-gray-300 rounded-md shadow-lg p-4">
                    <div className="grid grid-cols-7 gap-1 text-sm">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="p-2 text-center font-medium text-gray-500">
                          {day}
                        </div>
                      ))}
                      {/* Generate calendar days */}
                      {Array.from({ length: 35 }, (_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() + i);
                        const isToday = date.toDateString() === new Date().toDateString();
                        const isSelected = selectedDate === date.toISOString().split('T')[0];
                        
                        return (
                          <button
                            key={i}
                            onClick={() => handleDatePickerSelect(date.toISOString().split('T')[0])}
                            className={`p-2 text-center rounded hover:bg-gray-100 ${
                              isToday ? 'bg-blue-100 text-blue-600' : ''
                            } ${
                              isSelected ? 'bg-blue-500 text-white' : ''
                            }`}
                          >
                            {date.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {selectedDate && (
                  <p className="text-sm text-gray-500 mt-1">
                    Selected: {formatDateForDisplay(selectedDate)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Select Time Slot */}
        {selectedDate && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Step 4: Choose Your Time
              </CardTitle>
              <CardDescription>Select an available time slot</CardDescription>
            </CardHeader>
            <CardContent>
              {slotsLoading ? (
                <div className="text-center py-4">
                  Loading available slots...
                </div>
              ) : availableSlots && availableSlots.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot.id}
                      variant={selectedSlot === slot.id ? "default" : "outline"}
                      className="h-12"
                      onClick={() => setSelectedSlot(slot.id)}
                    >
                      {slot.startTime}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No available slots for this date. Please try another date.
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 5: Additional Information */}
        {selectedSlot && (
          <Card>
            <CardHeader>
              <CardTitle>Step 5: Additional Information</CardTitle>
              <CardDescription>
                Provide any additional details about your appointment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="symptoms">Symptoms (Optional)</Label>
                <Textarea
                  id="symptoms"
                  placeholder="Describe any symptoms you're experiencing..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any other information you'd like to share..."
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Appointment Summary */}
        {selectedSlot && (
          <Card className="bg-blue-50">
            <CardHeader>
              <CardTitle>Appointment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium">
                    {selectedServiceDetails?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">
                    {selectedServiceDetails?.duration} minutes
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{formatDateForDisplay(selectedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">
                    {selectedSlotDetails?.startTime}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Price:</span>
                  <span className="text-green-600">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        {selectedSlot && (
          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              disabled={bookAppointmentMutation.isPending}
              className="px-8"
            >
              {bookAppointmentMutation.isPending
                ? "Booking..."
                : "Book Appointment"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AppointmentBooking;
