import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertCircle, Mail, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/service/api';

interface MedicalFormRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
}

const MedicalFormRequiredModal: React.FC<MedicalFormRequiredModalProps> = ({
  isOpen,
  onClose,
  patientName = "Patient"
}) => {
  const [isResending, setIsResending] = useState(false);

  const handleResendForm = async () => {
    const patientEmail = localStorage.getItem('email');
    if (!patientEmail) {
      toast.error('Patient email not found. Please log in again.');
      return;
    }

    setIsResending(true);
    try {
      // Call backend API to resend medical form email
      await api.post('/medical-form/resend-email', {
        email: patientEmail,
        name: patientName
      });
      toast.success('Medical form email sent successfully!');
    } catch (error: any) {
      console.error('Error resending medical form email:', error);
      toast.error(error.response?.data?.message || 'Failed to resend email');
    } finally {
      setIsResending(false);
    }
  };

  const handleOpenForm = () => {
    window.open('/form', '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Medical Form Required
          </DialogTitle>
          <DialogDescription>
            Complete your medical consultation form to book appointments
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> You must complete the medical consultation form before booking any appointments. 
              This ensures our doctors have all the necessary information to provide you with the best care.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              <span>We've sent you a medical form link via email</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ExternalLink className="h-4 w-4" />
              <span>Or access the form directly at: <code className="bg-gray-100 px-1 rounded">/form</code></span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleResendForm}
              disabled={isResending}
              variant="outline"
              className="flex-1"
            >
              {isResending ? 'Sending...' : 'Resend Form Email'}
            </Button>
            
            <Button
              onClick={handleOpenForm}
              className="flex-1"
            >
              Open Form
            </Button>
          </div>

          <div className="text-center">
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-gray-500"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalFormRequiredModal;
