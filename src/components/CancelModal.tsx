import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2, AlertTriangle, XCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { cancelAppointment, clearCancelState } from '@/redux/slice/appointmentSlice';
import { toast } from 'react-toastify';

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    id: string;
    appointmentDate: string;
    appointmentTime: string;
    amount: string;
    doctor: {
      firstName: string;
      lastName: string;
    };
    service: {
      name: string;
    };
  };
}

const CancelModal: React.FC<CancelModalProps> = ({
  isOpen,
  onClose,
  appointment,
}) => {
  const dispatch = useAppDispatch();
  const { cancelLoading, cancelError, cancelSuccess } = useAppSelector(
    (state) => state.appointment
  );

  const [reason, setReason] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  React.useEffect(() => {
    if (cancelSuccess) {
      toast.success('Appointment cancelled successfully!');
      dispatch(clearCancelState());
      onClose();
      // Reset form
      setReason('');
      setIsConfirmed(false);
    }
  }, [cancelSuccess, dispatch, onClose]);

  React.useEffect(() => {
    if (cancelError) {
      toast.error(cancelError);
      dispatch(clearCancelState());
    }
  }, [cancelError, dispatch]);

  const handleCancel = () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    if (!isConfirmed) {
      toast.error('Please confirm that you want to cancel this appointment');
      return;
    }

    dispatch(cancelAppointment({
      appointmentId: appointment.id,
      cancellationReason: reason.trim(),
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

  const handleClose = () => {
    if (!cancelLoading) {
      setReason('');
      setIsConfirmed(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <XCircle className="w-5 h-5 text-red-500" />
            Cancel Appointment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Warning */}
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-semibold">Important Notice</span>
            </div>
            <p className="text-red-300 text-sm">
              Cancellations must be made at least 24 hours before the appointment. 
              You will be charged $25 if you cancel within less than 24 hours, and $50 if you miss your appointment.
            </p>
          </div>

          {/* Appointment Details */}
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader>
              <CardTitle className="text-lg text-white">Appointment Details</CardTitle>
              <CardDescription className="text-gray-300">
                Cancelling appointment with Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Service:</span>
                <span className="font-medium text-white">{appointment.service.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Date:</span>
                <span className="font-medium text-white">{formatDate(appointment.appointmentDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Time:</span>
                <span className="font-medium text-white">{formatTime(appointment.appointmentTime)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-600 pt-2">
                <span className="text-gray-300 font-medium">Amount:</span>
                <span className="font-bold text-lg text-red-500">${appointment.amount}</span>
              </div>
            </CardContent>
          </Card>

          {/* Cancellation Form */}
          <div className="space-y-4">
            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reason for Cancellation *
              </label>
              <textarea
                className="w-full bg-gray-700 text-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
                placeholder="Please provide a reason for cancelling this appointment..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

            {/* Confirmation Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="confirm-cancel"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="mt-1 w-4 h-4 text-red-500 bg-gray-700 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
              />
              <label htmlFor="confirm-cancel" className="text-sm text-gray-300">
                I understand that I may be charged $25 if I cancel within less than 24 hours, or $50 if I miss my appointment. 
                I confirm that I want to proceed with the cancellation.
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-gray-600 text-white border-gray-500 hover:bg-gray-500"
              disabled={cancelLoading}
            >
              Keep Appointment
            </Button>
            <Button
              type="button"
              onClick={handleCancel}
              disabled={!reason.trim() || !isConfirmed || cancelLoading}
              className="flex-1 bg-red-500 text-white hover:bg-red-600"
            >
              {cancelLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel Appointment
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancelModal;
