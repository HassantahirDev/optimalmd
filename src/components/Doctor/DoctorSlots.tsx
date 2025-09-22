import React, { useState, useEffect } from "react";
import { Clock, Calendar, User, Phone, Mail, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import api from "@/service/api";
import { formatTime, formatTimeRange } from "@/utils/timeUtils";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  status: 'available' | 'booked' | 'blocked';
  appointment?: {
    id: string;
    patientName: string;
    patientEmail: string;
    patientPhone?: string;
    serviceName: string;
    notes?: string;
    status: string;
    googleMeetLink?: string;
  };
}

interface DaySlots {
  date: string;
  dayName: string;
  slots: TimeSlot[];
}

interface DoctorSlotsProps {
  doctorId?: string;
}

const DoctorSlots: React.FC<DoctorSlotsProps> = ({ doctorId: propDoctorId }) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [daySlots, setDaySlots] = useState<DaySlots[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [showSlotDetails, setShowSlotDetails] = useState(false);

  // Get doctor ID from props or localStorage
  const doctorId = propDoctorId || localStorage.getItem("userId") || localStorage.getItem("doctorId");

  // Helper function to format date in local timezone (YYYY-MM-DD)
  const formatDateLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Generate days (today first, then future dates only)
  const generateDays = () => {
    const days = [];
    const today = new Date();
    
    // Generate today first
    const todayString = formatDateLocal(today);
    const todayDayName = today.toLocaleDateString('en-US', { weekday: 'short' });
    const todayFullDayName = today.toLocaleDateString('en-US', { weekday: 'long' });
    
    days.push({
      date: todayString,
      dayName: todayDayName,
      fullDayName: todayFullDayName,
      displayDate: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isPast: false,
      isToday: true
    });
    
    // Generate 60 days in the future (increased from 30 to 60)
    for (let i = 1; i <= 60; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dateString = formatDateLocal(date);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const fullDayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      days.push({
        date: dateString,
        dayName,
        fullDayName,
        displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        isPast: false
      });
    }
    
    return days;
  };

  const allDays = generateDays();

  // Set initial selected date to today
  useEffect(() => {
    if (allDays.length > 0 && !selectedDate) {
      setSelectedDate(allDays[0].date); // Today is now at index 0
    }
  }, [allDays, selectedDate]);

  // Fetch slots for selected date
  useEffect(() => {
    if (selectedDate && doctorId) {
      fetchSlotsForDate(selectedDate);
    }
  }, [selectedDate, doctorId]);

  const fetchSlotsForDate = async (date: string) => {
    if (!doctorId) return;

    try {
      setLoading(true);
      const response = await api.get(`/appointments/doctor/${doctorId}/slots?date=${date}`);
      
      if (response.data.success) {
        const slots = response.data.data || [];
        
        // Update the daySlots array with new data
        setDaySlots(prev => {
          const updated = [...prev];
          const existingIndex = updated.findIndex(day => day.date === date);
          
          const dayData = {
            date,
            dayName: allDays.find(d => d.date === date)?.dayName || '',
            slots: slots.map((slot: any) => ({
              id: slot.id,
              startTime: slot.startTime,
              endTime: slot.endTime,
              status: slot.status || (slot.appointment ? 'booked' : 'available'),
              appointment: slot.appointment ? {
                id: slot.appointment.id,
                patientName: slot.appointment.patientName || slot.appointment.patient?.name || 'Unknown Patient',
                patientEmail: slot.appointment.patientEmail || slot.appointment.patient?.email || '',
                patientPhone: slot.appointment.patientPhone || slot.appointment.patient?.phone || '',
                serviceName: slot.appointment.serviceName || slot.appointment.service?.name || 'General Consultation',
                notes: slot.appointment.notes || '',
                status: slot.appointment.status,
                googleMeetLink: slot.appointment.googleMeetLink
              } : undefined
            }))
          };
          
          if (existingIndex >= 0) {
            updated[existingIndex] = dayData;
          } else {
            updated.push(dayData);
          }
          
          return updated;
        });
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      // Set empty slots for failed requests
      setDaySlots(prev => {
        const updated = [...prev];
        const existingIndex = updated.findIndex(day => day.date === date);
        
        const dayData = {
          date,
          dayName: allDays.find(d => d.date === date)?.dayName || '',
          slots: []
        };
        
        if (existingIndex >= 0) {
          updated[existingIndex] = dayData;
        } else {
          updated.push(dayData);
        }
        
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500 hover:bg-green-600';
      case 'booked':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'blocked':
        return 'bg-gray-500 hover:bg-gray-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4" />;
      case 'booked':
        return <User className="h-4 w-4" />;
      case 'blocked':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'booked':
        return 'Booked';
      case 'blocked':
        return 'Blocked';
      default:
        return 'Unknown';
    }
  };

  const handleSlotClick = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setShowSlotDetails(true);
  };

  const currentDaySlots = daySlots.find(day => day.date === selectedDate);

  if (!doctorId) {
    return (
      <div className="flex-1 text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Doctor Slots</h1>
            <p className="text-gray-400 text-lg">
              Doctor ID is required to view slots.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 text-white p-4 sm:p-6 lg:p-8 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-500 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Doctor Slots</h1>
          </div>
          <p className="text-gray-400 text-lg">
            View and manage your appointment slots. Today is shown first, scroll right to see future dates.
          </p>
        </div>

        {/* Day Tabs - Scrollable */}
        <div className="mb-6 overflow-x-hidden">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {allDays.map((day) => (
              <Button
                key={day.date}
                variant={selectedDate === day.date ? "default" : "outline"}
                onClick={() => setSelectedDate(day.date)}
                className={`flex-shrink-0 min-w-[80px] ${
                  selectedDate === day.date
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : day.isToday
                    ? "bg-blue-500 border-blue-400 text-white hover:bg-blue-600"
                    : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <div className="text-center">
                  <div className="text-sm font-medium">{day.dayName}</div>
                  <div className="text-xs opacity-80">{day.displayDate}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Selected Day Info */}
        {selectedDate && (
          <Card className="bg-gray-800 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {allDays.find(d => d.date === selectedDate)?.fullDayName} - {allDays.find(d => d.date === selectedDate)?.displayDate}
                {allDays.find(d => d.date === selectedDate)?.isToday && (
                  <Badge variant="secondary" className="ml-2 bg-blue-500 text-white">
                    Today
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading slots...</p>
                </div>
              ) : currentDaySlots ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 overflow-x-hidden">
                  {currentDaySlots.slots.map((slot) => (
                    <div
                      key={slot.id}
                      onClick={() => handleSlotClick(slot)}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${getStatusColor(slot.status)}`}
                    >
                      <div className="text-center">
                        <div className="text-sm font-medium mb-1">{formatTimeRange(slot.startTime, slot.endTime)}</div>
                        <div className="flex items-center justify-center gap-1">
                          {getStatusIcon(slot.status)}
                          <span className="text-xs font-medium">
                            {getStatusText(slot.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No slots available for this date</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Slot Details Modal */}
        <Dialog open={showSlotDetails} onOpenChange={setShowSlotDetails}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Slot Details
              </DialogTitle>
            </DialogHeader>
            
            {selectedSlot && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Time</span>
                    <span className="font-medium">{formatTimeRange(selectedSlot.startTime, selectedSlot.endTime)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Status</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedSlot.status)}
                      <span className="font-medium">{getStatusText(selectedSlot.status)}</span>
                    </div>
                  </div>
                </div>

                {selectedSlot.appointment && (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-700 rounded-lg">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Patient Information
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>{selectedSlot.appointment.patientName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{selectedSlot.appointment.patientEmail}</span>
                        </div>
                        {selectedSlot.appointment.patientPhone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{selectedSlot.appointment.patientPhone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-700 rounded-lg">
                      <h3 className="font-semibold mb-3">Appointment Details</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-400">Service:</span>
                          <span className="ml-2">{selectedSlot.appointment.serviceName}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Status:</span>
                          <Badge variant="secondary" className="ml-2">
                            {selectedSlot.appointment.status}
                          </Badge>
                        </div>
                        {selectedSlot.appointment.notes && (
                          <div>
                            <span className="text-gray-400">Notes:</span>
                            <p className="mt-1 text-gray-300">{selectedSlot.appointment.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedSlot.appointment.googleMeetLink && (
                      <div className="p-4 bg-gray-700 rounded-lg">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Video Call
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Google Meet Link</span>
                          <Button
                            onClick={() => window.open(selectedSlot.appointment?.googleMeetLink, '_blank')}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Join Now
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowSlotDetails(false)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DoctorSlots;
