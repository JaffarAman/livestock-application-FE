import React from 'react';
import { useNavigate } from 'react-router-dom';

const ComingSoon = ({ title, description }) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fadeIn">
            <div className="w-24 h-24 rounded-3xl bg-primary/5 flex items-center justify-center text-primary mb-6 shadow-inner">
                <span className="material-symbols-outlined !text-5xl animate-pulse">construction</span>
            </div>
            <h2 className="text-xl font-semibold text-on-surface tracking-tight mb-2 text-center">
                {title || 'Feature Under Construction'}
            </h2>
            <p className="text-on-surface-variant text-center max-w-md mb-8">
                {description || "We're currently building this operational module to ensure the highest standards of livestock management. Stay tuned for updates."}
            </p>
            <div className="flex gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface-variant font-medium text-sm hover:bg-surface-container transition-all active:scale-95"
                >
                    Go Back
                </button>
                <button
                    onClick={() => navigate('/staff/dashboard')}
                    className="px-6 py-2.5 rounded-xl bg-primary text-white font-medium text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95"
                >
                    Return to Dashboard
                </button>
            </div>

            {/* Decorative background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />
        </div>
    );
};

export default ComingSoon;
