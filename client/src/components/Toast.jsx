import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Toast({ toast, onDismiss }) {
  const styles = {
    success: 'bg-semantic-successBg text-semantic-successText border-semantic-successText/20',
    error: 'bg-semantic-errorBg text-semantic-errorText border-semantic-errorText/20',
    warning: 'bg-semantic-warningBg text-semantic-warningText border-semantic-warningText/20',
    info: 'bg-card text-ink border-line'
  };

  const icons = {
    success: <CheckCircle2 size={16} />,
    error: <AlertCircle size={16} />,
    warning: <AlertCircle size={16} />,
    info: <Info size={16} />
  };

  return (
    <div className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded border shadow-sm text-caption animate-slideIn ${styles[toast.type] || styles.info}`}>
      {icons[toast.type] || icons.info}
      <p className="m-0 flex-1">{toast.message}</p>
      <button onClick={onDismiss} className="icon-button !p-0 ml-2 opacity-70 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
}
