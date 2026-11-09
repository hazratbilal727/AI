import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative w-full ${maxWidth} bg-[#071522] border border-[#00D9FF]/40 rounded-xl shadow-[0_0_35px_rgba(0,217,255,0.15)] overflow-hidden z-10`}
      >
        {/* Corner HUD markers */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00D9FF]" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00D9FF]" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00D9FF]" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00D9FF]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#00D9FF]/15 bg-[#0B1927]">
          <div>
            <h2 className="text-base font-semibold text-[#F2F7FA] font-display tracking-wide">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-[#8295A7] font-mono mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8295A7] hover:text-[#00D9FF] hover:bg-[#00D9FF]/10 rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
