import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = 'max-w-lg',
  showClose = true 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden">
      <div 
        className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm animate-fadeIn" 
        onClick={onClose} 
      />
      <div className={`relative w-full ${maxWidth} bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp max-h-full sm:max-h-[90vh] flex flex-col`}>
        {(title || showClose) && (
          <div className="px-6 py-4 border-b border-outline-variant/50 flex items-center justify-between bg-white shrink-0">
            <h2 className="text-xl font-semibold font-headline text-on-surface">{title}</h2>
            {showClose && (
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-surface-container-low rounded-full transition-colors text-on-surface-variant/60 hover:text-on-surface"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
