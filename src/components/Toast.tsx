import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  type,
  message,
  onClose,
  autoClose = true,
  duration = 5000,
}) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-success-500" />;
      case 'error':
        return <XCircle size={20} className="text-error-500" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-warning-500" />;
      case 'info':
        return <Info size={20} className="text-primary-500" />;
    }
  };
  
  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-success-500 bg-opacity-10 border-success-500';
      case 'error':
        return 'bg-error-500 bg-opacity-10 border-error-500';
      case 'warning':
        return 'bg-warning-500 bg-opacity-10 border-warning-500';
      case 'info':
        return 'bg-primary-500 bg-opacity-10 border-primary-500';
    }
  };
  
  return (
    <div className={`flex items-center p-4 mb-4 rounded-lg border-l-4 ${getBgColor()} animate-fade-in`}>
      <div className="mr-3">
        {getIcon()}
      </div>
      <div className="mr-4 flex-grow text-sm font-medium">
        {message}
      </div>
      <button 
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;