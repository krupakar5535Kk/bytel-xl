import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const iconConfig = {
          success: { icon: CheckCircle2, color: 'text-emerald-400', border: 'border-emerald-500/30 bg-emerald-950/40' },
          error: { icon: AlertCircle, color: 'text-red-400', border: 'border-red-500/30 bg-red-950/40' },
          warning: { icon: AlertTriangle, color: 'text-amber-400', border: 'border-amber-500/30 bg-amber-950/40' },
          info: { icon: Info, color: 'text-wildfire-blue', border: 'border-wildfire-blue/30 bg-slate-900/90' },
        }[toast.type];

        const Icon = iconConfig.icon;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-2xl transition-all animate-in slide-in-from-bottom-3 ${iconConfig.border}`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconConfig.color}`} />
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-white tracking-wide">{toast.title}</h5>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
