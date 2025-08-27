import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2, Calendar, Clock, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchAvailableSlots, rescheduleAppointment, clearRescheduleState } from '@/redux/slice/appointmentSlice';
import { toast } from 'react-toastify';

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

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
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
              <input
                type="date"
                className="w-full bg-gray-700 text-gray-300 px-4 py-3 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
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
