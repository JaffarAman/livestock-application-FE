import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

const SlidePanel = ({ 
  isOpen, 
  onClose, 
  title, 
  description,
  children, 
  maxWidth = 'max-w-2xl' 
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm animate-fadeIn transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Modal */}
      <div className={`relative w-full ${maxWidth} bg-white shadow-2xl flex flex-col animate-slideUp overflow-hidden rounded-3xl border border-outline-variant/30 max-h-full sm:max-h-[90vh]`}>
        <div className="px-6 py-6 border-b border-surface-container-low shrink-0 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold font-headline text-on-surface tracking-tight">{title}</h2>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-surface-container-low rounded-xl transition-colors text-on-surface-variant/70 hover:text-on-surface"
            >
              <X size={20} />
            </button>
          </div>
          {description && (
            <p className="text-on-surface-variant text-xs mt-2 font-medium leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-8">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SlidePanel;
