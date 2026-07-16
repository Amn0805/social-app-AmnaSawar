// components/ui/Badge.jsx
import clsx from 'clsx';

const VARIANTS = {
  draft: 'bg-ink/8 text-mutedLight dark:bg-white/8 dark:text-muted',
  public: 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400',
  private: 'bg-amber-400/15 text-amber-700 dark:text-amber-400',
};

const LABELS = {
  draft: 'Draft',
  public: 'Public',
  private: 'Private',
};

export default function Badge({ variant = 'public', className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium tracking-wide',
        VARIANTS[variant],
        className
      )}
    >
      {LABELS[variant]}
    </span>
  );
}