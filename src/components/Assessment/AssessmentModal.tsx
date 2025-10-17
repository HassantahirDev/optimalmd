import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import AssessmentForm from './AssessmentForm';
import { AssessmentValue } from '@/services/assessmentApi';

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  onSave?: (values: AssessmentValue[]) => void;
  readonly?: boolean;
}

const AssessmentModal: React.FC<AssessmentModalProps> = ({
  isOpen,
  onClose,
  appointmentId,
  onSave,
  readonly = false
}) => {
  const [saved, setSaved] = useState(false);

  const handleSave = (values: AssessmentValue[]) => {
    setSaved(true);
    if (onSave) {
      onSave(values);
    }
    
    // Close modal after a short delay to show success state
    setTimeout(() => {
      onClose();
      setSaved(false);
    }, 1000);
  };

  const handleCancel = () => {
    if (!saved) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              {readonly ? 'View Assessment' : 'Patient Assessment'}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={saved}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="mt-4">
          <AssessmentForm
            appointmentId={appointmentId}
            onSave={handleSave}
            onCancel={handleCancel}
            readonly={readonly}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssessmentModal;
