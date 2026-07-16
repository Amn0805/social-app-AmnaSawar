// components/ui/Modal.jsx
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm animate-fadeUp"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md mx-4 bg-white dark:bg-surface-elevated border border-transparent dark:border-surface-border rounded-2xl shadow-card-hover p-6 animate-slideDown"
      >
        {title && (
          <h3 className="font-display text-lg font-semibold text-ink dark:text-paper mb-4">
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}
