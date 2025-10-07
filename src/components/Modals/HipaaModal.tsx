import { Modal } from "./Modal";
import { HIPAA_NOTICE } from "@/constants/hipaaNotice";

interface HipaaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export function HipaaModal({ isOpen, onClose, onAccept }: HipaaModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onAccept={onAccept}
      title="HIPAA Privacy Notice"
    >
      <div className="space-y-4">
        <div className="whitespace-pre-line text-sm leading-relaxed text-white">
          {HIPAA_NOTICE}
        </div>
      </div>
    </Modal>
  );
}
