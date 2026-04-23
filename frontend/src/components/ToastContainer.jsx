import React from 'react';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 min-w-[320px] max-w-[420px]">
            {toasts.map((toast) => (
                <div 
                    key={toast.id}
                    className="toast-glass group relative flex items-center gap-4 p-4 pr-10 rounded-2xl animate-toast-in cursor-default"
                >
                    {/* Icon */}
                    <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                        toast.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
                        toast.type === 'error' ? 'bg-rose-50 text-rose-600' :
                        toast.type === 'warning' ? 'bg-amber-50 text-amber-600' :
                        'bg-blue-50 text-blue-600'
                    }`}>
                        {toast.type === 'success' && <CheckCircle2 size={18} />}
                        {toast.type === 'error' && <AlertCircle size={18} />}
                        {toast.type === 'warning' && <AlertTriangle size={18} />}
                        {toast.type === 'info' && <Info size={18} />}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <p className="text-[13px] font-bold text-slate-800 leading-tight">
                            {toast.type === 'success' ? 'Success' : 
                             toast.type === 'error' ? 'Action Required' :
                             toast.type === 'warning' ? 'Warning' : 'Information'}
                        </p>
                        <p className="text-[12px] font-medium text-slate-500 mt-0.5 line-clamp-2">
                            {toast.message}
                        </p>
                    </div>

                    {/* Close Button */}
                    <button 
                        onClick={() => removeToast(toast.id)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-300 hover:text-slate-500 hover:bg-slate-100 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                        <X size={14} />
                    </button>

                    {/* Progress Bar (Visual Only) */}
                    {toast.type !== 'error' && (
                        <div className="absolute bottom-0 left-0 h-1 bg-current opacity-10 rounded-full transition-all duration-[4000ms] w-0" 
                             style={{ animation: 'shimmer 4s linear forwards', width: '100%' }} />
                    )}
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
