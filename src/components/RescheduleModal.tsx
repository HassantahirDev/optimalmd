import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2, Calendar, Clock, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchAvailableSlots, rescheduleAppointment, clearRescheduleState } from '@/redux/slice/appointmentSlice';
import { toast } from 'react-toastify';
import { formatTime } from '@/utils/timeUtils';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    id: string;
    appointmentDate: string;
    appointmentTime: string;
    doctorId: string;
    serviceId: string;
    doctor: {
      firstName: string;
      lastName: string;
    };
    service: {
      name: string;
    };
  };
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  onClose,
  appointment,
}) => {
  const dispatch = useAppDispatch();
  const { availableSlots, rescheduleLoading, rescheduleError, rescheduleSuccess } = useAppSelector(
    (state) => state.appointment
  );

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [reason, setReason] = useState('');
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
        setSelectedDate(date.toISOString().split('T')[0]);
        setSelectedSlotId(''); // Reset slot selection when date changes
      }
    }
  };

  useEffect(() => {
    if (isOpen && appointment.doctorId && appointment.serviceId) {
      // Fetch available slots for the doctor
      dispatch(fetchAvailableSlots({
        doctorId: appointment.doctorId,
        date: selectedDate || new Date().toISOString().split('T')[0],
        serviceId: appointment.serviceId,
      }));
    }
  }, [isOpen, appointment.doctorId, appointment.serviceId, selectedDate, dispatch]);

  useEffect(() => {
    if (rescheduleSuccess) {
      toast.success('Appointment rescheduled successfully!');
      dispatch(clearRescheduleState());
      onClose();
    }
  }, [rescheduleSuccess, dispatch, onClose]);

  useEffect(() => {
    if (rescheduleError) {
      toast.error(rescheduleError);
      dispatch(clearRescheduleState());
    }
  }, [rescheduleError, dispatch]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedSlotId(''); // Reset slot selection when date changes
  };

  const handleReschedule = () => {
    if (!selectedSlotId) {
      toast.error('Please select a new time slot');
      return;
    }

    dispatch(rescheduleAppointment({
      appointmentId: appointment.id,
      newSlotId: selectedSlotId,
      reason: reason || undefined,
    }));
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Calendar className="w-5 h-5 text-red-500" />
            Reschedule Appointment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Appointment Summary */}
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader>
              <CardTitle className="text-lg text-white">Current Appointment</CardTitle>
              <CardDescription className="text-gray-300">
                Rescheduling appointment with Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Service:</span>
                <span className="font-medium text-white">{appointment.service.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Current Date:</span>
                <span className="font-medium text-white">{formatDate(appointment.appointmentDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Current Time:</span>
                <span className="font-medium text-white">{formatTime(appointment.appointmentTime)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Reschedule Form */}
          <div className="space-y-4">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select New Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full bg-gray-700 text-gray-300 px-4 py-3 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={selectedDate ? formatDateForDisplay(selectedDate) : ""}
                  onChange={(e) => handleDateInputChange(e)}
                  placeholder="MM-DD-YYYY"
                  onFocus={(e) => e.target.select()}
                />
                <button
                  type="button"
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  <Calendar className="w-5 h-5" />
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
                              setSelectedDate(date.toISOString().split('T')[0]);
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

            {/* Time Slot Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select New Time
              </label>
              <select
                className="w-full bg-gray-700 text-gray-300 px-4 py-3 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
                value={selectedSlotId}
                onChange={(e) => setSelectedSlotId(e.target.value)}
                disabled={!selectedDate || availableSlots.length === 0}
              >
                <option value="">Select a Time Slot</option>
                {availableSlots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </option>
                ))}
              </select>
              {selectedDate && availableSlots.length === 0 && (
                <div className="mt-2 flex items-center gap-2 text-yellow-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  No available slots for this date
                </div>
              )}
            </div>

            {/* Reason (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reason for Reschedule (Optional)
              </label>
              <textarea
                className="w-full bg-gray-700 text-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
                placeholder="Please provide a reason for rescheduling..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white border-gray-500 hover:bg-gray-500"
              disabled={rescheduleLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleReschedule}
              disabled={!selectedSlotId || rescheduleLoading}
              className="flex-1 bg-red-500 text-white hover:bg-red-600"
            >
              {rescheduleLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Rescheduling...
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 mr-2" />
                  Reschedule
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleModal;
