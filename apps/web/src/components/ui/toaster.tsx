import { createContext, useContext, useEffect, useState } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  addToast: (message: string, type: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let addToastFn: ((message: string, type: Toast['type']) => void) | undefined;

export const toast = {
  success: (message: string) => {
    addToastFn?.(message, 'success');
  },
  error: (message: string) => {
    addToastFn?.(message, 'error');
  },
  info: (message: string) => {
    addToastFn?.(message, 'info');
  },
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setToasts((currentToasts) => 
        currentToasts.length > 0 ? currentToasts.slice(1) : currentToasts
      );
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const addToast = (message: string, type: Toast['type']) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  // Set the addToast function reference
  useEffect(() => {
    addToastFn = addToast;
    return () => {
      addToastFn = undefined;
    };
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-0 right-0 p-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-md shadow-lg ${
              toast.type === 'success'
                ? 'bg-green-500'
                : toast.type === 'error'
                ? 'bg-red-500'
                : 'bg-blue-500'
            } text-white`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const Toaster = () => null;
