import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  onAccept,
  title,
  children,
}: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-center">{title}</h2>
        </div>
        <div className="p-6 text-gray-700 space-y-4">{children}</div>
        <div className="p-4 flex justify-end gap-3 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-black"
          >
            Close
          </button>
          {onAccept && (
            <button
              onClick={onAccept}
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
            >
              Accept
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
