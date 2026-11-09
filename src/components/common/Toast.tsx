import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'info' | 'error';

interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextValue {
  showToast: (title: string, description?: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((title: string, description?: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, title, description, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  }, []);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'error':
        return <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-[#00D9FF] shrink-0" />;
    }
  };

  const getBorderColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]';
      case 'warning':
        return 'border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]';
      case 'error':
        return 'border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.15)]';
      default:
        return 'border-[#00D9FF]/40 shadow-[0_0_15px_rgba(0,217,255,0.15)]';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 bg-[#071522]/95 border rounded-lg backdrop-blur-md transition-all duration-300 transform translate-y-0 ${getBorderColor(
              toast.type
            )}`}
          >
            {getIcon(toast.type)}
            <div className="flex-1 text-left min-w-0">
              <h4 className="text-xs font-semibold text-[#F2F7FA] font-display">
                {toast.title}
              </h4>
              {toast.description && (
                <p className="text-[11px] text-[#8295A7] font-mono mt-0.5 leading-snug">
                  {toast.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: () => {}
    };
  }
  return context;
};
